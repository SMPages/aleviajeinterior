// src/app/services/masterclass.service.ts
import { Injectable, inject } from '@angular/core';
import { SUPABASE } from '../core/supabase.token';

/* ===== Tipos ===== */
export interface LeadInput {
  nombre: string;
  email: string;
  telefono?: string | null;
  acepta_politicas: boolean;
  version_politicas?: string; // default 'v1'
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
}

export interface Testimonio {
  id: number;
  nombre: string;
  contenido: string;
  email?: string | null;
  foto_url?: string | null;
  aprobado: boolean;
  destacado: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt?: string | null;
  content_md?: string | null;
  cover_image?: string | null;
  author_name?: string | null;
  published: boolean;
  published_at?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  lang?: string | null;
  created_at: string;
  updated_at: string;
}

/* ===== Servicio ===== */
@Injectable({ providedIn: 'root' })
export class MasterclassService {
  private sb = inject(SUPABASE);

  // ==================== CLIENTES ====================
async registrarCliente(
  nombre: string,
  email: string,
  telefono: string | null,
  acepta: boolean,
  version = 'v1',
  utm?: { source?: string; medium?: string; campaign?: string }
) {
  const payload: LeadInput = {
    nombre,
    email,
    telefono: telefono ?? null,
    acepta_politicas: acepta,
    version_politicas: version,
    utm_source: utm?.source ?? null,
    utm_medium: utm?.medium ?? null,
    utm_campaign: utm?.campaign ?? null,
  };

  // 1) Inserta lead (sin .select() por RLS)
  {
    const { error } = await this.sb
      .schema('masterclass')
      .from('clientes')
      .insert([payload]);

    if (error) throw error;
  }

  // 2) Registrar SIEMPRE el consentimiento
  const userAgent =
    typeof navigator !== 'undefined' && navigator.userAgent
      ? navigator.userAgent
      : 'unknown';

  // 2a) RPC (capta IP si tu función lo hace)
  try {
    const { error: rpcErr } = await this.sb.rpc('log_consent', {
      p_email: email,
      p_version: version,
      p_user_agent: userAgent,
    });
    // Si la RPC devolviera error en respuesta:
    if (rpcErr) throw rpcErr;
  } catch {
    // 2b) Fallback directo a la tabla (ignora error de forma segura)
    const { error: clErr } = await this.sb
    .schema('masterclass')
    .from('consent_logs')
    .upsert([{ email, version, user_agent: userAgent }], { onConflict: 'email,version' });

    // No rompas el flujo si falla
    // if (clErr) console.warn('No se pudo registrar consentimiento:', clErr);
  }

  return true;
}


  // ==================== TESTIMONIOS ====================
async enviarTestimonio(nombre: string, contenido: string, email?: string, fotoUrl?: string) {
  const { error } = await this.sb
    .schema('masterclass')
    .from('testimonios')
    .insert([{ nombre, contenido, email, foto_url: fotoUrl }]); // 👈 sin .select()

  if (error) throw error;
  return true; // éxito
}
async obtenerTestimoniosAprobados(limit = 20) {
  const { data, error } = await this.sb
    .schema('masterclass')          
    .from('testimonios')        
    .select('*')
    .eq('aprobado', true)
    .order('destacado', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as Testimonio[];
}

  // ==================== BLOG ====================
  /**
   * Lista posts publicados con paginación y búsqueda opcional.
   * page empieza en 1.
   */
  async obtenerPostsPublicados(opts?: { page?: number; pageSize?: number; search?: string; categoryId?: number }) {
    const page = Math.max(1, opts?.page ?? 1);
    const pageSize = Math.min(50, Math.max(1, opts?.pageSize ?? 10));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const nowIso = new Date().toISOString();

    // 1) Si filtra por categoría, obtenemos los IDs desde la pivote
    let idsFiltro: number[] | undefined;
    if (opts?.categoryId) {
      const { data: rel, error: relErr } = await this.sb
        .schema('masterclass')
        .from('blog_post_categories')
        .select('post_id')
        .eq('category_id', opts.categoryId);

      if (relErr) throw relErr;
      idsFiltro = (rel ?? []).map(r => r.post_id);
      if (!idsFiltro.length) {
        return { items: [], total: 0, page, pageSize };
      }
    }

    // 2) Query base (misma "shape" siempre)
    const baseSelect =
      'id, slug, title, excerpt, cover_image, published_at, author_name, seo_title, seo_description';

    let q = this.sb
    .schema('masterclass')
      .from('masterclass.blog_posts')
      .select(baseSelect, { count: 'exact' })
      .eq('published', true)
      .or(`published_at.is.null,published_at.lte.${nowIso}`)
      .order('published_at', { ascending: false });

    if (idsFiltro) q = q.in('id', idsFiltro);
    if (opts?.search) q = q.or(`title.ilike.%${opts.search}%,excerpt.ilike.%${opts.search}%`);

    q = q.range(from, to);

    const { data, error, count } = await q;
    if (error) throw error;

    return {
      items: (data ?? []) as BlogPost[],
      total: count ?? (idsFiltro?.length ?? 0),
      page,
      pageSize
    };
  }

  async obtenerPostPorSlug(slug: string) {
    const nowIso = new Date().toISOString();

    const { data, error } = await this.sb
        .schema('masterclass')
      .from('masterclass.blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .or(`published_at.is.null,published_at.lte.${nowIso}`)
      .single();

    if (error) throw error;
    return data as BlogPost;
  }
}
