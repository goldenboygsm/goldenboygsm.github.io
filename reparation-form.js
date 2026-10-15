// ==========================================================
// FORMULAIRE DE PRISE DE RENDEZ-VOUS
// Valide les champs, puis ouvre WhatsApp avec la demande déjà rédigée
// (nécessite js/whatsapp.js chargé avant ce fichier)
// ==========================================================

const formulaire = document.getElementById("rdv-form");
const messageSucces = document.getElementById("rdv-success");

// Date du jour au format AAAA-MM-JJ (heure locale, pas UTC)
function dateDuJour() {
  const d = new Date();
  const mois = String(d.getMonth() + 1).padStart(2, "0");
  const jour = String(d.getDate()).padStart(2, "0");
  return d.getFullYear() + "-" + mois + "-" + jour;
}

// Le calendrier n'autorise pas les dates passées
document.getElementById("date").min = dateDuJour();

formulaire.addEventListener("submit", function (evenement) {
  evenement.preventDefault();

  document.querySelectorAll("#rdv-form .error-message").forEach(function (span) {
    span.textContent = "";
  });

  let formulaireValide = true;

  const nom = document.getElementById("nom");
  if (nom.value.trim() === "") {
    document.getElementById("err-nom").textContent = "Veuillez indiquer votre nom.";
    formulaireValide = false;
  }

  const telephone = document.getElementById("telephone");
  const chiffresUniquement = telephone.value.replace(/\D/g, "");
  if (chiffresUniquement.length < 8) {
    document.getElementById("err-telephone").textContent = "Numéro de téléphone invalide (8 chiffres minimum).";
    formulaireValide = false;
  }

  const modele = document.getElementById("modele");
  if (modele.value.trim() === "") {
    document.getElementById("err-modele").textContent = "Veuillez indiquer le modèle de votre appareil.";
    formulaireValide = false;
  }

  const date = document.getElementById("date");
  if (date.value === "") {
    document.getElementById("err-date").textContent = "Veuillez choisir une date.";
    formulaireValide = false;
  } else if (date.value < dateDuJour()) {
    document.getElementById("err-date").textContent = "La date ne peut pas être dans le passé.";
    formulaireValide = false;
  }

  if (!formulaireValide) {
    messageSucces.textContent = "";
    return;
  }

  // Tout est valide : on prépare le message WhatsApp
  const panne = document.getElementById("panne");
  const description = document.getElementById("description").value.trim();

  const message =
    "*Demande de rendez-vous - Réparation*\n\n" +
    "Nom : " + nom.value.trim() + "\n" +
    "Téléphone : " + telephone.value.trim() + "\n" +
    "Appareil : " + modele.value.trim() + "\n" +
    "Panne : " + panne.options[panne.selectedIndex].text + "\n" +
    (description !== "" ? "Description : " + description + "\n" : "") +
    "Date souhaitée : " + date.value;

  messageSucces.textContent =
    "WhatsApp s'ouvre avec votre demande. Appuyez sur « Envoyer » pour la confirmer.";

  ouvrirWhatsApp(message);
  formulaire.reset();
});
