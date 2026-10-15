// ===== Outils partagés : formats, lecture et affichage des valeurs =====

const formatEuro = new Intl.NumberFormat("fr-BE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const formatNombre = new Intl.NumberFormat("fr-BE", { maximumFractionDigits: 2 });
const formatPourcent = new Intl.NumberFormat("fr-BE", { style: "percent", maximumFractionDigits: 0 });

// Valeur numérique d'un champ (0 s'il est vide)
function valeur(id) {
    return parseFloat(document.getElementById(id).value) || 0;
}

// Écrit un montant en euros dans un élément
function afficher(id, montant) {
    document.getElementById(id).textContent = formatEuro.format(montant);
}

// Écrit un taux (ex. "4,25 %") dans un élément
function afficherTaux(id, taux) {
    document.getElementById(id).textContent = formatNombre.format(taux) + " %";
}

// Icône du sprite défini en haut d'index.html
function icone(nom) {
    return `<svg class="icon"><use href="#icon-${nom}"/></svg>`;
}
