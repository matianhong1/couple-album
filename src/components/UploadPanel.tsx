"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Session } from "@supabase/supabase-js";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { Category, Photo } from "@/lib/types";

const categoryOptions: { value: Category; label: string }[] = [
  { value: "life", label: "生活" },
  { value: "food", label: "美食" },
  { value: "travel", label: "旅行" }
];

type PhotoRow = {
  id: string;
  category: Category;
  title: string;
  description: string | null;
  image_url: string;
  thumb_url: string | null;
  taken_at: string | null;
  is_published: boolean;
  created_at: string;
};

function rowToPhoto(row: PhotoRow): Photo {
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

function sanitizeFilename(name: string): string {
  return name.trim().replace(/\s+/g, "-").replace(/[^a-zA-Z0-9._-]/g, "");
}

function fallbackTitleFromFilename(name: string): string {
  const extRemoved = name.replace(/\.[^/.]+$/, "");
  const normalized = extRemoved.replace(/[-_]+/g, " ").trim();
  return normalized || "未命名照片";
}

export default function UploadPanel() {
  const supabase = useMemo(() => getSupabaseClient(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [takenAt, setTakenAt] = useState("");
  const [category, setCategory] = useState<Category>("life");
  const [files, setFiles] = useState<File[]>([]);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadProgressText, setUploadProgressText] = useState("");

  const loadPhotos = useCallback(async () => {
    if (!supabase) return;

    const { data, error } = await supabase
      .from("photos")
      .select("id, category, title, description, image_url, thumb_url, taken_at, is_published, created_at")
      .order("created_at", { ascending: false });

    if (error || !data) {
      setMessage(error?.message ?? "读取图片失败");
      return;
    }

    setPhotos(data.map((row) => rowToPhoto(row as PhotoRow)));
  }, [supabase]);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    if (!session) return;
    void loadPhotos();
  }, [session, loadPhotos]);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setMessage(`登录失败：${error.message}`);
      return;
    }

    setMessage("登录成功");
  }

  async function logout() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setMessage("已退出登录");
  }

  async function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase || files.length === 0) {
      setMessage("请先选择至少一张图片");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadProgressText(`准备上传 0/${files.length}`);

    let successCount = 0;
    const failedFiles: string[] = [];

    for (let i = 0; i < files.length; i += 1) {
      const file = files[i];
      const safeName = sanitizeFilename(file.name);
      const filePath = `${category}/${Date.now()}-${i + 1}-${safeName}`;
      setUploadProgressText(`正在上传 ${i + 1}/${files.length}：${file.name}`);

      const { error: uploadError } = await supabase.storage.from("couple-album").upload(filePath, file, { upsert: false });

      if (uploadError) {
        failedFiles.push(file.name);
        const progress = Math.round(((i + 1) / files.length) * 100);
        setUploadProgress(progress);
        continue;
      }

      const { data: urlData } = supabase.storage.from("couple-album").getPublicUrl(filePath);

      const resolvedTitle =
        files.length === 1
          ? title.trim() || fallbackTitleFromFilename(file.name)
          : title.trim()
            ? `${title.trim()} ${i + 1}`
            : fallbackTitleFromFilename(file.name);

      const { error: insertError } = await supabase.from("photos").insert({
        category,
        title: resolvedTitle,
        description: description || null,
        image_url: urlData.publicUrl,
        thumb_url: null,
        taken_at: takenAt || null,
        is_published: true
      });

      if (insertError) {
        failedFiles.push(file.name);
      } else {
        successCount += 1;
      }

      const progress = Math.round(((i + 1) / files.length) * 100);
      setUploadProgress(progress);
    }

    setUploadProgressText("上传完成");
    setIsUploading(false);

    setTitle("");
    setDescription("");
    setTakenAt("");
    setCategory("life");
    setFiles([]);

    if (failedFiles.length > 0) {
      setMessage(`上传完成：成功 ${successCount} 张，失败 ${failedFiles.length} 张。失败文件：${failedFiles.slice(0, 3).join("、")}${failedFiles.length > 3 ? "..." : ""}`);
    } else {
      setMessage(`上传成功，共 ${successCount} 张`);
    }

    await loadPhotos();
  }

  async function togglePublish(photo: Photo) {
    if (!supabase) return;

    const { error } = await supabase
      .from("photos")
      .update({ is_published: !photo.isPublished })
      .eq("id", photo.id);

    if (error) {
      setMessage(`更新失败：${error.message}`);
      return;
    }

    await loadPhotos();
  }

  async function updateText(photo: Photo) {
    if (!supabase) return;

    const { error } = await supabase
      .from("photos")
      .update({
        title: photo.title,
        description: photo.description ?? null
      })
      .eq("id", photo.id);

    if (error) {
      setMessage(`保存失败：${error.message}`);
      return;
    }

    setMessage("保存成功");
    await loadPhotos();
  }

  async function removePhoto(photo: Photo) {
    if (!supabase) return;

    const filePath = extractStoragePath(photo.imageUrl);

    const { error: deleteDbError } = await supabase.from("photos").delete().eq("id", photo.id);
    if (deleteDbError) {
      setMessage(`删除失败：${deleteDbError.message}`);
      return;
    }

    if (filePath) {
      await supabase.storage.from("couple-album").remove([filePath]);
    }

    setMessage("已删除");
    await loadPhotos();
  }

  function extractStoragePath(url: string): string | null {
    const marker = "/storage/v1/object/public/couple-album/";
    const idx = url.indexOf(marker);
    if (idx < 0) return null;
    return url.slice(idx + marker.length);
  }

  if (!supabase) {
    return (
      <div className="rounded-3xl border border-[#f4d9e4] bg-white/70 p-8 text-[#7a5262] shadow-soft">
        <h2 className="font-serif text-2xl">未配置 Supabase</h2>
        <p className="mt-3 text-sm leading-7">
          请先配置 <code>NEXT_PUBLIC_SUPABASE_URL</code> 与 <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>，并在 Supabase 创建
          <code>photos</code> 表和 <code>couple-album</code> 存储桶。
        </p>
      </div>
    );
  }

  if (loading) {
    return <p className="rounded-2xl bg-white/70 p-6 text-[#8a6171] shadow-soft">正在加载登录状态...</p>;
  }

  if (!session) {
    return (
      <form onSubmit={login} className="mx-auto max-w-md rounded-3xl border border-[#f4d9e4] bg-white/75 p-8 shadow-soft">
        <h2 className="font-serif text-2xl text-[#4b2f3c]">情侣相册登录</h2>
        <p className="mt-2 text-sm text-[#8a6171]">仅登录用户可上传与管理照片。</p>

        <label className="mt-6 block text-sm text-[#7a5262]">邮箱</label>
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-2 w-full rounded-xl border border-[#f3d6e2] bg-white px-3 py-2 outline-none ring-0 focus:border-[#e6adc3]"
        />

        <label className="mt-4 block text-sm text-[#7a5262]">密码</label>
        <input
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 w-full rounded-xl border border-[#f3d6e2] bg-white px-3 py-2 outline-none ring-0 focus:border-[#e6adc3]"
        />

        <button type="submit" className="mt-6 w-full rounded-xl bg-[#f4bfd1] px-4 py-2 font-medium text-[#5a3a49] transition hover:brightness-95">
          登录进入
        </button>
        {message ? <p className="mt-3 text-sm text-[#8a6171]">{message}</p> : null}
      </form>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between rounded-2xl border border-[#f4d9e4] bg-white/75 p-4 shadow-soft">
        <p className="text-sm text-[#7a5262]">当前登录：{session.user.email}</p>
        <button onClick={logout} className="rounded-lg bg-[#f8dce7] px-3 py-1.5 text-sm text-[#5f3f4f] transition hover:bg-[#f3c8d9]">
          退出登录
        </button>
      </div>

      <form onSubmit={upload} className="rounded-3xl border border-[#f4d9e4] bg-white/75 p-6 shadow-soft md:p-8">
        <h3 className="font-serif text-2xl text-[#4b2f3c]">上传新照片</h3>
        <p className="mt-2 text-sm text-[#8a6171]">支持多选批量上传；可选填统一标题前缀和描述。</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm text-[#7a5262]">统一标题前缀（可选）</label>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="例如：厦门旅行"
              className="mt-2 w-full rounded-xl border border-[#f3d6e2] bg-white px-3 py-2 focus:border-[#e6adc3]"
            />
          </div>
          <div>
            <label className="text-sm text-[#7a5262]">分类</label>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value as Category)}
              className="mt-2 w-full rounded-xl border border-[#f3d6e2] bg-white px-3 py-2 focus:border-[#e6adc3]"
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-[#7a5262]">拍摄日期（可选）</label>
            <input
              type="date"
              value={takenAt}
              onChange={(event) => setTakenAt(event.target.value)}
              className="mt-2 w-full rounded-xl border border-[#f3d6e2] bg-white px-3 py-2 focus:border-[#e6adc3]"
            />
          </div>
          <div>
            <label className="text-sm text-[#7a5262]">选择图片（可多选）</label>
            <input
              type="file"
              accept="image/*"
              multiple
              required
              onChange={(event) => setFiles(Array.from(event.target.files ?? []))}
              className="mt-2 w-full rounded-xl border border-[#f3d6e2] bg-white px-3 py-2"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="text-sm text-[#7a5262]">统一描述（可选）</label>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            className="mt-2 w-full rounded-xl border border-[#f3d6e2] bg-white px-3 py-2 focus:border-[#e6adc3]"
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-[#8f6576]">
          <span>已选择 {files.length} 张图片</span>
          {files.length > 0 ? (
            <button
              type="button"
              onClick={() => setFiles([])}
              className="rounded-lg bg-[#f8dce7] px-3 py-1.5 text-[#5f3f4f] transition hover:bg-[#f3c8d9]"
            >
              清空选择
            </button>
          ) : null}
        </div>

        {isUploading || uploadProgress > 0 ? (
          <div className="mt-5 rounded-xl border border-[#f2d6e2] bg-[#fff7fb] p-3">
            <div className="mb-2 flex items-center justify-between text-xs text-[#8a6171]">
              <span>{uploadProgressText || "准备上传"}</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#f4d9e6]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#f4bfd1] to-[#edbfd4] transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isUploading}
          className="mt-5 rounded-xl bg-[#f4bfd1] px-5 py-2.5 font-medium text-[#5a3a49] transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isUploading ? "上传中..." : "开始上传"}
        </button>
        {message ? <p className="mt-3 text-sm text-[#8a6171]">{message}</p> : null}
      </form>

      <section className="rounded-3xl border border-[#f4d9e4] bg-white/75 p-6 shadow-soft md:p-8">
        <h3 className="font-serif text-2xl text-[#4b2f3c]">照片管理</h3>
        <div className="mt-6 space-y-4">
          {photos.map((photo) => (
            <article key={photo.id} className="grid gap-4 rounded-2xl border border-[#f2d6e2] bg-white/80 p-4 md:grid-cols-[120px_1fr_auto]">
              <div className="relative h-[120px] overflow-hidden rounded-xl">
                <Image src={photo.imageUrl} alt={photo.title} fill className="object-cover" />
              </div>
              <div className="space-y-2">
                <input
                  value={photo.title}
                  onChange={(event) => {
                    const next = photos.map((item) => (item.id === photo.id ? { ...item, title: event.target.value } : item));
                    setPhotos(next);
                  }}
                  className="w-full rounded-lg border border-[#f1d5e0] px-3 py-2 text-sm"
                />
                <textarea
                  value={photo.description ?? ""}
                  onChange={(event) => {
                    const next = photos.map((item) =>
                      item.id === photo.id ? { ...item, description: event.target.value || undefined } : item
                    );
                    setPhotos(next);
                  }}
                  rows={2}
                  className="w-full rounded-lg border border-[#f1d5e0] px-3 py-2 text-sm"
                />
                <div className="text-xs text-[#916678]">
                  分类：{categoryOptions.find((item) => item.value === photo.category)?.label} | 日期：{photo.takenAt ?? "未设置"}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => updateText(photo)}
                  className="rounded-lg bg-[#f7dce8] px-3 py-1.5 text-sm text-[#5f3f4f] transition hover:bg-[#f1cade]"
                >
                  保存文字
                </button>
                <button
                  onClick={() => togglePublish(photo)}
                  className="rounded-lg bg-[#f1d5e2] px-3 py-1.5 text-sm text-[#5f3f4f] transition hover:bg-[#ebc1d5]"
                >
                  {photo.isPublished ? "设为下架" : "设为发布"}
                </button>
                <button
                  onClick={() => removePhoto(photo)}
                  className="rounded-lg bg-[#f2b9cf] px-3 py-1.5 text-sm text-[#6b443f] transition hover:bg-[#ecabc6]"
                >
                  删除
                </button>
              </div>
            </article>
          ))}
          {photos.length === 0 ? <p className="text-sm text-[#8f6677]">暂无照片，先上传第一张吧。</p> : null}
        </div>
      </section>
    </div>
  );
}
