```text
     ┌───────┐
     │ ◉   ◉ │       C   L   A   U   D   E
     │   ▿   │
     └─┬───┬─┘       GitHub: branches, commits, pushes and pull requests,
     ┌─┴───┴─┐       written so that I can review them quickly.
     │ ▓▓▓▓▓ │
     └─┘   └─┘
```

# GITHUB

Immovest lives in **[immovest-app/immovest](https://github.com/immovest-app/immovest)**. GitHub Pages publishes the
site from `main`: what is merged is online a minute later.
You may push branches and open pull requests **for me to review**. You never merge.

**Contents**

1. Rules
2. Branches
3. Commits
4. Pull requests
5. Example

---

## 1. RULES

- **Never** commit or push to `main`, never force-push, never rewrite a pushed history, never merge.
  The ruleset « 🪼 Security » blocks it anyway.
- **Ask me** before the first push of a branch and before opening a pull request.
- Before any commit, open the site in a browser (`python3 -m http.server`) and check the change: no error in the
  console, French and English, phone width.
- Never commit secrets, credentials, personal data or large files; check `git status` and `git diff --staged`.
- Never read the GitHub token (`~/.config/gh/hosts.yml`) nor print it.
- Commits and pull requests are written **in French**, like the rest of the project.

## 2. BRANCHES

- One branch per topic, short **kebab-case** name saying what it does: `ecran-acces`, `graphique-cash-flow`.
- Branch from an up-to-date `main` (`git switch main && git pull`), unless asked otherwise.
- After I merge: `git switch main && git pull`, then delete the local branch.

## 3. COMMITS

Format of the first line: **`<gitmoji> <Scope> - <What, in a few words>`**

The scope is the part of the site: `Accès`, `Endettement`, `Simulation`, `Recherche`, `Rendement`, `Visite`, `Header`,
`Graphique`, `Claude`, …

| Gitmoji | When                     | Example                                              |
| ------- | ------------------------ | ---------------------------------------------------- |
| ✨      | new feature              | `✨ Accès - Clé demandée à la première visite`       |
| 🐛      | bug fix                  | `🐛 Simulation - Taux minimum au-dessus du maximum`  |
| 💄      | look of the site         | `💄 Header - Logo aligné sur les onglets`            |
| 🌐      | translations             | `🌐 Recherche - Critères traduits en anglais`        |
| 🔧      | configuration            | `🔧 Config - Durée du prêt jusqu'à 30 ans`           |
| ♻️      | refactoring              | `♻️ Graphique - Une seule fonction pour les axes`    |
| 📝      | documentation            | `📝 Claude - Fichiers d'instructions partagés`       |
| 🎨      | code style, formatting   | `🎨 CSS - Variables regroupées par usage`            |
| ⚡️      | performance              | `⚡️ Graphique - Redessiné seulement si visible`      |
| 🔥      | removal of code or files | `🔥 Recherche - Thème Administratif retiré`          |

- Optional body: a few bullet points, plain sentences.
- Last line of every commit made by Claude: `Co-Authored-By: Claude <noreply@anthropic.com>` (with the model name).

## 4. PULL REQUESTS

**Title**: same format as a commit, describing the whole pull request.

**Body**, always in this order:

```markdown
## Résumé
Deux à quatre phrases courtes, en mots simples : ce que fait la pull request et pourquoi.
Quelqu'un qui n'a pas suivi le travail doit en comprendre le but.

## Modifications
| Fichier                    | Pourquoi                                          |
| -------------------------- | ------------------------------------------------- |
| `assets/js/acces.js`       | Vérifie la clé et retient l'accès.                |
| `index.html`               | Ajoute l'écran d'accès devant le site.            |

## Tests
Ce qui a été vérifié et le résultat, ex. Chrome : bonne et mauvaise clé, rechargement, mobile, console sans erreur.

## Notes
Facultatif : limites, suites, décisions prises avec moi.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

- One row per modified file (group them only when many files change for the same reason).
- Plain, short sentences everywhere; no jargon that is not needed.
- Open the pull request with `gh pr create --base main --title "..." --body-file <file>`, then give me its link.

## 5. EXAMPLE

What the first pull request of Immovest looks like with these rules (branch `ecran-acces`):

**Title**

```text
✨ Accès - Clé demandée à la première visite
```

**Body**

```markdown
## Résumé
Le site est maintenant précédé d'un écran qui demande une clé d'accès. Une fois la bonne clé entrée, le navigateur
s'en souvient et ne la redemande plus. C'est une barrière pour décourager les visiteurs, pas une vraie sécurité.

## Modifications
| Fichier                    | Pourquoi                                                              |
| -------------------------- | --------------------------------------------------------------------- |
| `assets/js/acces.js`       | Compare l'empreinte de la clé entrée et retient l'accès.              |
| `index.html`               | Ajoute l'écran d'accès et charge le script dans le `<head>`.          |
| `assets/css/base.css`      | Masque le site tant que la clé n'est pas entrée, style de l'écran.    |
| `assets/js/traductions.js` | Textes de l'écran en anglais.                                         |

## Tests
Chrome : mauvaise clé → message d'erreur, bonne clé → site affiché, rechargement → reste ouvert, mobile correct,
console sans erreur.

## Notes
- La clé n'est pas écrite en clair, seulement son empreinte SHA-256.
- L'accès est perdu en navigation privée ou si les données du site sont effacées.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```
