export type Category = "life" | "food" | "travel";

export interface Photo {
  id: string;
  category: Category;
  title: string;
  description?: string;
  imageUrl: string;
  thumbUrl?: string;
  takenAt?: string;
  isPublished: boolean;
  createdAt: string;
}

export interface CategoryMeta {
  id: Category;
  title: string;
  subtitle: string;
  cover: string;
}

