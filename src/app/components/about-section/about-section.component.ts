import { Component } from "@angular/core"

@Component({
  selector: "app-about-section",
  standalone: true,
  templateUrl: "./about-section.component.html",
  styleUrls: ["./about-section.component.scss"],
})
export class AboutSectionComponent {

  registerHref: string =
    "https://wa.me/573228969215?text=Hola!%20Doctora.%20Alejandra%20Me%20gustaria%20agendar%20una%20cita%20para%20una%20consulta%20virtual";
}
