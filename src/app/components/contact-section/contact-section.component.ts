import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"

@Component({
  selector: "app-contact-section",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./contact-section.component.html",
  styleUrl: "./contact-section.component.scss",
})
export class ContactSectionComponent {
  contactForm = {
    name: "",
    email: "",
    message: "",
  }

  onSubmit() {
    console.log("Form submitted:", this.contactForm)
    // Aquí puedes agregar la lógica para enviar el formulario
  }
}
