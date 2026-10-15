// ==========================================================
// ENVOI PAR WHATSAPP
// Les formulaires du site (rendez-vous, contact, commande) ne peuvent pas
// envoyer de message tout seuls (un site simple n'a pas de serveur).
// On ouvre donc WhatsApp avec le message déjà écrit : le client n'a plus
// qu'à appuyer sur "Envoyer" et vous le recevez directement.
// ==========================================================

const NUMERO_WHATSAPP = "2290166873347"; // indicatif pays + numéro, sans + ni espaces

function ouvrirWhatsApp(message) {
  const url = "https://wa.me/" + NUMERO_WHATSAPP + "?text=" + encodeURIComponent(message);
  // On tente d'ouvrir un nouvel onglet ; si le navigateur le bloque, on ouvre dans l'onglet actuel
  const fenetre = window.open(url, "_blank");
  if (!fenetre) {
    window.location.href = url;
  }
}
