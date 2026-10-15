// ==========================================================
// GESTION DU PANIER (localStorage)
// Ce fichier est partagé par TOUTES les pages qui touchent au panier :
// phones.html, accessoires.html (pour ajouter des produits)
// et panier.html (pour l'afficher / le modifier)
// ==========================================================

const CLE_PANIER = "telrepar_panier"; // clé utilisée dans localStorage

// -----------------------------------------
// Lire le panier depuis localStorage
// -----------------------------------------
function obtenirPanier() {
  const donnees = localStorage.getItem(CLE_PANIER);
  // Si rien n'est encore stocké, on retourne un tableau vide
  return donnees ? JSON.parse(donnees) : [];
}

// -----------------------------------------
// Sauvegarder le panier dans localStorage
// -----------------------------------------
function sauvegarderPanier(panier) {
  localStorage.setItem(CLE_PANIER, JSON.stringify(panier));
}

// -----------------------------------------
// Ajouter un produit au panier
// Si le produit existe déjà (même nom), on augmente juste sa quantité
// -----------------------------------------
function ajouterAuPanier(nom, prix) {
  const panier = obtenirPanier();

  // .find() cherche un élément qui correspond à la condition, sinon retourne undefined
  const produitExistant = panier.find(function (item) {
    return item.nom === nom;
  });

  if (produitExistant) {
    produitExistant.quantite += 1;
  } else {
    panier.push({ nom: nom, prix: prix, quantite: 1 });
  }

  sauvegarderPanier(panier);
  mettreAJourCompteurPanier();
}

// -----------------------------------------
// Met à jour la petite pastille du nombre d'articles dans le header (🛒 Panier (3))
// Appelée sur CHAQUE page au chargement, pour que le compteur soit toujours juste
// -----------------------------------------
function mettreAJourCompteurPanier() {
  const panier = obtenirPanier();
  const totalArticles = panier.reduce(function (somme, item) {
    return somme + item.quantite;
  }, 0);

  const lienPanier = document.querySelector(".cart-link");
  if (lienPanier) {
    lienPanier.textContent = "🛒 Panier" + (totalArticles > 0 ? " (" + totalArticles + ")" : "");
  }
}

// -----------------------------------------
// Attache l'événement "ajouter au panier" à tous les boutons produits de la page
// (utilisé sur phones.html et accessoires.html)
// -----------------------------------------
function initialiserBoutonsAjout() {
  const boutonsAjout = document.querySelectorAll("[data-add-to-cart]");

  boutonsAjout.forEach(function (bouton) {
    bouton.addEventListener("click", function () {
      const nom = bouton.getAttribute("data-nom");
      const prix = parseFloat(bouton.getAttribute("data-prix"));
      ajouterAuPanier(nom, prix);

      // Petit retour visuel pour confirmer l'ajout
      const texteOriginal = bouton.textContent;
      bouton.textContent = "Ajouté ✓";
      setTimeout(function () {
        bouton.textContent = texteOriginal;
      }, 1000);
    });
  });
}

// Ces deux fonctions tournent sur TOUTES les pages dès que le HTML est chargé
document.addEventListener("DOMContentLoaded", function () {
  mettreAJourCompteurPanier();
  initialiserBoutonsAjout();
});
