import {Link} from "react-router-dom";

export default function Home() {
  return (
    <>
      <section className="page hero-page">
        <div className="hero-content">
          <p className="eyebrow">Ruhequelle</p>
          <h1>Raum für Gesundheit, Ruhe und Erholung</h1>
          <p className="lead">
            Individuelle Massagen für mehr Leichtigkeit im Alltag. Mit sanften
            Techniken, warmen Ölen und ganz viel Zeit für dich.
          </p>
          <Link className="pill-button" to="/appointment">
            Termin vereinbaren
          </Link>
        </div>
        <div className="hero-art">
          <img src="/images/home.png" alt="Ruhequelle – Raum für Gesundheit und Erholung" />
        </div>
      </section>

      <section className="page actions-page">
        <h2>Aktuelle Aktionen & Specials</h2>
        <p className="actions-subtitle">Besondere Rituale für besondere Momente</p>

        <article className="action-card">
          <div className="action-image">
            <img src="/images/8-maerz.png" alt="Aktion zum 8. März" />
          </div>
          <div className="action-content">
            <h3 className="action-title">
              <span className="action-icon">🌸</span> Aktion zum 8. März
            </h3>
            <p className="action-tagline">
              Ein exklusives Schönheitsritual – nur für kurze Zeit
            </p>
            <p>
              Zum 8. März – ein exklusives Schönheitsritual, das Sie so noch
              nicht erlebt haben.
            </p>
            <p>
              Dies ist keine gewöhnliche Behandlung, sondern ein sorgfältig
              abgestimmtes Zusammenspiel von Techniken, bei dem jede die Wirkung
              der anderen verstärkt:
            </p>
            <ul className="action-list">
              <li>
                Sanfte Mikrostrom-Impulse aktivieren die Zellen und schenken
                neue Spannkraft.
              </li>
              <li>
                Eine intensive Gesichts- und Dekolleté-Massage löst Spannungen,
                modelliert die Konturen und führt in tiefe Entspannung.
              </li>
              <li>
                Eine modellierende Alginatmaske in Kombination mit einem
                hochwirksamen Serum fixiert den Effekt – die Haut wirkt
                straffer, glatter und sichtbar strahlender.
              </li>
            </ul>
            <p>
              Nach der Behandlung fühlen Sie Leichtigkeit, Frische und innere
              Harmonie.
            </p>
            <div className="action-meta">
              <span>
                <span className="action-meta-icon">📅</span> Nur im März
                verfügbar
              </span>
              <span>
                <span className="action-meta-icon">👥</span> Begrenzte Plätze
              </span>
            </div>
            <Link className="pill-button" to="/appointment">
              Jetzt Termin buchen
            </Link>
          </div>
        </article>
      </section>
    </>
  );
}