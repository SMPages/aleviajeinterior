import { Component, signal, inject, DestroyRef } from "@angular/core";
import { NgIf , NgFor,NgClass  } from "@angular/common";
import { MasterclassSignupComponent } from "../masterclass-signup/masterclass-signup.component";
import { MasterclassWelcomeModalComponent } from "../masterclass-welcome-modal/masterclass-welcome-modal.component";

@Component({
  selector: "app-hero-section",
  standalone: true,
  imports: [NgIf, NgFor,NgClass , MasterclassSignupComponent, MasterclassWelcomeModalComponent],
  templateUrl: "./hero-section.component.html",
  styleUrls: ["./hero-section.component.scss"],
})
export class HeroSectionComponent {
  showSignup = false;
  private destroyRef = inject(DestroyRef);
  // Modal
  showWelcome = false;
  welcomeName: string | undefined;

  images = [
    { src: '/images/carrusel/1.png',  alt: 'Mujer en proceso de sanación emocional' },
    { src: '/images/carrusel/2.png', alt: 'Sesión de terapia: calma y bienestar' },
    { src: '/images/carrusel/3.png', alt: 'Meditación guiada para equilibrio emocional' },
    { src: '/images/carrusel/4.png', alt: 'Meditación guiada para equilibrio emocional' },
  ];
 current = signal(0);
  autoplayMs = 5000;
  private timerId: any = null;

  // Ruta donde está la masterclass (ajústala)
  masterclassRoute = "/acceso";

  toggleSignup() {
    this.showSignup = !this.showSignup;
    if (this.showSignup) {
      setTimeout(() => {
        document.getElementById("signup-form")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 0);
    }
  }

  onSignupSubmitted() {
    this.showWelcome = true;
  }

  onSignupSubmittedName(name: string) {
    this.welcomeName = name;
  }

  closeWelcome() {
    this.showWelcome = false;
  }

  scrollToSection(sectionId: string): void {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  ngOnInit() {
    this.startAutoplay();
    // Limpieza automática al destruir el componente
    this.destroyRef.onDestroy(() => this.stopAutoplay());
  }

  next() {
    this.current.update(i => (i + 1) % this.images.length);
  }

  prev() {
    this.current.update(i => (i - 1 + this.images.length) % this.images.length);
  }

  goTo(index: number) {
    this.current.set(index);
  }

  startAutoplay() {
    this.stopAutoplay();
    this.timerId = setInterval(() => this.next(), this.autoplayMs);
  }

  stopAutoplay() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  // Opcional: pausar cuando el usuario interactúa
  onMouseEnter() { this.stopAutoplay(); }
  onMouseLeave() { this.startAutoplay(); }
}
