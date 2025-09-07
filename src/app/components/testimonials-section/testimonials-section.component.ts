// src/app/components/testimonials-section/testimonials-section.component.ts
import { Component, OnInit, OnDestroy, HostListener, inject } from "@angular/core";
import { CommonModule, NgIf, NgFor } from "@angular/common";
import { trigger, style, transition, animate } from "@angular/animations";
import { MasterclassService } from "../../services/masterclass.service";
import { TestimonialSubmitWithPhotoComponent } from "../testimonial-submit/testimonial-submit.component";
interface Testimonial {
  name: string;
  text: string;
  image?: string;
}

@Component({
  selector: "app-testimonials-section",
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, TestimonialSubmitWithPhotoComponent],
  templateUrl: "./testimonials-section.component.html",
  styleUrls: ["./testimonials-section.component.scss"],
  animations: [
    trigger("slideIn", [
      transition("* => *", [
        style({ opacity: 0, transform: "translateX(20px)" }),
        animate("300ms ease-in", style({ opacity: 1, transform: "translateX(0)" })),
      ]),
    ]),
  ],
})
export class TestimonialsSectionComponent implements OnInit, OnDestroy {
  private mc = inject(MasterclassService);

  testimonials: Testimonial[] = [];
  currentIndex = 0;
  loading = true;
  errorMsg = "";
  showForm = false; 
  // autoplay (opcional)
  private autoTimer: any = null;
  autoIntervalMs = 6000;

  async ngOnInit() {
    try {
      const rows = await this.mc.obtenerTestimoniosAprobados();
      this.testimonials = (rows ?? []).map((t: any) => ({
        name: t.nombre,
        text: t.contenido,
        image: t.foto_url || "icons/default-avatar.jpg",
      }));

      if (this.testimonials.length === 0) {
        this.errorMsg = "Aún no hay testimonios publicados.";
      } else {
        this.startAuto();
      }
    } catch (e: any) {
      this.errorMsg = e?.message ?? "Error cargando testimonios.";
    } finally {
      this.loading = false;
    }
  }

  ngOnDestroy() {
    this.stopAuto();
  }

  nextTestimonial(): void {
    if (this.testimonials.length <= 1) return;
    this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
  }

  prevTestimonial(): void {
    if (this.testimonials.length <= 1) return;
    this.currentIndex = (this.currentIndex - 1 + this.testimonials.length) % this.testimonials.length;
  }

  goToTestimonial(index: number): void {
    if (index < 0 || index >= this.testimonials.length) return;
    this.currentIndex = index;
  }

  get currentTestimonial(): Testimonial | null {
    return this.testimonials.length ? this.testimonials[this.currentIndex] : null;
  }

  trackByIndex = (_: number, __: unknown) => _;

  // Accesibilidad con teclado
  @HostListener('window:keydown.arrowRight') onRight() { this.nextTestimonial(); }
  @HostListener('window:keydown.arrowLeft') onLeft() { this.prevTestimonial(); }

  // autoplay helpers
  private startAuto() {
    this.stopAuto();
    if (this.testimonials.length > 1) {
      this.autoTimer = setInterval(() => this.nextTestimonial(), this.autoIntervalMs);
    }
  }
  private stopAuto() {
    if (this.autoTimer) {
      clearInterval(this.autoTimer);
      this.autoTimer = null;
    }
  }

   // Mostrar/ocultar formulario + scroll suave
  toggleForm() {
    this.showForm = !this.showForm;
    if (this.showForm) {
      setTimeout(() => {
        document.getElementById('testimonial-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 0);
    }
  }
}
