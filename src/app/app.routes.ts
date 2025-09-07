import type { Routes } from "@angular/router"
import { HomeComponent } from "./pages/home/home.component"
import { PoliticaDeDatosComponent } from './pages/politica-de-datos/politica-de-datos.component';

export const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: 'politica-de-datos', component: PoliticaDeDatosComponent },
  { path: "**", redirectTo: "" },
]
