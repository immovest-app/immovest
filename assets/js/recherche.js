// ===== Onglet Recherche : grille de critères =====
// Générée depuis CONFIG.criteres. Chaque type de réponse a son contrôle :
// ouiNon → Oui / Non, choix → options, nombre → champ avec unité, note → 5 points,
// curseur → barre graduée (comme l'onglet Endettement), texte → remarque libre.
// Un critère peut avoir une bulle d'aide et des questions de suivi affichées à partir d'un seuil.

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

// Ligne d'un critère : libellé (+ bulle d'aide) à gauche, réponse à droite
function ligneCritere(item, cle, classe = "") {
    const aide = item.aide
        ? `<span class="help" tabindex="0" aria-label="Aide">?<span class="help__tip" role="tooltip">${item.aide}</span></span>`
        : "";
    return `<div class="criteria__row ${classe}" data-type="${item.type}" data-cle="${cle}">
        <span class="criteria__label"><label for="critere-${cle}">${item.label}</label>${aide}</span>
        ${controleCritere(item, "critere-" + cle)}
    </div>`;
}

// Retrouve la définition d'un critère à partir de sa clé : « groupe-item » ou « groupe-item-suivi »
function critere(cle) {
    const [g, i, q] = cle.split("-").map(Number);
    const item = CONFIG.criteres[g].items[i];
    return q === undefined ? item : item.suivi.questions[q];
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
                .map((item, i) => {
                    const suivi = item.suivi
                        ? `<div class="criteria__followup" data-parent="${g}-${i}" data-seuil="${item.suivi.seuil}" hidden>
                            ${item.suivi.questions.map((q, n) => ligneCritere(q, `${g}-${i}-${n}`, "criteria__row--sub")).join("")}
                        </div>`
                        : "";
                    return ligneCritere(item, `${g}-${i}`) + suivi;
                })
                .join("")}
        </div>`
        )
        .join("");
    majProgressionCriteres();
}

// Réponse d'une ligne : l'option choisie, la note (1 à 5), le nombre ou le texte ; null si vide
function reponseCritere(ligne) {
    const choix = ligne.querySelector(".choice__btn.active");
    if (choix) return choix.dataset.valeur;
    const note = ligne.querySelectorAll(".rating__dot.on").length;
    if (note) return note;
    const champ = ligne.querySelector("input");
    if (champ?.type === "range") return champ.dataset.touche ? Number(champ.value) : null; // non renseigné tant qu'on n'y a pas touché
    return champ && champ.value !== "" ? champ.value : null;
}

// Points (de 0 à 1) d'un critère selon sa règle ; null si le critère n'est pas noté
function pointsCritere(item, reponse) {
    if (item.type === "ouiNon" && item.bon) return reponse === item.bon ? 1 : 0;
    if (item.type === "choix" && item.points) return item.points[reponse] ?? 0;
    if (item.type === "note") return reponse ? reponse / 5 : 0;
    if (item.type === "curseur" && item.moinsMieux) return reponse === null ? 0 : 1 - (reponse - item.min) / (item.max - item.min);
    if (item.type === "nombre" && (item.min !== undefined || item.max !== undefined)) {
        if (reponse === null) return 0;
        const v = parseFloat(reponse);
        return (item.min === undefined || v >= item.min) && (item.max === undefined || v <= item.max) ? 1 : 0;
    }
    return null;
}

// Progression (critères renseignés) et score sur 100 (points obtenus ÷ critères notés, pondérés par l'importance).
// Les questions de suivi ne comptent que lorsqu'elles sont affichées.
function majProgressionCriteres() {
    // Questions de suivi : affichées à partir du seuil de leur critère
    document.querySelectorAll(".criteria__followup").forEach((bloc) => {
        const reponse = reponseCritere(document.querySelector(`.criteria__row[data-cle="${bloc.dataset.parent}"]`));
        bloc.hidden = !(reponse !== null && reponse >= Number(bloc.dataset.seuil));
    });

    let faits = 0, total = 0, points = 0, poids = 0;
    document.querySelectorAll(".criteria__row").forEach((ligne) => {
        if (ligne.closest("[hidden]")) return;
        total++;
        const item = critere(ligne.dataset.cle);
        const reponse = reponseCritere(ligne);
        if (reponse !== null) faits++;
        const p = pointsCritere(item, reponse);
        if (p !== null) {
            const importance = item.importance || 1;
            poids += importance;
            if (reponse !== null) points += p * importance;
        }
    });
    const score = poids ? Math.round((points / poids) * 100) : 0;
    document.getElementById("criteres-faits").textContent = faits;
    document.getElementById("criteres-total").textContent = total;
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
    grille.addEventListener("input", (e) => {
        if (e.target.type === "range") e.target.dataset.touche = "1"; // le curseur compte comme renseigné
        majProgressionCriteres();
    });
}
