// ===== Onglet Recherche : grille de critères =====
// Générée depuis CONFIG.criteres. Chaque type de réponse a son contrôle :
// ouiNon → Oui / Non, choix → options, nombre → champ avec unité, note → 5 points, texte → remarque libre.

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
        case "note":
            return `<div class="rating" role="group">${[1, 2, 3, 4, 5]
                .map((n) => `<button type="button" class="rating__dot" data-valeur="${n}" aria-label="${n} sur 5"></button>`)
                .join("")}</div>`;
        default:
            return `<input type="text" class="criteria__text" id="${id}" placeholder="Ajouter une remarque…">`;
    }
}

function rendreCriteres() {
    const grille = document.getElementById("criteres");
    grille.innerHTML = CONFIG.criteres
        .map(
            (groupe, g) => `<div class="criteria__group">
            <div class="input-tile__head">
                <span class="input-tile__icon">${icone(groupe.icone)}</span>
                <span>${groupe.theme}</span>
            </div>
            ${groupe.items
                .map(
                    (item, i) => `<div class="criteria__row" data-type="${item.type}" data-groupe="${g}" data-item="${i}">
                <label class="criteria__label" for="critere-${g}-${i}">${item.label}</label>
                ${controleCritere(item, `critere-${g}-${i}`)}
            </div>`
                )
                .join("")}
        </div>`
        )
        .join("");
    document.getElementById("criteres-total").textContent = grille.querySelectorAll(".criteria__row").length;
    majProgressionCriteres();
}

// Réponse d'une ligne : l'option choisie, la note (1 à 5), le nombre ou le texte ; null si vide
function reponseCritere(ligne) {
    const choix = ligne.querySelector(".choice__btn.active");
    if (choix) return choix.dataset.valeur;
    const note = ligne.querySelectorAll(".rating__dot.on").length;
    if (note) return note;
    const champ = ligne.querySelector("input");
    return champ && champ.value !== "" ? champ.value : null;
}

// Points (de 0 à 1) d'un critère selon sa règle ; null si le critère n'est pas noté
function pointsCritere(item, reponse) {
    if (item.type === "ouiNon" && item.bon) return reponse === item.bon ? 1 : 0;
    if (item.type === "choix" && item.points) return item.points[reponse] ?? 0;
    if (item.type === "note") return reponse ? reponse / 5 : 0;
    if (item.type === "nombre" && (item.min !== undefined || item.max !== undefined)) {
        if (reponse === null) return 0;
        const v = parseFloat(reponse);
        return (item.min === undefined || v >= item.min) && (item.max === undefined || v <= item.max) ? 1 : 0;
    }
    return null;
}

// Progression (critères renseignés) et score sur 100 (points obtenus ÷ critères notés)
function majProgressionCriteres() {
    let faits = 0, points = 0, notes = 0;
    document.querySelectorAll(".criteria__row").forEach((ligne) => {
        const item = CONFIG.criteres[ligne.dataset.groupe].items[ligne.dataset.item];
        const reponse = reponseCritere(ligne);
        if (reponse !== null) faits++;
        const p = pointsCritere(item, reponse);
        if (p !== null) {
            notes++;
            if (reponse !== null) points += p;
        }
    });
    const score = notes ? Math.round((points / notes) * 100) : 0;
    document.getElementById("criteres-faits").textContent = faits;
    document.getElementById("criteres-score").textContent = score;
    document.getElementById("criteres-barre").style.setProperty("--part", score / 100);
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
            const n = Number(bouton.dataset.valeur);
            const actuelle = groupe.querySelectorAll(".rating__dot.on").length;
            groupe.querySelectorAll(".rating__dot").forEach((d, i) => d.classList.toggle("on", n !== actuelle && i < n));
        }
        majProgressionCriteres();
    });
    grille.addEventListener("input", majProgressionCriteres);
}
