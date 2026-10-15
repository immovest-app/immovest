// ===== Application : lit la page, calcule et affiche =====
// Ordre de chargement (index.html) : config → outils → calculs → composants → graphique → app

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

// Fourchette du résultat, avec le taux sous chaque montant
function afficherFourchette(prefixe, bas, haut, r) {
    afficher(prefixe + "-bas", bas);
    afficher(prefixe + "-haut", haut);
    afficherTaux(prefixe + "-label-min", r.tauxMin);
    afficherTaux(prefixe + "-label-max", r.tauxMax);
}

// Mode 1 : capacité d'endettement → budget = montant empruntable + apport
// Renvoie le prêt au taux maximum (utilisé par le graphique)
function simulerDepuisCapacite(capacite, r) {
    const mensualite = Math.max(capacite, 0);
    const montantBas = montantEmpruntable(mensualite, r.tauxMax, r.duree);
    const montantHaut = montantEmpruntable(mensualite, r.tauxMin, r.duree);

    document.getElementById("sim-mensualite").textContent = formatNombre.format(Math.round(mensualite));
    afficherFourchette("sim", montantBas + r.apport, montantHaut + r.apport, r);
    return { montant: montantBas, mensualite };
}

// Mode 2 : montant libre → fourchette de mensualité
function simulerMontantLibre(r) {
    const montant = valeur("libre-montant");
    const mensualiteBas = mensualitePour(montant, r.tauxMin, r.duree);
    const mensualiteHaut = mensualitePour(montant, r.tauxMax, r.duree);

    afficherFourchette("libre", mensualiteBas, mensualiteHaut, r);
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

// ----- Démarrage -----
rendreComposants();
activerCurseurs();
activerChampsRetenus();
activerModes();
document.querySelector("main").addEventListener("input", toutCalculer);
toutCalculer();
