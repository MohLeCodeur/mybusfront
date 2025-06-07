import React from 'react'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination, EffectCoverflow } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-coverflow'

const destinations = [
  {
    id: 1,
    name: 'Bamako',
    description: 'La capitale animée aux marchés colorés',
    image: '/assets/destinations/bamako.png',
    price: '5 000 FCFA'
  },
  {
    id: 2,
    name: 'Sikasso',
    description: 'Le grenier du Mali et ses paysages verdoyants',
    image: '/assets/destinations/sikasso.png',
    price: '7 500 FCFA'
  },
  {
    id: 3,
    name: 'Kayes',
    description: 'La ville aux sept collines, climat chaleureux',
    image: '/assets/destinations/kayes.png',
    price: '10 000 FCFA'
  },
  {
    id: 4,
    name: 'Mopti',
    description: 'La « Venise » malienne au confluent Niger/Bani',
    image: '/assets/destinations/mopti.webp',
    price: '8 000 FCFA'
  }
]

export default function DestinationCarousel () {
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
          <SwiperSlide key={dest.id} className="px-2">
        <motion.div
  whileHover={{ rotateX: 5, rotateY: -5, scale: 1.03 }}
  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
  className="group relative bg-white/10 backdrop-blur-lg rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10"
>
  <span className="absolute top-4 left-0 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-blue-500 text-xs font-semibold tracking-wide py-1 px-3 rounded-r-full text-white shadow">
    {dest.price}
  </span>

  <div className="relative h-56 overflow-hidden">
    <img
      src={dest.image}
      alt={dest.name}
      className="w-full h-full object-cover transition-transform duration-[4000ms] group-hover:scale-110"
      loading="lazy"
    />
    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 to-transparent" />
    <h3 className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white font-playfair text-2xl font-bold">
      {dest.name}
    </h3>
  </div>

  <div className="p-6 space-y-6">
    {/* ---- description en noir ---- */}
    <p className="text-gray-800 font-inter leading-relaxed min-h-[3.5rem]">
      {dest.description}
    </p>

    <div className="flex justify-end">
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="px-5 py-2 rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-blue-500 text-white font-medium shadow-lg shadow-pink-500/20"
      >
        Réserver
      </motion.button>
    </div>
  </div>
</motion.div>

          </SwiperSlide>
        ))}
      </Swiper>
    </motion.section>
  )
}
