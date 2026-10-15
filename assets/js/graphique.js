// ===== Graphique de remboursement (SVG) =====
// Colonnes empilées par année : capital (en bas) + intérêts (en haut) = mensualités de l'année
const SVG_NS = "http://www.w3.org/2000/svg";
let dernieresDonnees = [];

function svg(tag, attributs, parent) {
    const el = document.createElementNS(SVG_NS, tag);
    for (const [cle, val] of Object.entries(attributs)) el.setAttribute(cle, val);
    if (parent) parent.appendChild(el);
    return el;
}

// Chemin d'un rectangle arrondi seulement en haut (4px), carré à la base
function barreArrondie(x, y, largeur, hauteur, rayon) {
    const r = Math.min(rayon, hauteur, largeur / 2);
    return `M${x},${y + hauteur} V${y + r} Q${x},${y} ${x + r},${y} H${x + largeur - r} Q${x + largeur},${y} ${x + largeur},${y + r} V${y + hauteur} Z`;
}

// Graduations « rondes » (environ 4), toutes sous le maximum des données :
// l'axe s'arrête juste au-dessus de la plus haute barre, pour que le graphique occupe toute la hauteur
function graduations(max) {
    const brut = max / 4;
    const puissance = Math.pow(10, Math.floor(Math.log10(brut)));
    const pas = [1, 2, 2.5, 5, 10].map((m) => m * puissance).find((p) => p >= brut);
    const ticks = [];
    for (let v = 0; v <= max; v += pas) ticks.push(v);
    return ticks;
}

// Graduations en milliers d'euros, avec l'unité (ex. « 10 k€ »)
const formatK = (v) => (v === 0 ? "0" : formatNombre.format(v / 1000) + " k€");

function dessinerGraphique(donnees) {
    dernieresDonnees = donnees;
    const zone = document.getElementById("chart-remboursement");
    const racine = document.getElementById("chart-svg");
    const tooltip = document.getElementById("chart-tooltip");
    racine.replaceChildren();
    tooltip.hidden = true;

    const largeur = zone.clientWidth;
    const hauteur = 330;
    if (!largeur) return;
    racine.setAttribute("viewBox", `0 0 ${largeur} ${hauteur}`);

    if (!donnees.length) {
        const vide = svg("text", { x: largeur / 2, y: hauteur / 2, "text-anchor": "middle", class: "chart__axis-label" }, racine);
        vide.textContent = "Encodez les données de la simulation pour générer le graphique.";
        return;
    }

    const marge = { haut: 10, droite: 0, bas: 40, gauche: 44 };
    const l = largeur - marge.gauche - marge.droite;
    const h = hauteur - marge.haut - marge.bas;
    const max = Math.max(...donnees.map((d) => d.capital + d.interets));
    const ticks = graduations(max);
    const yMax = max * 1.05; // un peu d'air au-dessus de la plus haute barre
    const y = (v) => marge.haut + h - (v / yMax) * h;

    // Grille et axe Y (discrets)
    ticks.forEach((v) => {
        svg("line", { x1: marge.gauche, x2: largeur, y1: y(v), y2: y(v), class: "chart__grid" }, racine);
        const t = svg("text", { x: marge.gauche - 8, y: y(v) + 4, "text-anchor": "end", class: "chart__axis-label" }, racine);
        t.textContent = formatK(v);
    });

    // Titre de l'axe X (l'unité de l'axe Y est sur ses graduations)
    const titreX = svg("text", { x: marge.gauche + l / 2, y: hauteur - 2, "text-anchor": "middle", class: "chart__axis-title" }, racine);
    titreX.textContent = "Année";

    // Colonnes
    const slot = l / donnees.length;
    const larg = Math.min(24, slot * 0.6);
    const ecart = 2; // espace entre capital et intérêts (couleur du fond)
    const pasEtiquette = donnees.length > 15 ? 5 : donnees.length > 8 ? 2 : 1;

    // Première année où l'on possède plus de la moitié du bien (marquée d'un point)
    const anneeMoitie = donnees.find((d) => d.possede >= 0.5)?.annee;

    donnees.forEach((d, i) => {
        const cx = marge.gauche + slot * i + slot / 2;
        const x = cx - larg / 2;
        const g = svg("g", { class: "chart__col" }, racine);

        const yCapital = y(d.capital);
        svg("rect", { x, y: yCapital, width: larg, height: Math.max(y(0) - yCapital, 0), class: "chart__bar chart__capital" }, g);
        const yTotal = y(d.capital + d.interets);
        const hInterets = Math.max(yCapital - ecart - yTotal, 0);
        if (hInterets > 0) svg("path", { d: barreArrondie(x, yTotal, larg, hInterets, 4), class: "chart__bar chart__interets" }, g);
        if (d.annee === anneeMoitie) svg("circle", { cx, cy: yTotal - 9, r: 3, class: "chart__milestone" }, g);

        // Zone de survol : toute la largeur de la colonne
        const hit = svg("rect", { x: marge.gauche + slot * i, y: marge.haut, width: slot, height: h, class: "chart__hit", tabindex: 0 }, g);
        hit.setAttribute("aria-label", `Année ${d.annee} : capital ${formatEuro.format(d.capital)}, intérêts ${formatEuro.format(d.interets)}`);
        const montrer = () => afficherTooltip(d, cx, largeur);
        hit.addEventListener("pointerenter", montrer);
        hit.addEventListener("focus", montrer);
        hit.addEventListener("pointerleave", () => (tooltip.hidden = true));
        hit.addEventListener("blur", () => (tooltip.hidden = true));

        if (d.annee === 1 || d.annee % pasEtiquette === 0) {
            const t = svg("text", { x: cx, y: y(0) + 16, "text-anchor": "middle", class: "chart__axis-label" }, racine);
            t.textContent = d.annee;
        }
    });
}

// Bulle au survol d'une année :
//   Année 7                    42 % possédé
//   [mini-barre de la part possédée]
//   ━ Capital remboursé         5 125 €
//   ━ Intérêts                  5 963 €
//   Capital restant           140 216 €
function afficherTooltip(d, cx, largeur) {
    const tooltip = document.getElementById("chart-tooltip");
    const el = (classe, texte) => {
        const e = document.createElement("div");
        e.className = classe;
        if (texte !== undefined) e.textContent = texte;
        return e;
    };

    const tete = el("chart__tooltip-head");
    const possede = el("chart__tooltip-own");
    possede.append(el("chart__tooltip-own-value", formatPourcent.format(d.possede)), " possédé");
    tete.append(el("chart__tooltip-title", "Année " + d.annee), possede);

    const barre = el("chart__tooltip-progress");
    barre.style.setProperty("--part", Math.min(d.possede, 1));

    const lignes = el("chart__tooltip-grid");
    const ligne = (couleur, libelle, montant) => {
        const lab = el("chart__tooltip-label");
        const cle = el("chart__tooltip-key");
        cle.style.background = couleur;
        lab.append(cle, libelle);
        lignes.append(lab, el("chart__tooltip-value", formatEuro.format(montant)));
    };
    ligne("var(--chart-capital)", "Capital remboursé", d.capital);
    ligne("var(--chart-interets)", "Intérêts", d.interets);

    const pied = el("chart__tooltip-grid chart__tooltip-foot");
    pied.append(el("chart__tooltip-label", "Capital restant"), el("chart__tooltip-value", formatEuro.format(d.restant)));

    tooltip.replaceChildren(tete, barre, lignes, pied);
    tooltip.hidden = false;
    // À droite de la colonne, ou à gauche si on approche du bord
    const w = tooltip.offsetWidth;
    const gauche = cx + 16 + w > largeur ? cx - 16 - w : cx + 16;
    tooltip.style.left = Math.max(gauche, 0) + "px";
}

// Redessine à la bonne largeur quand la fenêtre change de taille
window.addEventListener("resize", () => dessinerGraphique(dernieresDonnees));
