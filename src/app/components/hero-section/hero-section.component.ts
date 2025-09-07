import { Component } from "@angular/core";
import { NgIf } from "@angular/common";
import { MasterclassSignupComponent } from "../masterclass-signup/masterclass-signup.component";
import { MasterclassWelcomeModalComponent } from "../masterclass-welcome-modal/masterclass-welcome-modal.component";

@Component({
  selector: "app-hero-section",
  standalone: true,
  imports: [NgIf, MasterclassSignupComponent, MasterclassWelcomeModalComponent],
  templateUrl: "./hero-section.component.html",
  styleUrls: ["./hero-section.component.scss"],
})
export class HeroSectionComponent {
  showSignup = false;

  // Modal
  showWelcome = false;
  welcomeName: string | undefined;

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
}
