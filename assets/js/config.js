// ===== Configuration du site =====
// Toutes les valeurs par défaut, les bornes des curseurs et les textes des bulles d'aide sont ici.
// Modifiez ce fichier puis rechargez la page : rien d'autre à toucher.
//
// Dans index.html, un emplacement comme <div data-champ="revenu"></div> est remplacé par le champ
// correspondant ci-dessous. data-id permet de réutiliser un même champ deux fois (ex. l'apport dans
// les deux modes de la Simulation).

const CONFIG = {
    // Champs à encoder (montants). defaut: 0 → champ vide.
    champs: {
        revenu:  { label: "Revenu net",         icone: "briefcase",   unite: "€ / mois", defaut: 2800, pas: 50,   retenu: true, aide: "revenu" },
        credits: { label: "Crédits en cours",   icone: "credit-card", unite: "€ / mois", defaut: 0,    pas: 10 },
        loyer:   { label: "Loyer brut attendu", icone: "house",       unite: "€ / mois", defaut: 0,    pas: 10,   retenu: true },
        apport:  { label: "Apport personnel",   icone: "piggy-bank",  unite: "€",        defaut: 0,    pas: 1000 },
        montant: { label: "Montant emprunté",   icone: "banknote",    unite: "€",        defaut: 0,    pas: 1000 },
    },

    // Curseurs (hypothèses). Le bouton ↺ et le repère sur la barre ramènent à « defaut ».
    curseurs: {
        tauxEndettement: { label: "Taux d'endettement",    min: 0, max: 100, pas: 1,    defaut: 33,   unite: "%",   aide: "tauxEndettement" },
        partLoyer:       { label: "Part du loyer retenue", min: 0, max: 100, pas: 5,    defaut: 70,   unite: "%",   aide: "partLoyer" },
        tauxMin:         { label: "Minimum",               min: 0, max: 8,   pas: 0.05, defaut: 3.25, unite: "%" },
        tauxMax:         { label: "Maximum",               min: 0, max: 8,   pas: 0.05, defaut: 4.25, unite: "%" },
        duree:           { label: "Nombre d'années",       min: 5, max: 30,  pas: 1,    defaut: 25,   unite: "ans" },
    },

    // En-têtes de colonne qui regroupent plusieurs curseurs
    entetes: {
        tauxInteret: { label: "Taux d'intérêt", icone: "percent", aide: "tauxInteret" },
        duree:       { label: "Durée du prêt",  icone: "calendar" },
    },

    // Textes des bulles « ? »
    aides: {
        revenu: {
            texte: "La banque se base généralement sur votre salaire net, mais elle peut y ajouter d'autres revenus stables : pension, revenus d'indépendant, loyers de biens que vous louez déjà (souvent retenus à 70–80 %) ou, selon la banque, une pension alimentaire.",
            source: { nom: "hypothèque.be", url: "https://www.xn--hypothque-53a.be/fr/blog/quels-sont-les-revenus-pris-en-compte-pour-emprunt-hypoth%C3%A9caire" },
        },
        tauxEndettement: {
            texte: "Part de votre revenu net que la banque accepte de consacrer à vos crédits. Il n'existe pas de plafond légal en Belgique : 33 % est le repère habituel, et certaines banques vont jusqu'à 50 % pour les bons profils (revenus élevés, peu de charges). Pour une estimation prudente, gardez 33 %.",
            source: { nom: "mbc-credits.be", url: "https://www.mbc-credits.be/taux-dendettement-maximum-en-belgique/" },
        },
        partLoyer: {
            texte: "Part du loyer futur que la banque ajoute à vos revenus. Selon la banque, elle va de 70 % à 100 %, et certaines n'en comptent rien (0 %).",
            source: { nom: "simulationpret.be", url: "https://www.simulationpret.be/articles/credit-investissement-locatif" },
        },
        tauxInteret: {
            texte: "Taux annuel fixe proposé par la banque. Il dépend de la durée, de votre apport et de votre profil. En 2026, les taux fixes sur 25 ans se situent environ entre 3 % et 4,5 %. Encodez le meilleur et le moins bon taux que vous pensez obtenir, et vérifiez les taux du moment sur un baromètre.",
            source: { nom: "meilleurtaux.be", url: "https://www.meilleurtaux.be/pret-hypothecaire/barometre-des-taux/" },
        },
    },
};
