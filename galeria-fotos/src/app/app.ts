import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BackendFile, PhotoService } from './photo';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  providers: [PhotoService],
  templateUrl: './app.html'
})
export class App implements OnInit {
  files: BackendFile[] = [];
  totalFiles: number = 0;
  isLoading: boolean = false;
  isDragging: boolean = false;

  constructor(public photoService: PhotoService) {}

  ngOnInit(): void {
    this.loadPhotos();
  }

  loadPhotos(): void {
    this.isLoading = true;
    this.photoService.getPhotos().subscribe({
      next: (res) => {
        this.files = res.files;
        this.totalFiles = res.total;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar fotos:', err);
        this.isLoading = false;
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadFile(input.files[0]);
    }
  }

  // Suporte para Drag and Drop
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(): void {
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.uploadFile(event.dataTransfer.files[0]);
    }
  }

  private uploadFile(file: File): void {
    this.isLoading = true;
    this.photoService.uploadPhoto(file).subscribe({
      next: (res) => {
        // Atualiza a lista local com o retorno do backend
        this.files = res.files;
        this.totalFiles = res.total;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro no upload:', err);
        this.isLoading = false;
      }
    });
  }

  // Helper para formatar o tamanho do arquivo amigavelmente
  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}