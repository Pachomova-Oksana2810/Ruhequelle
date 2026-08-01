import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {fetchPublicNews} from "../api/cms";
import type {NewsItem} from "../types/cms";
import {useScrollAnimation} from "../hooks/useScrollAnimation";

function formatNewsDate(iso: string): string {
  if (!iso) {
    return "";
  }
  try {
    return new Intl.DateTimeFormat("de-DE", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default function Home() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const newsRef = useScrollAnimation<HTMLElement>();
  const actionsRef = useScrollAnimation<HTMLElement>();

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      setNewsLoading(true);
      const items = await fetchPublicNews();
      if (!cancelled) {
        setNews(items);
        setNewsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <section className="page hero-page">
        <div className="hero-particles" aria-hidden>
          <span className="hero-particle" />
          <span className="hero-particle" />
          <span className="hero-particle" />
          <span className="hero-particle" />
        </div>
        <div className="hero-content">
          <p className="eyebrow">Ruhequelle</p>
          <h1>Raum für Gesundheit, Ruhe und Erholung</h1>
          <hr className="hero-heading-line" />
          <p className="lead">
            Individuelle Massagen für mehr Leichtigkeit im Alltag. Mit sanften
            Techniken, warmen Ölen und ganz viel Zeit für dich.
          </p>
          <Link className="pill-button" to="/appointment">
            Termin vereinbaren
          </Link>
        </div>
        <div className="hero-art">
          <img
            src="/images/home.png"
            alt="Ruhequelle – Raum für Gesundheit und Erholung"
            loading="eager"
          />
        </div>
      </section>

      <hr className="section-divider" />

      {newsLoading && (
        <section className="page news-page">
          <p className="news-loading">Nachrichten werden geladen…</p>
        </section>
      )}

      {!newsLoading && news.length > 0 && (
        <section
          ref={newsRef}
          className="page news-page scroll-animate section-watermark"
        >
          <h2>Aktuelles</h2>
          <p className="news-subtitle">Neuigkeiten aus der Praxis</p>
          <div className="news-list">
            {news.map((item) => (
              <article key={item.id} className="action-card news-card">
                {item.imageUrl && (
                  <div className="action-image">
                    <img src={item.imageUrl} alt={item.title} loading="lazy" />
                  </div>
                )}
                <div className="action-content">
                  <h3 className="action-title">{item.title}</h3>
                  {item.publishedAt && (
                    <p className="news-date">{formatNewsDate(item.publishedAt)}</p>
                  )}
                  <div className="news-content">
                    {item.content.split("\n").map((paragraph, index) =>
                      paragraph.trim() ? <p key={index}>{paragraph}</p> : null
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <hr className="section-divider" />

      <section
        ref={actionsRef}
        className="page actions-page scroll-animate section-watermark"
      >
        <h2>Aktuelle Aktionen & Specials</h2>
        <p className="actions-subtitle">Besondere Rituale für besondere Momente</p>

        <article className="action-card">
          <div className="action-image">
            <img
              src="/images/rueckenpflege.png"
              alt="Intensive Rückenpflege mit Beinmassage"
              loading="lazy"
            />
          </div>
          <div className="action-content">
            <h3 className="action-title">
              <span className="action-icon">✨</span> Neue Behandlung – Intensive
              Rückenpflege
            </h3>
            <p className="action-tagline">
              Zeit für Ihre Haut. Zeit für sich.
            </p>
            <p>
              Die Haut am Rücken benötigt ebenso regelmäßige Pflege wie die
              Gesichtshaut. Dennoch wird dieser Bereich häufig vernachlässigt.
            </p>
            <p>
              Diese intensive Rückenpflege unterstützt die Reinigung der Haut,
              verbessert ihr Erscheinungsbild und sorgt für ein angenehmes
              Hautgefühl.
            </p>
            <p>Die Behandlung umfasst:</p>
            <ul className="action-list">
              <li>Reinigung der Rückenhaut</li>
              <li>Peeling für ein glatteres und ebenmäßigeres Hautbild</li>
              <li>
                Eine individuell auf die Bedürfnisse der Haut abgestimmte Maske
              </li>
              <li>Abschließende Pflege</li>
            </ul>
            <p>
              Während die Maske einwirkt, genießen Sie eine Beinmassage, die zur
              Entspannung beiträgt und die Behandlung besonders angenehm macht.
            </p>
            <p>
              Nach der Behandlung wirkt die Haut gepflegter, glatter und
              frischer. Gleichzeitig sorgt die Kombination aus Hautpflege und
              Massage für Wohlbefinden und Entspannung.
            </p>
            <div className="action-meta">
              <span>
                <span className="action-meta-icon">⏱</span> Dauer: 60 Minuten
              </span>
              <span>
                <span className="action-meta-icon">💶</span> Preis: 75 €
              </span>
            </div>
            <p>
              Terminvereinbarung telefonisch oder per Direktnachricht.
            </p>
            <Link className="pill-button" to="/appointment">
              Jetzt Termin buchen
            </Link>
          </div>
        </article>
      </section>
    </>
  );
}
