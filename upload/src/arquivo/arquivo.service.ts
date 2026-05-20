import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateArquivoDto } from './dto/create-arquivo.dto';
import { UpdateArquivoDto } from './dto/update-arquivo.dto';
import * as fs from 'fs';

@Injectable()
export class ArquivoService {
  private readonly pastaUpload = './drive';

  constructor() {
    if (!fs.existsSync(this.pastaUpload)) {
      fs.mkdirSync(this.pastaUpload, { recursive: true });
    }
  }
  //Retorna os dados do arquivo após o upload
  create(arquivo: Express.Multer.File) {
    return {
      message: 'Arquivo enviado com sucesso!',
      filename: arquivo.filename,
      originalname: arquivo.originalname,
      size: arquivo.size,
    };
  }

  findAll() {
    try {
      const files = fs.readdirSync(this.pastaUpload);
      const fileList = files.map(
        (filename) => {
          const stats = fs.statSync(`${this.pastaUpload}/${filename}`);
          return {
            filename,
            size: stats.size,
            criado: stats.birthtime,
          };
        }
      );
      return {
        total: fileList.length,
        files: fileList,
      };
    } catch (error) {
      throw new BadRequestException('Não foi possivel listar os arquivos.')
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} arquivo`;
  }

  update(id: number, updateArquivoDto: UpdateArquivoDto) {
    return `This action updates a #${id} arquivo`;
  }

  remove(filename: string) {
  const caminhoArquivo = `${this.pastaUpload}/${filename}`;
console.log(`Tentando remover o arquivo: ${caminhoArquivo}`);
  if (!fs.existsSync(caminhoArquivo)) {
    throw new NotFoundException(
      `Arquivo ${filename} não encontrado`,
    );
  }

  fs.unlinkSync(caminhoArquivo);

  return {
    mensagem: 'Arquivo removido com sucesso!',
  };
}
}