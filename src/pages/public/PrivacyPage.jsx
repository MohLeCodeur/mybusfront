// src/pages/public/PrivacyPage.jsx

import React from 'react';

const PrivacyPage = () => {
  return (
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto prose prose-lg prose-blue">
        <h1>Politique de Confidentialité</h1>
        <p className="text-sm text-gray-500">Dernière mise à jour : 24/05/2024</p>
        
        <h2>Introduction</h2>
        <p>La protection de votre vie privée est une priorité pour MyBus. Cette politique de confidentialité explique quelles données nous collectons, comment nous les utilisons et les droits dont vous disposez concernant vos informations personnelles dans le cadre de l'utilisation de notre application de gestion de transport.</p>

        <h2>1. Données que nous collectons</h2>
        <p>Nous collectons plusieurs types de données pour fournir et améliorer nos services :</p>
        <ul>
            <li><strong>Informations de compte :</strong> Lors de votre inscription, nous collectons votre nom, prénom, adresse e-mail, numéro de téléphone et mot de passe (haché).</li>
            <li><strong>Informations de réservation et de colis :</strong> Nous enregistrons les détails de vos trajets (villes de départ/arrivée, dates), les informations sur les passagers que vous fournissez, ainsi que les informations sur l'expéditeur et le destinataire des colis.</li>
            <li><strong>Données de paiement :</strong> Nous ne stockons PAS vos informations de paiement (numéro de carte, code Orange Money). Ces données sont traitées directement et de manière sécurisée par notre partenaire de paiement, VitePay. Nous ne conservons qu'une référence de la transaction (ID de paiement, statut).</li>
            <li><strong>Données de géolocalisation :</strong> Nous collectons les données de position GPS des bus pour permettre le suivi en temps réel.</li>
        </ul>

        <h2>2. Comment nous utilisons vos données</h2>
        <p>Vos données sont utilisées pour :</p>
        <ul>
            <li>Gérer votre compte et vous authentifier.</li>
            <li>Traiter vos réservations de billets et vos enregistrements de colis.</li>
            <li>Vous permettre de suivre vos bus et colis.</li>
            <li>Vous envoyer des notifications importantes relatives à vos trajets ou colis (confirmation, mise à jour de statut, etc.) par e-mail ou via des notifications push.</li>
            <li>Améliorer la sécurité et la performance de notre application.</li>
            <li>Répondre à vos demandes auprès du service client.</li>
        </ul>

        <h2>3. Partage de vos données</h2>
        <p>Nous ne vendons ni ne louons vos données personnelles à des tiers. Vos données peuvent être partagées uniquement dans les cas suivants :</p>
        <ul>
            <li><strong>Avec les compagnies de transport :</strong> Nous partageons les informations nécessaires (noms des passagers, détails des colis) avec la compagnie de transport concernée pour qu'elle puisse honorer le service.</li>
            <li><strong>Avec les prestataires de services :</strong> Nous faisons appel à des tiers pour le traitement des paiements (VitePay) ou l'envoi de notifications. Ils n'ont accès qu'aux données strictement nécessaires à l'exécution de leur mission.</li>
            <li><strong>Pour des raisons légales :</strong> Si la loi l'exige ou pour répondre à une procédure judiciaire valide.</li>
        </ul>

        <h2>4. Sécurité de vos données</h2>
        <p>Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données contre l'accès non autorisé, la perte ou la destruction. Cela inclut le hachage des mots de passe et l'utilisation de connexions sécurisées (HTTPS).</p>

        <h2>5. Vos droits</h2>
        <p>Conformément à la réglementation, vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles. Vous pouvez exercer ces droits en nous contactant à l'adresse suivante : support@mybus.ml. Vous pouvez modifier la plupart de vos informations directement depuis votre espace "Mon Compte".</p>

        <h2>6. Modifications de cette politique</h2>
        <p>Nous pouvons mettre à jour cette politique de confidentialité périodiquement. Nous vous informerons de tout changement majeur. Nous vous encourageons à consulter cette page régulièrement.</p>
      </div>
    </div>
  );
};

export default PrivacyPage;