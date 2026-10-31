// ===== Accès au site =====
// Petite barrière, pas une vraie sécurité : elle décourage les visiteurs sans masquer le code.
// La clé n'est pas écrite en clair : seule son empreinte SHA-256 est ici. Pour la changer, calculez
// l'empreinte de la nouvelle clé (Terminal : printf 'nouvellecle' | shasum -a 256) et remplacez-la.
// Une fois la bonne clé entrée, le navigateur s'en souvient : elle n'est plus demandée.
// Chargé dans le <head> : la page reste masquée (html sans classe « ouvert ») tant que l'accès n'est pas donné.

const EMPREINTE_CLE = "e299dcd5a8a8f5297aa9a7b7f701c520174e6a8752032b02ddae4b3d8fb33d3e";

function ouvrirSite() {
    document.documentElement.classList.add("ouvert");
}

try {
    if (localStorage.getItem("acces") === EMPREINTE_CLE) ouvrirSite(); // déjà entré sur ce navigateur
} catch {
    // stockage indisponible (navigation privée…) : la clé sera redemandée à chaque visite
}

// Empreinte SHA-256 d'un texte, en hexadécimal
async function empreinte(texte) {
    const octets = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(texte));
    return [...new Uint8Array(octets)].map((o) => o.toString(16).padStart(2, "0")).join("");
}

document.addEventListener("DOMContentLoaded", () => {
    const formulaire = document.getElementById("acces-form");
    const champ = document.getElementById("acces-cle");
    const erreur = document.getElementById("acces-erreur");
    if (!document.documentElement.classList.contains("ouvert")) champ.focus();

    formulaire.addEventListener("submit", async (e) => {
        e.preventDefault();
        // Majuscules et espaces ignorés : « Be more curious » est accepté
        const essai = await empreinte(champ.value.toLowerCase().replace(/\s+/g, ""));
        if (essai !== EMPREINTE_CLE) {
            erreur.hidden = false;
            champ.select();
            return;
        }
        try {
            localStorage.setItem("acces", essai);
        } catch {
            // stockage indisponible : l'accès vaut pour cette visite seulement
        }
        ouvrirSite();
        toutCalculer(); // le graphique se redessine à la bonne largeur une fois visible
    });
});
