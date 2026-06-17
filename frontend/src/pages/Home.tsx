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
            <img
              src="/images/rueckenpflege.png"
              alt="Intensive Rückenpflege mit Beinmassage"
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