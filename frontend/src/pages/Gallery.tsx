import {useState} from "react";

const STORAGE_KEY = "ruhequelle-reviews";

type Review = {
  id: string;
  name: string;
  email: string;
  rating: number;
  text: string;
  date: string;
};

const initialReviews: Review[] = [
  {
    id: "1",
    name: "Maria S.",
    email: "",
    rating: 5,
    text: "Sehr entspannte Atmosphäre und eine Massage, die genau auf meine Bedürfnisse abgestimmt war.",
    date: "",
  },
  {
    id: "2",
    name: "Leon K.",
    email: "",
    rating: 5,
    text: "Professionell, freundlich und mit viel Herz. Ich komme definitiv wieder.",
    date: "",
  },
  {
    id: "3",
    name: "Natalia P.",
    email: "",
    rating: 5,
    text: "Man fühlt sich sofort wohl. Meine Verspannungen waren nach der Sitzung deutlich besser.",
    date: "",
  },
];

function loadReviews(): Review[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch {
    // ignore
  }
  return [];
}

function saveReviews(reviews: Review[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  } catch {
    // ignore
  }
}

export default function Gallery() {
  const [userReviews, setUserReviews] = useState<Review[]>(loadReviews);
  const [form, setForm] = useState({
    name: "",
    email: "",
    rating: 5,
    text: "",
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const allReviews = [...initialReviews, ...userReviews];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const trimmedName = form.name.trim();
    const trimmedText = form.text.trim();

    if (!trimmedName) {
      setError("Bitte geben Sie Ihren Namen ein.");
      return;
    }
    if (!trimmedText) {
      setError("Bitte schreiben Sie Ihren Bewertungstext.");
      return;
    }

    const newReview: Review = {
      id: `review-${Date.now()}`,
      name: trimmedName,
      email: form.email.trim(),
      rating: form.rating,
      text: trimmedText,
      date: new Date().toLocaleDateString("de-DE"),
    };

    const updated = [...userReviews, newReview];
    saveReviews(updated);
    setUserReviews(updated);

    setForm({name: "", email: "", rating: 5, text: ""});
    setSuccess("Vielen Dank! Ihre Bewertung wurde gespeichert.");
  };

  return (
    <section className="page gallery-page">
      <div className="gallery-header">
        <p className="eyebrow">Galerie</p>
        <h2>Einblicke in die Praxis</h2>
        <p className="lead">
          Helle Räume, warme Farben und eine ruhige Atmosphäre für deine
          Erholung.
        </p>
      </div>

      <div className="gallery-grid">
        <div className="gallery-item gallery-video">
          <video src="/videos/angebot1.mp4" controls muted loop playsInline />
        </div>
        <div className="gallery-item gallery-video">
          <video src="/videos/anin1.mov" controls muted loop playsInline />
        </div>
        <div className="gallery-item gallery-video">
          <video src="/videos/video1.mp4" controls muted loop playsInline />
        </div>
        <div className="gallery-item gallery-video">
          <video src="/videos/massage1.mov" controls muted loop playsInline />
        </div>
        <div className="gallery-item gallery-video">
          <video src="/videos/massage2.mov" controls muted loop playsInline />
        </div>
        <div className="gallery-item gallery-video">
          <video src="/videos/skin_cleansing.mov" controls muted loop playsInline />
        </div>
      </div>

      <div className="reviews">
        <h3>Kundenstimmen</h3>

        <form className="review-form" onSubmit={handleSubmit}>
          <h4>Bewertung schreiben</h4>
          {error && <p className="review-form-error">{error}</p>}
          {success && <p className="review-form-success">{success}</p>}
          <div className="review-form-row">
            <label>
              Name *
              <input
                type="text"
                placeholder="Ihr Name"
                value={form.name}
                onChange={(e) => setForm((p) => ({...p, name: e.target.value}))}
              />
            </label>
            <label>
              E-Mail
              <input
                type="email"
                placeholder="Ihre E-Mail (optional)"
                value={form.email}
                onChange={(e) => setForm((p) => ({...p, email: e.target.value}))}
              />
            </label>
          </div>
          <div className="review-form-row">
            <label>
              Bewertung
              <select
                value={form.rating}
                onChange={(e) =>
                  setForm((p) => ({...p, rating: Number(e.target.value)}))
                }
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n} ★
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label>
            Ihre Bewertung *
            <textarea
              placeholder="Teilen Sie Ihre Erfahrung..."
              rows={4}
              value={form.text}
              onChange={(e) => setForm((p) => ({...p, text: e.target.value}))}
            />
          </label>
          <button type="submit" className="pill-button">
            Bewertung absenden
          </button>
        </form>

        <div className="review-grid">
          {allReviews.map((r) => (
            <article key={r.id} className="review-card">
              <div className="review-rating">
                {"★".repeat(r.rating)}
                {r.rating < 5 && (
                  <span className="review-rating-empty">
                    {"★".repeat(5 - r.rating)}
                  </span>
                )}
              </div>
              <p>"{r.text}"</p>
              <span>
                — {r.name}
                {r.date && ` · ${r.date}`}
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
