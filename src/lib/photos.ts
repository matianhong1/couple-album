import { seedPlaceholders } from "@/data/seedPlaceholders";
import { Photo } from "@/lib/types";
import { getSupabaseClient } from "@/lib/supabaseClient";

type PhotoRow = {
  id: string;
  category: "life" | "food" | "travel";
  title: string;
  description: string | null;
  image_url: string;
  thumb_url: string | null;
  taken_at: string | null;
  is_published: boolean;
  created_at: string;
};

function mapRow(row: PhotoRow): Photo {
  return {
    id: row.id,
    category: row.category,
    title: row.title,
    description: row.description ?? undefined,
    imageUrl: row.image_url,
    thumbUrl: row.thumb_url ?? undefined,
    takenAt: row.taken_at ?? undefined,
    isPublished: row.is_published,
    createdAt: row.created_at
  };
}

export async function fetchPublishedPhotos(): Promise<Photo[]> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return seedPlaceholders;
  }

  const { data, error } = await supabase
    .from("photos")
    .select("id, category, title, description, image_url, thumb_url, taken_at, is_published, created_at")
    .eq("is_published", true)
    .order("taken_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error || !data || data.length === 0) {
    return seedPlaceholders;
  }

  return data.map(mapRow);
}

export async function fetchAllPhotos(): Promise<Photo[]> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return seedPlaceholders;
  }

  const { data, error } = await supabase
    .from("photos")
    .select("id, category, title, description, image_url, thumb_url, taken_at, is_published, created_at")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return seedPlaceholders;
  }

  return data.map(mapRow);
}

