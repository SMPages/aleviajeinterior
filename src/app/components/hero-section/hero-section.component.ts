import { Component } from "@angular/core";

@Component({
  selector: "app-hero-section",
  standalone: true,
  templateUrl: "./hero-section.component.html",
  styleUrls: ["./hero-section.component.scss"],
})
export class HeroSectionComponent {

  // 👉 enlace para registro vía WhatsApp (cámbialo por tu número real o tu formulario)
  registerHref: string =
    "https://wa.me/573228969215?text=Quiero%20registrarme%20a%20la%20masterclass";

  /**
   * Desplaza suavemente hasta la sección indicada por ID
   */
  scrollToSection(sectionId: string): void {
    const el = document.getElementById(sectionId);
  
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
}
