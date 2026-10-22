// ===== Onglet Recherche : grille de critères =====
// Générée depuis CONFIG.criteres (config.js). Chaque type de réponse a son contrôle :
// ouiNon → Oui / Non, note → 5 points, curseur → barre graduée, choix → options, nombre → champ, texte → remarque.

const NUMEROS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

function controleCritere(item, id) {
    const options = (liste) =>
        `<div class="choice" role="group">${liste
            .map((o) => `<button type="button" class="choice__btn" data-valeur="${o}">${o}</button>`)
            .join("")}</div>`;
    switch (item.type) {
        case "ouiNon":
            return options(["Oui", "Non"]);
        case "choix":
            return options(item.options);
        case "nombre":
            return `<div class="field__input field__input--small">
                <input type="number" id="${id}" min="0" placeholder="—">
                <span class="field__unit">${item.unite || ""}</span>
            </div>`;
        case "curseur":
            return `<div class="slider criteria__slider">
                <input type="range" id="${id}" min="${item.min}" max="${item.max}" step="${item.pas}" value="${item.min}"
                    data-unite="${item.unite}" data-unite-pluriel="${item.unitePluriel || ""}">
                <span class="slider__thumb"></span>
            </div>`;
        case "note":
            return `<div class="rating" role="group">${[1, 2, 3, 4, 5]
                .map((n) => `<button type="button" class="rating__dot" data-valeur="${n}" aria-label="${n} sur 5"></button>`)
                .join("")}</div>`;
        default:
            return `<input type="text" class="criteria__text" id="${id}" placeholder="Ajouter une remarque…">`;
    }
}

// Ligne d'un critère : la question (+ bulle « pourquoi ? ») à gauche, la réponse à droite
function ligneCritere(item, cle) {
    const aide = item.aide
        ? `<span class="help" tabindex="0" aria-label="Pourquoi ?">?<span class="help__tip" role="tooltip">${item.aide}</span></span>`
        : "";
    return `<div class="criteria__row" data-cle="${cle}">
        <span class="criteria__label"><label for="critere-${cle}">${item.label}</label>${aide}</span>
        ${controleCritere(item, "critere-" + cle)}
    </div>`;
}

// Définition d'un critère à partir de sa clé « thème-critère »
function critere(cle) {
    const [g, i] = cle.split("-").map(Number);
    return CONFIG.criteres[g].items[i];
}

function rendreCriteres() {
    document.getElementById("criteres").innerHTML = CONFIG.criteres
        .map(
            (groupe, g) => `<div class="criteria__group">
            <h3 class="criteria__theme"><span class="criteria__num">${NUMEROS[g]}</span>${groupe.theme}</h3>
            ${groupe.items.map((item, i) => ligneCritere(item, `${g}-${i}`)).join("")}
        </div>`
        )
        .join("");
    majScoreCriteres();
}

// Réponse d'une ligne : l'option choisie, la note (1 à 5), la valeur du curseur… ; null si pas encore répondu
function reponseCritere(ligne) {
    const choix = ligne.querySelector(".choice__btn.active");
    if (choix) return choix.dataset.valeur;
    const note = ligne.querySelectorAll(".rating__dot.on").length;
    if (note) return note;
    const champ = ligne.querySelector("input");
    if (champ?.type === "range") return champ.dataset.touche ? Number(champ.value) : null; // non répondu tant qu'on n'y a pas touché
    return champ && champ.value !== "" ? champ.value : null;
}

// Effet d'une réponse sur le score, de −1 (mauvais) à +1 (bon) ; null si le critère ne compte pas
const EFFET_NOTE = [-1, -0.5, 0, 0.5, 1];
function effetCritere(item, reponse) {
    if (item.type === "ouiNon" && item.bon) return reponse === null ? 0 : reponse === item.bon ? 1 : -1;
    if (item.type === "note") return reponse === null ? 0 : EFFET_NOTE[reponse - 1];
    if (item.type === "curseur" && item.moinsMieux) return reponse === null ? 0 : 1 - (2 * (reponse - item.min)) / (item.max - item.min);
    if (item.type === "choix" && item.points) return reponse === null ? 0 : 2 * (item.points[reponse] ?? 0) - 1;
    if (item.type === "nombre" && (item.min !== undefined || item.max !== undefined)) {
        if (reponse === null) return 0;
        const v = parseFloat(reponse);
        return (item.min === undefined || v >= item.min) && (item.max === undefined || v <= item.max) ? 1 : -1;
    }
    return null;
}

// Score indicatif : 50 + 50 × (effets pondérés ÷ importance totale) → 0 si tout est mauvais, 100 si tout est bon
function majScoreCriteres() {
    let repondus = 0, total = 0, somme = 0, poids = 0;
    document.querySelectorAll(".criteria__row").forEach((ligne) => {
        total++;
        const item = critere(ligne.dataset.cle);
        const reponse = reponseCritere(ligne);
        ligne.classList.toggle("is-answered", reponse !== null);
        if (reponse !== null) repondus++;
        const effet = effetCritere(item, reponse);
        if (effet !== null) {
            const importance = item.importance || 1;
            poids += importance;
            somme += effet * importance;
        }
    });
    const score = Math.round(50 + (poids ? (50 * somme) / poids : 0));
    document.getElementById("criteres-faits").textContent = repondus;
    document.getElementById("criteres-total").textContent = total;
    document.getElementById("criteres-score").textContent = score;
    // Anneau : la partie colorée du cercle (longueur 2π × 52) correspond au score
    const longueur = 2 * Math.PI * 52;
    document.getElementById("criteres-anneau").style.strokeDashoffset = longueur * (1 - score / 100);
}

function activerCriteres() {
    const grille = document.getElementById("criteres");
    grille.addEventListener("click", (e) => {
        const bouton = e.target.closest(".choice__btn, .rating__dot");
        if (!bouton) return;
        const groupe = bouton.parentElement;
        if (bouton.classList.contains("choice__btn")) {
            // Un seul choix actif ; un second clic le retire
            const etaitActif = bouton.classList.contains("active");
            groupe.querySelectorAll(".choice__btn").forEach((b) => b.classList.remove("active"));
            if (!etaitActif) bouton.classList.add("active");
        } else {
            // Note : un clic sur la note déjà choisie la retire
            const n = Number(bouton.dataset.valeur);
            const actuelle = groupe.querySelectorAll(".rating__dot.on").length;
            groupe.querySelectorAll(".rating__dot").forEach((d, i) => d.classList.toggle("on", n !== actuelle && i < n));
        }
        majScoreCriteres();
    });
    grille.addEventListener("input", (e) => {
        if (e.target.type === "range") e.target.dataset.touche = "1"; // le curseur compte comme répondu
        majScoreCriteres();
    });
}
