import { Component, EventEmitter, Output, Input, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MasterclassService } from '../../services/masterclass.service';

@Component({
  selector: 'app-masterclass-signup',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './masterclass-signup.component.html',
  styleUrls: ['./masterclass-signup.component.scss']
})
export class MasterclassSignupComponent {
  private mc = inject(MasterclassService);
  private route = inject(ActivatedRoute);

  @Output() submitted = new EventEmitter<void>();
  @Output() submittedName = new EventEmitter<string>(); // ← emitimos el nombre

  @Input() versionPoliticas: string = 'v1';

  nombre = '';
  email = '';
  telefono = '';
  acepta = false;

  utm = { source: '', medium: '', campaign: '' };

  submitting = false;
  msg = '';
  success = false;

  constructor() {
    const qp = this.route.snapshot.queryParamMap;
    this.utm.source = qp.get('utm_source') ?? '';
    this.utm.medium = qp.get('utm_medium') ?? '';
    this.utm.campaign = qp.get('utm_campaign') ?? '';
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  onChange() { if (this.msg) this.msg = ''; }

  async onSubmit() {
    if (this.submitting) return;

    this.msg = '';
    this.success = false;

    const nombre = this.nombre.trim();
    const email = this.email.trim();
    const telefono = this.telefono.trim() || null;

    if (!nombre || !email) {
      this.msg = 'Nombre y email son obligatorios.';
      return;
    }
    if (!this.isValidEmail(email)) {
      this.msg = 'Por favor escribe un email válido.';
      return;
    }
    if (!this.acepta) {
      this.msg = 'Debes aceptar las políticas de tratamiento de datos.';
      return;
    }

    this.submitting = true;
    try {
      await this.mc.registrarCliente(
        nombre,
        email,
        telefono,
        this.acepta,
        this.versionPoliticas,
        {
          source: this.utm.source || undefined,
          medium: this.utm.medium || undefined,
          campaign: this.utm.campaign || undefined
        }
      );

      this.success = true;
      this.msg = '¡Gracias! Te hemos registrado para la masterclass. Revisa tu email.';

      this.submitted.emit();           // evento de éxito
      this.submittedName.emit(nombre); // ← enviamos el nombre al padre

      // reset suave
      this.nombre = '';
      this.email = '';
      this.telefono = '';
      this.acepta = false;
    } catch (e: any) {
      this.msg = e?.message ?? 'Ocurrió un error al registrar tu inscripción.';
      this.success = false;
    } finally {
      this.submitting = false;
    }
  }
}
