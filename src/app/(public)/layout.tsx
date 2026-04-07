import Link from "next/link";
import { SITE_TITLE } from "@/lib/constants";

export default function PublicLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-x-hidden text-ink">
      <header className="sticky top-0 z-40 border-b border-[#f4d7df] bg-[#fff5f8]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-8">
          <Link href="/" className="font-serif text-lg font-semibold md:text-xl">
            {SITE_TITLE}
          </Link>
          <nav className="flex items-center gap-2 text-sm md:gap-6 md:text-base">
            <Link href="/#categories" className="rounded-full px-3 py-1.5 transition hover:bg-[#fde8ef]">
              分类
            </Link>
            <Link href="/studio" className="rounded-full bg-[#f3c9d8] px-4 py-1.5 text-[#563844] transition hover:-translate-y-0.5 hover:bg-[#efbfd0]">
              上传图片
            </Link>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
