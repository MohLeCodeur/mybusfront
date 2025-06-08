// src/pages/public/ConfirmationPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api'; // Utilise notre instance Axios centralisée
import { FiCheck, FiDownload, FiCalendar, FiClock, FiUsers, FiLoader } from 'react-icons/fi';
import { FaTicketAlt, FaBus } from 'react-icons/fa';
import domtoimage from 'dom-to-image';
import { jsPDF } from 'jspdf';

const ConfirmationPage = () => {
  const { id: reservationId } = useParams();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const ticketRef = useRef(null);

  useEffect(() => {
    // L'appel API est déjà correct car il utilise /api/reservations/:id
    api.get(`/reservations/${reservationId}`)
      .then(res => {
        setReservation(res.data);
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Impossible de récupérer les détails de la réservation.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [reservationId]);

  const handleDownloadTicket = async () => {
    if (!ticketRef.current || downloading) return;
    setDownloading(true);
    try {
      const scale = 2;
      const dataUrl = await domtoimage.toPng(ticketRef.current, {
        width: ticketRef.current.clientWidth * scale,
        height: ticketRef.current.clientHeight * scale,
        style: { transform: `scale(${scale})`, transformOrigin: 'top left' },
        quality: 1.0,
        bgcolor: '#ffffff'
      });
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`MyBus-Ticket-${reservationId}.pdf`);
    } catch (err) {
      console.error('Erreur lors de la génération du PDF:', err);
      alert("Une erreur est survenue lors du téléchargement.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <FiLoader className="text-5xl text-pink-500 animate-spin mb-4" />
        <p className="text-lg text-gray-700">Chargement de votre confirmation...</p>
      </div>
    );
  }

  if (error || !reservation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <FiCheck className="text-4xl text-red-500" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Erreur</h1>
          <p className="text-gray-600 mb-6">{error || "Réservation introuvable."}</p>
          <Link to="/" className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-blue-600 text-white font-semibold hover:opacity-90 transition">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }
  
  const formattedDate = new Date(reservation.trajet.dateDepart).toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });
  
  return (
    <main className="py-16 px-4 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <FiCheck className="text-4xl text-green-500" />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-600">
            Réservation confirmée !
          </h1>
          <p className="text-gray-600">
            Votre paiement a été effectué avec succès. Voici votre e-ticket.
          </p>
        </div>

        <div ref={ticketRef} className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 relative mx-auto max-w-2xl">
          <div className="bg-gradient-to-r from-pink-500 to-blue-600 py-6 px-8 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">MyBus</h2>
                <p className="text-sm font-medium opacity-90">E-Ticket de voyage</p>
              </div>
              <FaTicketAlt className="text-4xl opacity-80" />
            </div>
          </div>
          <div className="p-8">
            <div className="border-t-2 border-dashed border-gray-200 relative -mx-8 mb-8">
              <div className="absolute -left-3 -top-2.5 h-5 w-5 rounded-full bg-gray-50"></div>
              <div className="absolute -right-3 -top-2.5 h-5 w-5 rounded-full bg-gray-50"></div>
            </div>
            <div className="mb-6 text-center">
              <span className="text-sm text-gray-500">N° de Réservation</span>
              <h3 className="text-xl font-bold text-gray-800">{reservation._id}</h3>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
                <div className="text-center sm:text-left"><div className="text-sm text-gray-500">Départ</div><div className="text-2xl font-bold">{reservation.trajet.villeDepart}</div></div>
                <div className="flex items-center my-4 sm:my-0"><FaBus className="text-3xl text-blue-500"/><div className="w-24 h-0.5 bg-gray-200 mx-2"></div></div>
                <div className="text-center sm:text-right"><div className="text-sm text-gray-500">Arrivée</div><div className="text-2xl font-bold">{reservation.trajet.villeArrivee}</div></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center gap-4"><div className="bg-pink-100 p-3 rounded-full"><FiCalendar className="text-pink-500"/></div><div><div className="text-sm text-gray-500">Date</div><div className="font-medium">{formattedDate}</div></div></div>
              <div className="flex items-center gap-4"><div className="bg-blue-100 p-3 rounded-full"><FiClock className="text-blue-500"/></div><div><div className="text-sm text-gray-500">Heure</div><div className="font-medium">{reservation.trajet.heureDepart}</div></div></div>
            </div>
            
            {/* === SECTION CORRIGÉE : Affichage de tous les passagers === */}
            <div className="mb-8">
              <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3">
                <FiUsers />
                <span>Passager(s) ({reservation.placesReservees})</span>
              </h4>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                {reservation.passagers.map((p, index) => (
                  <div key={index} className="font-medium">{p.prenom} {p.nom}</div>
                ))}
              </div>
            </div>
            {/* ======================================================= */}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div>
                <div className="text-sm text-gray-500">Compagnie</div>
                <div className="font-medium">{reservation.trajet.compagnie}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">N° de bus</div>
                {/* On s'assure que trajet.bus existe avant d'essayer d'afficher son numéro */}
                <div className="font-medium">{reservation.trajet.bus?.numero || 'N/A'}</div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-lg font-medium">Total payé</div>
              <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-600">
                {(reservation.trajet.prix * reservation.placesReservees).toLocaleString('fr-FR')} FCFA
              </div>
            </div>
            <div className="text-center mt-8 pt-6 border-t border-dashed border-gray-200 text-sm text-gray-500">
                <p>Présentez ce ticket (imprimé ou sur votre téléphone) à l'embarquement.</p>
                <p className="font-medium mt-1">MyBus vous souhaite un excellent voyage !</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <button onClick={handleDownloadTicket} disabled={downloading} className="px-8 py-3 rounded-full font-semibold text-white flex items-center justify-center gap-2 mx-auto transition bg-gradient-to-r from-pink-500 to-blue-600 hover:brightness-105 active:scale-95 disabled:bg-gray-400">
            {downloading ? <><FiLoader className="animate-spin" /> Génération...</> : <><FiDownload /> Télécharger le billet</>}
          </button>
          <Link to="/" className="block mt-4 text-blue-600 hover:underline">Retour à l'accueil</Link>
        </div>
      </div>
    </main>
  );
};

export default ConfirmationPage;