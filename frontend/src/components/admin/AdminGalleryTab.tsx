import {useCallback, useEffect, useState} from "react";
import {API_URL} from "../../api/config";
import {
  getAdminHeaders,
  handleAdminForbidden,
  uploadAdminFile,
} from "../../lib/adminAuth";
import {
  parseGalleryList,
  type GalleryForm,
  type GalleryItemDto,
  type GalleryItemType,
} from "../../types/cms";

const emptyForm: GalleryForm = {
  type: "PHOTO",
  url: "",
  caption: "",
  sortOrder: "0",
  visible: true,
};

type Props = {
  onLogout: () => void;
  onMessage: (msg: string) => void;
};

export default function AdminGalleryTab({onLogout, onMessage}: Props) {
  const [items, setItems] = useState<GalleryItemDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<GalleryForm>(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/admin/gallery`, {headers: getAdminHeaders()});
      if (handleAdminForbidden(res.status, onLogout)) {
        return;
      }
      if (!res.ok) {
        setError(`Laden fehlgeschlagen (${res.status}).`);
        setItems([]);
        return;
      }
      const data: unknown = await res.json();
      setItems(parseGalleryList(data));
    } catch {
      setError("Netzwerkfehler.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [onLogout]);

  useEffect(() => {
    void load();
  }, [load]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (item: GalleryItemDto) => {
    setEditingId(item.id);
    setForm({
      type: item.type,
      url: item.url,
      caption: item.caption ?? "",
      sortOrder: String(item.sortOrder),
      visible: item.visible,
    });
    setShowForm(true);
  };

  const save = async () => {
    onMessage("");
    if (!form.url.trim()) {
      onMessage("URL ist erforderlich.");
      return;
    }
    const sortOrder = form.sortOrder.trim() ? Number(form.sortOrder) : 0;
    const body = {
      type: form.type,
      url: form.url.trim(),
      caption: form.caption.trim() || null,
      sortOrder: Number.isNaN(sortOrder) ? 0 : sortOrder,
      visible: form.visible,
    };
    try {
      const url =
        editingId === null
          ? `${API_URL}/api/admin/gallery`
          : `${API_URL}/api/admin/gallery/${editingId}`;
      const res = await fetch(url, {
        method: editingId === null ? "POST" : "PUT",
        headers: getAdminHeaders(),
        body: JSON.stringify(body),
      });
      if (handleAdminForbidden(res.status, onLogout)) {
        return;
      }
      if (!res.ok) {
        onMessage(`Speichern fehlgeschlagen (${res.status}).`);
        return;
      }
      setShowForm(false);
      onMessage(editingId === null ? "Galerie-Eintrag erstellt." : "Galerie-Eintrag aktualisiert.");
      await load();
    } catch {
      onMessage("Netzwerkfehler.");
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Diesen Galerie-Eintrag wirklich löschen?")) {
      return;
    }
    onMessage("");
    try {
      const res = await fetch(`${API_URL}/api/admin/gallery/${id}`, {
        method: "DELETE",
        headers: getAdminHeaders(),
      });
      if (handleAdminForbidden(res.status, onLogout)) {
        return;
      }
      if (!res.ok) {
        onMessage(`Löschen fehlgeschlagen (${res.status}).`);
        return;
      }
      onMessage("Galerie-Eintrag gelöscht.");
      await load();
    } catch {
      onMessage("Netzwerkfehler.");
    }
  };

  const onFileSelected = async (file: File | undefined) => {
    if (!file) {
      return;
    }
    setUploading(true);
    onMessage("");
    const result = await uploadAdminFile(file);
    setUploading(false);
    if ("error" in result) {
      onMessage(result.error);
      return;
    }
    setForm((p) => ({
      ...p,
      url: result.url,
      type: file.type.startsWith("video/") ? "VIDEO" : "PHOTO",
    }));
    onMessage("Datei hochgeladen.");
  };

  return (
    <div className="admin-grid">
      <div className="admin-card admin-card-wide">
        <div className="admin-section-header">
          <h2>Galerie</h2>
          <button type="button" className="admin-btn-primary" onClick={openCreate}>
            Hinzufügen
          </button>
        </div>
        {loading && <p className="admin-hint">Lade Galerie…</p>}
        {error && <p className="admin-error">{error}</p>}
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Typ</th>
                <th>URL</th>
                <th>Beschriftung</th>
                <th>Reihenfolge</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {!loading && items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="admin-table-empty">
                    Keine Galerie-Einträge.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.type}</td>
                    <td className="admin-cell-muted admin-cell-url">{item.url}</td>
                    <td>{item.caption ?? "—"}</td>
                    <td>{item.sortOrder}</td>
                    <td className="admin-actions">
                      <button
                        type="button"
                        className="admin-btn-small"
                        onClick={() => openEdit(item)}
                      >
                        Bearbeiten
                      </button>
                      <button
                        type="button"
                        className="admin-btn-small admin-btn-danger"
                        onClick={() => void remove(item.id)}
                      >
                        Löschen
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="admin-modal-backdrop" role="presentation" onClick={() => setShowForm(false)}>
          <div
            className="admin-modal admin-modal-wide"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{editingId === null ? "Galerie-Eintrag hinzufügen" : "Galerie-Eintrag bearbeiten"}</h2>
            <div className="admin-form-grid">
              <label>
                Typ
                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm((p) => ({...p, type: e.target.value as GalleryItemType}))
                  }
                >
                  <option value="PHOTO">PHOTO</option>
                  <option value="VIDEO">VIDEO</option>
                </select>
              </label>
              <label>
                Reihenfolge
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm((p) => ({...p, sortOrder: e.target.value}))}
                />
              </label>
              <label className="admin-span-2">
                URL (Cloudinary)
                <input
                  value={form.url}
                  onChange={(e) => setForm((p) => ({...p, url: e.target.value}))}
                  placeholder="https://res.cloudinary.com/…"
                />
              </label>
              <label className="admin-span-2">
                Foto hochladen
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploading}
                  onChange={(e) => void onFileSelected(e.target.files?.[0])}
                />
              </label>
              <p className="admin-hint admin-span-2">
                Für Videos: Cloudinary-URL direkt einfügen (Upload über Cloudinary Dashboard).
              </p>
              <label className="admin-span-2">
                Beschriftung
                <input
                  value={form.caption}
                  onChange={(e) => setForm((p) => ({...p, caption: e.target.value}))}
                />
              </label>
              <label className="admin-checkbox-label admin-span-2">
                <input
                  type="checkbox"
                  checked={form.visible}
                  onChange={(e) => setForm((p) => ({...p, visible: e.target.checked}))}
                />
                Sichtbar auf der Website
              </label>
            </div>
            <div className="admin-modal-actions">
              <button type="button" className="admin-btn-ghost" onClick={() => setShowForm(false)}>
                Abbrechen
              </button>
              <button type="button" className="admin-btn-primary" onClick={() => void save()}>
                Speichern
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
