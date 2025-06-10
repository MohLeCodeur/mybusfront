import { motion } from 'framer-motion'
import { FiSmartphone, FiBox, FiMapPin, FiClock } from 'react-icons/fi'

export default function Hero () {
  return (
    <section className="relative h-screen w-full bg-[url('/assets/bus-hero.webp')] bg-cover bg-center">
      {/* voile sombre très léger */}
      <div className="absolute inset-0 bg-black/60 sm:bg-black/50" />

      {/* ——— CONTENU CENTRÉ ——— */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center h-full px-6">
        {/* Titre */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl text-4xl md:text-6xl font-bold font-playfair text-white leading-tight"
        >
          Réservez vos trajets en&nbsp;
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-fuchsia-500">
            un seul clic
          </span>
        </motion.h1>

        {/* Sous-titre */}
       <motion.p
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.2, duration: 0.8 }}
  className="mt-6 max-w-2xl text-lg md:text-xl text-gray-200"
>
 Pour vos trajets au Mali, réservez en un clic, suivez votre bus sur la carte et gardez un œil sur vos colis à chaque étape.
</motion.p>


        {/* CTA */}
        <motion.a
          href="/search"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-10 inline-block px-10 py-4 rounded-full bg-gradient-to-r from-pink-500 to-blue-600 text-white font-semibold shadow-lg shadow-pink-500/40 hover:shadow-blue-600/40 transition"
        >
          Réserver un billet
        </motion.a>

        {/* Mini-features (option : commente si trop chargé) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-14 backdrop-blur-md bg-white/10 rounded-2xl px-6 py-4 flex flex-wrap justify-center gap-6 shadow-inner max-w-xl"
        >
          {[
            { Icon: FiSmartphone, text: 'Orange Money' },
            { Icon: FiBox,        text: 'Colis suivis' },
            { Icon: FiMapPin,     text: 'GPS temps réel' },
            { Icon: FiClock,      text: 'Réservation rapide' }
          ].map(({ Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-white/90">
              <Icon size={20} /> <span className="text-sm">{text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
