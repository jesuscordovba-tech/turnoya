import { supabase } from '@/lib/supabase/client'

export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function generateUniqueSlug(
  baseSlug: string,
  excludeId?: string,
): Promise<string> {
  let slug = toSlug(baseSlug)
  if (!slug) slug = 'negocio'

  let counter = 1
  while (await slugExists(slug, excludeId)) {
    slug = `${toSlug(baseSlug)}-${counter}`
    counter++
  }

  return slug
}

async function slugExists(slug: string, excludeId?: string): Promise<boolean> {
  let query = supabase.from('businesses').select('id').eq('slug', slug)

  if (excludeId) {
    query = query.neq('id', excludeId)
  }

  const { data } = await query.maybeSingle()
  return !!data
}
