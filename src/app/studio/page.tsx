import UploadPanel from "@/components/UploadPanel";

export default function StudioPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-14 md:px-8">
      <div className="mb-8">
        <h1 className="mt-2 font-serif text-4xl text-[#4b2f3c] md:text-5xl">情侣相册</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#7c5a67] md:text-base">上传、编辑、发布照片。公开页面只展示“已发布”内容。</p>
      </div>
      <UploadPanel />
    </main>
  );
}
