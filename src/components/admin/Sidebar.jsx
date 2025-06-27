// src/components/admin/Sidebar.jsx
import React, { useContext } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { FiGrid, FiUsers, FiMap, FiPackage, FiLogOut, FiBarChart2 } from 'react-icons/fi';
import { FaBus } from 'react-icons/fa';
import AuthContext from '../../context/AuthContext';

// Données des liens de navigation
const navLinks = [
  { to: '/admin/dashboard', icon: <FiGrid />, label: 'Dashboard' },
  { to: '/admin/bus', icon: <FaBus />, label: 'Gestion des Bus' },
  { to: '/admin/chauffeurs', icon: <FiUsers />, label: 'Chauffeurs' },
  { to: '/admin/trajets', icon: <FiMap />, label: 'Trajets' },
  { to: '/admin/reservations', icon: <FiPackage />, label: 'Réservations' },
  { to: '/admin/colis', icon: <FiPackage />, label: 'Colis' },
  { to: '/admin/stats', icon: <FiBarChart2 />, label: 'Statistiques' },
];

// Composant interne pour chaque lien
const SidebarLink = ({ to, icon, label }) => {
  const baseClasses = "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out";
  const inactiveClasses = "text-gray-500 hover:bg-blue-50 hover:text-blue-600";
  const activeClasses = "bg-gradient-to-r from-pink-500 to-blue-500 text-white shadow-lg";

  return (
    <NavLink to={to} className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
      <span className="mr-3 text-lg">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
};

// Composant principal de la Sidebar
const Sidebar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

  // --- CORRECTION : La structure flexbox est conservée, mais la gestion du débordement est améliorée.
  return (
    <aside className="w-64 bg-white h-screen shadow-2xl flex flex-col sticky top-0 border-r border-gray-100">
      
      {/* --- CORRECTION : On ajoute 'shrink-0' pour empêcher cette section de se réduire sur les petits écrans --- */}
      <div className="p-6 border-b border-gray-100 flex justify-center items-center shrink-0">
        <Link to="/" className="group">
            <img 
              src="/assets/mybus.webp" 
              alt="MyBus Logo" 
              className="h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
        </Link>
      </div>
      
      {/* --- CORRECTION : On ajoute 'overflow-y-auto' pour que SEULEMENT la liste des liens devienne scrollable si nécessaire --- */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navLinks.map(link => (
          <SidebarLink key={link.to} {...link} />
        ))}
      </nav>

      {/* --- CORRECTION : On ajoute 'shrink-0' pour que cette section soit toujours visible en bas --- */}
      <div className="p-4 border-t border-gray-100 shrink-0">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-pink-50">
            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-blue-200 rounded-full text-blue-600 font-bold">
                {user?.prenom?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="overflow-hidden">
                <p className="text-sm font-semibold text-gray-800 truncate" title={user?.prenom + ' ' + user?.nom}>
                    {user?.prenom} {user?.nom}
                </p>
                <p className="text-xs text-gray-500 truncate" title={user?.email}>
                    {user?.email}
                </p>
            </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center mt-3 px-4 py-2 text-sm font-medium rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <FiLogOut className="mr-2" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;