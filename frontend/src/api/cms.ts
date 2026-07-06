import {API_URL} from "../api/config";
import {
  parseCmsServiceList,
  parseGalleryList,
  parseNewsList,
  type CmsService,
  type GalleryItemDto,
  type NewsItem,
} from "../types/cms";

export async function fetchPublicNews(): Promise<NewsItem[]> {
  try {
    const res = await fetch(`${API_URL}/api/news`);
    if (!res.ok) {
      return [];
    }
    const data: unknown = await res.json();
    return parseNewsList(data);
  } catch {
    return [];
  }
}

export async function fetchPublicServices(): Promise<CmsService[]> {
  try {
    const res = await fetch(`${API_URL}/api/services`);
    if (!res.ok) {
      return [];
    }
    const data: unknown = await res.json();
    return parseCmsServiceList(data);
  } catch {
    return [];
  }
}

export async function fetchPublicGallery(): Promise<GalleryItemDto[]> {
  try {
    const res = await fetch(`${API_URL}/api/gallery`);
    if (!res.ok) {
      return [];
    }
    const data: unknown = await res.json();
    return parseGalleryList(data);
  } catch {
    return [];
  }
}
