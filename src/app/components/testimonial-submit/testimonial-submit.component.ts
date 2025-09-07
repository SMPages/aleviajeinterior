// src/app/components/testimonial-submit/testimonial-submit.component.ts
import { Component, inject, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MasterclassService } from '../../services/masterclass.service';
import { SUPABASE } from '../../core/supabase.token';

@Component({
  selector: 'app-testimonial-submit',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './testimonial-submit.component.html',
  styleUrls: ['./testimonial-submit.component.scss']
})
export class TestimonialSubmitWithPhotoComponent {
  private mc = inject(MasterclassService);
  private sb = inject(SUPABASE);

  @ViewChild('fileInput') fileInputRef?: ElementRef<HTMLInputElement>;

  nombre = '';
  email = '';
  contenido = '';
  file: File | null = null;
  submitting = false;
  msg = '';
  success = false;

  onFile(e: Event) {
    const input = e.target as HTMLInputElement;
    this.file = input.files?.[0] ?? null;
  }

  async onSubmit() {
    if (!this.nombre || !this.contenido) {
      this.msg = 'Por favor completa nombre y tu opinión.';
      this.success = false;
      return;
    }

    this.submitting = true;
    this.msg = '';
    this.success = false;

    try {
      let fotoUrl: string | undefined;

      // Subida de imagen opcional
      if (this.file) {
        // Validaciones básicas
        const maxBytes = 5 * 1024 * 1024; // 5MB
        if (this.file.size > maxBytes) {
          throw new Error('La imagen debe pesar 5MB o menos.');
        }
        if (!/^image\/(png|jpeg|jpg|webp|gif)$/i.test(this.file.type)) {
          throw new Error('Formato de imagen no soportado. Usa PNG/JPG/WEBP/GIF.');
        }

        // Comprobar que el bucket exista (diagnóstico útil)
        const { error: listErr } = await this.sb.storage.from('testimonios').list('', { limit: 1 });
        if (listErr && /Bucket not found/i.test(listErr.message)) {
          throw new Error('El bucket "testimonios" no existe en este proyecto. Verifica el nombre en Storage.');
        }

        const ext = (this.file.name.split('.').pop() || 'jpg').toLowerCase();
        const safeName = this.nombre.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
        const path = `avatars/${Date.now()}_${safeName}.${ext}`;

        const { error: upErr } = await this.sb.storage
          .from('testimonios') // nombre EXACTO del bucket
          .upload(path, this.file, { upsert: false });

        if (upErr) {
          if (/Bucket not found/i.test(upErr.message)) {
            throw new Error('No se encontró el bucket "testimonios". Revisa el nombre exacto o el proyecto Supabase.');
          }
          throw upErr;
        }

        // URL pública (el bucket debe ser público)
        const { data: pub } = this.sb.storage.from('testimonios').getPublicUrl(path);
        fotoUrl = pub.publicUrl;
      }

      // IMPORTANTE: el service ya NO hace .select() tras el insert (por RLS)
      await this.mc.enviarTestimonio(this.nombre, this.contenido, this.email || undefined, fotoUrl);

      this.msg = '¡Gracias! Revisaremos tu testimonio antes de publicarlo.';
      this.success = true;

      // Reset del formulario
      this.nombre = '';
      this.email = '';
      this.contenido = '';
      this.file = null;
      if (this.fileInputRef?.nativeElement) {
        this.fileInputRef.nativeElement.value = '';
      }
    } catch (e: any) {
      this.msg = `Error: ${e?.message ?? e}`;
      this.success = false;
    } finally {
      this.submitting = false;
    }
  }
}
