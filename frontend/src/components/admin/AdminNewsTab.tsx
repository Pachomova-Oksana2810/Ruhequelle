import {useCallback, useEffect, useState} from "react";
import {API_URL} from "../../api/config";
import {
  getAdminHeaders,
  handleAdminForbidden,
  uploadAdminFile,
} from "../../lib/adminAuth";
import {
  parseNewsItem,
  parseNewsList,
  type NewsForm,
  type NewsItem,
} from "../../types/cms";

const emptyForm: NewsForm = {
  title: "",
  content: "",
  imageUrl: "",
  visible: true,
};

type Props = {
  onLogout: () => void;
  onMessage: (msg: string) => void;
};

export default function AdminNewsTab({onLogout, onMessage}: Props) {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<NewsForm>(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/admin/news`, {headers: getAdminHeaders()});
      if (handleAdminForbidden(res.status, onLogout)) {
        return;
      }
      if (!res.ok) {
        setError(`Laden fehlgeschlagen (${res.status}).`);
        setItems([]);
        return;
      }
      const data: unknown = await res.json();
      setItems(parseNewsList(data));
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

  const openEdit = (item: NewsItem) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      content: item.content,
      imageUrl: item.imageUrl ?? "",
      visible: item.visible,
    });
    setShowForm(true);
  };

  const save = async () => {
    onMessage("");
    if (!form.title.trim() || !form.content.trim()) {
      onMessage("Titel und Inhalt sind erforderlich.");
      return;
    }
    const body = {
      title: form.title.trim(),
      content: form.content.trim(),
      imageUrl: form.imageUrl.trim() || null,
      visible: form.visible,
    };
    try {
      const url =
        editingId === null
          ? `${API_URL}/api/admin/news`
          : `${API_URL}/api/admin/news/${editingId}`;
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
      onMessage(editingId === null ? "Nachricht erstellt." : "Nachricht aktualisiert.");
      await load();
    } catch {
      onMessage("Netzwerkfehler.");
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Diese Nachricht wirklich löschen?")) {
      return;
    }
    onMessage("");
    try {
      const res = await fetch(`${API_URL}/api/admin/news/${id}`, {
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
      onMessage("Nachricht gelöscht.");
      await load();
    } catch {
      onMessage("Netzwerkfehler.");
    }
  };

  const toggleVisible = async (item: NewsItem) => {
    onMessage("");
    try {
      const res = await fetch(`${API_URL}/api/admin/news/${item.id}`, {
        method: "PUT",
        headers: getAdminHeaders(),
        body: JSON.stringify({...item, visible: !item.visible}),
      });
      if (handleAdminForbidden(res.status, onLogout)) {
        return;
      }
      if (!res.ok) {
        onMessage(`Aktualisierung fehlgeschlagen (${res.status}).`);
        return;
      }
      const updated = parseNewsItem(await res.json());
      if (updated) {
        setItems((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
      }
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
    setForm((p) => ({...p, imageUrl: result.url}));
    onMessage("Bild hochgeladen.");
  };

  const formatDate = (iso: string) => {
    if (!iso) {
      return "—";
    }
    try {
      return new Intl.DateTimeFormat("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(iso));
    } catch {
      return iso;
    }
  };

  return (
    <div className="admin-grid">
      <div className="admin-card admin-card-wide">
        <div className="admin-section-header">
          <h2>Nachrichten</h2>
          <button type="button" className="admin-btn-primary" onClick={openCreate}>
            Hinzufügen
          </button>
        </div>
        {loading && <p className="admin-hint">Lade Nachrichten…</p>}
        {error && <p className="admin-error">{error}</p>}
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Titel</th>
                <th>Datum</th>
                <th>Sichtbar</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {!loading && items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="admin-table-empty">
                    Keine Nachrichten.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.title}</td>
                    <td>{formatDate(item.publishedAt)}</td>
                    <td>
                      <label className="admin-checkbox-label">
                        <input
                          type="checkbox"
                          checked={item.visible}
                          onChange={() => void toggleVisible(item)}
                        />
                        {item.visible ? "Ja" : "Nein"}
                      </label>
                    </td>
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
            <h2>{editingId === null ? "Nachricht hinzufügen" : "Nachricht bearbeiten"}</h2>
            <div className="admin-form-grid">
              <label className="admin-span-2">
                Titel
                <input
                  value={form.title}
                  onChange={(e) => setForm((p) => ({...p, title: e.target.value}))}
                />
              </label>
              <label className="admin-span-2">
                Inhalt
                <textarea
                  rows={6}
                  value={form.content}
                  onChange={(e) => setForm((p) => ({...p, content: e.target.value}))}
                />
              </label>
              <label className="admin-span-2">
                Bild-URL
                <input
                  value={form.imageUrl}
                  onChange={(e) => setForm((p) => ({...p, imageUrl: e.target.value}))}
                  placeholder="https://…"
                />
              </label>
              <label className="admin-span-2">
                Bild hochladen
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploading}
                  onChange={(e) => void onFileSelected(e.target.files?.[0])}
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
