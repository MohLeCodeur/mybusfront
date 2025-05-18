import React from 'react'
import { motion } from 'framer-motion'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const Footer = () => {
  const footerLinks = [
    {
      title: 'Liens rapides',
      links: [
        { name: 'Accueil', path: '/' },
        { name: 'Destinations', path: '/#destinations' },
        { name: 'Tarifs', path: '/#tarifs' },
        { name: 'Contact', path: '/#contact' }
      ]
    },
    {
      title: 'Services',
      links: [
        { name: 'Réservation', path: '/search' },
        { name: 'Suivi en temps réel', path: '/#suivi' },
        { name: 'FAQ', path: '/faq' },
        { name: 'Conditions générales', path: '/cgv' }
      ]
    },
    {
      title: 'Entreprise',
      links: [
        { name: 'À propos', path: '/about' },
        { name: 'Carrières', path: '/careers' },
        { name: 'Presse', path: '/press' },
        { name: 'Blog', path: '/blog' }
      ]
    }
  ]

  const socialLinks = [
    { icon: FaFacebook, name: 'Facebook', url: 'https://facebook.com' },
    { icon: FaTwitter,  name: 'Twitter',  url: 'https://twitter.com' },
    { icon: FaInstagram,name: 'Instagram',url: 'https://instagram.com' },
    { icon: FaLinkedin, name: 'LinkedIn', url: 'https://linkedin.com' }
  ]

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="relative text-white"
    >


      <div className="bg-gradient-to-b from-indigo-900 via-indigo-950 to-black pt-20 pb-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* colonne logo */}
          <div className="space-y-6">
           <Link to="/" className="flex-shrink-0">
                       <motion.div whileHover={{ scale: 1.05 }} className="h-20 w-52 relative">
                         <img src="/assets/mybus.webp" alt="MyBus Logo" className="h-full w-full object-contain" />
                       </motion.div>
                     </Link>

            <p className="font-inter text-indigo-200 leading-relaxed">
              MyBus révolutionne les déplacements au&nbsp;Mali grâce à des solutions modernes, fiables et accessibles.
            </p>

            <div className="flex space-x-3">
              {socialLinks.map(({ icon: Icon, name, url }) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="group rounded-full p-3 bg-white/10 hover:bg-white/20 transition"
                >
                  <Icon className="text-xl group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* liens */}
          {footerLinks.map(section => (
            <div key={section.title}>
              <h3 className="font-playfair text-xl font-semibold mb-6">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map(link => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="font-inter text-indigo-200 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* bar inférieure */}
        <div className="mt-16 border-t border-indigo-800/60 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-inter text-indigo-300">
            © {new Date().getFullYear()} MyBus Mali — Tous droits réservés.
          </p>
          <div className="flex gap-6 text-sm">
            <Link to="/privacy" className="font-inter text-indigo-300 hover:text-white transition">
              Confidentialité
            </Link>
            <Link to="/terms" className="font-inter text-indigo-300 hover:text-white transition">
              Conditions
            </Link>
            <Link to="/cookies" className="font-inter text-indigo-300 hover:text-white transition">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}

export default Footer
