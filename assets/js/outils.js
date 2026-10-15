// ===== Outils partagés : formats, lecture et affichage des valeurs =====

// Langue courante ("fr" ou "en") ; changée par langue.js
let LANGUE = "fr";

// Texte traduit : la version anglaise de TRADUCTIONS si elle existe, sinon le texte français donné
function t(cle, francais) {
    return (LANGUE !== "fr" && TRADUCTIONS[LANGUE]?.[cle]) || francais;
}

// Formats des nombres, adaptés à la langue (1 560 € / €1,560)
let formatEuro, formatNombre, formatPourcent, formatTaux;
function definirFormats() {
    const locale = LANGUE === "en" ? "en-GB" : "fr-BE";
    formatEuro = new Intl.NumberFormat(locale, { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
    formatNombre = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 });
    formatPourcent = new Intl.NumberFormat(locale, { style: "percent", maximumFractionDigits: 0 });
    // Taux donné en pourcentage (4.25 → « 4,25 % » / « 4.25% »)
    const pourcent = new Intl.NumberFormat(locale, { style: "percent", maximumFractionDigits: 2 });
    formatTaux = { format: (v) => pourcent.format(v / 100) };
}
definirFormats();

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
    document.getElementById(id).textContent = formatTaux.format(taux);
}

// Icône du sprite défini en haut d'index.html
function icone(nom) {
    return `<svg class="icon"><use href="#icon-${nom}"/></svg>`;
}
