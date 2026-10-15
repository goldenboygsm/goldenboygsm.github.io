// ==========================================================
// FILTRE DE PRODUITS PAR CATÉGORIE
// ==========================================================

// 1. On récupère TOUS les boutons de filtre (il y en a 4 : Tous, Classiques, Incassables, Reconditionnés)
const boutonsFiltre = document.querySelectorAll(".filter-btn");

// 2. On récupère TOUTES les cartes produits affichées sur la page
const cartesProduits = document.querySelectorAll(".product-card");

// 3. Pour CHAQUE bouton, on ajoute un écouteur d'événement "click"
boutonsFiltre.forEach(function (bouton) {

  bouton.addEventListener("click", function () {

    // 3a. On lit la catégorie choisie, stockée dans l'attribut data-filter du bouton cliqué
    const categorieChoisie = bouton.getAttribute("data-filter");

    // 3b. On met à jour l'apparence des boutons : un seul actif à la fois
    boutonsFiltre.forEach(function (b) {
      b.classList.remove("active");
    });
    bouton.classList.add("active");

    // 3c. On parcourt chaque carte produit pour décider si on l'affiche ou pas
    cartesProduits.forEach(function (carte) {
      const categorieCarte = carte.getAttribute("data-category");

      // Si on a cliqué "Tous" OU si la catégorie de la carte correspond au filtre choisi -> on affiche
      if (categorieChoisie === "tous" || categorieCarte === categorieChoisie) {
        carte.style.display = "block";
      } else {
        carte.style.display = "none";
      }
    });

  });

});
