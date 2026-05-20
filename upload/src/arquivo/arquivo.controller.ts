import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException, HttpStatus, ArgumentsHost, ExceptionFilter, UseFilters, Catch } from '@nestjs/common';
import { ArquivoService } from './arquivo.service';
import { CreateArquivoDto } from './dto/create-arquivo.dto';
import { UpdateArquivoDto } from './dto/update-arquivo.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';

@Catch()
class MulterExceptionFilter
  implements ExceptionFilter
{
  catch(exception: any, host: ArgumentsHost) {
    const response =
      host.switchToHttp().getResponse();

    // HTTP 413 = Payload Too Large
    // Retornado quando o arquivo ultrapassa 5MB
    if (exception.code === 'LIMIT_FILE_SIZE') {
      return response.status(
        HttpStatus.PAYLOAD_TOO_LARGE,
      ).json({
        statusCode: 413,
        message:
          'Arquivo excede o limite máximo de 5MB.',
      });
    }

    throw exception;
  }
}

@Controller('arquivo')
export class ArquivoController {
  constructor(private readonly arquivoService: ArquivoService) {}

  @Post('upload')
  @UseFilters(MulterExceptionFilter)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './drive',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
       limits: {
        fileSize: 5 * 1024 * 1024,
       },
    
        // Permite apenas imagens:
    // JPG, JPEG, PNG e TIFF
    fileFilter: (req, file, callback) => {

      const formatosPermitidos =
        /jpg|jpeg|png|tiff/;

      const extensaoValida =
        formatosPermitidos.test(
          extname(file.originalname).toLowerCase(),
        );

      const mimeValido =
        formatosPermitidos.test(file.mimetype);

      if (extensaoValida && mimeValido) {
        return callback(null, true);
      }

      // BONUS:
      // HTTP 400 = Bad Request
      // Retornado quando o formato não é permitido
      return callback(
        new BadRequestException(
          'Formato inválido. Envie apenas JPG, JPEG, PNG ou TIFF.',
        ),
        false,
      );
    },
  }),
)
  uploadFile(@UploadedFile() file:Express.Multer.File){
    if(!file){
      throw new BadRequestException("Nenhum arquivo enviado baumannnn.");
  }
    return this.arquivoService.create(file);
  };

  @Get()
  findAll() {
    return this.arquivoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.arquivoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArquivoDto: UpdateArquivoDto) {
    return this.arquivoService.update(+id, updateArquivoDto);
  }

  @Delete(':filename')
  remove(@Param('filename') filename: string) {
    return this.arquivoService.remove(filename);
  }
}