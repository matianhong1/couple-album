import CategoryCards from "@/components/CategoryCards";
import SiteFooter from "@/components/SiteFooter";
import { fetchPublishedPhotos } from "@/lib/photos";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const photos = await fetchPublishedPhotos();

  return (
    <main className="pt-8 md:pt-10">
      <CategoryCards photos={photos} />
      <SiteFooter />
    </main>
  );
}
