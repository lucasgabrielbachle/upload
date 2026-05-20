

@Injectable({
  providedIn: 'root',
})
export class Photo {}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BackendFile {
  filename: string;
  size: number;
  criado: string;
}

export interface UploadResponse {
  total: number;
  files: BackendFile[];
}

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  private apiUrl = 'http://localhost:3000/arquivo/upload';
  // URL base onde as imagens de fato são renderizadas pelo backend
  public baseUrl = 'http://localhost:3000/arquivo/ver/'; 
  

  constructor(private http: HttpClient) {}

  // Busca a lista de fotos (o JSON informado)
  getPhotos(): Observable<UploadResponse> {
    return this.http.get<UploadResponse>(this.apiUrl);
  }

  // Faz o upload de um arquivo usando FormData
  uploadPhoto(file: File): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file); // 'file' deve bater com o nome esperado pelo backend (ex: multer)
    return this.http.post<UploadResponse>(this.apiUrl, formData);
  }
}