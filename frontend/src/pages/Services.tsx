import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {fetchPublicServices} from "../api/cms";
import type {CmsService} from "../types/cms";

export default function Services() {
  const [services, setServices] = useState<CmsService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      setLoading(true);
      setError("");
      try {
        const items = await fetchPublicServices();
        if (!cancelled) {
          setServices(items);
        }
      } catch {
        if (!cancelled) {
          setError("Behandlungen konnten nicht geladen werden.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="page services-page">
      <h2>Massagearten und Preise</h2>
      <p className="services-intro">
        Wählen Sie aus unserem Angebot an Wellnessmassagen und Kosmetik
        Behandlungen.
      </p>

      {loading && <p className="services-loading">Behandlungen werden geladen…</p>}
      {error && <p className="services-error">{error}</p>}

      {!loading && !error && services.length === 0 && (
        <p className="services-empty">Derzeit sind keine Behandlungen hinterlegt.</p>
      )}

      <div className="service-list">
        {services.map((s) => (
          <article key={s.id} className="service-card">
            {s.imageUrl && (
              <div className="service-image">
                <img src={encodeURI(s.imageUrl)} alt={s.name} />
              </div>
            )}
            <div className="service-content">
              <div className="service-header">
                <h3>{s.name}</h3>
                <span className="price">{s.price}</span>
              </div>
              <p className="service-description">{s.description}</p>
              <div className="service-meta">
                {s.durationMinutes != null && (
                  <span className="service-duration">
                    Dauer: {s.durationMinutes} Minuten
                  </span>
                )}
              </div>
              <Link className="pill-button" to="/appointment">
                Termin buchen
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
