import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { trigger, style, transition, animate } from "@angular/animations"

interface Testimonial {
  name: string
  text: string
  image: string
}

@Component({
  selector: "app-testimonials-section",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./testimonials-section.component.html",
  styleUrls: ["./testimonials-section.component.scss"],
  animations: [
    trigger("slideIn", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateX(20px)" }),
        animate("300ms ease-in", style({ opacity: 1, transform: "translateX(0)" })),
      ]),
    ]),
  ],
})
export class TestimonialsSectionComponent {
  testimonials: Testimonial[] = [
    {
      name: "María González",
      text: "El programa me ayudó a entender patrones que venía repitiendo desde generaciones. Ahora me siento libre y auténtica por primera vez en mi vida.",
      image: "/images/happy-woman-testimonial-portrait.png",
    },
    {
      name: "Carmen Rodríguez",
      text: "Alejandra me acompañó con tanta calidez en este proceso. Logré sanar heridas que ni sabía que tenía y reconectar conmigo misma.",
      image: "/images/smiling-woman-testimonial-portrait.png",
    },
    {
      name: "Ana Martínez",
      text: "Los 90 días fueron transformadores. Pasé de sentirme bloqueada emocionalmente a vivir desde un lugar de poder y autenticidad.",
      image: "/images/confident-woman-testimonial-portrait.png",
    },
  ]

  currentIndex = 0

  nextTestimonial(): void {
    this.currentIndex = (this.currentIndex + 1) % this.testimonials.length
  }

  prevTestimonial(): void {
    this.currentIndex = (this.currentIndex - 1 + this.testimonials.length) % this.testimonials.length
  }

  goToTestimonial(index: number): void {
    this.currentIndex = index
  }

  get currentTestimonial(): Testimonial {
    return this.testimonials[this.currentIndex]
  }
}
