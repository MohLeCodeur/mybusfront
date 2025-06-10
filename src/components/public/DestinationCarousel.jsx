// src/components/public/DestinationCarousel.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; // <-- 1. Importer useNavigate
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

const destinations = [
  { id: 1, name: 'Bamako', description: 'La capitale animée et ses marchés colorés.', image: '/assets/destinations/bamako.png', price: 'Dès 5 000 FCFA' },
  { id: 2, name: 'Sikasso', description: 'Le grenier du Mali et ses paysages verdoyants.', image: '/assets/destinations/sikasso.png', price: 'Dès 7 500 FCFA' },
  { id: 3, name: 'Kayes', description: 'La ville aux sept collines au climat chaleureux.', image: '/assets/destinations/kayes.png', price: 'Dès 10 000 FCFA' },
  { id: 4, name: 'Mopti', description: 'La « Venise » malienne au confluent du Niger.', image: '/assets/destinations/mopti.webp', price: 'Dès 8 000 FCFA' }
];

export default function DestinationCarousel() {
  const navigate = useNavigate(); // <-- 2. Initialiser le hook

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
      className="overflow-x-hidden"
    >
      <Swiper
        modules={[Autoplay, Navigation, Pagination, EffectCoverflow]}
        effect="coverflow"
        coverflowEffect={{ rotate: 0, depth: 120, modifier: 1, slideShadows: false }}
        spaceBetween={60}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 }
        }}
        autoplay={{ delay: 4500, disableOnInteraction: false }}
        navigation
        pagination={{ clickable: true }}
        loop
        className="py-12"
      >
        {destinations.map(dest => (
          <SwiperSlide key={dest.id} className="px-2 pb-12">
            <motion.div
              whileHover={{ y: -5, boxShadow: '0 25px 50px -12px rgba(219, 39, 119, 0.25)' }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="group relative bg-white rounded-3xl overflow-hidden shadow-xl ring-1 ring-gray-100 h-full flex flex-col"
            >
              <span className="absolute top-4 left-0 bg-gradient-to-r from-pink-500 to-blue-500 text-xs font-semibold tracking-wide py-1 px-3 rounded-r-full text-white shadow">
                {dest.price}
              </span>
              <div className="relative h-56 overflow-hidden">
                <img src={dest.image} alt={dest.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy"/>
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 to-transparent" />
                <h3 className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white font-playfair text-2xl font-bold w-full text-center">
                  {dest.name}
                </h3>
              </div>
              <div className="p-6 space-y-4 flex-grow flex flex-col">
                <p className="text-gray-600 leading-relaxed text-sm flex-grow">
                  {dest.description}
                </p>
                <div className="flex justify-end pt-2">
                  {/* --- BOUTON MODIFIÉ --- */}
                  <motion.button
                    onClick={() => navigate('/search')} // 3. Le clic appelle navigate
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-5 py-2 rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-blue-500 text-white font-medium shadow-lg shadow-pink-500/20"
                  >
                    Réserver
                  </motion.button>
                  {/* ----------------------- */}
                </div>
              </div>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </motion.section>
  );
}