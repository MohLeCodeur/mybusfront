// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { FiSmartphone, FiMapPin } from 'react-icons/fi'
import { FaBoxOpen } from 'react-icons/fa'

/* --- composants globaux --- */
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import FeatureCard from './components/FeatureCard'
import DestinationCarousel from './components/DestinationCarousel'
import LiveMap from './components/LiveMap'
import Footer from './components/Footer'

/* --- pages spécifiques --- */
import SearchPage from './routes/SearchPage'
import ReservationPage from './routes/ReservationPage'
import ConfirmationPage from './routes/ConfirmationPage'

/* ---------------------------------------------------------------------------
   HOME
--------------------------------------------------------------------------- */
function Home() {
  return (
    <div className="overflow-hidden bg-gray-50">
      {/* NAVBAR */}
      <Navbar />

      {/* HERO */}
      <Hero />

      {/* FEATURES */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-primary mb-4">
            Pourquoi choisir MyBus&nbsp;?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Profitez de la réservation Orange&nbsp;Money, du suivi de colis et de notre géolocalisation en temps réel
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<FiSmartphone size={36} />}
            title="Réservation Orange Money"
            description="Payez et recevez votre billet en quelques secondes grâce à l’intégration Orange Money."
            color="from-orange-500 to-amber-600"
          />

          <FeatureCard
            icon={<FaBoxOpen size={36} />}
            title="Suivi du statut des colis"
            description="Expédiez vos paquets : suivez leur état (en chargement, en route, livré) directement depuis l’appli."
            color="from-purple-600 to-fuchsia-600"
          />

          <FeatureCard
            icon={<FiMapPin size={36} />}
            title="Suivi temps réel"
            description="Géolocalisez votre bus et obtenez l’heure d’arrivée estimée, minute par minute."
            color="from-blue-500 to-indigo-600"
          />
        </div>
      </section>

      {/* DESTINATIONS */}
      <section className="py-24 bg-gradient-to-br from-white to-indigo-50">
        <div className="px-4 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-primary mb-4">
              Nos destinations populaires
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Parcourez les principales villes desservies par MyBus
            </p>
          </div>
          <DestinationCarousel />
        </div>
      </section>

      {/* LIVE MAP */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-primary mb-4">
            Suivi en temps réel
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Suivez votre bus ou vos colis sur notre carte interactive
          </p>
        </div>
        <LiveMap />
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  )
}

/* ---------------------------------------------------------------------------
   APP ROOT
--------------------------------------------------------------------------- */
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/reservation/:id" element={<ReservationPage />} />
        <Route path="/confirmation/:id" element={<ConfirmationPage />} />
      </Routes>
    </Router>
  )
}
