import {Link} from "react-router-dom";

const services = [
  {
    id: "wellness",
    image: "/images/Service/Wellness massage.png",
    title: "Wellness-Massage",
    price: "55 €",
    tagline: "Harmonie für Körper und Geist. Entspannung, die bleibt.",
    description:
      "Gönnen Sie sich eine Auszeit vom Alltag mit einer wohltuenden Wellness-Massage – einer sanften, ganzheitlichen Behandlung, die Körper und Seele in Einklang bringt. Durch langsame, fließende Bewegungen und gezielte Grifftechniken werden Verspannungen gelöst, der Energiefluss aktiviert und tiefe Entspannung ermöglicht.",
    benefits: [
      "reduziert Stress und innere Unruhe",
      "fördert die Durchblutung und den Lymphfluss",
      "verbessert das allgemeine Wohlbefinden und den Schlaf",
      "steigert die Vitalität und Lebensfreude",
      "schafft Raum für innere Ruhe und Achtsamkeit",
    ],
    target:
      "Diese Massageform ist ideal für alle, die ihrem Körper etwas Gutes tun und bewusst entschleunigen möchten. Sie ersetzt keine medizinische Behandlung, wirkt aber nachweislich regenerierend und entspannend.",
    duration: "60 Minuten",
    recommendation: "Regelmäßige Anwendungen für nachhaltige Wirkung.",
  },
  {
    id: "gesicht",
    image: "/images/Service/Gesichts-und Dekollete-Massage.png",
    title: "Gesichts- und Dekolleté-Massage",
    price: "45 €",
    tagline: "Strahlende Haut. Sanfte Berührung. Spürbare Entspannung.",
    description:
      "Die Gesichts- und Dekolleté-Massage ist eine wohltuende Kombination aus Pflege, Entspannung und Schönheitspflege. Durch sanfte, gezielte Massagegriffe werden die Hautdurchblutung gefördert, feine Linien geglättet, Schwellungen reduziert und der Teint sichtbar erfrischt. Behandelt werden Gesicht, Hals und Dekolleté – genau jene Zonen, in denen sich Stress, Müdigkeit und Spannungen oft sichtbar zeigen.",
    benefits: [
      "sichtbar glattere und straffere Haut",
      "Aktivierung der Lymphzirkulation & Entstauung",
      "natürliche Frische und Leuchtkraft",
      "Lösung von Muskelverspannungen im Gesicht und Nacken",
      "angenehme Tiefenentspannung und Regeneration",
    ],
    target:
      "Ideal als Einzelbehandlung oder als Ergänzung zu einer Gesichtsbehandlung. Für alle Hauttypen geeignet – besonders bei Stress, fahlem Teint oder ersten Anzeichen der Hautalterung.",
    duration: "45 Minuten",
    recommendation: "Als Kur buchbar für nachhaltige Ergebnisse.",
  },
  {
    id: "lymphdrainage",
    image: "/images/Service/Lymphdrainage-Massage.png",
    title: "Lymphdrainage-Massage",
    price: "50 €",
    tagline: "Schenken Sie Ihrem Körper neue Leichtigkeit und Vitalität.",
    description:
      "Die Lymphdrainage-Massage ist eine spezielle, sanfte Massagetechnik, die den Lymphfluss anregt und den natürlichen Entgiftungsprozess des Körpers unterstützt. Durch rhythmische, fließende Bewegungen wird der Abtransport von überschüssiger Gewebsflüssigkeit und Schadstoffen gefördert.",
    benefits: [
      "Schwellungen und Wassereinlagerungen zu reduzieren",
      "das Immunsystem zu stärken",
      "die Durchblutung zu verbessern",
      "die Regeneration nach körperlicher Belastung oder Operationen zu beschleunigen",
      "Spannungsgefühle und Müdigkeit zu lindern",
    ],
    target:
      "Ideal bei Stress, Bewegungsmangel, nach langen Reisen oder als Teil eines ganzheitlichen Detox-Programms. Spüren Sie, wie Körper und Geist zur Ruhe kommen und ein neues Gefühl der Leichtigkeit entsteht.",
    duration: "60 Minuten",
    recommendation: "Regelmäßige Anwendungen für nachhaltige Wirkung.",
  },
  {
    id: "anticellulite",
    image: "/images/Service/Anti-Cellulite-Massage.png",
    title: "Anti-Cellulite-Massage",
    price: "60 €",
    tagline: "Glatte Haut. Straffe Silhouette. Neues Selbstbewusstsein.",
    description:
      "Die Anti-Cellulite-Massage ist eine wirkungsvolle Technik zur Reduzierung von Cellulite und zur sichtbaren Verbesserung des Hautbildes. Durch gezielte, tiefgehende Massagetechniken wird die Durchblutung angeregt, der Lymphfluss gefördert und der Fettstoffwechsel aktiviert.",
    benefits: [
      "glattere und straffere Haut",
      "Reduktion von Orangenhaut",
      "Entgiftung und Entwässerung des Gewebes",
      "bessere Elastizität und Spannkraft der Haut",
    ],
    target:
      "Die Behandlung empfiehlt sich als Kur, kann aber auch einzeln spürbare Ergebnisse bringen. Ideal in Kombination mit Bewegung, gesunder Ernährung oder Körperwickeln. Spüren Sie schon nach wenigen Sitzungen die neue Leichtigkeit Ihrer Haut.",
    duration: "40 Minuten",
    recommendation: "Regelmäßige Anwendungen für nachhaltige Wirkung.",
  },
  {
    id: "koerperhaltung",
    image: "/images/Service/Körperhaltung ung Bewegungsoptim.png",
    title: "Körperhaltung und Bewegungsoptimierung",
    price: "50 €",
    tagline: "Ein aufrechter Körper. Freie Bewegung. Neue Lebensqualität.",
    description:
      "Falsche Haltung, Bewegungsmangel und einseitige Belastungen führen oft zu Verspannungen, Schmerzen und einem eingeschränkten Bewegungsmuster. Unsere ganzheitliche Behandlung zur Körperhaltung und Bewegungsoptimierung unterstützt Sie dabei, Ihre natürliche Aufrichtung zurückzugewinnen und sich wieder mit Leichtigkeit zu bewegen.",
    benefits: [
      "bessere Körperhaltung und Aufrichtung",
      "Reduktion von Rückenschmerzen und Verspannungen",
      "gesteigerte Beweglichkeit und Koordination",
      "mehr Leichtigkeit im Alltag",
      "nachhaltige Prävention von Beschwerden",
    ],
    treatmentDetails: [
      "Analyse der Haltung und Bewegung",
      "Manuelle Korrektur und gezielte Mobilisationstechniken",
      "Übungen zur Kräftigung und Körperwahrnehmung",
      "Alltagstaugliche Tipps für gesunde Bewegung und Haltung",
    ],
    target:
      "Geeignet für Erwachsene und Jugendliche – besonders bei sitzender Tätigkeit, muskulären Dysbalancen, nach der Geburt oder als Teil eines Rehabilitationsplans.",
    duration: "60 Minuten",
    recommendation: "Regelmäßige Anwendungen für nachhaltige Wirkung.",
  },
  {
    id: "tiefenreinigung",
    image: "/images/Service/Gesichts-und Dekollete-Massage.png",
    title: "Tiefenreinigende Behandlung",
    price: "96 €",
    tagline: "Reine Haut. Tiefenwirkung. Sichtbare Frische.",
    description:
      "Eine intensive Gesichtsbehandlung für unreine, ölige oder zu Akne neigende Haut. Die Tiefenreinigung befreit Poren von Unreinheiten, gleicht das Hautbild aus und schenkt Ihrer Haut neue Klarheit und Frische.",
    treatmentDetails: [
      "Tiefenreinigung",
      "Sanftes Peeling",
      "Manuelle und mit Ultraschall-Scrubber Ausreinigung",
      "Beruhigende Maske",
      "Feuchtigkeitsspendende Pflege",
    ],
    treatmentDetailsLabel: "Ablauf der Behandlung",
    recommendedFor: [
      "Unreiner, öliger oder zu Akne neigender Haut",
      "Vergrößerten Poren und Hautunebenheiten",
      "Teenagern und Erwachsenen mit Problemhaut",
    ],
    target:
      "Ideal für alle, die ihrer Haut eine intensive Reinigung und Pflege gönnen möchten.",
    duration: "90 Minuten",
    recommendation: "Regelmäßige Behandlungen für nachhaltige Hautverbesserung.",
  },
  {
    id: "enzympeeling",
    image: "/images/Service/Gesichts-und Dekollete-Massage.png",
    title: "Enzympeeling",
    price: "60 €",
    tagline: "Sanfte Exfoliation. Frischer Teint. Zarte Haut.",
    description:
      "Ein mildes Enzympeeling, das die Haut sanft von abgestorbenen Zellen befreit und für einen strahlenden, ebenmäßigen Teint sorgt. Besonders schonend für empfindliche Haut.",
    treatmentDetails: [
      "Reinigung",
      "Enzym-Exfoliation",
      "Wirkstoffserum",
      "Aktivmaske",
    ],
    treatmentDetailsLabel: "Ablauf der Behandlung",
    recommendedFor: [
      "Empfindlicher oder sensibler Haut",
      "Fahlem Teint und rauer Hautstruktur",
      "Ersten Anzeichen der Hautalterung",
    ],
    target:
      "Ideal für alle, die ihrer Haut eine sanfte, aber wirkungsvolle Erneuerung gönnen möchten.",
    duration: "30 Minuten",
    recommendation: "Regelmäßige Anwendungen für nachhaltige Hautverbesserung.",
  },
  {
    id: "lifting-antiage",
    image: "/images/Service/Gesichts-und Dekollete-Massage.png",
    title: "Lifting + Anti-Age-Pflege",
    price: "75 €",
    tagline: "Straffung. Frische. Sichtbare Verjüngung.",
    description:
      "Eine intensive Anti-Aging-Behandlung, die Feine Linien und Falten mildert, die Elastizität der Haut verbessert und einen sichtbar frischen, straffen Teint schenkt.",
    treatmentDetails: [
      "Reinigung",
      "Sanftes Peeling",
      "Gesichtsmassage",
      "Anti-Aging-Serum",
      "Straffende Aktivmaske",
      "Biomimetisches Wirkstoffserum",
      "Augenpflege",
      "Abschlusspflege",
    ],
    treatmentDetailsLabel: "Ablauf der Behandlung",
    recommendedFor: [
      "Feinen Linien und Falten",
      "Elastizitätsverlust und müder Haut",
      "Kunden ab ca. 30 Jahren, die vorbeugen oder gezielt pflegen möchten",
    ],
    target:
      "Ideal zur Vorbeugung und gezielten Pflege ab dem 30. Lebensjahr.",
    duration: "60 Minuten",
    recommendation: "Regelmäßige Behandlungen für nachhaltige Wirkung.",
  },
  {
    id: "fermenttherapie",
    image: "/images/Service/Gesichts-und Dekollete-Massage.png",
    title: "Fermenttherapie",
    price: "50 €",
    tagline: "Zelluläre Regeneration. Natürliche Verjüngung. Ohne Spritzen.",
    description:
      "Fermenttherapie ist eine Pflegebehandlung, die die Funktionen der Haut auf zellulärer Ebene wiederherstellt. Dank Fermenttherapie lassen sich dunkle Ringe und Schwellungen unter den Augen beseitigen, die Hautfestigkeit und -elastizität verbessern, der Alterungsprozess der Haut aufhalten und Pigmentflecken entfernen. Die Wirkstoffe dringen tief in die Haut ein. Die Wirkung der Fermenttherapie ist mit Injektionsmethoden vergleichbar. Diese Behandlung ist für diejenigen geeignet, die nicht bereit sind, sich ‚Schönheitsspritzen‘ zu unterziehen. Fermenttherapie ist weltweit die einzige, die die Eigenschaften von Botenstoffen nutzt. Bis heute gibt es keine vergleichbare Methode.",
    target:
      "Ideal für alle, die eine intensive Hautregeneration ohne invasive Methoden wünschen.",
    duration: "60 Minuten",
    recommendation: "Regelmäßige Anwendungen für optimale Ergebnisse.",
  },
  {
    id: "gesicht-mikrostrom",
    image: "/images/Service/Gesichtsmassage + Mikrostrom-Stimulation.png",
    title: "Gesichtsbehandlung: Gesichtsmassage + Mikrostrom-Stimulation + modellierende Maske + Serum",
    price: "64 €",
    tagline: "Straffung. Frische. Sichtbarer Lifting-Effekt.",
    description:
      "Diese kombinierte Behandlung vereint manuelle Gesichtsmassage mit sanfter Mikrostrom-Technologie, einer modellierenden Maske und einem hochkonzentrierten Serum. Die Massage aktiviert die Durchblutung, fördert den Lymphfluss und entspannt die mimische Muskulatur. Die Mikrostrom-Stimulation unterstützt die Hautstraffung, verbessert den Zellstoffwechsel und verleiht einen sichtbaren Lifting-Effekt. Die modellierende Maske intensiviert die Wirkung, festigt die Konturen und versorgt die Haut mit Feuchtigkeit. Abschließend wird ein Serum individuell nach Hauttyp aufgetragen, um Regeneration, Glätte und Ausstrahlung zu fördern.",
    benefits: [
      "Sichtbar frischere, straffere und glattere Haut bereits nach der ersten Anwendung",
      "Aktivierung der Durchblutung und des Lymphflusses",
      "Verbesserung des Zellstoffwechsels",
      "Individuelle Serum-Auswahl nach Hauttyp",
    ],
    target:
      "Ideal für alle, die ihrer Haut eine intensive Pflege mit sichtbarem Ergebnis gönnen möchten.",
    duration: "60 Minuten",
    recommendation: "Regelmäßige Behandlungen für nachhaltige Wirkung.",
  },
];

export default function Services() {
  return (
    <section className="page services-page">
      <h2>Massagearten und Preise</h2>
      <p className="services-intro">
        Wählen Sie aus unserem Angebot an Wellnessmassagen und Kosmetik
        Behandlungen.
      </p>
      <div className="service-list">
        {services.map((s) => (
          <article key={s.id} className="service-card">
            <div className="service-image">
              <img src={encodeURI(s.image)} alt={s.title} />
            </div>
            <div className="service-content">
              <div className="service-header">
                <h3>{s.title}</h3>
                <span className="price">{s.price}</span>
              </div>
              <p className="service-tagline">{s.tagline}</p>
              <p className="service-description">{s.description}</p>
              {"benefits" in s && (s as {benefits: string[]}).benefits.length > 0 && (
                <div className="service-benefits">
                  <h4>Vorteile:</h4>
                  <ul>
                    {(s as {benefits: string[]}).benefits.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              )}
              {"treatmentDetails" in s && (
                <div className="service-treatment">
                  <h4>{(s as {treatmentDetailsLabel?: string}).treatmentDetailsLabel ?? "Was erwartet Sie"}:</h4>
                  <ul>
                    {(s as {treatmentDetails: string[]}).treatmentDetails.map(
                      (t, i) => (
                        <li key={i}>{t}</li>
                      )
                    )}
                  </ul>
                </div>
              )}
              {"recommendedFor" in s && (
                <div className="service-recommended">
                  <h4>Empfohlen bei:</h4>
                  <ul>
                    {(s as {recommendedFor: string[]}).recommendedFor.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
              <p className="service-target">{s.target}</p>
              <div className="service-meta">
                <span className="service-duration">Dauer: {s.duration}</span>
                <span className="service-recommendation">
                  Empfehlung: {s.recommendation}
                </span>
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
