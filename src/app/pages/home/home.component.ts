import { Component } from "@angular/core"
import { HeaderComponent } from "../../components/header/header.component"
import { HeroSectionComponent } from "../../components/hero-section/hero-section.component"
import { AboutSectionComponent } from "../../components/about-section/about-section.component"
import { ProgramSectionComponent } from "../../components/program-section/program-section.component"
import { TestimonialsSectionComponent } from "../../components/testimonials-section/testimonials-section.component"
import { BlogSectionComponent } from "../../components/blog-section/blog-section.component"
import { ContactSectionComponent } from "../../components/contact-section/contact-section.component"
import { FooterComponent } from "../../components/footer/footer.component"

@Component({
  selector: "app-home",
  standalone: true,
  imports: [
    HeaderComponent,
    HeroSectionComponent,
    AboutSectionComponent,
    ProgramSectionComponent,
    TestimonialsSectionComponent,
    BlogSectionComponent,
    ContactSectionComponent,
    FooterComponent,
  ],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent {}
