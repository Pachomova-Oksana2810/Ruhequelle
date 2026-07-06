import {useCallback, useEffect, useState} from "react";
import {API_URL} from "../../api/config";
import {
  getAdminHeaders,
  handleAdminForbidden,
  uploadAdminFile,
} from "../../lib/adminAuth";
import {
  parseCmsServiceList,
  type CmsService,
  type ServiceForm,
} from "../../types/cms";

const emptyForm: ServiceForm = {
  name: "",
  description: "",
  price: "",
  imageUrl: "",
  durationMinutes: "",
  sortOrder: "0",
  visible: true,
};

type Props = {
  onLogout: () => void;
  onMessage: (msg: string) => void;
};

export default function AdminServicesTab({onLogout, onMessage}: Props) {
  const [items, setItems] = useState<CmsService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ServiceForm>(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/admin/services`, {headers: getAdminHeaders()});
      if (handleAdminForbidden(res.status, onLogout)) {
        return;
      }
      if (!res.ok) {
        setError(`Laden fehlgeschlagen (${res.status}).`);
        setItems([]);
        return;
      }
      const data: unknown = await res.json();
      setItems(parseCmsServiceList(data));
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

  const openEdit = (item: CmsService) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      description: item.description,
      price: item.price,
      imageUrl: item.imageUrl ?? "",
      durationMinutes: item.durationMinutes != null ? String(item.durationMinutes) : "",
      sortOrder: String(item.sortOrder),
      visible: item.visible,
    });
    setShowForm(true);
  };

  const save = async () => {
    onMessage("");
    if (!form.name.trim() || !form.description.trim() || !form.price.trim()) {
      onMessage("Name, Beschreibung und Preis sind erforderlich.");
      return;
    }
    const duration = form.durationMinutes.trim()
      ? Number(form.durationMinutes)
      : null;
    const sortOrder = form.sortOrder.trim() ? Number(form.sortOrder) : 0;
    const body = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: form.price.trim(),
      imageUrl: form.imageUrl.trim() || null,
      durationMinutes: duration != null && !Number.isNaN(duration) ? duration : null,
      sortOrder: Number.isNaN(sortOrder) ? 0 : sortOrder,
      visible: form.visible,
    };
    try {
      const url =
        editingId === null
          ? `${API_URL}/api/admin/services`
          : `${API_URL}/api/admin/services/${editingId}`;
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
      onMessage(editingId === null ? "Behandlung erstellt." : "Behandlung aktualisiert.");
      await load();
    } catch {
      onMessage("Netzwerkfehler.");
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Diese Behandlung wirklich löschen?")) {
      return;
    }
    onMessage("");
    try {
      const res = await fetch(`${API_URL}/api/admin/services/${id}`, {
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
      onMessage("Behandlung gelöscht.");
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
    setForm((p) => ({...p, imageUrl: result.url}));
    onMessage("Bild hochgeladen.");
  };

  return (
    <div className="admin-grid">
      <div className="admin-card admin-card-wide">
        <div className="admin-section-header">
          <h2>Behandlungen</h2>
          <button type="button" className="admin-btn-primary" onClick={openCreate}>
            Hinzufügen
          </button>
        </div>
        {loading && <p className="admin-hint">Lade Behandlungen…</p>}
        {error && <p className="admin-error">{error}</p>}
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Preis</th>
                <th>Reihenfolge</th>
                <th>Sichtbar</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {!loading && items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="admin-table-empty">
                    Keine Behandlungen.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.price}</td>
                    <td>{item.sortOrder}</td>
                    <td>{item.visible ? "Ja" : "Nein"}</td>
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
            <h2>{editingId === null ? "Behandlung hinzufügen" : "Behandlung bearbeiten"}</h2>
            <div className="admin-form-grid">
              <label className="admin-span-2">
                Name
                <input
                  value={form.name}
                  onChange={(e) => setForm((p) => ({...p, name: e.target.value}))}
                />
              </label>
              <label className="admin-span-2">
                Beschreibung
                <textarea
                  rows={6}
                  value={form.description}
                  onChange={(e) => setForm((p) => ({...p, description: e.target.value}))}
                />
              </label>
              <label>
                Preis
                <input
                  value={form.price}
                  onChange={(e) => setForm((p) => ({...p, price: e.target.value}))}
                  placeholder="60€ / 60 Min"
                />
              </label>
              <label>
                Dauer (Minuten)
                <input
                  type="number"
                  min={0}
                  value={form.durationMinutes}
                  onChange={(e) => setForm((p) => ({...p, durationMinutes: e.target.value}))}
                />
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
                Bild-URL
                <input
                  value={form.imageUrl}
                  onChange={(e) => setForm((p) => ({...p, imageUrl: e.target.value}))}
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
