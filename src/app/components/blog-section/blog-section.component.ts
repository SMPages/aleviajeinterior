import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-blog-section",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./blog-section.component.html",
  styleUrl: "./blog-section.component.scss",
})
export class BlogSectionComponent {
  articles = [
    {
      title: "Cómo identificar patrones transgeneracionales en tu vida",
      excerpt: "Descubre las señales que indican que estás repitiendo patrones familiares y cómo comenzar a sanarlos.",
      image: "/images/family-tree-patterns-healing-therapy.png",
    },
    {
      title: "El poder de la sanación emocional femenina",
      excerpt: "Explora la importancia de reconectar con tu esencia femenina y sanar las heridas del linaje materno.",
      image: "/images/feminine-healing-emotional-wellness.png",
    },
    {
      title: "5 técnicas para liberar bloqueos emocionales",
      excerpt: "Herramientas prácticas que puedes usar hoy mismo para comenzar tu proceso de liberación emocional.",
      image: "/images/emotional-release-techniques-meditation.png",
    },
  ]
}
