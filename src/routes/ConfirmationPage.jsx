import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FiCheck, FiDownload, FiCalendar, FiClock, FiMapPin, FiUser, FiLoader } from 'react-icons/fi';
import { FaTicketAlt, FaBus } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const API_BASE = 'https://mybusback.onrender.com';

export default function ConfirmationPage() {
  const { id: reservationId } = useParams();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const ticketRef = useRef(null);

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/api/reservations/${reservationId}`);
        setReservation(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Impossible de récupérer les détails de la réservation');
      } finally {
        setLoading(false);
      }
    };

    fetchReservation();
  }, [reservationId]);

 const handleDownloadTicket = async () => {
  setDownloading(true);
  
  try {
    const pdf = new jsPDF();
    
    // Définir les styles de base
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(24);
    pdf.setTextColor(59, 130, 246); // Bleu
    
    // Titre
    pdf.text('MyBus - Billet de voyage', 105, 20, { align: 'center' });
    
    // Informations sur la réservation
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    
    pdf.text(`Réservation: ${reservationId}`, 20, 40);
    pdf.text(`De: ${reservation.trajet.villeDepart} - À: ${reservation.trajet.villeArrivee}`, 20, 50);
    pdf.text(`Date: ${formattedDate}`, 20, 60);
    pdf.text(`Heure de départ: ${reservation.trajet.heureDepart}`, 20, 70);
    
    // Informations passager
    pdf.setFont('helvetica', 'bold');
    pdf.text('Informations passager:', 20, 90);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Nom & Prénom: ${reservation.client.nom} ${reservation.client.prenom}`, 20, 100);
    pdf.text(`Contact: ${reservation.client.email}`, 20, 110);
    pdf.text(`Téléphone: ${reservation.client.telephone}`, 20, 120);
    
    // Autres détails
    pdf.text(`Compagnie: ${reservation.trajet.compagnie}`, 20, 140);
    pdf.text(`N° de bus: ${reservation.trajet.bus?.numero || 'N/A'}`, 20, 150);
    pdf.text(`Places: ${reservation.placesReservees} place(s)`, 20, 160);
    
    // Total
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.setTextColor(59, 130, 246); // Bleu
    pdf.text(`Total: ${(reservation.trajet.prix * reservation.placesReservees).toLocaleString('fr-FR')} FCFA`, 20, 180);
    
    // Pied de page
    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(12);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Présentez ce ticket labas', 105, 230, { align: 'center' });
    pdf.text('MyBus vous souhaite un excellent voyage', 105, 240, { align: 'center' });
    
    pdf.save(`MyBus-Ticket-${reservationId}.pdf`);
  } catch (err) {
    console.error('Error generating PDF:', err);
  } finally {
    setDownloading(false);
  }
};

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-indigo-50">
          <FiLoader className="text-5xl text-pink-500 animate-spin mb-4" />
          <p className="text-lg text-gray-700">Chargement de votre réservation...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !reservation) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-indigo-50 px-4">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
            <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <FiCheck className="text-4xl text-red-500" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Une erreur s'est produite</h1>
            <p className="text-gray-600 mb-6">{error || "Réservation introuvable"}</p>
            <Link
              to="/"
              className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-blue-600 text-white font-semibold hover:opacity-90 transition"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Format date
  const formattedDate = new Date(reservation.trajet.dateDepart).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <>
      <Navbar />
      <main className="py-16 px-4 min-h-screen bg-gradient-to-br from-white to-indigo-50">
        <div className="max-w-4xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-12">
            <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <FiCheck className="text-4xl text-green-500" />
            </div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-pink-500 to-blue-600 bg-clip-text text-transparent">
              Réservation confirmée !
            </h1>
            <p className="text-gray-600">
              Votre réservation a été effectuée avec succès. Vous pouvez télécharger votre billet ci-dessous.
            </p>
          </div>

          {/* Ticket */}
          <div className="mb-12">
            <div
              ref={ticketRef}
              className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 relative mx-auto max-w-2xl"
            >
              {/* Ticket header */}
              <div className="bg-gradient-to-r from-pink-500 to-blue-600 py-6 px-8 text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold">MyBus</h2>
                    <p className="text-sm font-medium opacity-90">E-Ticket de voyage</p>
                  </div>
                  <FaTicketAlt className="text-4xl opacity-80" />
                </div>
              </div>
              
              {/* Ticket body */}
              <div className="p-8">
                {/* Divider with perforation */}
                <div className="border-t-2 border-dashed border-gray-200 relative -mx-8 mb-8">
                  <div className="absolute -left-3 -top-2.5 h-5 w-5 rounded-full bg-indigo-50"></div>
                  <div className="absolute -right-3 -top-2.5 h-5 w-5 rounded-full bg-indigo-50"></div>
                </div>
                
                {/* Reservation ID */}
                <div className="mb-6 text-center">
                  <span className="text-sm text-gray-500">Réservation</span>
                  <h3 className="text-xl font-bold text-gray-800">{reservationId}</h3>
                </div>
                
                {/* Journey details */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
                  <div className="mb-4 sm:mb-0">
                    <div className="text-sm text-gray-500 mb-1">Départ</div>
                    <div className="text-2xl font-bold text-gray-800">{reservation.trajet.villeDepart}</div>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <FaBus className="text-3xl text-blue-500 mb-2" />
                    <div className="w-24 h-0.5 bg-gradient-to-r from-pink-500 to-blue-600"></div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Arrivée</div>
                    <div className="text-2xl font-bold text-gray-800">{reservation.trajet.villeArrivee}</div>
                  </div>
                </div>
                
                {/* Time and date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-pink-100 rounded-full p-3 mr-4">
                      <FiCalendar className="text-lg text-pink-500" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Date</div>
                      <div className="font-medium">{formattedDate}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-100 rounded-full p-3 mr-4">
                      <FiClock className="text-lg text-blue-500" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Heure de départ</div>
                      <div className="font-medium">{reservation.trajet.heureDepart}</div>
                    </div>
                  </div>
                </div>
                
                {/* Passenger info */}
                <div className="mb-8">
                  <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3">
                    <FiUser />
                    <span>Informations passager</span>
                  </h4>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Nom & Prénom</div>
                        <div className="font-medium">{reservation.client.nom} {reservation.client.prenom}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Contact</div>
                        <div className="font-medium">{reservation.client.email}</div>
                        <div className="font-medium">{reservation.client.telephone}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Journey details bottom section */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <div>
                    <div className="text-sm text-gray-500">Compagnie</div>
                    <div className="font-medium">{reservation.trajet.compagnie}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">N° de bus</div>
                    <div className="font-medium">{reservation.trajet.bus?.numero || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Places</div>
                    <div className="font-medium">{reservation.placesReservees} place(s)</div>
                  </div>
                </div>
                
                {/* Price */}
                <div className="flex justify-between items-center mb-6">
                  <div className="text-lg font-medium">Total</div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-blue-600 bg-clip-text text-transparent">
                    {(reservation.trajet.prix * reservation.placesReservees).toLocaleString('fr-FR')} FCFA
                  </div>
                </div>
                
                {/* Bottom divider with perforation */}
                <div className="border-t-2 border-dashed border-gray-200 relative -mx-8 mt-8">
                  <div className="absolute -left-3 -top-2.5 h-5 w-5 rounded-full bg-indigo-50"></div>
                  <div className="absolute -right-3 -top-2.5 h-5 w-5 rounded-full bg-indigo-50"></div>
                </div>
                
                {/* Footer */}
                <div className="text-center mt-8 text-sm text-gray-500">
                  <p>Présentez ce ticket à l'embarquement</p>
                  <p className="font-medium mt-1">MyBus vous souhaite un excellent voyage</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Download Button */}
          <div className="text-center">
            <button
              onClick={handleDownloadTicket}
              disabled={downloading}
              className={`px-8 py-3 rounded-full font-semibold text-white flex items-center justify-center gap-2 mx-auto transition ${
                downloading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-pink-500 to-blue-600 hover:brightness-105 active:scale-95'
              }`}
            >
              {downloading ? (
                <>
                  <FiLoader className="animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <FiDownload />
                  Télécharger mon billet
                </>
              )}
            </button>
            
            <Link to="/" className="block mt-4 text-blue-600 hover:underline">
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
