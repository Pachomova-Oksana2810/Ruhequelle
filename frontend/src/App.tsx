import "./App.css";
import {BrowserRouter, Link, Route, Routes} from "react-router-dom";
import {FiMapPin, FiMail, FiPhone} from "react-icons/fi";
import {FaInstagram} from "react-icons/fa";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Booking from "./pages/Booking";
import Gallery from "./pages/Gallery";
import Impressum from "./pages/Impressum";
import Datenschutz from "./pages/Datenschutz";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header className="topbar">
          <Link to="/" className="brand">
            <img src="/images/logo.png" alt="Ruhequelle" className="brand-logo" />
          </Link>
          <nav className="topbar-nav">
            <Link to="/">Start</Link>
            <Link to="/about">Über mich</Link>
            <Link to="/services">Massagen</Link>
            <Link to="/booking">Galerie & Bewertungen</Link>
          </nav>
          <Link to="/appointment" className="pill-button">
            Termin buchen
          </Link>
        </header>

        <div className="page-header">
          <img src="/images/header1.png" alt="" className="page-header-image" />
        </div>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/booking" element={<Gallery />} />
            <Route path="/appointment" element={<Booking />} />
            <Route path="/impressum" element={<Impressum />} />
            <Route path="/datenschutz" element={<Datenschutz />} />
          </Routes>
        </main>

        <footer className="footer">
          <div className="footer-inner">
            <div className="footer-brand">
              <strong>Ruhequelle</strong>
              <span>Massage und Kosmetik Behandlungen</span>
            </div>
            <div className="footer-contact">
              <p className="footer-contact-item">
                <FiMapPin className="footer-icon" aria-hidden />
                <span>
                  <strong>Anna Koldakova</strong>
                  <br />
                  Neustadt 23A, 56068 Koblenz
                </span>
              </p>
              <p className="footer-contact-item">
                <FiMail className="footer-icon" aria-hidden />
                <a href="mailto:koldakova.anna88@gmail.com">
                  koldakova.anna88@gmail.com
                </a>
              </p>
              <p className="footer-contact-item">
                <FiPhone className="footer-icon" aria-hidden />
                <a href="tel:+491705996137">+49 170 599 6137</a>
              </p>
              <p className="footer-contact-item">
                <FaInstagram className="footer-icon" aria-hidden />
                <a
                  href="https://www.instagram.com/koldakova_anna?igsh=MWlzYWRuMWpkZXM5OA%3D%3D&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
              </p>
            </div>
            <div className="footer-legal">
              <Link to="/impressum">Impressum</Link>
              <span className="footer-sep">·</span>
              <Link to="/datenschutz">Datenschutz</Link>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
