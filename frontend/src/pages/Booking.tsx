import {useEffect, useMemo, useState} from "react";
import axios from "axios";
import {MASSAGE_OPTIONS} from "../data/massageTypes";

type Slot = {
  date: string;
  time: string;
  available: boolean;
};

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  massageType: string;
  date: string;
  time: string;
};

// Fallback-Slots wenn API nicht erreichbar ist
function generateFallbackSlots(): Slot[] {
  const slots: Slot[] = [];
  const today = new Date();
  for (let d = 0; d < 14; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() + d);
    const dateStr = toLocalIsoDate(date);
    const times = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
    times.forEach((time) => slots.push({date: dateStr, time, available: true}));
  }
  return slots;
}

function toLocalIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function Booking() {
  const [form, setForm] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    massageType: "",
    date: "",
    time: "",
  });
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  useEffect(() => {
    const fetchSlots = async () => {
      setLoading(true);
      setError("");
      const start = new Date();
      const end = new Date();
      end.setDate(start.getDate() + 13);
      const startIso = toLocalIsoDate(start);
      const endIso = toLocalIsoDate(end);

      try {
        const res = await axios.get(
          `http://localhost:8080/api/appointments/availability?start=${startIso}&end=${endIso}`
        );
        setSlots(Array.isArray(res.data) ? res.data : []);
      } catch {
        setError("Verfügbare Zeiten konnten nicht geladen werden. Demo-Modus aktiv.");
        setSlots(generateFallbackSlots());
      } finally {
        setLoading(false);
      }
    };
    fetchSlots();
  }, []);

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

  const calendarBaseDate = useMemo(() => {
    if (selectedDate) return new Date(`${selectedDate}T12:00:00`);
    if (availableDates.length > 0) return new Date(`${availableDates[0]}T12:00:00`);
    return new Date();
  }, [availableDates, selectedDate]);

  const monthLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("de-DE", {month: "long", year: "numeric"}).format(
        calendarBaseDate
      ),
    [calendarBaseDate]
  );

  const calendarDays = useMemo(() => {
    const year = calendarBaseDate.getFullYear();
    const month = calendarBaseDate.getMonth();
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const startWeekday = (first.getDay() + 6) % 7;
    const cells: Array<{date: string | null; label: number | null}> = [];

    for (let i = 0; i < startWeekday; i++) cells.push({date: null, label: null});
    for (let d = 1; d <= last.getDate(); d++) {
      const date = new Date(year, month, d);
      cells.push({date: toLocalIsoDate(date), label: d});
    }
    return cells;
  }, [calendarBaseDate]);

  const selectDate = (date: string) => {
    setSelectedDate(date);
    setSelectedTime("");
    setSuccess("");
    setForm((prev) => ({...prev, date, time: ""}));
    setError("");
  };

  const selectTime = (time: string) => {
    setSelectedTime(time);
    setForm((prev) => ({...prev, time, date: selectedDate}));
    setError("");
    setSuccess("");
  };

  const submit = async () => {
    if (!form.firstName || !form.lastName || !form.email || !form.phone) {
      setError("Bitte alle Felder ausfüllen");
      return;
    }
    if (!form.massageType) {
      setError("Bitte Art der Behandlung wählen");
      return;
    }
    if (!form.date || !form.time) {
      setError("Bitte Datum und Uhrzeit wählen");
      return;
    }
    setError("");
    try {
      await axios.post("http://localhost:8080/api/appointments", {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        massageType: form.massageType,
        date: form.date,
        time: form.time,
      });
      setSuccess("Termin erfolgreich gebucht!");
      setForm({firstName: "", lastName: "", email: "", phone: "", massageType: "", date: "", time: ""});
      setSelectedDate("");
      setSelectedTime("");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.code === "ERR_NETWORK" || !err.response) {
          setError("Server nicht erreichbar. Backend auf localhost:8080 starten.");
        } else if (err.response?.status === 409) {
          setError("Slot ist bereits belegt. Bitte anderes Datum oder Zeit wählen.");
        } else if (err.response?.status === 400) {
          setError("Ungültige Daten. Bitte prüfen.");
        } else {
          setError(`Fehler: ${err.response?.data ?? err.message}`);
        }
      } else {
        setError("Ein unerwarteter Fehler ist aufgetreten.");
      }
    }
  };

  const formatWeekday = (date: string) =>
    new Intl.DateTimeFormat("de-DE", {weekday: "short"}).format(
      new Date(`${date}T12:00:00`)
    );
  const formatDayNum = (date: string) =>
    new Intl.DateTimeFormat("de-DE", {day: "2-digit"}).format(
      new Date(`${date}T12:00:00`)
    );

  return (
    <section className="page booking-page">
      <div className="booking-card">
        <div className="booking-hero">
          <div className="booking-hero-text">
            <h2>Online-Termin buchen</h2>
            <p>
              Wähle deinen Wunschtermin und erhalte sofort die Bestätigung. Ich
              melde mich bei dir, falls eine Alternative nötig ist.
            </p>
          </div>
          <div className="booking-hero-image">
            <img src="/images/8-maerz.png" alt="Aktion zum 8. März" />
          </div>
        </div>

        <div className="booking-form-container">
          <div className="booking-form-header">
            <h3>Deine Daten</h3>
            <p>Bitte fülle das Formular für die Terminbestätigung aus.</p>
          </div>
          <div className="booking-form-grid">
            <label>
              Vorname
              <input
                placeholder="Vorname"
                value={form.firstName}
                onChange={(e) => setForm((p) => ({...p, firstName: e.target.value}))}
              />
            </label>
            <label>
              Nachname
              <input
                placeholder="Nachname"
                value={form.lastName}
                onChange={(e) => setForm((p) => ({...p, lastName: e.target.value}))}
              />
            </label>
            <label>
              Telefon
              <input
                placeholder="Telefon"
                value={form.phone}
                onChange={(e) => setForm((p) => ({...p, phone: e.target.value}))}
              />
            </label>
            <label>
              E-Mail
              <input
                placeholder="E-Mail"
                value={form.email}
                onChange={(e) => setForm((p) => ({...p, email: e.target.value}))}
              />
            </label>
            <label className="booking-massage-label">
              Art der Behandlung
              <select
                value={form.massageType}
                onChange={(e) => setForm((p) => ({...p, massageType: e.target.value}))}
                className="booking-massage-select"
              >
                <option value="">— Bitte wählen —</option>
                {MASSAGE_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.label}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="booking-calendar-container">
          <div className="booking-calendar-header">
            <h3>Datum & Uhrzeit auswählen</h3>
            {loading && <span>Verfügbare Termine laden...</span>}
          </div>
          {error && <p className="error-text">{error}</p>}
          {success && <p className="success-text">{success}</p>}

          <div className="booking-calendar-panel">
            <div className="booking-calendar-month">{monthLabel}</div>
            <div className="booking-calendar-weekdays">
              {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
            <div className="booking-calendar-grid">
              {calendarDays.map((cell, i) => {
                if (!cell.date || cell.label === null) {
                  return <span key={`e-${i}`} />;
                }
                const isAvailable = availableDates.includes(cell.date);
                return (
                  <button
                    key={cell.date}
                    type="button"
                    className={`booking-calendar-day ${
                      selectedDate === cell.date ? "is-active" : ""
                    } ${!isAvailable ? "is-disabled" : ""}`}
                    onClick={() => isAvailable && selectDate(cell.date)}
                    disabled={!isAvailable}
                  >
                    {cell.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="booking-date-row">
            {availableDates.map((date) => (
              <button
                key={date}
                type="button"
                onClick={() => selectDate(date)}
                className={`booking-date-button ${
                  selectedDate === date ? "is-active" : ""
                }`}
              >
                <span className="booking-date-weekday">{formatWeekday(date)}</span>
                <span className="booking-date-day">{formatDayNum(date)}</span>
              </button>
            ))}
          </div>

          {selectedDate && (
            <div className="booking-time-section">
              <p className="booking-time-label">Uhrzeit für {selectedDate}:</p>
              <div className="booking-time-grid">
                {(groupedSlots[selectedDate] ?? []).map((slot) => (
                  <button
                    key={slot.time}
                    type="button"
                    onClick={() => slot.available && selectTime(slot.time)}
                    disabled={!slot.available}
                    className={`booking-time-button ${
                      selectedTime === slot.time ? "is-active" : ""
                    } ${!slot.available ? "is-occupied" : ""}`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="booking-submit-row">
            <button
              className="booking-submit-button"
              onClick={submit}
              disabled={
                !form.firstName ||
                !form.lastName ||
                !form.email ||
                !form.phone ||
                !form.massageType ||
                !form.date ||
                !form.time
              }
            >
              Termin bestätigen
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
