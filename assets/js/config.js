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

    // Grille de critères de l'onglet Recherche : les points importants à regarder sur une annonce ou en visite.
    // L'argent n'est pas ici (il sera traité dans l'onglet Rendement).
    // Types de réponse : "ouiNon", "note" (1 à 5, extremes = libellés du côté mauvais et du côté bon), "curseur",
    // et aussi "choix", "nombre", "texte". icone : l'icône du thème (sprite d'index.html).
    // Score (indicatif) : on part de 50 / 100. Chaque critère ajoute ou retire des points, de −1 à +1 :
    //   ouiNon : bon = la bonne réponse (+1), l'autre retire (−1)
    //   note : 1 et 2 retirent, 3 est neutre, 4 et 5 ajoutent
    //   curseur : moinsMieux = true → le minimum ajoute (+1), le milieu est neutre, le maximum retire (−1)
    //   sans règle : ne compte pas
    // importance : 1 (défaut), 2 ou 3 → pèse 1, 2 ou 3 fois plus. Toutes les bonnes réponses = 100.
    // aide : la bulle « ? » explique pourquoi le critère est important.
    criteres: [
        // Du plus général au plus précis : si les premiers critères sont déjà mauvais, inutile d'aller plus loin.
        {
            theme: "Analyse de l'emplacement", icone: "map-pin",
            items: [
                {
                    label: "Le quartier est-il agréable (propreté, façades, espaces verts) ?", type: "note", extremes: ["Négligé", "Très soigné"],
                    aide: "C'est la première impression de vos futurs locataires : un quartier soigné se loue plus vite et plus cher.",
                },
                {
                    label: "Le quartier est-il connu pour des incivilités ou du trafic de drogue ?", type: "ouiNon", bon: "Non", importance: 3,
                    aide: "Une mauvaise réputation fait fuir les bons locataires et freine la revente.",
                },
                {
                    label: "Y a-t-il une nuisance à proximité (grand axe routier, déchetterie, zone industrielle…) ?", type: "ouiNon", bon: "Non", importance: 2,
                    aide: "Bruit et nuisances font baisser le loyer et allongent les périodes sans locataire.",
                },
                {
                    label: "Combien de biens sont en vente à moins de 100 m ?", type: "curseur",
                    min: 0, max: 10, pas: 1, unite: "bien", unitePluriel: "biens", moinsMieux: true, importance: 2,
                    aide: "Beaucoup d'offre autour signale souvent un problème (gros travaux à venir, quartier qui se dégrade, difficulté à louer) et met votre bien en concurrence. Cherchez à savoir pourquoi, par exemple en parlant avec les voisins.",
                },
                {
                    label: "Un projet (construction, aménagement) est-il prévu à moins de 100 m ?", type: "ouiNon", bon: "Non",
                    aide: "De nouveaux logements autour créent de la concurrence et font baisser les loyers des bailleurs déjà présents, sans compter les nuisances du chantier.",
                },
                {
                    label: "Le bien est-il à moins d'1 h de voiture de chez vous ?", type: "ouiNon", bon: "Oui", importance: 2,
                    aide: "Visites, travaux, signature de l'acte, demandes des locataires : vous devrez vous y rendre souvent.",
                },
            ],
        },
        {
            theme: "Analyse du bien", icone: "house",
            items: [
                {
                    label: "Le bien donne-t-il envie d'y vivre (lumière, ambiance) ?", type: "note", extremes: ["Pas du tout", "Coup de cœur"],
                    aide: "Un locataire choisit aussi au coup de cœur : un bien chaleureux se loue plus vite.",
                },
                {
                    label: "Le bien est-il calme ?", type: "note", extremes: ["Bruyant", "Très calme"],
                    aide: "Le bruit est l'une des premières raisons pour lesquelles un locataire s'en va.",
                },
                { label: "Le bien a-t-il un garage ?", type: "ouiNon", bon: "Oui" },
                { label: "Le bien a-t-il une cave ?", type: "ouiNon", bon: "Oui" },
                { label: "Le bien a-t-il une place de parking ?", type: "ouiNon", bon: "Oui" },
                { label: "La cuisine est-elle équipée ?", type: "ouiNon", bon: "Oui" },
                { label: "La salle de bain est-elle récente (douche à l'italienne…) ?", type: "ouiNon", bon: "Oui" },
                {
                    label: "Est-il aussi bien équipé que les biens comparables autour ?", type: "ouiNon", bon: "Oui",
                    aide: "À loyer égal, un locataire choisit le bien le mieux équipé.",
                },
            ],
        },
        {
            theme: "Analyse des commodités", icone: "bus",
            items: [
                {
                    label: "Y a-t-il un bus ou une gare à moins de 10 min à pied ?", type: "ouiNon", bon: "Oui",
                    aide: "Beaucoup de locataires n'ont pas de voiture : de bons transports élargissent votre public.",
                },
                {
                    label: "Y a-t-il un lieu bruyant ou très fréquenté juste à côté (gare, école…) ?", type: "ouiNon", bon: "Non",
                    aide: "Passages et bruit au quotidien pèsent sur le confort et sur la durée des locations.",
                },
                {
                    label: "Y a-t-il une école à proximité ?", type: "ouiNon", bon: "Oui",
                    aide: "Indispensable pour attirer des familles, qui restent souvent longtemps.",
                },
                {
                    label: "Y a-t-il des commerces à proximité (supermarché, boulangerie…) ?", type: "ouiNon", bon: "Oui",
                    aide: "Pouvoir faire ses courses à pied est un vrai argument de location.",
                },
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
