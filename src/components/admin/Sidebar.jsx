// src/components/admin/Sidebar.jsx
import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiGrid, FiUsers, FiMap, FiPackage, FiCreditCard, FiLogOut, FiBarChart2 } from 'react-icons/fi';
import { FaBus } from 'react-icons/fa';
import AuthContext from '../../context/AuthContext';

// Configuration des liens de navigation pour la barre latérale
const navLinks = [
  { to: '/admin/dashboard', icon: <FiGrid />, label: 'Dashboard' },
  { to: '/admin/bus', icon: <FaBus />, label: 'Gestion des Bus' },
  { to: '/admin/chauffeurs', icon: <FiUsers />, label: 'Chauffeurs' },
  { to: '/admin/trajets', icon: <FiMap />, label: 'Trajets' },
  { to: '/admin/reservations', icon: <FiPackage />, label: 'Réservations' },
  { to: '/admin/colis', icon: <FiPackage />, label: 'Colis' },
  { to: '/admin/stats', icon: <FiBarChart2 />, label: 'Statistiques' },
];

// Composant interne réutilisable pour chaque lien de navigation
const SidebarLink = ({ to, icon, label }) => {
  const baseClasses = "flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200";
  const inactiveClasses = "text-gray-600 hover:bg-gray-100 hover:text-gray-900";
  const activeClasses = "bg-blue-600 text-white shadow-md";

  return (
    <NavLink
      to={to}
      className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      <span className="mr-3 text-lg">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
};

// Composant principal de la barre latérale
const Sidebar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    // Fonction pour gérer la déconnexion
    const handleLogout = () => {
        logout();
        navigate('/login'); // Redirige vers la page de connexion après déconnexion
    };

  return (
    <aside className="w-64 bg-white h-screen shadow-lg flex flex-col sticky top-0">
      
      {/* --- SECTION DU LOGO (AMÉLIORÉE) --- */}
      <div className="p-4 border-b border-gray-200 flex justify-center items-center">
        <NavLink to="/" className="group transition-transform duration-300 ease-in-out hover:scale-105">
            <img 
              src="/assets/mybus.webp" 
              alt="MyBus Logo" 
              className="h-20 w-auto object-contain" // h-20 pour augmenter la hauteur
            />
        </NavLink>
      </div>
      {/* ---------------------------------- */}
      
      {/* Section des liens de navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navLinks.map(link => (
          <SidebarLink key={link.to} {...link} />
        ))}
      </nav>

      {/* Section inférieure avec les informations de l'utilisateur et la déconnexion */}
      <div className="p-4 border-t border-gray-200">
        <div className="p-3 rounded-lg bg-gray-100">
            <p className="text-sm font-semibold truncate" title={user?.prenom + ' ' + user?.nom}>{user?.prenom} {user?.nom}</p>
            <p className="text-xs text-gray-500 truncate" title={user?.email}>{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center mt-3 px-4 py-2 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 transition-colors"
        >
          <FiLogOut className="mr-2" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;