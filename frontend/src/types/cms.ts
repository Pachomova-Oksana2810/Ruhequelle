export type NewsItem = {
  id: number;
  title: string;
  content: string;
  imageUrl: string | null;
  publishedAt: string;
  visible: boolean;
};

export type CmsService = {
  id: number;
  name: string;
  description: string;
  price: string;
  imageUrl: string | null;
  durationMinutes: number | null;
  sortOrder: number;
  visible: boolean;
};

export type GalleryItemType = "PHOTO" | "VIDEO";

export type GalleryItemDto = {
  id: number;
  type: GalleryItemType;
  url: string;
  caption: string | null;
  sortOrder: number;
  visible: boolean;
};

export type NewsForm = {
  title: string;
  content: string;
  imageUrl: string;
  visible: boolean;
};

export type ServiceForm = {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  durationMinutes: string;
  sortOrder: string;
  visible: boolean;
};

export type GalleryForm = {
  type: GalleryItemType;
  url: string;
  caption: string;
  sortOrder: string;
  visible: boolean;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseId(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function parsePublishedAt(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }
  if (Array.isArray(value) && value.length >= 3) {
    const [year, month, day, hour = 0, minute = 0, second = 0] = value;
    const pad = (n: unknown) => String(Number(n) || 0).padStart(2, "0");
    return `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}:${pad(second)}`;
  }
  return "";
}

export function parseNewsItem(raw: unknown): NewsItem | null {
  if (!isRecord(raw)) {
    return null;
  }
  const id = parseId(raw.id);
  if (id == null) {
    return null;
  }
  return {
    id,
    title: String(raw.title ?? ""),
    content: String(raw.content ?? ""),
    imageUrl: raw.imageUrl != null ? String(raw.imageUrl) : null,
    publishedAt: parsePublishedAt(raw.publishedAt),
    visible: Boolean(raw.visible),
  };
}

export function parseNewsList(raw: unknown): NewsItem[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  return raw.map(parseNewsItem).filter((item): item is NewsItem => item !== null);
}

export function parseCmsService(raw: unknown): CmsService | null {
  if (!isRecord(raw) || typeof raw.id !== "number") {
    return null;
  }
  return {
    id: raw.id,
    name: String(raw.name ?? ""),
    description: String(raw.description ?? ""),
    price: String(raw.price ?? ""),
    imageUrl: raw.imageUrl != null ? String(raw.imageUrl) : null,
    durationMinutes:
      typeof raw.durationMinutes === "number" ? raw.durationMinutes : null,
    sortOrder: typeof raw.sortOrder === "number" ? raw.sortOrder : 0,
    visible: Boolean(raw.visible),
  };
}

export function parseCmsServiceList(raw: unknown): CmsService[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  return raw
    .map(parseCmsService)
    .filter((item): item is CmsService => item !== null);
}

export function parseGalleryItem(raw: unknown): GalleryItemDto | null {
  if (!isRecord(raw) || typeof raw.id !== "number") {
    return null;
  }
  const type = raw.type === "VIDEO" ? "VIDEO" : "PHOTO";
  return {
    id: raw.id,
    type,
    url: String(raw.url ?? ""),
    caption: raw.caption != null ? String(raw.caption) : null,
    sortOrder: typeof raw.sortOrder === "number" ? raw.sortOrder : 0,
    visible: Boolean(raw.visible),
  };
}

export function parseGalleryList(raw: unknown): GalleryItemDto[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  return raw
    .map(parseGalleryItem)
    .filter((item): item is GalleryItemDto => item !== null);
}
