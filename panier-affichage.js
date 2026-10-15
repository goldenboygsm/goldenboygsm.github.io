// ==========================================================
// AFFICHAGE ET GESTION DE LA PAGE PANIER
// Nécessite js/panier.js et js/whatsapp.js chargés AVANT ce fichier
// ==========================================================

const corpsTableau = document.getElementById("panier-corps");
const tableauPanier = document.getElementById("panier-table");
const messageVide = document.getElementById("panier-vide");
const blocTotal = document.getElementById("panier-total-bloc");
const totalTexte = document.getElementById("panier-total");
const sectionCommande = document.getElementById("commande-section");
const boutonVider = document.getElementById("vider-panier");

// Formatte un nombre en "12 000 FCFA" (pour l'affichage)
function formaterPrix(nombre) {
  return nombre.toLocaleString("fr-FR") + " FCFA";
}

// Même chose avec des espaces normaux (pour le message WhatsApp)
function prixPourMessage(nombre) {
  return formaterPrix(nombre).replace(/[\u202f\u00a0]/g, " ");
}

// Empêche qu'un nom de produit contienne du code HTML
function echapperHtml(texte) {
  return String(texte)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// -----------------------------------------
// Reconstruit tout l'affichage du panier à partir de localStorage
// -----------------------------------------
function afficherPanier() {
  const panier = obtenirPanier();

  corpsTableau.innerHTML = "";

  // Panier vide : on cache tableau, total, bouton "vider" et formulaire de commande
  if (panier.length === 0) {
    tableauPanier.style.display = "none";
    blocTotal.style.display = "none";
    sectionCommande.style.display = "none";
    if (boutonVider) boutonVider.style.display = "none";
    messageVide.style.display = "block";
    return;
  }

  tableauPanier.style.display = "table";
  blocTotal.style.display = "flex";
  sectionCommande.style.display = "block";
  if (boutonVider) boutonVider.style.display = "block";
  messageVide.style.display = "none";

  let total = 0;

  panier.forEach(function (produit, index) {
    const sousTotal = produit.prix * produit.quantite;
    total += sousTotal;

    const ligne = document.createElement("tr");

    ligne.innerHTML = `
      <td>${echapperHtml(produit.nom)}</td>
      <td>${formaterPrix(produit.prix)}</td>
      <td>
        <div class="quantite-controle">
          <button class="qty-btn" data-action="moins" data-index="${index}">-</button>
          <span>${produit.quantite}</span>
          <button class="qty-btn" data-action="plus" data-index="${index}">+</button>
        </div>
      </td>
      <td>${formaterPrix(sousTotal)}</td>
      <td><button class="remove-btn" data-index="${index}" aria-label="Retirer du panier">✕</button></td>
    `;

    corpsTableau.appendChild(ligne);
  });

  totalTexte.textContent = formaterPrix(total);

  attacherEvenementsLignes();
}

// -----------------------------------------
// Clics sur les boutons +, - et supprimer (à rattacher après chaque affichage)
// -----------------------------------------
function attacherEvenementsLignes() {

  document.querySelectorAll(".qty-btn").forEach(function (bouton) {
    bouton.addEventListener("click", function () {
      const index = parseInt(bouton.getAttribute("data-index"));
      const action = bouton.getAttribute("data-action");
      const panier = obtenirPanier();

      if (action === "plus") {
        panier[index].quantite += 1;
      } else if (action === "moins") {
        panier[index].quantite -= 1;
        if (panier[index].quantite <= 0) {
          panier.splice(index, 1);
        }
      }

      sauvegarderPanier(panier);
      mettreAJourCompteurPanier();
      afficherPanier();
    });
  });

  document.querySelectorAll(".remove-btn").forEach(function (bouton) {
    bouton.addEventListener("click", function () {
      const index = parseInt(bouton.getAttribute("data-index"));
      const panier = obtenirPanier();
      panier.splice(index, 1);
      sauvegarderPanier(panier);
      mettreAJourCompteurPanier();
      afficherPanier();
    });
  });

}

// -----------------------------------------
// Bouton "Vider le panier"
// -----------------------------------------
if (boutonVider) {
  boutonVider.addEventListener("click", function () {
    if (confirm("Voulez-vous vraiment vider votre panier ?")) {
      sauvegarderPanier([]);
      mettreAJourCompteurPanier();
      afficherPanier();
    }
  });
}

// -----------------------------------------
// Validation du formulaire, puis envoi de la commande par WhatsApp
// -----------------------------------------
const formulaireCommande = document.getElementById("commande-form");

formulaireCommande.addEventListener("submit", function (evenement) {
  evenement.preventDefault();

  document.querySelectorAll("#commande-form .error-message").forEach(function (span) {
    span.textContent = "";
  });

  let valide = true;

  const nom = document.getElementById("cmd-nom");
  if (nom.value.trim() === "") {
    document.getElementById("err-cmd-nom").textContent = "Veuillez indiquer votre nom.";
    valide = false;
  }

  const adresse = document.getElementById("cmd-adresse");
  if (adresse.value.trim() === "") {
    document.getElementById("err-cmd-adresse").textContent = "Veuillez indiquer une adresse de livraison.";
    valide = false;
  }

  const telephone = document.getElementById("cmd-telephone");
  const chiffres = telephone.value.replace(/\D/g, "");
  if (chiffres.length < 8) {
    document.getElementById("err-cmd-telephone").textContent = "Numéro de téléphone invalide.";
    valide = false;
  }

  if (!valide) {
    document.getElementById("commande-success").textContent = "";
    return;
  }

  // Construction du récapitulatif de la commande
  const panier = obtenirPanier();
  if (panier.length === 0) {
    return;
  }

  let total = 0;
  let lignes = "";
  panier.forEach(function (produit) {
    const sousTotal = produit.prix * produit.quantite;
    total += sousTotal;
    lignes += "- " + produit.nom + " x" + produit.quantite + " = " + prixPourMessage(sousTotal) + "\n";
  });

  const paiement = document.getElementById("cmd-paiement");

  const message =
    "*Nouvelle commande - GOLDENBOY GSM*\n\n" +
    "Produits :\n" + lignes + "\n" +
    "*Total : " + prixPourMessage(total) + "*\n\n" +
    "Nom : " + nom.value.trim() + "\n" +
    "Adresse de livraison : " + adresse.value.trim() + "\n" +
    "Téléphone : " + telephone.value.trim() + "\n" +
    "Paiement : " + paiement.options[paiement.selectedIndex].text;

  document.getElementById("commande-success").textContent =
    "WhatsApp s'ouvre avec le récapitulatif de votre commande. Appuyez sur « Envoyer » pour la confirmer. " +
    "Votre panier est conservé : vous pouvez le vider avec le bouton ci-dessus une fois la commande envoyée.";

  ouvrirWhatsApp(message);
});

// Au chargement de la page panier, on affiche tout de suite le contenu
document.addEventListener("DOMContentLoaded", afficherPanier);
