// src/pages/public/SearchPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { FiLoader, FiSearch, FiFilter, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api';
import TrajetCard from '../../components/public/TrajetCard.jsx';
import { Button } from '../../components/ui/Button.jsx';

const LIMIT = 9; // Nombre de trajets par page

// Composant interne pour les filtres, pour garder le code propre
const FilterPanel = ({ filters, meta, onChange, onReset, isMobile = false, onClose }) => {
  return (
    <div className="space-y-4">
      {isMobile && (
        <div className="flex justify-between items-center pb-4 border-b">
          <h3 className="text-lg font-bold text-gray-800">Filtrer les trajets</h3>
          <button onClick={onClose} className="p-2 -mr-2"><FiX size={24} /></button>
        </div>
      )}
      <select name="departure" value={filters.departure} onChange={onChange} className="w-full px-4 py-3 rounded-lg border-gray-300 focus:ring-2 focus:ring-pink-500 bg-white">
        <option value="">De (toutes villes)</option>
        {meta.allCities.map(v => <option key={v} value={v}>{v}</option>)}
      </select>
      <select name="arrival" value={filters.arrival} onChange={onChange} className="w-full px-4 py-3 rounded-lg border-gray-300 focus:ring-2 focus:ring-pink-500 bg-white">
        <option value="">À (toutes villes)</option>
        {meta.allCities.map(v => <option key={v} value={v}>{v}</option>)}
      </select>
      <input type="date" name="date" value={filters.date} onChange={onChange} className="w-full px-4 py-3 rounded-lg border-gray-300 focus:ring-2 focus:ring-pink-500" />
      <input type="text" name="company" value={filters.company} onChange={onChange} placeholder="Rechercher une compagnie..." className="w-full px-4 py-3 rounded-lg border-gray-300 focus:ring-2 focus:ring-pink-500" />
      <select name="sortBy" value={filters.sortBy} onChange={onChange} className="w-full px-4 py-3 rounded-lg border-gray-300 bg-white text-sm focus:ring-2 focus:ring-blue-500">
          <option value="date">Trier par : Date</option>
          <option value="price_asc">Trier par : Prix (croissant)</option>
          <option value="price_desc">Trier par : Prix (décroissant)</option>
      </select>
      <Button onClick={onReset} variant="outline" className="w-full py-3 flex items-center justify-center gap-2"><FiX /> Effacer les filtres</Button>
    </div>
  );
};

const SearchPage = () => {
  const [filters, setFilters] = useState({ departure: '', arrival: '', date: '', company: '', sortBy: 'date' });
  const [debouncedCompany] = useDebounce(filters.company, 500);
  const [isFilterOpen, setIsFilterOpen] = useState(false); // État pour le panneau mobile

  const [page, setPage] = useState(1);
  const [data, setData] = useState({ docs: [], totalPages: 1, total: 0 });
  const [meta, setMeta] = useState({ allCities: [], allCompanies: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchTrajets = useCallback(() => {
    setLoading(true);
    setError(null);
    const params = {
      villeDepart: filters.departure,
      villeArrivee: filters.arrival,
      date: filters.date,
      compagnie: debouncedCompany,
      sortBy: filters.sortBy,
      page,
      limit: LIMIT,
    };
    api.get('/public/trajets/search', { params })
      .then(({ data }) => {
        setData({ docs: data.docs || [], totalPages: data.pages || 1, total: data.total || 0 });
        if (data.meta) { setMeta(data.meta); }
      })
      .catch(err => setError(err.response?.data?.message || "Une erreur est survenue."))
      .finally(() => setLoading(false));
  }, [filters.departure, filters.arrival, filters.date, debouncedCompany, filters.sortBy, page]);

  useEffect(() => {
    fetchTrajets();
  }, [fetchTrajets]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const handleReset = () => {
    setFilters({ departure: '', arrival: '', date: '', company: '', sortBy: 'date' });
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-white">
      {/* ======================================================= */}
      {/* === Section des filtres - NOUVELLE VERSION RESPONSIVE === */}
      {/* ======================================================= */}
      <section className="sticky top-20 z-20 bg-white/80 backdrop-blur-lg shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Version Desktop : filtres toujours visibles */}
          <div className="hidden lg:block">
            <FilterPanel filters={filters} meta={meta} onChange={handleFilterChange} onReset={handleReset} />
          </div>
          {/* Version Mobile : bouton pour ouvrir les filtres */}
          <div className="lg:hidden text-center">
            <Button onClick={() => setIsFilterOpen(true)} className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
              <FiFilter className="mr-2" /> Afficher les filtres
            </Button>
          </div>
        </div>
      </section>

      {/* Panneau de filtres mobile (Drawer) */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-full w-full max-w-sm bg-white shadow-2xl z-40 p-6 lg:hidden"
            >
              <FilterPanel filters={filters} meta={meta} onChange={handleFilterChange} onReset={handleReset} isMobile={true} onClose={() => setIsFilterOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Section des résultats */}
      <main className="max-w-7xl mx-auto px-4 py-12 w-full">
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                {loading ? 'Recherche...' : `${data.total} trajet${data.total > 1 ? 's' : ''} trouvé${data.total > 1 ? 's' : ''}`}
            </h2>
            {/* Le tri est maintenant dans le panneau de filtre, on peut le cacher ici sur mobile */}
            <div className="hidden sm:block">
                {/* (Optionnel) On peut garder le tri ici pour les tablettes/desktop */}
            </div>
        </div>

        {loading ? (
          <div className="flex justify-center mt-20"><FiLoader className="animate-spin text-5xl text-blue-500" /></div>
        ) : error ? (
          <div className="text-center space-y-4 text-red-600 bg-red-50 p-8 rounded-lg">
            <p><strong>Erreur :</strong> {error}</p>
            <Button onClick={fetchTrajets}>Réessayer</Button>
          </div>
        ) : data.docs.length === 0 ? (
          <div className="text-center text-gray-500 bg-white p-12 rounded-lg shadow-sm">
            <FiSearch className="mx-auto text-6xl mb-4 text-gray-300" />
            <p className="font-semibold">Aucun trajet ne correspond à votre recherche.</p>
            <p className="text-sm">Essayez de modifier ou d'effacer vos filtres.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.docs.map(t => (
                <TrajetCard key={t._id} trajet={t} onReserve={() => navigate(`/reservation/${t._id}`)} />
              ))}
            </div>
            {data.totalPages > 1 && (
              <nav className="flex justify-center mt-12 gap-2">
                {Array.from({ length: data.totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)} className={`h-10 w-10 flex items-center justify-center rounded-full border text-sm font-medium transition ${p === page ? 'bg-gradient-to-r from-pink-500 to-blue-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>
                    {p}
                  </button>
                ))}
              </nav>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default SearchPage;