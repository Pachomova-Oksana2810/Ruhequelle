-- Seed initial CMS services from legacy frontend hardcoded data
INSERT INTO cms_services (name, description, price, duration_minutes, image_url, sort_order, visible)
SELECT 'Intensive Rückenpflege', 'Die Haut am Rücken benötigt ebenso regelmäßige Pflege wie die Gesichtshaut. Dennoch wird dieser Bereich häufig vernachlässigt. Diese intensive Rückenpflege unterstützt die Reinigung der Haut, verbessert ihr Erscheinungsbild und sorgt für ein angenehmes Hautgefühl.', '75 €', 60, '/images/rueckenpflege-service.png', 1, TRUE
WHERE NOT EXISTS (SELECT 1 FROM cms_services WHERE name = 'Intensive Rückenpflege');

INSERT INTO cms_services (name, description, price, duration_minutes, image_url, sort_order, visible)
SELECT 'Wellness-Massage', 'Gönnen Sie sich eine Auszeit vom Alltag mit einer wohltuenden Wellness-Massage – einer sanften, ganzheitlichen Behandlung, die Körper und Seele in Einklang bringt. Durch langsame, fließende Bewegungen und gezielte Grifftechniken werden Verspannungen gelöst, der Energiefluss aktiviert und tiefe Entspannung ermöglicht.', '55 €', 60, '/images/Service/Wellness massage.png', 2, TRUE
WHERE NOT EXISTS (SELECT 1 FROM cms_services WHERE name = 'Wellness-Massage');

INSERT INTO cms_services (name, description, price, duration_minutes, image_url, sort_order, visible)
SELECT 'Gesichts- und Dekolleté-Massage', 'Die Gesichts- und Dekolleté-Massage ist eine wohltuende Kombination aus Pflege, Entspannung und Schönheitspflege. Durch sanfte, gezielte Massagegriffe werden die Hautdurchblutung gefördert, feine Linien geglättet, Schwellungen reduziert und der Teint sichtbar erfrischt. Behandelt werden Gesicht, Hals und Dekolleté – genau jene Zonen, in denen sich Stress, Müdigkeit und Spannungen oft sichtbar zeigen.', '45 €', 45, '/images/Service/Gesichts-und Dekollete-Massage.png', 3, TRUE
WHERE NOT EXISTS (SELECT 1 FROM cms_services WHERE name = 'Gesichts- und Dekolleté-Massage');

INSERT INTO cms_services (name, description, price, duration_minutes, image_url, sort_order, visible)
SELECT 'Lymphdrainage-Massage', 'Die Lymphdrainage-Massage ist eine spezielle, sanfte Massagetechnik, die den Lymphfluss anregt und den natürlichen Entgiftungsprozess des Körpers unterstützt. Durch rhythmische, fließende Bewegungen wird der Abtransport von überschüssiger Gewebsflüssigkeit und Schadstoffen gefördert.', '50 €', 60, '/images/Service/Lymphdrainage-Massage.png', 4, TRUE
WHERE NOT EXISTS (SELECT 1 FROM cms_services WHERE name = 'Lymphdrainage-Massage');

INSERT INTO cms_services (name, description, price, duration_minutes, image_url, sort_order, visible)
SELECT 'Anti-Cellulite-Massage', 'Die Anti-Cellulite-Massage ist eine wirkungsvolle Technik zur Reduzierung von Cellulite und zur sichtbaren Verbesserung des Hautbildes. Durch gezielte, tiefgehende Massagetechniken wird die Durchblutung angeregt, der Lymphfluss gefördert und der Fettstoffwechsel aktiviert.', '60 €', 40, '/images/Service/Anti-Cellulite-Massage.png', 5, TRUE
WHERE NOT EXISTS (SELECT 1 FROM cms_services WHERE name = 'Anti-Cellulite-Massage');

INSERT INTO cms_services (name, description, price, duration_minutes, image_url, sort_order, visible)
SELECT 'Körperhaltung und Bewegungsoptimierung', 'Falsche Haltung, Bewegungsmangel und einseitige Belastungen führen oft zu Verspannungen, Schmerzen und einem eingeschränkten Bewegungsmuster. Unsere ganzheitliche Behandlung zur Körperhaltung und Bewegungsoptimierung unterstützt Sie dabei, Ihre natürliche Aufrichtung zurückzugewinnen und sich wieder mit Leichtigkeit zu bewegen.', '60 €', 60, '/images/Service/Körperhaltung ung Bewegungsoptim.png', 6, TRUE
WHERE NOT EXISTS (SELECT 1 FROM cms_services WHERE name = 'Körperhaltung und Bewegungsoptimierung');

INSERT INTO cms_services (name, description, price, duration_minutes, image_url, sort_order, visible)
SELECT 'Tiefenreinigende Behandlung', 'Eine intensive Gesichtsbehandlung für unreine, ölige oder zu Akne neigende Haut. Die Tiefenreinigung befreit Poren von Unreinheiten, gleicht das Hautbild aus und schenkt Ihrer Haut neue Klarheit und Frische.', '96 €', 90, '/images/Service/Gesichts-und Dekollete-Massage.png', 7, TRUE
WHERE NOT EXISTS (SELECT 1 FROM cms_services WHERE name = 'Tiefenreinigende Behandlung');

INSERT INTO cms_services (name, description, price, duration_minutes, image_url, sort_order, visible)
SELECT 'Enzympeeling', 'Ein mildes Enzympeeling, das die Haut sanft von abgestorbenen Zellen befreit und für einen strahlenden, ebenmäßigen Teint sorgt. Besonders schonend für empfindliche Haut.', '60 €', 30, '/images/Service/Gesichts-und Dekollete-Massage.png', 8, TRUE
WHERE NOT EXISTS (SELECT 1 FROM cms_services WHERE name = 'Enzympeeling');

INSERT INTO cms_services (name, description, price, duration_minutes, image_url, sort_order, visible)
SELECT 'Lifting + Anti-Age-Pflege', 'Eine intensive Anti-Aging-Behandlung, die Feine Linien und Falten mildert, die Elastizität der Haut verbessert und einen sichtbar frischen, straffen Teint schenkt.', '75 €', 60, '/images/Service/Gesichts-und Dekollete-Massage.png', 9, TRUE
WHERE NOT EXISTS (SELECT 1 FROM cms_services WHERE name = 'Lifting + Anti-Age-Pflege');

INSERT INTO cms_services (name, description, price, duration_minutes, image_url, sort_order, visible)
SELECT 'Fermenttherapie', 'Fermenttherapie ist eine Pflegebehandlung, die die Funktionen der Haut auf zellulärer Ebene wiederherstellt. Dank Fermenttherapie lassen sich dunkle Ringe und Schwellungen unter den Augen beseitigen, die Hautfestigkeit und -elastizität verbessern, der Alterungsprozess der Haut aufhalten und Pigmentflecken entfernen. Die Wirkstoffe dringen tief in die Haut ein. Die Wirkung der Fermenttherapie ist mit Injektionsmethoden vergleichbar. Diese Behandlung ist für diejenigen geeignet, die nicht bereit sind, sich ‚Schönheitsspritzen‘ zu unterziehen. Fermenttherapie ist weltweit die einzige, die die Eigenschaften von Botenstoffen nutzt. Bis heute gibt es keine vergleichbare Methode.', '50 €', 60, '/images/Service/Gesichts-und Dekollete-Massage.png', 10, TRUE
WHERE NOT EXISTS (SELECT 1 FROM cms_services WHERE name = 'Fermenttherapie');

INSERT INTO cms_services (name, description, price, duration_minutes, image_url, sort_order, visible)
SELECT 'Gesichtsbehandlung: Gesichtsmassage + Mikrostrom-Stimulation + modellierende Maske + Serum', 'Diese kombinierte Behandlung vereint manuelle Gesichtsmassage mit sanfter Mikrostrom-Technologie, einer modellierenden Maske und einem hochkonzentrierten Serum. Die Massage aktiviert die Durchblutung, fördert den Lymphfluss und entspannt die mimische Muskulatur. Die Mikrostrom-Stimulation unterstützt die Hautstraffung, verbessert den Zellstoffwechsel und verleiht einen sichtbaren Lifting-Effekt. Die modellierende Maske intensiviert die Wirkung, festigt die Konturen und versorgt die Haut mit Feuchtigkeit. Abschließend wird ein Serum individuell nach Hauttyp aufgetragen, um Regeneration, Glätte und Ausstrahlung zu fördern.', '64 €', 60, '/images/Service/Gesichtsmassage + Mikrostrom-Stimulation.png', 11, TRUE
WHERE NOT EXISTS (SELECT 1 FROM cms_services WHERE name = 'Gesichtsbehandlung: Gesichtsmassage + Mikrostrom-Stimulation + modellierende Maske + Serum');
