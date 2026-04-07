import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "情侣相册",
  description: "展示生活、美食、旅行回忆的情侣纪念网站"
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}

