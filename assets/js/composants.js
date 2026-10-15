// ===== Composants générés depuis CONFIG =====
// Dans index.html : <div data-champ="cle"></div>, <div data-curseur="cle"></div> ou
// <div data-entete="cle"></div> sont remplacés par le HTML complet du composant.
// data-id="…" donne l'id du champ (par défaut : la clé).

function bulleAide(cle) {
    const aide = CONFIG.aides[cle];
    if (!aide) return "";
    return `<span class="help" tabindex="0" aria-label="Aide" data-i18n-aria="commun.aide">?
        <span class="help__tip" role="tooltip">
            <span data-i18n="aides.${cle}">${aide.texte}</span>
            ${aide.source ? `<a href="${aide.source.url}" target="_blank" rel="noopener"><span data-i18n="commun.source">Source :</span> ${aide.source.nom}</a>` : ""}
        </span>
    </span>`;
}

// Icône + libellé (+ bulle d'aide) en tête de colonne ; cleTexte = clé de traduction du libellé
function enTete({ icone: nom, label, aide }, cleTexte, pourId) {
    const attr = `data-i18n="${cleTexte}"`;
    const titre = pourId ? `<label for="${pourId}" ${attr}>${label}</label>` : `<span ${attr}>${label}</span>`;
    return `<div class="input-tile__head">
        <span class="input-tile__icon">${icone(nom)}</span>
        ${titre}
        ${bulleAide(aide)}
    </div>`;
}

// Champ montant ; « retenu » ajoute le montant pondéré en discret à côté du chiffre encodé
function champ(cle, id) {
    const c = CONFIG.champs[cle];
    const valeurDefaut = c.defaut ? ` value="${c.defaut}"` : "";
    return enTete(c, "champs." + cle, id) + `
    <div class="field__input${c.retenu ? " field__input--retained" : ""}">
        <input type="number" id="${id}" min="0" step="${c.pas}" placeholder="0"${valeurDefaut}>
        ${c.retenu ? `<span class="field__retained" id="${id}-retenu"></span>` : ""}
        <span class="field__unit" data-i18n="unite:${c.unite}">${c.unite}</span>
    </div>`;
}

// Curseur : libellé, bouton ↺, repère de la valeur par défaut et pastille avec la valeur
function curseur(cle, id) {
    const c = CONFIG.curseurs[cle];
    const defaut = c.defaut === "max" ? c.max : c.defaut;
    const position = c.defaut === "max" ? 1 : (c.defaut - c.min) / (c.max - c.min);
    return `<div class="weight">
        <div class="weight__head">
            <label class="weight__label" for="${id}" data-i18n="curseurs.${cle}">${c.label}</label>
            ${bulleAide(c.aide)}
            <button type="button" class="reset-btn" title="Revenir à la valeur par défaut" aria-label="Revenir à la valeur par défaut"
                data-i18n-title="commun.reinit" data-i18n-aria="commun.reinit">${icone("reset")}</button>
        </div>
        <div class="slider" style="--pos-defaut: ${position}">
            <span class="slider__default"></span>
            <input type="range" id="${id}" min="${c.min}" max="${c.max}" step="${c.pas}" value="${defaut}" data-unite="${c.unite}">
            <span class="slider__thumb"></span>
        </div>
    </div>`;
}

function rendreComposants() {
    document.querySelectorAll("[data-champ]").forEach((el) => {
        el.outerHTML = champ(el.dataset.champ, el.dataset.id || el.dataset.champ);
    });
    document.querySelectorAll("[data-curseur]").forEach((el) => {
        el.outerHTML = curseur(el.dataset.curseur, el.dataset.id || el.dataset.curseur);
    });
    document.querySelectorAll("[data-entete]").forEach((el) => {
        el.outerHTML = enTete(CONFIG.entetes[el.dataset.entete], "entetes." + el.dataset.entete);
    });
}

// ===== Comportement des curseurs =====

// Place la pastille, y écrit la valeur et estompe le bouton ↺ si la valeur est celle par défaut
function majCurseur(c) {
    c.parentElement.style.setProperty("--pos", (c.value - c.min) / (c.max - c.min || 1));
    const unite = c.dataset.unite;
    c.parentElement.querySelector(".slider__thumb").textContent = unite === "%"
        ? formatTaux.format(c.value)
        : formatNombre.format(c.value) + " " + t("unite:" + unite, unite);
    c.closest(".weight").querySelector(".reset-btn").disabled = c.value === c.defaultValue;
}

function majTousLesCurseurs() {
    document.querySelectorAll(".slider input").forEach(majCurseur);
}

// Curseur dont le maximum vient d'un calcul (ex. mensualité ≤ capacité d'endettement).
// Sa valeur par défaut est ce maximum ; s'il était au maximum, il y reste quand le maximum change.
function ajusterMaximum(c, max) {
    const etaitAuMax = parseFloat(c.value) >= parseFloat(c.max);
    c.max = max;
    c.defaultValue = max;
    if (etaitAuMax) c.value = max;
}

// Bouton ↺ et double-clic : retour à la valeur par défaut
function activerCurseurs() {
    document.querySelectorAll(".slider input").forEach((c) => {
        const remettre = () => {
            c.value = c.defaultValue;
            c.dispatchEvent(new Event("input", { bubbles: true }));
        };
        c.closest(".weight").querySelector(".reset-btn").addEventListener("click", remettre);
        c.addEventListener("dblclick", remettre);
    });
}

// ===== Champs avec montant retenu =====
// Le champ prend la largeur du chiffre encodé, pour que le montant retenu s'affiche juste à côté
function activerChampsRetenus() {
    document.querySelectorAll(".field__input--retained").forEach((cadre) => {
        const saisie = cadre.querySelector("input");
        const ajuster = () => (saisie.style.width = Math.max(saisie.value.length, 1) + 0.1 + "ch");
        saisie.addEventListener("input", ajuster);
        cadre.addEventListener("click", () => saisie.focus());
        ajuster();
    });
}

// Montant retenu affiché entre parenthèses (vide si rien n'est encodé)
function afficherRetenu(id, retenu) {
    document.getElementById(id + "-retenu").textContent =
        valeur(id) > 0 ? "(" + formatNombre.format(Math.round(retenu)) + ")" : "";
}
