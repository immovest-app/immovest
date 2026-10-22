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
    // defaut: "max" → le curseur est au maximum par défaut (maximum fixé par le calcul, ex. la capacité).
    curseurs: {
        tauxEndettement: { label: "Taux d'endettement",    min: 0, max: 100, pas: 1,    defaut: 33,   unite: "%",   aide: "tauxEndettement" },
        partLoyer:       { label: "Part du loyer retenue", min: 0, max: 100, pas: 5,    defaut: 70,   unite: "%",   aide: "partLoyer" },
        tauxMin:         { label: "Minimum",               min: 0, max: 8,   pas: 0.05, defaut: 3.25, unite: "%" },
        tauxMax:         { label: "Maximum",               min: 0, max: 8,   pas: 0.05, defaut: 4.25, unite: "%" },
        duree:           { label: "Nombre d'années",       min: 5, max: 30,  pas: 1,    defaut: 25,   unite: "ans" },
        mensualite:      { label: "Valeur exacte", min: 0, max: 0, pas: 1, defaut: "max", unite: "€" },
    },

    // En-têtes de colonne qui regroupent plusieurs curseurs
    entetes: {
        mensualite:  { label: "Mensualité souhaitée", icone: "link", aide: "mensualite" },
        tauxInteret: { label: "Taux d'intérêt", icone: "percent", aide: "tauxInteret" },
        duree:       { label: "Durée du prêt",  icone: "calendar" },
    },

    // Grille de critères de l'onglet Recherche (exemple à adapter).
    // Types de réponse : "ouiNon", "choix" (options), "nombre" (unite), "note" (de 1 à 5), "texte".
    // Score (exemple, à redéfinir) : chaque critère noté rapporte de 0 à 1 point →
    //   ouiNon : bon = la bonne réponse · choix : points = { option: 0 à 1 } · note : note ÷ 5
    //   nombre : min et/ou max = seuils à respecter · sans règle (ou texte) : non compté
    //   curseur : moinsMieux = true → le minimum vaut 1 point, le maximum 0 (au prorata entre les deux)
    // importance : 1 (défaut), 2 ou 3 → le critère compte 1, 2 ou 3 fois dans le score.
    // pour : "appartement" ou "maison" → le critère n'apparaît que pour ce type de bien (sinon : les deux).
    criteres: [
        // Du plus général au plus précis : si les premiers critères sont déjà mauvais, inutile d'aller plus loin.
        {
            theme: "Analyse de l'emplacement", icone: "map-pin",
            items: [
                {
                    label: "Aspect du quartier", type: "note",
                    aide: "Votre première impression en arrivant : propreté, entretien des façades et des rues, espaces verts.",
                },
                { label: "Quartier connu pour des incivilités ou du trafic de drogue ?", type: "ouiNon", bon: "Non", importance: 3 },
                { label: "Nuisance à proximité (grand axe routier, déchetterie, zone industrielle…) ?", type: "ouiNon", bon: "Non", importance: 2 },
                {
                    label: "Biens en vente à moins de 100 m", type: "curseur",
                    min: 0, max: 10, pas: 1, unite: "bien", unitePluriel: "biens",
                    moinsMieux: true, importance: 2,
                    aide: "Chaque bien en vente compte pour 10 % de saturation (10 biens = zone saturée). Beaucoup d'offre doit vous alerter : demandez-vous pourquoi. Pour un appartement, de gros travaux sont-ils prévus dans l'immeuble ? Les propriétaires peinent-ils à louer ? Pour une maison, un projet est-il prévu dans le quartier ? La ville construit-elle de nouveaux logements qui concurrenceront les bailleurs ? N'hésitez pas à en parler avec les voisins.",
                },
                {
                    label: "Projet local prévu à moins de 100 m ?", type: "ouiNon",
                    aide: "Nouveaux logements, chantier, aménagement… Renseignez-vous à la commune : un projet peut valoriser le quartier, ou au contraire créer de la concurrence et des nuisances. Il ne compte donc pas dans le score.",
                },
                {
                    label: "À moins d'1 h en voiture de chez vous ?", type: "ouiNon", bon: "Oui", importance: 2,
                    aide: "Vous devrez vous y rendre souvent : visites, travaux, signature de l'acte, demandes des locataires… Un bien trop loin vous fera perdre beaucoup de temps.",
                },
            ],
        },
        {
            theme: "Analyse du bien", icone: "house",
            items: [
                { label: "Le bien est chaleureux", type: "note" },
                { label: "Le bien est calme", type: "note" },
                { label: "Garage", type: "ouiNon", bon: "Oui" },
                { label: "Cave", type: "ouiNon", bon: "Oui" },
                { label: "Place de parking", type: "ouiNon", bon: "Oui" },
                { label: "Cuisine équipée", type: "ouiNon", bon: "Oui" },
                { label: "Salle de bain récente (douche à l'italienne…)", type: "ouiNon", bon: "Oui" },
                {
                    label: "Aussi bien équipé que les biens en vente autour ?", type: "ouiNon", bon: "Oui",
                    aide: "S'il y a de l'offre dans le quartier, comparez : à loyer égal, un locataire choisira le bien le mieux équipé.",
                },
            ],
        },
        {
            theme: "Analyse des commodités", icone: "bus",
            items: [
                { label: "Transport en commun (bus, gare) à moins de 10 min à pied ?", type: "ouiNon", bon: "Oui" },
                { label: "Lieu très fréquenté ou bruyant juste à côté (gare, école…) ?", type: "ouiNon", bon: "Non" },
                { label: "École à proximité ?", type: "ouiNon", bon: "Oui" },
                { label: "Commerces à proximité (supermarché, boulangerie…) ?", type: "ouiNon", bon: "Oui" },
            ],
        },
    ],

    // Textes des bulles « ? » (source facultative)
    aides: {
        mensualite: {
            texte: "Montant que vous souhaitez rembourser chaque mois. Il peut aller jusqu'à votre capacité d'endettement, calculée ci-dessus, et le curseur est à ce maximum par défaut.",
        },
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
