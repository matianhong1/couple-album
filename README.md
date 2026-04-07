# Couple Memory Album

一个高颜值、温柔浪漫的情侣纪念相册网站。技术栈：Next.js(App Router) + Tailwind CSS + Supabase。

## 功能

- 公开展示端
  - Hero 全屏主视觉
  - 分类卡片（生活 / 美食 / 旅行）
  - 分类画廊（响应式网格）
  - 图片 Lightbox 预览（上一张/下一张/Esc 关闭）
  - 关于我们 + 精致页脚
- 私有管理端 `/studio`
  - 邮箱密码登录
  - 上传照片到 Supabase Storage
  - 手动分类
  - 编辑标题/描述
  - 发布/下架
  - 删除照片

## 项目结构

```txt
src/
  app/
    (public)/
      layout.tsx
      page.tsx
      gallery/[category]/page.tsx
    studio/page.tsx
    globals.css
    layout.tsx
  components/
    Hero.tsx
    CategoryCards.tsx
    PhotoGrid.tsx
    Lightbox.tsx
    AboutSection.tsx
    SiteFooter.tsx
    UploadPanel.tsx
  lib/
    types.ts
    constants.ts
    animations.ts
    photos.ts
    supabaseClient.ts
  data/
    seedPlaceholders.ts
supabase/
  schema.sql
  README.md
```

## 本地运行

1. 安装 Node.js 20 LTS。
2. 安装依赖：

```bash
npm install
```

3. 创建环境变量文件：

```bash
cp .env.example .env.local
```

在 `.env.local` 填写：

```env
NEXT_PUBLIC_SUPABASE_URL=你的项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的anon key
```

4. 初始化 Supabase：
- 在 Supabase SQL Editor 执行 `supabase/schema.sql`
- 创建 Storage bucket：`couple-album`
- 在 Auth 创建登录账号（你和对象）

5. 启动：

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)

## 如何替换成你们自己的图片和文案

### 方式 A：在线上传（推荐）

1. 打开 `/studio`
2. 登录
3. 上传图片，选择分类，填标题/描述/日期
4. 上传后自动出现在前台对应分类
5. 你可以在管理列表中改文案、下架、删除

### 方式 B：仅改占位数据

编辑 `src/data/seedPlaceholders.ts`：
- `title` 改为你想显示的标题
- `description` 改为照片说明
- `imageUrl` 换成你的图片 URL
- `category` 设为 `life | food | travel`

## 视觉风格说明

- 主色：奶白、浅粉、浅金、暖杏
- 大留白、圆角卡片、柔和阴影
- Hero 和卡片有轻动效，悬停卡片浮起、图片微缩放
- 全局平滑滚动

## 部署到 Vercel

1. 推送到 GitHub
2. Vercel 导入仓库
3. 配置同样的环境变量
4. 点击 Deploy

完成后即可获得线上地址，手机和电脑都可访问。

