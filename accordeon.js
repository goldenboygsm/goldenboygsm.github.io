// ==========================================================
// ACCORDÉON DES CATÉGORIES D'ACCESSOIRES
// Chaque bouton .category-toggle ouvre/ferme le bloc juste en dessous
// ==========================================================

const boutonsCategorie = document.querySelectorAll(".category-toggle");

boutonsCategorie.forEach(function (bouton) {

  bouton.addEventListener("click", function () {

    // Le contenu à afficher/cacher est l'élément juste après le bouton dans le HTML
    const contenu = bouton.nextElementSibling;

    // classList.toggle : ajoute la classe si elle n'y est pas, l'enlève si elle y est déjà
    // C'est plus court que de tester avec un if/else
    contenu.classList.toggle("open");
    bouton.classList.toggle("open");

  });

});

// Au chargement de la page, on ouvre automatiquement la première catégorie
// pour que l'utilisateur voie tout de suite qu'il y a du contenu à l'intérieur
if (boutonsCategorie.length > 0) {
  boutonsCategorie[0].click();
}
