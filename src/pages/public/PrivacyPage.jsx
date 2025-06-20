// src/pages/public/PrivacyPage.jsx
import React from 'react';
import LegalPageLayout from '../../layouts/LegalPageLayout'; // <-- Importer le layout

const PrivacyPage = () => {
  return (
    <LegalPageLayout title="Politique de Confidentialité" lastUpdated="24/05/2024">
        <h2>Introduction</h2>
        <p>La protection de vos données est une priorité pour MyBus. Cette politique détaille les informations que nous collectons et comment nous les utilisons pour vous offrir un service fiable et sécurisé.</p>

        <h2>1. Données Collectées</h2>
        <p>Nous collectons les données que vous nous fournissez pour :</p>
        <ul>
            <li><strong>La création de compte :</strong> Nom, prénom, e-mail, téléphone, mot de passe (haché).</li>
            <li><strong>Les réservations :</strong> Détails des trajets, noms des passagers.</li>
            <li><strong>L'envoi de colis :</strong> Informations sur l'expéditeur et le destinataire.</li>
        </ul>
        <p>Nous ne stockons jamais vos informations de paiement complètes.</p>

        <h2>2. Utilisation de vos données</h2>
        <p>Vos données sont essentielles pour :</p>
        <ul>
            <li>Gérer votre compte et traiter vos réservations.</li>
            <li>Vous envoyer des notifications de service (confirmation, suivi).</li>
            <li>Assurer le suivi en temps réel des bus et colis.</li>
            <li>Améliorer la sécurité et la performance de notre plateforme.</li>
        </ul>

        <h2>3. Partage des Données</h2>
        <p>Vos données ne sont partagées qu'avec les tiers indispensables au service :</p>
        <ul>
            <li>Les <strong>compagnies de transport</strong> pour l'exécution du voyage.</li>
            <li>Nos <strong>prestataires de paiement</strong> pour sécuriser les transactions.</li>
        </ul>
        <p>Nous ne vendons ni ne louons jamais vos données personnelles.</p>

        <h2>4. Sécurité et Vos Droits</h2>
        <p>Nous utilisons des mesures de sécurité robustes (HTTPS, hachage) pour protéger vos informations. Vous disposez d'un droit d'accès, de rectification et de suppression de vos données, que vous pouvez exercer en nous contactant à <strong>support@mybus.ml</strong>.</p>
    </LegalPageLayout>
  );
};

export default PrivacyPage;