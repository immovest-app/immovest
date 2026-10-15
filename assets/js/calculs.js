// ===== Calculs financiers (fonctions pures, sans lien avec la page) =====
// Prêt à taux fixe et mensualités constantes.
// En Belgique, le taux annoncé est un taux annuel actuariel : taux mensuel = (1 + taux annuel)^(1/12) − 1

function tauxMensuel(tauxAnnuelPourcent) {
    return Math.pow(1 + tauxAnnuelPourcent / 100, 1 / 12) - 1;
}

// Montant empruntable pour une mensualité donnée
function montantEmpruntable(mensualite, tauxAnnuelPourcent, annees) {
    const t = tauxMensuel(tauxAnnuelPourcent);
    const n = annees * 12;
    if (t === 0) return mensualite * n;
    return mensualite * (1 - Math.pow(1 + t, -n)) / t;
}

// Mensualité pour un montant emprunté donné
function mensualitePour(montant, tauxAnnuelPourcent, annees) {
    const t = tauxMensuel(tauxAnnuelPourcent);
    const n = annees * 12;
    if (t === 0) return montant / n;
    return montant * t / (1 - Math.pow(1 + t, -n));
}

// Remboursement année par année, calculé mois par mois :
// intérêts = capital restant × t, le reste de la mensualité rembourse le capital.
// possede = part du bien possédée = (apport + capital déjà remboursé) ÷ (montant emprunté + apport)
function tableauRemboursement(montant, mensualite, tauxAnnuelPourcent, annees, apport) {
    if (montant <= 0) return [];
    const t = tauxMensuel(tauxAnnuelPourcent);
    let capitalRestant = montant;
    const lignes = [];
    for (let annee = 1; annee <= annees; annee++) {
        let interets = 0;
        let capital = 0;
        for (let mois = 0; mois < 12; mois++) {
            const interetsMois = capitalRestant * t;
            interets += interetsMois;
            capital += mensualite - interetsMois;
            capitalRestant -= mensualite - interetsMois;
        }
        const restant = Math.max(capitalRestant, 0);
        const possede = (apport + montant - restant) / (montant + apport);
        lignes.push({ annee, interets, capital, restant, possede });
    }
    return lignes;
}
