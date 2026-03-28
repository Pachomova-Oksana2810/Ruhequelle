import {useCallback, useEffect, useMemo, useState} from "react";
import {MASSAGE_OPTIONS} from "../data/massageTypes";
import {API_URL} from "../api/config";

const ADMIN_STORAGE_KEY = "ruhequelle_admin_password";

const SLOT_TIMES = [
  "08:15",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
] as const;

type Slot = {
  date: string;
  time: string;
  available: boolean;
};

type AppointmentRow = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  massageType: string;
  date: string;
  time: string;
  status: string;
};

type BlockedRow = {
  id: number;
  date: string;
  time: string;
  reason: string;
};

type ManualForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  massageType: string;
  date: string;
  time: string;
};

type EditForm = ManualForm & { status: string };

function toLocalIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function normalizeTimeDisplay(time: string): string {
  if (time.length >= 5) {
    return time.slice(0, 5);
  }
  return time;
}

function passwordHeaders(password: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    "X-Admin-Password": password,
  };
}

function getStoredPassword(): string {
  return sessionStorage.getItem(ADMIN_STORAGE_KEY) ?? "";
}

function getAdminHeaders(): HeadersInit {
  return passwordHeaders(getStoredPassword());
}

function parseAppointments(raw: unknown): AppointmentRow[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  const out: AppointmentRow[] = [];
  for (const item of raw) {
    if (typeof item !== "object" || item === null) {
      continue;
    }
    const o = item as Record<string, unknown>;
    if (typeof o.id !== "number") {
      continue;
    }
    out.push({
      id: o.id,
      firstName: String(o.firstName ?? ""),
      lastName: String(o.lastName ?? ""),
      email: String(o.email ?? ""),
      phone: String(o.phone ?? ""),
      massageType: String(o.massageType ?? ""),
      date: String(o.date ?? ""),
      time: normalizeTimeDisplay(String(o.time ?? "")),
      status: String(o.status ?? "confirmed"),
    });
  }
  return out;
}

function parseBlocked(raw: unknown): BlockedRow[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  const out: BlockedRow[] = [];
  for (const item of raw) {
    if (typeof item !== "object" || item === null) {
      continue;
    }
    const o = item as Record<string, unknown>;
    if (typeof o.id !== "number") {
      continue;
    }
    out.push({
      id: o.id,
      date: String(o.date ?? ""),
      time: normalizeTimeDisplay(String(o.time ?? "")),
      reason: String(o.reason ?? ""),
    });
  }
  return out;
}

export default function Admin() {
  const [unlocked, setUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");

  const [appointments, setAppointments] = useState<AppointmentRow[]>([]);
  const [blocked, setBlocked] = useState<BlockedRow[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const [listError, setListError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const [manualForm, setManualForm] = useState<ManualForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    massageType: "",
    date: "",
    time: "",
  });

  const [blockForm, setBlockForm] = useState({date: "", time: "", reason: ""});

  const [editing, setEditing] = useState<AppointmentRow | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    massageType: "",
    date: "",
    time: "",
    status: "confirmed",
  });

  const fetchPublicSlots = useCallback(async () => {
    setSlotsLoading(true);
    const start = new Date();
    const end = new Date();
    end.setDate(start.getDate() + 13);
    const startIso = toLocalIsoDate(start);
    const endIso = toLocalIsoDate(end);
    try {
      const res = await fetch(
        `${API_URL}/api/appointments/availability?start=${startIso}&end=${endIso}`
      );
      if (!res.ok) {
        setSlots([]);
        return;
      }
      const data: unknown = await res.json();
      setSlots(Array.isArray(data) ? (data as Slot[]) : []);
    } catch {
      setSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  }, []);

  const loadDashboard = useCallback(async () => {
    setListError("");
    setActionMessage("");
    try {
      const headers = getAdminHeaders();
      const [aRes, bRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/appointments`, {headers}),
        fetch(`${API_URL}/api/admin/slots/blocks`, {headers}),
      ]);
      if (aRes.status === 403 || bRes.status === 403) {
        sessionStorage.removeItem(ADMIN_STORAGE_KEY);
        setUnlocked(false);
        setLoginError("Sitzung abgelaufen oder ungültiges Passwort.");
        return;
      }
      if (!aRes.ok) {
        setListError(`Termine konnten nicht geladen werden (${aRes.status}).`);
        setAppointments([]);
      } else {
        const aj: unknown = await aRes.json();
        setAppointments(parseAppointments(aj));
      }
      if (!bRes.ok) {
        setBlocked([]);
      } else {
        const bj: unknown = await bRes.json();
        setBlocked(parseBlocked(bj));
      }
    } catch {
      setListError("Netzwerkfehler beim Laden der Daten.");
    }
  }, []);

  useEffect(() => {
    if (getStoredPassword()) {
      setUnlocked(true);
    }
  }, []);

  useEffect(() => {
    if (!unlocked) {
      return;
    }
    void loadDashboard();
    void fetchPublicSlots();
  }, [unlocked, loadDashboard, fetchPublicSlots]);

  const groupedSlots = useMemo(() => {
    return slots.reduce<Record<string, Slot[]>>((acc, slot) => {
      acc[slot.date] ??= [];
      acc[slot.date].push(slot);
      return acc;
    }, {});
  }, [slots]);

  const availableDates = useMemo(
    () =>
      Object.keys(groupedSlots).filter((date) =>
        groupedSlots[date].some((s) => s.available)
      ),
    [groupedSlots]
  );

  const tryLogin = async () => {
    const pw = passwordInput.trim();
    if (!pw) {
      setLoginError("Bitte Passwort eingeben.");
      return;
    }
    setLoginError("");
    try {
      const res = await fetch(`${API_URL}/api/admin/appointments`, {
        headers: passwordHeaders(pw),
      });
      if (res.status === 403) {
        setLoginError("Zugriff verweigert — falsches Passwort oder ADMIN_PASSWORD nicht gesetzt.");
        return;
      }
      if (!res.ok) {
        setLoginError(`Serverfehler (${res.status}).`);
        return;
      }
      sessionStorage.setItem(ADMIN_STORAGE_KEY, pw);
      setPasswordInput("");
      setUnlocked(true);
    } catch {
      setLoginError("Netzwerkfehler — Backend erreichbar?");
    }
  };

  const logout = () => {
    sessionStorage.removeItem(ADMIN_STORAGE_KEY);
    setUnlocked(false);
    setAppointments([]);
    setBlocked([]);
    setSlots([]);
  };

  const submitManual = async () => {
    setActionMessage("");
    if (
      !manualForm.firstName ||
      !manualForm.lastName ||
      !manualForm.email ||
      !manualForm.phone ||
      !manualForm.massageType ||
      !manualForm.date ||
      !manualForm.time
    ) {
      setActionMessage("Bitte alle Felder der manuellen Buchung ausfüllen.");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/admin/appointments`, {
        method: "POST",
        headers: getAdminHeaders(),
        body: JSON.stringify({
          firstName: manualForm.firstName,
          lastName: manualForm.lastName,
          email: manualForm.email,
          phone: manualForm.phone,
          massageType: manualForm.massageType,
          date: manualForm.date,
          time: manualForm.time,
          status: "confirmed",
        }),
      });
      if (res.status === 403) {
        logout();
        return;
      }
      if (res.status === 409) {
        const t = await res.text();
        setActionMessage(t || "Zeitslot nicht verfügbar.");
        return;
      }
      if (!res.ok) {
        setActionMessage(`Fehler: ${res.status}`);
        return;
      }
      setActionMessage("Termin angelegt.");
      setManualForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        massageType: "",
        date: "",
        time: "",
      });
      await loadDashboard();
      await fetchPublicSlots();
    } catch {
      setActionMessage("Netzwerkfehler.");
    }
  };

  const submitBlock = async () => {
    setActionMessage("");
    if (!blockForm.date || !blockForm.time || !blockForm.reason.trim()) {
      setActionMessage("Datum, Uhrzeit und Grund für die Sperre angeben.");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/admin/slots/block`, {
        method: "POST",
        headers: getAdminHeaders(),
        body: JSON.stringify({
          date: blockForm.date,
          time: blockForm.time,
          reason: blockForm.reason.trim(),
        }),
      });
      if (res.status === 403) {
        logout();
        return;
      }
      if (res.status === 409) {
        const t = await res.text();
        setActionMessage(t || "Slot bereits gesperrt oder belegt.");
        return;
      }
      if (!res.ok) {
        setActionMessage(`Fehler: ${res.status}`);
        return;
      }
      setActionMessage("Slot gesperrt.");
      setBlockForm({date: "", time: "", reason: ""});
      await loadDashboard();
      await fetchPublicSlots();
    } catch {
      setActionMessage("Netzwerkfehler.");
    }
  };

  const unblock = async (id: number) => {
    if (!confirm("Sperre wirklich aufheben?")) {
      return;
    }
    setActionMessage("");
    try {
      const res = await fetch(`${API_URL}/api/admin/slots/block/${id}`, {
        method: "DELETE",
        headers: getAdminHeaders(),
      });
      if (res.status === 403) {
        logout();
        return;
      }
      if (!res.ok) {
        setActionMessage(`Aufheben fehlgeschlagen (${res.status}).`);
        return;
      }
      await loadDashboard();
      await fetchPublicSlots();
    } catch {
      setActionMessage("Netzwerkfehler.");
    }
  };

  const removeAppointment = async (id: number) => {
    if (!confirm("Diesen Termin wirklich löschen?")) {
      return;
    }
    setActionMessage("");
    try {
      const res = await fetch(`${API_URL}/api/admin/appointments/${id}`, {
        method: "DELETE",
        headers: getAdminHeaders(),
      });
      if (res.status === 403) {
        logout();
        return;
      }
      if (!res.ok) {
        setActionMessage(`Löschen fehlgeschlagen (${res.status}).`);
        return;
      }
      await loadDashboard();
      await fetchPublicSlots();
    } catch {
      setActionMessage("Netzwerkfehler.");
    }
  };

  const openEdit = (row: AppointmentRow) => {
    setEditing(row);
    setEditForm({
      firstName: row.firstName,
      lastName: row.lastName,
      email: row.email,
      phone: row.phone,
      massageType: row.massageType,
      date: row.date,
      time: row.time,
      status: row.status,
    });
  };

  const saveEdit = async () => {
    if (!editing) {
      return;
    }
    setActionMessage("");
    try {
      const res = await fetch(`${API_URL}/api/admin/appointments/${editing.id}`, {
        method: "PUT",
        headers: getAdminHeaders(),
        body: JSON.stringify({
          firstName: editForm.firstName,
          lastName: editForm.lastName,
          email: editForm.email,
          phone: editForm.phone,
          massageType: editForm.massageType,
          date: editForm.date,
          time: editForm.time,
          status: editForm.status,
        }),
      });
      if (res.status === 403) {
        logout();
        return;
      }
      if (res.status === 409) {
        setActionMessage("Neuer Zeitslot nicht verfügbar.");
        return;
      }
      if (!res.ok) {
        setActionMessage(`Speichern fehlgeschlagen (${res.status}).`);
        return;
      }
      setEditing(null);
      await loadDashboard();
      await fetchPublicSlots();
    } catch {
      setActionMessage("Netzwerkfehler.");
    }
  };

  const formatDeDate = (iso: string) => {
    if (!iso) {
      return "—";
    }
    try {
      return new Intl.DateTimeFormat("de-DE", {
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(new Date(`${iso}T12:00:00`));
    } catch {
      return iso;
    }
  };

  if (!unlocked) {
    return (
      <section className="page admin-page">
        <div className="admin-login-card">
          <h1 className="admin-title">Admin</h1>
          <p className="admin-lead">Passwort für den Zugriff auf die Terminverwaltung.</p>
          <label className="admin-label">
            Passwort
            <input
              type="password"
              autoComplete="current-password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="admin-input"
              onKeyDown={(e) => e.key === "Enter" && void tryLogin()}
            />
          </label>
          {loginError && <p className="admin-error">{loginError}</p>}
          <button type="button" className="admin-btn-primary" onClick={() => void tryLogin()}>
            Anmelden
          </button>
        </div>
      </section>
    );
  }

  const timesForManualDate =
    manualForm.date !== "" ? (groupedSlots[manualForm.date] ?? []) : [];

  return (
    <section className="page admin-page">
      <div className="admin-toolbar">
        <h1 className="admin-title">Terminverwaltung</h1>
        <div className="admin-toolbar-actions">
          <button type="button" className="admin-btn-ghost" onClick={() => void loadDashboard()}>
            Aktualisieren
          </button>
          <button type="button" className="admin-btn-ghost" onClick={() => void fetchPublicSlots()}>
            Slots neu laden
          </button>
          <button type="button" className="admin-btn-muted" onClick={logout}>
            Abmelden
          </button>
        </div>
      </div>

      {listError && <p className="admin-error">{listError}</p>}
      {actionMessage && <p className="admin-success">{actionMessage}</p>}

      <div className="admin-grid">
        <div className="admin-card admin-card-wide">
          <h2>Alle Buchungen</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Datum</th>
                  <th>Zeit</th>
                  <th>Name</th>
                  <th>Telefon</th>
                  <th>Behandlung</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="admin-table-empty">
                      Keine Termine.
                    </td>
                  </tr>
                ) : (
                  appointments.map((a) => (
                    <tr key={a.id}>
                      <td>{formatDeDate(a.date)}</td>
                      <td>{a.time}</td>
                      <td>
                        {a.firstName} {a.lastName}
                      </td>
                      <td>{a.phone}</td>
                      <td className="admin-cell-muted">{a.massageType}</td>
                      <td>{a.status}</td>
                      <td className="admin-actions">
                        <button type="button" className="admin-btn-small" onClick={() => openEdit(a)}>
                          Bearbeiten
                        </button>
                        <button
                          type="button"
                          className="admin-btn-small admin-btn-danger"
                          onClick={() => void removeAppointment(a.id)}
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

        <div className="admin-card">
          <h2>Manuelle Buchung</h2>
          <p className="admin-hint">
            Nur freie Slots (gleiche Logik wie auf der Buchungsseite). {slotsLoading && "Lade Verfügbarkeit…"}
          </p>
          <div className="admin-form-grid">
            <label>
              Vorname
              <input
                value={manualForm.firstName}
                onChange={(e) => setManualForm((p) => ({...p, firstName: e.target.value}))}
              />
            </label>
            <label>
              Nachname
              <input
                value={manualForm.lastName}
                onChange={(e) => setManualForm((p) => ({...p, lastName: e.target.value}))}
              />
            </label>
            <label>
              Telefon
              <input
                value={manualForm.phone}
                onChange={(e) => setManualForm((p) => ({...p, phone: e.target.value}))}
              />
            </label>
            <label>
              E-Mail
              <input
                type="email"
                value={manualForm.email}
                onChange={(e) => setManualForm((p) => ({...p, email: e.target.value}))}
              />
            </label>
            <label className="admin-span-2">
              Behandlung
              <select
                value={manualForm.massageType}
                onChange={(e) => setManualForm((p) => ({...p, massageType: e.target.value}))}
              >
                <option value="">— wählen —</option>
                {MASSAGE_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.label}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Datum
              <select
                value={manualForm.date}
                onChange={(e) =>
                  setManualForm((p) => ({...p, date: e.target.value, time: ""}))
                }
              >
                <option value="">— Datum —</option>
                {availableDates.map((d) => (
                  <option key={d} value={d}>
                    {formatDeDate(d)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Uhrzeit
              <select
                value={manualForm.time}
                disabled={!manualForm.date}
                onChange={(e) => setManualForm((p) => ({...p, time: e.target.value}))}
              >
                <option value="">— Zeit —</option>
                {timesForManualDate
                  .filter((s) => s.available)
                  .map((s) => (
                    <option key={s.time} value={s.time}>
                      {s.time}
                    </option>
                  ))}
              </select>
            </label>
          </div>
          <button type="button" className="admin-btn-primary" onClick={() => void submitManual()}>
            Termin speichern
          </button>
        </div>

        <div className="admin-card">
          <h2>Slot sperren</h2>
          <p className="admin-hint">z. B. Urlaub, Pause — erscheint als belegt in der öffentlichen Buchung.</p>
          <div className="admin-form-grid">
            <label>
              Datum
              <input
                type="date"
                value={blockForm.date}
                onChange={(e) => setBlockForm((p) => ({...p, date: e.target.value}))}
              />
            </label>
            <label>
              Uhrzeit
              <select
                value={blockForm.time}
                onChange={(e) => setBlockForm((p) => ({...p, time: e.target.value}))}
              >
                <option value="">— Zeit —</option>
                {SLOT_TIMES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
            <label className="admin-span-2">
              Grund
              <input
                placeholder="Urlaub, Pause, …"
                value={blockForm.reason}
                onChange={(e) => setBlockForm((p) => ({...p, reason: e.target.value}))}
              />
            </label>
          </div>
          <button type="button" className="admin-btn-primary" onClick={() => void submitBlock()}>
            Sperren
          </button>
        </div>

        <div className="admin-card admin-card-wide">
          <h2>Gesperrte Slots</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Datum</th>
                  <th>Zeit</th>
                  <th>Grund</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {blocked.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="admin-table-empty">
                      Keine Sperren.
                    </td>
                  </tr>
                ) : (
                  blocked.map((b) => (
                    <tr key={b.id}>
                      <td>{formatDeDate(b.date)}</td>
                      <td>{b.time}</td>
                      <td>{b.reason}</td>
                      <td>
                        <button
                          type="button"
                          className="admin-btn-small"
                          onClick={() => void unblock(b.id)}
                        >
                          Freigeben
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {editing !== null && (
        <div className="admin-modal-backdrop" role="presentation" onClick={() => setEditing(null)}>
          <div
            className="admin-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-edit-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="admin-edit-title">Termin bearbeiten (#{editing.id})</h2>
            <div className="admin-form-grid">
              <label>
                Vorname
                <input
                  value={editForm.firstName}
                  onChange={(e) => setEditForm((p) => ({...p, firstName: e.target.value}))}
                />
              </label>
              <label>
                Nachname
                <input
                  value={editForm.lastName}
                  onChange={(e) => setEditForm((p) => ({...p, lastName: e.target.value}))}
                />
              </label>
              <label>
                Telefon
                <input
                  value={editForm.phone}
                  onChange={(e) => setEditForm((p) => ({...p, phone: e.target.value}))}
                />
              </label>
              <label>
                E-Mail
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm((p) => ({...p, email: e.target.value}))}
                />
              </label>
              <label className="admin-span-2">
                Behandlung
                <select
                  value={editForm.massageType}
                  onChange={(e) => setEditForm((p) => ({...p, massageType: e.target.value}))}
                >
                  {MASSAGE_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.label}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Datum
                <input
                  type="date"
                  value={editForm.date}
                  onChange={(e) => setEditForm((p) => ({...p, date: e.target.value}))}
                />
              </label>
              <label>
                Uhrzeit
                <select
                  value={editForm.time}
                  onChange={(e) => setEditForm((p) => ({...p, time: e.target.value}))}
                >
                  {SLOT_TIMES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
              <label className="admin-span-2">
                Status
                <input
                  value={editForm.status}
                  onChange={(e) => setEditForm((p) => ({...p, status: e.target.value}))}
                />
              </label>
            </div>
            <div className="admin-modal-actions">
              <button type="button" className="admin-btn-ghost" onClick={() => setEditing(null)}>
                Abbrechen
              </button>
              <button type="button" className="admin-btn-primary" onClick={() => void saveEdit()}>
                Speichern
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
