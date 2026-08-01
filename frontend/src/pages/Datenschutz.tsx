export default function Datenschutz() {
  return (
    <section className="page datenschutz-page">
      <h2>Datenschutzerklärung</h2>
      <p className="datenschutz-subtitle">
        Ruhequelle – Massage und Kosmetik Behandlungen
      </p>

      <div className="datenschutz-block">
        <h3>1. Verantwortlicher</h3>
        <p>
          Verantwortlich für die Datenverarbeitung auf dieser Website im Sinne
          der Datenschutz-Grundverordnung (DSGVO) ist:
        </p>
        <p>
          Anna Koldakova
          <br />
          Ruhequelle – Massage und Kosmetik Behandlungen
          <br />
          Neustadt 23A
          <br />
          56068 Koblenz, Deutschland
        </p>
        <p>
          E-Mail:{" "}
          <a href="mailto:koldakova.anna88@gmail.com">
            koldakova.anna88@gmail.com
          </a>
          <br />
          Tel.:{" "}
          <a href="tel:+491705996137">+49 170 599 6137</a>
        </p>
      </div>

      <div className="datenschutz-block">
        <h3>2. Arten der verarbeiteten Daten</h3>
        <p>Im Rahmen der Nutzung dieser Website können folgende Daten verarbeitet werden:</p>
        <ul>
          <li>
            <strong>Kontaktdaten:</strong> Name, E-Mail-Adresse, Telefonnummer
          </li>
          <li>
            <strong>Buchungsdaten:</strong> Datum, Uhrzeit und Art der
            Behandlung
          </li>
          <li>
            <strong>Technische Daten:</strong> IP-Adresse, Browser-Typ und
            -Version sowie weitere Informationen, die Ihr Browser automatisch
            übermittelt
          </li>
        </ul>
      </div>

      <div className="datenschutz-block">
        <h3>3. Zweck der Verarbeitung</h3>
        <p>Ihre personenbezogenen Daten werden verarbeitet, um:</p>
        <ul>
          <li>Terminbuchungen entgegenzunehmen und zu verwalten</li>
          <li>mit Ihnen in Bezug auf Ihre Buchung zu kommunizieren</li>
          <li>
            Erinnerungen und Bestätigungen per E-Mail und SMS zu versenden
          </li>
        </ul>
      </div>

      <div className="datenschutz-block">
        <h3>4. Rechtsgrundlage</h3>
        <p>Die Verarbeitung erfolgt auf Grundlage von:</p>
        <ul>
          <li>
            <strong>Art. 6 Abs. 1 lit. b DSGVO</strong> – zur Erfüllung eines
            Vertrags bzw. zur Durchführung vorvertraglicher Maßnahmen
            (Terminbuchung und -verwaltung)
          </li>
          <li>
            <strong>Art. 6 Abs. 1 lit. f DSGVO</strong> – aufgrund unseres
            berechtigten Interesses an einer sicheren und funktionsfähigen
            Website sowie an einer effizienten Terminorganisation
          </li>
        </ul>
      </div>

      <div className="datenschutz-block">
        <h3>5. Speicherdauer</h3>
        <p>
          Buchungs- und Kontaktdaten werden für einen Zeitraum von{" "}
          <strong>3 Jahren nach dem letzten Termin</strong> gespeichert und
          danach automatisch gelöscht, sofern keine gesetzlichen
          Aufbewahrungspflichten entgegenstehen.
        </p>
      </div>

      <div className="datenschutz-block">
        <h3>6. Weitergabe an Dritte</h3>
        <p>
          Eine Weitergabe Ihrer Daten an Dritte erfolgt nur, soweit dies zur
          Erbringung der genannten Zwecke erforderlich ist:
        </p>
        <ul>
          <li>
            <strong>Brevo</strong> (ehemals Sendinblue) – Versand von E-Mails
            und SMS. Die Server befinden sich in der Europäischen Union.
          </li>
          <li>
            <strong>Google Calendar</strong> – Terminverwaltung. Weitere
            Informationen finden Sie in der{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Datenschutzerklärung von Google
            </a>
            .
          </li>
        </ul>
        <p>
          Eine Weitergabe Ihrer Daten zu Werbezwecken findet nicht statt.
        </p>
      </div>

      <div className="datenschutz-block">
        <h3>7. Ihre Rechte (Art. 15–21 DSGVO)</h3>
        <p>Sie haben jederzeit das Recht auf:</p>
        <ul>
          <li>Auskunft über Ihre gespeicherten personenbezogenen Daten (Art. 15 DSGVO)</li>
          <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
          <li>Löschung Ihrer Daten (Art. 17 DSGVO)</li>
          <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
          <li>
            Widerspruch gegen die Verarbeitung Ihrer Daten (Art. 21 DSGVO)
          </li>
        </ul>
        <p>
          Darüber hinaus haben Sie das Recht, sich bei einer
          Datenschutzaufsichtsbehörde zu beschweren. Zuständig ist:
        </p>
        <p>
          Der Landesbeauftragte für den Datenschutz und die Informationsfreiheit
          Rheinland-Pfalz
          <br />
          Hintere Bleiche 34
          <br />
          55116 Mainz
          <br />
          Website:{" "}
          <a
            href="https://www.datenschutz.rlp.de"
            target="_blank"
            rel="noopener noreferrer"
          >
            www.datenschutz.rlp.de
          </a>
        </p>
      </div>

      <div className="datenschutz-block">
        <h3>8. Cookies und lokale Speicherung</h3>
        <p>
          Auf dieser Website werden ausschließlich technisch notwendige Cookies
          eingesetzt. Tracking- oder Werbe-Cookies werden nicht verwendet.
        </p>
        <p>
          Für Bewertungen wird <strong>localStorage</strong> im Browser
          verwendet. Die Speicherung erfolgt ausschließlich lokal auf Ihrem
          Gerät; es findet keine Übertragung an einen Server statt.
        </p>
      </div>

      <div className="datenschutz-block">
        <h3>9. SSL-Verschlüsselung</h3>
        <p>
          Diese Website nutzt eine SSL-/TLS-Verschlüsselung (HTTPS), um Ihre
          Daten bei der Übertragung zu schützen. Eine verschlüsselte Verbindung
          erkennen Sie am Schloss-Symbol in der Adresszeile Ihres Browsers sowie
          an der Adresse, die mit „https://“ beginnt.
        </p>
      </div>

      <div className="datenschutz-block">
        <h3>10. Kontakt für Datenschutzanfragen</h3>
        <p>
          Bei Fragen zum Datenschutz oder zur Ausübung Ihrer Rechte wenden Sie
          sich bitte an:
        </p>
        <p>
          <a href="mailto:koldakova.anna88@gmail.com">
            koldakova.anna88@gmail.com
          </a>
        </p>
      </div>
    </section>
  );
}
