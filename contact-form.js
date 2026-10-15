// ==========================================================
// FORMULAIRE DE CONTACT
// Valide les champs, puis ouvre WhatsApp avec le message déjà rédigé
// (nécessite js/whatsapp.js chargé avant ce fichier)
// ==========================================================

const formulaireContact = document.getElementById("contact-form");

formulaireContact.addEventListener("submit", function (evenement) {
  evenement.preventDefault();

  document.querySelectorAll("#contact-form .error-message").forEach(function (span) {
    span.textContent = "";
  });

  let valide = true;

  const nom = document.getElementById("c-nom");
  if (nom.value.trim() === "") {
    document.getElementById("err-c-nom").textContent = "Veuillez indiquer votre nom.";
    valide = false;
  }

  const email = document.getElementById("c-email");
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexEmail.test(email.value.trim())) {
    document.getElementById("err-c-email").textContent = "Veuillez indiquer un email valide.";
    valide = false;
  }

  const message = document.getElementById("c-message");
  if (message.value.trim().length < 10) {
    document.getElementById("err-c-message").textContent = "Votre message doit contenir au moins 10 caractères.";
    valide = false;
  }

  if (!valide) {
    document.getElementById("contact-success").textContent = "";
    return;
  }

  const sujet = document.getElementById("c-sujet");

  const texte =
    "*Message depuis le site - " + sujet.options[sujet.selectedIndex].text + "*\n\n" +
    "Nom : " + nom.value.trim() + "\n" +
    "Email : " + email.value.trim() + "\n\n" +
    message.value.trim();

  document.getElementById("contact-success").textContent =
    "WhatsApp s'ouvre avec votre message. Appuyez sur « Envoyer » pour nous le transmettre.";

  ouvrirWhatsApp(texte);
  formulaireContact.reset();
});
