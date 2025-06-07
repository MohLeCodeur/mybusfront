// src/pages/public/SearchPage.jsx
import React, { useState, useEffect } from 'react';
import { FiLoader, FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import TrajetCard from '../../components/public/TrajetCard';

const LIMIT = 15;

const SearchPage = () => {
  const [filters, setFilters] = useState({ departure: '', arrival: '', date: '' });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [trajets, setTrajets] = useState([]);
  const [allVilles, setAllVilles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    const params = {
      villeDepart: filters.departure || undefined,
      villeArrivee: filters.arrival || undefined,
      date: filters.date || undefined,
      page,
      limit: LIMIT,
    };

    api.get('/public/trajets/search', { params }) // URL CORRIGÉE
      .then(({ data }) => {
        setTrajets(data.docs);
        setTotalPages(data.pages);
        if (page === 1) {
            const villes = new Set();
            data.docs.forEach(t => {
                villes.add(t.villeDepart);
                villes.add(t.villeArrivee);
            });
            setAllVilles(Array.from(villes).sort());
        }
      })
      .catch(err => setError(err.response?.data?.message || "Une erreur est survenue."))
      .finally(() => setLoading(false));

  }, [filters, page]);

  const handleFilterChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setPage(1);
  };

  const handleReset = () => {
    setFilters({ departure: '', arrival: '', date: '' });
    setPage(1);
  };

  const handleReserve = (id) => navigate(`/reservation/${id}`);

  // Le reste du JSX est déjà correct
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <section className="relative bg-[url('/assets/search-bg.webp')] bg-cover bg-center">
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 py-24">
          <h1 className="text-4xl font-playfair font-bold mb-8">Trouvez votre trajet</h1>
          <form className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-lg" onSubmit={e => e.preventDefault()}>
            <select name="departure" value={filters.departure} onChange={handleFilterChange} className="w-full px-4 py-3 rounded-full bg-white/50 border border-gray-200 focus:ring-2 focus:ring-pink-500">
              <option value="">Départ</option>
              {allVilles.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            <select name="arrival" value={filters.arrival} onChange={handleFilterChange} className="w-full px-4 py-3 rounded-full bg-white/50 border border-gray-200 focus:ring-2 focus:ring-pink-500">
              <option value="">Arrivée</option>
              {allVilles.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            <input type="date" name="date" value={filters.date} onChange={handleFilterChange} className="w-full px-4 py-3 rounded-full bg-white/50 border border-gray-200 focus:ring-2 focus:ring-pink-500" />
            <button type="button" onClick={handleReset} className="w-full px-4 py-3 rounded-full text-white font-semibold bg-gradient-to-r from-pink-500 to-blue-600 hover:brightness-110 active:scale-95 transition">
              Réinitialiser
            </button>
          </form>
        </div>
      </section>
      <main className="flex-1 max-w-7xl mx-auto px-4 py-16 w-full">
        {loading ? (
          <div className="flex justify-center mt-20"><FiLoader className="animate-spin text-4xl text-pink-500" /></div>
        ) : error ? (
          <div className="text-center space-y-4 text-red-500 bg-red-50 p-6 rounded-lg">
            <p>Erreur: {error}</p>
            <button onClick={() => window.location.reload()} className="px-6 py-2 bg-pink-500 rounded-full text-white">Réessayer</button>
          </div>
        ) : trajets.length === 0 ? (
          <div className="text-center text-gray-500 bg-gray-100 p-8 rounded-lg">
            <FiSearch className="mx-auto text-5xl mb-4" />
            <p>Aucun trajet ne correspond à votre recherche pour le moment.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {trajets.map(t => (
                <TrajetCard key={t._id} trajet={t} onReserve={() => handleReserve(t._id)} />
              ))}
            </div>
            {totalPages > 1 && (
              <nav className="flex justify-center mt-12 gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)} className={`px-4 py-2 rounded-full border ${p === page ? 'bg-gradient-to-r from-pink-500 to-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>
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