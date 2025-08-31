import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { trigger, state, style, transition, animate } from "@angular/animations"

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
  animations: [
    trigger("mobileMenu", [
      state(
        "closed",
        style({
          opacity: 0,
          transform: "translateY(-10px)",
        }),
      ),
      state(
        "open",
        style({
          opacity: 1,
          transform: "translateY(0)",
        }),
      ),
      transition("closed => open", animate("200ms ease-in")),
      transition("open => closed", animate("200ms ease-out")),
    ]),
  ],
})
export class HeaderComponent {
  isMenuOpen = false

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    this.isMenuOpen = false
  }
}
