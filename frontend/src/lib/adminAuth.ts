import {API_URL} from "../api/config";

export const ADMIN_STORAGE_KEY = "ruhequelle_admin_password";

export function getStoredPassword(): string {
  return sessionStorage.getItem(ADMIN_STORAGE_KEY) ?? "";
}

export function passwordHeaders(password: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    "X-Admin-Password": password,
  };
}

export function getAdminHeaders(): HeadersInit {
  return passwordHeaders(getStoredPassword());
}

export function getAdminUploadHeaders(): HeadersInit {
  return {"X-Admin-Password": getStoredPassword()};
}

export async function uploadAdminFile(
  file: File
): Promise<{url: string} | {error: string}> {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const res = await fetch(`${API_URL}/api/admin/upload`, {
      method: "POST",
      headers: getAdminUploadHeaders(),
      body: formData,
    });
    if (res.status === 403) {
      return {error: "Zugriff verweigert"};
    }
    const data: unknown = await res.json();
    if (!res.ok) {
      const message =
        typeof data === "object" &&
        data !== null &&
        "message" in data &&
        typeof (data as {message: unknown}).message === "string"
          ? (data as {message: string}).message
          : `Upload fehlgeschlagen (${res.status})`;
      return {error: message};
    }
    if (
      typeof data === "object" &&
      data !== null &&
      "url" in data &&
      typeof (data as {url: unknown}).url === "string"
    ) {
      return {url: (data as {url: string}).url};
    }
    return {error: "Ungültige Serverantwort"};
  } catch {
    return {error: "Netzwerkfehler beim Upload"};
  }
}

export function handleAdminForbidden(status: number, onLogout: () => void): boolean {
  if (status === 403) {
    sessionStorage.removeItem(ADMIN_STORAGE_KEY);
    onLogout();
    return true;
  }
  return false;
}
