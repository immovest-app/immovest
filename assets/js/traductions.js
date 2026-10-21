// ===== Traductions =====
// Le français est la langue de base : il est écrit directement dans index.html et config.js.
// Ici, uniquement les textes anglais, rangés par clé. Dans la page, un élément traduisible porte
// data-i18n="clé" (texte), data-i18n-title="clé" (info-bulle) ou data-i18n-aria="clé" (lecteurs d'écran).
// Une clé absente garde le texte français.

const TRADUCTIONS = {
    en: {
        // ----- Header -----
        "nav.endettement": "Borrowing",
        "nav.recherche": "Search",
        "nav.rendement": "Returns",
        "nav.visite": "Viewing",

        // ----- Commun -----
        "commun.source": "Source:",
        "commun.aide": "Help",
        "commun.reinit": "Back to default value",
        "unite.parMois": "/ month",
        "unite:€ / mois": "€ / month",
        "unite:ans": "yrs",

        // ----- Card « Capacité d'endettement » -----
        "cap.titre": "Borrowing capacity",
        "cap.description": `In theory, this is the <strong>maximum amount your bank will let you repay each month</strong>
            on a new loan. To estimate it, the bank takes a share (the debt ratio) of your net income, subtracts
            your current loans and adds a portion (the share of rent counted) of the gross rent the property will
            bring in. The share of rent not counted is assumed to cover the property's costs (works, insurance,
            property tax, maintenance, vacancy, unpaid rent…). In Belgium there is no legal cap: each bank sets its
            own debt ratio, usually between 30% and 45%, and some leave future rent out entirely (share of rent
            counted of 0%).`,

        // ----- Champs, curseurs et en-têtes (config.js) -----
        "champs.revenu": "Net income",
        "champs.credits": "Current loans",
        "champs.loyer": "Expected gross rent",
        "champs.apport": "Down payment",
        "champs.montant": "Loan amount",
        "curseurs.tauxEndettement": "Debt ratio",
        "curseurs.partLoyer": "Share of rent counted",
        "curseurs.tauxMin": "Minimum",
        "curseurs.tauxMax": "Maximum",
        "curseurs.duree": "Number of years",
        "curseurs.mensualite": "Exact value",
        "entetes.mensualite": "Desired monthly payment",
        "entetes.tauxInteret": "Interest rate",
        "entetes.duree": "Loan term",

        // ----- Bulles « ? » -----
        "aides.revenu": "Banks usually start from your net salary, but may add other stable income: pension, self-employed income, rent from properties you already let (often counted at 70–80%) or, depending on the bank, alimony.",
        "aides.tauxEndettement": "Share of your net income the bank accepts to spend on loans. There is no legal cap in Belgium: 33% is the usual benchmark, and some banks go up to 50% for strong profiles (high income, few expenses). For a cautious estimate, keep 33%.",
        "aides.partLoyer": "Share of the future rent the bank adds to your income. Depending on the bank, it ranges from 70% to 100%, and some count none of it (0%).",
        "aides.tauxInteret": "Fixed annual rate offered by the bank. It depends on the loan term, your down payment and your profile. In 2026, 25-year fixed rates are roughly between 3% and 4.5%. Enter the best and worst rates you expect, and check current rates on a rate tracker.",
        "aides.mensualite": "The amount you want to repay each month. It can go up to your borrowing capacity, calculated above, and the slider starts at that maximum.",

        // ----- Formules -----
        "f.capacite": "Capacity",
        "f.revenu": "Income",
        "f.tauxEndettement": "Debt ratio",
        "f.credits": "Loans",
        "f.loyer": "Rent",
        "f.partRetenue": "Share counted",
        "f.budget": "Budget",
        "f.mensualite": "Monthly payment",
        "f.apport": "Down payment",
        "f.montant": "Loan amount",
        "f.exposant": "−(term × 12)",
        "f.legende": "where t = (1 + annual rate)<sup>1/12</sup> − 1",

        // ----- Card « Simulation » -----
        "sim.titre": "Simulation",
        "sim.description": `This gives a <strong>rough idea of the budget</strong> you can spend on a purchase: either
            the amount you could borrow based on your borrowing capacity, or the monthly payment for an amount of
            your choice. It assumes a fixed-rate loan with constant monthly payments, excluding purchase costs and
            insurance.`,
        "sim.modeCapacite": "From my borrowing capacity",
        "sim.modeLibre": "Custom amount",
        "resultat.tauxMin": "Min rate",
        "resultat.tauxMax": "Max rate",

        // ----- Graphique -----
        "graph.aria": "Yearly split between principal repaid and interest",
        "graph.capital": "Principal repaid",
        "graph.interets": "Interest",
        "graph.moitie": "Over 50% owned",
        "graph.tauxApplique": "Rate applied",
        "graph.interetsTotaux": "Total interest",
        "graph.coutTotal": "Total cost",
        "graph.annee": "Year",
        "graph.vide": "Enter the simulation details to draw the chart.",
        "graph.possede": "owned",
        "graph.restant": "Still owed",
    },
};
