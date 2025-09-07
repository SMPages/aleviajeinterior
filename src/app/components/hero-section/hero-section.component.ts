import { Component } from "@angular/core";
import { MasterclassSignupComponent } from "../masterclass-signup/masterclass-signup.component";
import { NgIf } from "@angular/common";
@Component({
  selector: "app-hero-section",
  standalone: true,
  imports: [MasterclassSignupComponent, NgIf],
  templateUrl: "./hero-section.component.html",
  styleUrls: ["./hero-section.component.scss"],
})
export class HeroSectionComponent {

  showSignup = false;
  // 👉 enlace para registro vía WhatsApp (cámbialo por tu número real o tu formulario)
  

    toggleSignup() {
  this.showSignup = !this.showSignup;
  if (this.showSignup) {
    setTimeout(() => {
      document.getElementById('signup-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  }
}

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
