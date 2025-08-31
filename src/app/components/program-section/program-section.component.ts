import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"

interface Feature {
  icon: string
  title: string
  description: string
}

interface TimelineItem {
  week: string
  phase: string
  description: string
}

@Component({
  selector: "app-program-section",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./program-section.component.html",
  styleUrls: ["./program-section.component.scss"],
})
export class ProgramSectionComponent {
  features: Feature[] = [
    {
      icon: "❤️",
      title: "Sanar patrones familiares",
      description: "Identifica y libera las cargas emocionales heredadas que limitan tu crecimiento personal.",
    },
    {
      icon: "🔓",
      title: "Liberarte de bloqueos emocionales",
      description: "Desbloquea las emociones reprimidas y encuentra la libertad emocional que mereces.",
    },
    {
      icon: "✨",
      title: "Reconectar con tu autenticidad",
      description: "Redescubre tu verdadera esencia y vive desde un lugar de autenticidad y poder personal.",
    },
  ]

  timeline: TimelineItem[] = [
    { week: "Semana 1-3", phase: "Reconocimiento", description: "Identificación de patrones" },
    { week: "Semana 4-6", phase: "Liberación", description: "Sanación de heridas heredadas" },
    { week: "Semana 7-9", phase: "Integración", description: "Nuevos patrones saludables" },
    { week: "Semana 10-12", phase: "Transformación", description: "Reconexión con tu esencia" },
  ]
}
