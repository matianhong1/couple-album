import Link from "next/link";
import { notFound } from "next/navigation";
import PhotoGrid from "@/components/PhotoGrid";
import { CATEGORY_META } from "@/lib/constants";
import { fetchPublishedPhotos } from "@/lib/photos";
import { Category } from "@/lib/types";

const validCategories: Category[] = ["life", "food", "travel"];

type Props = {
  params: Promise<{ category: string }>;
};

export default async function GalleryPage({ params }: Props) {
  const resolved = await params;
  const category = resolved.category as Category;

  if (!validCategories.includes(category)) {
    notFound();
  }

  const allPhotos = await fetchPublishedPhotos();
  const photos = allPhotos.filter((photo) => photo.category === category);
  const meta = CATEGORY_META.find((item) => item.id === category);

  return (
    <main className="mx-auto max-w-6xl px-4 py-14 md:px-8">
      <div className="mb-10 flex flex-col gap-3">
        <Link href="/" className="w-fit rounded-full bg-white/70 px-4 py-1.5 text-sm text-[#6e594c] shadow-soft transition hover:bg-white">
          返回首页
        </Link>
        <h1 className="font-serif text-4xl text-[#3f3028] md:text-5xl">{meta?.title}</h1>
        <p className="max-w-2xl text-sm leading-7 text-[#6f5b4f] md:text-base">{meta?.subtitle}</p>
      </div>

      <PhotoGrid photos={photos} emptyText="" />
    </main>
  );
}
