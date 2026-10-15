// ===== Application : lit la page, calcule et affiche =====
// Ordre de chargement (index.html) : config → traductions → outils → calculs → composants → graphique → langue → app

// ----- Card « Capacité d'endettement » -----
// Capacité = Revenu net × Taux d'endettement − Crédits en cours + Loyer × Part du loyer retenue
function calculerCapacite() {
    const revenuRetenu = valeur("revenu") * valeur("taux-endettement") / 100;
    const loyerRetenu = valeur("loyer") * valeur("part-loyer") / 100;
    const capacite = revenuRetenu - valeur("credits") + loyerRetenu;

    afficherRetenu("revenu", revenuRetenu);
    afficherRetenu("loyer", loyerRetenu);
    afficher("capacite", capacite);
    document.getElementById("capacite").classList.toggle("negative", capacite < 0);
    return capacite;
}

// ----- Card « Simulation » -----
// Chaque mode a les mêmes réglages, préfixés « sim » ou « libre »

// Lit les réglages d'un mode ; le taux minimum ne peut pas dépasser le maximum (et inversement)
function lireReglages(prefixe) {
    const min = document.getElementById(prefixe + "-taux-min");
    const max = document.getElementById(prefixe + "-taux-max");
    if (parseFloat(min.value) > parseFloat(max.value)) {
        if (document.activeElement === max) min.value = max.value;
        else max.value = min.value;
    }
    return {
        tauxMin: valeur(prefixe + "-taux-min"),
        tauxMax: valeur(prefixe + "-taux-max"),
        duree: valeur(prefixe + "-duree"),
        apport: valeur(prefixe + "-apport"),
    };
}

// Fourchette du résultat (le libellé « Taux min / max » est écrit dans le HTML)
function afficherFourchette(prefixe, bas, haut) {
    afficher(prefixe + "-bas", bas);
    afficher(prefixe + "-haut", haut);
}

// Mode 1 : mensualité souhaitée (au plus la capacité d'endettement) → budget = montant empruntable + apport
// Renvoie le prêt au taux maximum (utilisé par le graphique)
function simulerDepuisCapacite(capacite, r) {
    const curseurMensualite = document.getElementById("sim-mensualite");
    ajusterMaximum(curseurMensualite, Math.max(Math.floor(capacite), 0));
    const mensualite = valeur("sim-mensualite");
    const montantBas = montantEmpruntable(mensualite, r.tauxMax, r.duree);
    const montantHaut = montantEmpruntable(mensualite, r.tauxMin, r.duree);

    afficherFourchette("sim", montantBas + r.apport, montantHaut + r.apport);
    return { montant: montantBas, mensualite };
}

// Mode 2 : montant libre → fourchette de mensualité
function simulerMontantLibre(r) {
    const montant = valeur("libre-montant");
    const mensualiteBas = mensualitePour(montant, r.tauxMin, r.duree);
    const mensualiteHaut = mensualitePour(montant, r.tauxMax, r.duree);

    afficherFourchette("libre", mensualiteBas, mensualiteHaut);
    return { montant, mensualite: mensualiteHaut };
}

// Graphique et totaux du prêt du mode actif, au taux maximum
function afficherRemboursement(pret, r) {
    const coutTotal = pret.mensualite * r.duree * 12;
    afficherTaux("chart-taux", r.tauxMax);
    afficher("chart-interets", coutTotal - pret.montant);
    afficher("chart-total", coutTotal);
    dessinerGraphique(tableauRemboursement(pret.montant, pret.mensualite, r.tauxMax, r.duree, r.apport));
}

const modeActif = () => document.querySelector(".mode-option.active").dataset.mode;

// ----- Mise à jour globale (à chaque saisie) -----
function toutCalculer() {
    const capacite = calculerCapacite();
    const reglages = { sim: lireReglages("sim"), libre: lireReglages("libre") };
    const prets = {
        sim: simulerDepuisCapacite(capacite, reglages.sim),
        libre: simulerMontantLibre(reglages.libre),
    };
    afficherRemboursement(prets[modeActif()], reglages[modeActif()]);
    majTousLesCurseurs();
}

// Choix du mode de la simulation
function activerModes() {
    document.querySelectorAll(".mode-option").forEach((bouton) => {
        bouton.addEventListener("click", () => {
            document.querySelectorAll(".mode-option").forEach((b) => {
                b.classList.toggle("active", b === bouton);
                b.setAttribute("aria-selected", b === bouton);
            });
            document.querySelectorAll(".mode-panel").forEach((panel) => {
                panel.classList.toggle("active", panel.id === "mode-" + bouton.dataset.mode);
            });
            toutCalculer();
        });
    });
}

// Onglets du header ; l'onglet actif est gardé dans l'adresse (#rendement) pour survivre au rechargement
function activerOnglets() {
    const ouvrir = (id) => {
        const bouton = document.querySelector(`.nav__btn[data-tab="${id}"]`);
        if (!bouton) return;
        document.querySelectorAll(".nav__btn").forEach((b) => {
            b.classList.toggle("active", b === bouton);
            b.setAttribute("aria-selected", b === bouton);
        });
        document.querySelectorAll(".tab").forEach((tab) => tab.classList.toggle("active", tab.id === id));
        try {
            history.replaceState(null, "", "#" + id);
        } catch {
            // certains navigateurs refusent de modifier l'adresse d'un fichier local : sans gravité
        }
        toutCalculer(); // le graphique se redessine à la bonne largeur une fois visible
    };
    document.querySelectorAll(".nav__btn").forEach((b) => b.addEventListener("click", () => ouvrir(b.dataset.tab)));
    if (location.hash) ouvrir(location.hash.slice(1));
}

// ----- Démarrage -----
rendreComposants();
activerLangue(toutCalculer); // après les composants : leurs textes sont traduits aussi
activerCurseurs();
activerChampsRetenus();
activerModes();
activerOnglets();
document.querySelector("main").addEventListener("input", toutCalculer);
toutCalculer();
