import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, HostListener, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-masterclass-welcome-modal',
  standalone: true,
  imports: [NgIf],
  templateUrl: './masterclass-welcome-modal.component.html',
  styleUrls: ['./masterclass-welcome-modal.component.scss']
})
export class MasterclassWelcomeModalComponent {
  private router = inject(Router);

  /** Mostrar/ocultar modal */
  @Input() open = false;

  /** Ruta donde está la masterclass */
  @Input() masterclassRoute: string = '/acceso';

  /** Nombre para saludo */
  @Input() nombre?: string;

  /** Se emite al cerrar (esc, backdrop, X) */
  @Output() closed = new EventEmitter<void>();

  @ViewChild('primaryBtn') primaryBtn?: ElementRef<HTMLButtonElement>;

  ngOnChanges() {
    if (this.open) {
      setTimeout(() => this.primaryBtn?.nativeElement?.focus(), 0);
    }
  }

  close() { this.closed.emit(); }

  goNow() {
    this.close();
    this.router.navigateByUrl(this.masterclassRoute);
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    if (!this.open) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      this.close();
    }
  }

  onBackdropClick(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('mcw__backdrop')) {
      this.close();
    }
  }
}
