import { Component, EventEmitter, Output, inject } from '@angular/core';
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

  // Campos
  nombre = '';
  email = '';
  telefono = '';
  acepta = false;

  // UTM (si vienen en la URL)
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

  async onSubmit() {
    this.msg = '';
    this.success = false;

    if (!this.nombre.trim() || !this.email.trim()) {
      this.msg = 'Nombre y email son obligatorios.';
      return;
    }
    if (!this.acepta) {
      this.msg = 'Debes aceptar las políticas de tratamiento de datos.';
      return;
    }

    this.submitting = true;
    try {
      await this.mc.registrarCliente(
        this.nombre.trim(),
        this.email.trim(),
        this.telefono.trim() || null,
        this.acepta,
        'v1',
        {
          source: this.utm.source || undefined,
          medium: this.utm.medium || undefined,
          campaign: this.utm.campaign || undefined,
        }
      );

      this.success = true;
      this.msg = '¡Gracias! Te hemos registrado para la masterclass. Revisa tu email.';
      this.submitted.emit();

      // reset suave
      this.nombre = '';
      this.email = '';
      this.telefono = '';
      this.acepta = false;
    } catch (e: any) {
      this.msg = e?.message ?? 'Ocurrió un error al registrar tu inscripción.';
    } finally {
      this.submitting = false;
    }
  }
}
