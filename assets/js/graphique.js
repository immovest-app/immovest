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

// Graduations « rondes » : 0, un palier intermédiaire et le sommet (3 au total en général)
function graduations(max) {
    const brut = max / 2;
    const puissance = Math.pow(10, Math.floor(Math.log10(brut)));
    const pas = [1, 2, 2.5, 5, 10].map((m) => m * puissance).find((p) => p >= brut);
    const ticks = [];
    for (let v = 0; v <= max + pas * 0.001; v += pas) ticks.push(v);
    if (ticks[ticks.length - 1] < max) ticks.push(ticks[ticks.length - 1] + pas);
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
    const yMax = ticks[ticks.length - 1];
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

    donnees.forEach((d, i) => {
        const cx = marge.gauche + slot * i + slot / 2;
        const x = cx - larg / 2;
        const g = svg("g", { class: "chart__col" }, racine);

        const yCapital = y(d.capital);
        svg("rect", { x, y: yCapital, width: larg, height: Math.max(y(0) - yCapital, 0), class: "chart__bar chart__capital" }, g);
        const yTotal = y(d.capital + d.interets);
        const hInterets = Math.max(yCapital - ecart - yTotal, 0);
        if (hInterets > 0) svg("path", { d: barreArrondie(x, yTotal, larg, hInterets, 4), class: "chart__bar chart__interets" }, g);

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

function afficherTooltip(d, cx, largeur) {
    const tooltip = document.getElementById("chart-tooltip");
    tooltip.replaceChildren();

    const ligne = (classe, couleur, valeur, libelle) => {
        const row = document.createElement("div");
        row.className = classe;
        if (couleur) {
            const key = document.createElement("span");
            key.className = "chart__tooltip-key";
            key.style.background = couleur;
            row.appendChild(key);
        }
        const v = document.createElement("span");
        v.className = "chart__tooltip-value";
        v.textContent = valeur;
        const lab = document.createElement("span");
        lab.className = "chart__tooltip-label";
        lab.textContent = libelle;
        row.append(v, lab);
        tooltip.appendChild(row);
    };

    const titre = document.createElement("div");
    titre.className = "chart__tooltip-title";
    titre.textContent = "Année " + d.annee;
    tooltip.appendChild(titre);
    ligne("chart__tooltip-row", "var(--chart-interets)", formatEuro.format(d.interets), "intérêts");
    ligne("chart__tooltip-row", "var(--chart-capital)", formatEuro.format(d.capital), "capital remboursé");
    const pied = document.createElement("div");
    pied.className = "chart__tooltip-foot";
    pied.textContent = "Capital restant : " + formatEuro.format(d.restant);
    tooltip.appendChild(pied);

    const possession = document.createElement("div");
    possession.className = "chart__tooltip-own";
    const pourcent = document.createElement("span");
    pourcent.className = "chart__tooltip-value";
    pourcent.textContent = formatPourcent.format(d.possede);
    possession.append(pourcent, " du bien possédé");
    tooltip.appendChild(possession);

    tooltip.hidden = false;
    // À droite de la colonne, ou à gauche si on approche du bord
    const w = tooltip.offsetWidth;
    const gauche = cx + 16 + w > largeur ? cx - 16 - w : cx + 16;
    tooltip.style.left = Math.max(gauche, 0) + "px";
}

// Redessine à la bonne largeur quand la fenêtre change de taille
window.addEventListener("resize", () => dessinerGraphique(dernieresDonnees));
