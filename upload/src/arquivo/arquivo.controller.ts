import { 
  Controller, Get, Post, Body, Patch, Param, Delete, 
  UseInterceptors, UploadedFile, BadRequestException, Res 
} from '@nestjs/common';
import { ArquivoService } from './arquivo.service';
import { UpdateArquivoDto } from './dto/update-arquivo.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { Response as ExpressResponse } from 'express';


@Controller('arquivo')
export class ArquivoController {
  constructor(private readonly arquivoService: ArquivoService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './drive', // Seus arquivos estão sendo salvos aqui
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo enviado.');
    }
    return this.arquivoService.create(file);
  }

  // AJUSTE 1: Alterado de @Get() para @Get('upload') para alinhar com o Angular
  @Get('upload')
  findAll() {
    return this.arquivoService.findAll();
  }

  // AJUSTE 2: Nova rota necessária para o Angular conseguir baixar e ver a miniatura
  // URL: http://localhost:3000/arquivo/ver/nome-da-foto.png
@Get('ver/:imgpath')
  seeUploadedFile(@Param('imgpath') image: string, @Res() res: any) {
    return res.sendFile(image, { root: './drive' });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.arquivoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArquivoDto: UpdateArquivoDto) {
    return this.arquivoService.update(+id, updateArquivoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.arquivoService.remove(+id);
  }
}