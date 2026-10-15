// ===== Langue du site =====
// Applique les traductions (traductions.js) aux éléments marqués data-i18n, data-i18n-title et data-i18n-aria.
// Le texte français d'origine est mémorisé au premier passage, pour pouvoir y revenir.

function traduirePage() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
        if (el.dataset.fr === undefined) el.dataset.fr = el.innerHTML;
        el.innerHTML = t(el.dataset.i18n, el.dataset.fr);
    });
    // Attributs traduits : data-i18n-title → title, data-i18n-aria → aria-label
    for (const [marque, attribut] of [["i18nTitle", "title"], ["i18nAria", "aria-label"]]) {
        const selecteur = marque === "i18nTitle" ? "[data-i18n-title]" : "[data-i18n-aria]";
        document.querySelectorAll(selecteur).forEach((el) => {
            const memoire = "fr" + marque;
            if (el.dataset[memoire] === undefined) el.dataset[memoire] = el.getAttribute(attribut);
            el.setAttribute(attribut, t(el.dataset[marque], el.dataset[memoire]));
        });
    }
}

function choisirLangue(langue) {
    LANGUE = langue;
    document.documentElement.lang = langue;
    definirFormats();
    traduirePage();
    document.querySelectorAll(".lang__btn").forEach((b) => b.classList.toggle("active", b.dataset.langue === langue));
    try {
        localStorage.setItem("langue", langue); // retenue pour la prochaine visite
    } catch {
        // stockage indisponible (navigation privée…) : la langue revient au français au rechargement
    }
}

// Boutons FR / EN du header ; reprend la dernière langue choisie
function activerLangue(apresChangement) {
    document.querySelectorAll(".lang__btn").forEach((b) =>
        b.addEventListener("click", () => {
            choisirLangue(b.dataset.langue);
            apresChangement();
        })
    );
    let langue = "fr";
    try {
        langue = localStorage.getItem("langue") || "fr";
    } catch {
        // stockage indisponible : français par défaut
    }
    choisirLangue(langue);
}
