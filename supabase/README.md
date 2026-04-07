# Supabase setup notes

1. Create a project in Supabase.
2. Run `supabase/schema.sql` in SQL Editor.
3. Create a public bucket named `couple-album`.
4. Bucket policy suggestion:
   - Public read for files in `couple-album`
   - Authenticated write/delete
5. Create two Auth users (you and your partner).
6. Fill `.env.local` from `.env.example`.

