export default function SiteFooter() {
  return (
    <footer className="border-t border-[#efdbc8] bg-[#fcf8f2] py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 text-center text-sm text-[#7d6759] md:px-8">
        <p className="font-serif text-base text-[#5e4b40]">Our Gentle Archive</p>
        <p>愿每一张照片，都能让我们再次爱上同一天。</p>
        <p className="text-xs text-[#9f8a79]">© {new Date().getFullYear()} Couple Album.</p>
      </div>
    </footer>
  );
}

