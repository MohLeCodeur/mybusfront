// src/components/admin/Sidebar.jsx
import React, { useContext } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom'; // Assurez-vous que Link et NavLink sont là
import { FiGrid, FiUsers, FiMap, FiPackage, FiCreditCard, FiLogOut, FiBarChart2 } from 'react-icons/fi';
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

// Composant principal
const Sidebar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

  return (
    <aside className="w-64 bg-white h-screen shadow-2xl flex flex-col sticky top-0 border-r border-gray-100">
      <div className="p-6 border-b border-gray-100 flex justify-center items-center">
        <Link to="/" className="group">
            <img 
              src="/assets/mybus.webp" 
              alt="MyBus Logo" 
              className="h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
        </Link>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navLinks.map(link => (
          <SidebarLink key={link.to} {...link} />
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="p-3 rounded-lg bg-gray-50 text-center">
            <p className="text-sm font-semibold text-gray-800 truncate">{user?.prenom} {user?.nom}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
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