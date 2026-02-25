const certImages = [
  "/images/zertificat1.jpg",
  "/images/zertificat2.jpg",
  "/images/zertificat3.jpg",
  "/images/zertificat5.jpg",
  "/images/zertificat6.jpg",
  "/images/zertificat7.jpg",
  "/images/zertificat8.jpg",
];

export default function About() {
  return (
    <section className="page about-page">
      <p className="eyebrow">Über mich</p>
      <h2>Hallo, ich bin Anna Koldakova</h2>

      <div className="about-content">
        <div className="about-portrait">
          <img src="/images/ueber-mich.jpg" alt="Anna Koldakova" />
        </div>
        <div className="about-text">
        <p>
          Ich bin staatlich geprüfte Kosmetikerin und Massagetherapeutin mit über
          15 Jahren Berufserfahrung. Meine Qualifikationen sind durch in
          Deutschland anerkannte Zertifikate bestätigt.
        </p>
        <p>
          Meine Arbeit vereint professionelle Hautpflege und therapeutische
          Massagen zu einem ganzheitlichen Konzept für Gesundheit und Schönheit.
          Jede Behandlung wird individuell geplant und sorgfältig auf Ihren
          Hauttyp, Ihre körperliche Verfassung und Ihre persönlichen Ziele
          abgestimmt.
        </p>
        <p>
          Die Massage ist weit mehr als Entspannung. Sie unterstützt die
          Durchblutung, fördert den Lymphfluss, löst Muskelverspannungen und
          trägt zur Regeneration des Körpers bei. Regelmäßige Massagen helfen,
          Stress abzubauen, das allgemeine Wohlbefinden zu steigern und das
          natürliche Gleichgewicht des Körpers zu erhalten. In einer Zeit hoher
          Belastung ist bewusste körperliche Regeneration kein Luxus, sondern ein
          wichtiger Bestandteil eines gesunden Lebensstils.
        </p>
        <p>
          Ich arbeite ausschließlich mit hochwertigen, geprüften Materialien und
          professionellen Produkten renommierter Hersteller. Qualität, Hygiene
          und Sicherheit haben für mich höchste Priorität.
        </p>
        <p>
          Mein Ziel ist es, sichtbare Ergebnisse und spürbare Leichtigkeit zu
          schaffen – für gesunde Haut, entspannte Muskulatur und nachhaltiges
          Wohlbefinden.
        </p>
        <p>
          Ihr Vertrauen ist die Grundlage meiner Arbeit. Ich freue mich darauf,
          Sie persönlich begrüßen zu dürfen.
        </p>
        </div>
      </div>

      <div className="certs">
        <h3>Meine Zertifikate</h3>
        <div className="cert-grid">
          {certImages.map((src, i) => (
            <div key={i} className="cert">
              <img src={src} alt={`Zertifikat ${i + 1}`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
