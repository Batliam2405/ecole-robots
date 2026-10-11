
const niveauxScolaires = [
    "Petite section",
    "Moyenne section",
    "Grande section",
    "CP",
    "CE1",
    "CE2",
    "CM1",
    "CM2"
];

const matieresDisponibles = [
    "Mathématiques",
    "Français",
    "Histoire",
    "Géographie",
    "Sciences",
    "Anglais",
    "Arts plastiques",
    "Éducation physique"
];


const prenomsEleves = [
    "Lucas", "Emma", "Nathan", "Jade", "Louis",
    "Lina", "Gabriel", "Chloé", "Hugo", "Léa",
    "Arthur", "Manon", "Jules", "Inès", "Adam",
    "Zoé", "Noah", "Camille", "Raphaël", "Louise",
    "Ethan", "Sarah", "Tom", "Alice", "Léo",
    "Mila", "Paul", "Rose", "Sacha", "Anna",
    "Mathis", "Eva", "Enzo", "Juliette", "Aaron",
    "Ambre", "Maël", "Lola", "Victor", "Jeanne"
];

const nomsEleves = [
    "Martin", "Bernard", "Petit", "Robert", "Richard",
    "Durand", "Dubois", "Moreau", "Laurent", "Simon",
    "Michel", "Lefebvre", "Leroy", "Roux", "David",
    "Bertrand", "Morel", "Fournier", "Girard", "Bonnet",
    "Dupont", "Lambert", "Fontaine", "Rousseau", "Vincent",
    "Muller", "Lefevre", "Faure", "Andre", "Mercier",
    "Blanc", "Guerin", "Boyer", "Garnier", "Chevalier",
    "Francois", "Legrand", "Gauthier", "Garcia", "Perrin"
];

let classes = [
    { id: 1, nom: "CM1 A", niveau: "CM1" },
    { id: 2, nom: "CE2 A", niveau: "CE2" }
];

let robots = [
    {
        id: 1,
        nom: "Robi",
        classeId: 1,
        niveau: 1,
        matierePreferee: "Mathématiques"
    },
    {
        id: 2,
        nom: "Pixel",
        classeId: 1,
        niveau: 1,
        matierePreferee: "Français"
    },
    {
        id: 3,
        nom: "Nova",
        classeId: 2,
        niveau: 1,
        matierePreferee: "Sciences"
    }
];

let prochainIdRobot = 4;
let historiqueResultats = [];
let devoirs = [];
let evaluations = [];
let prochainIdEvaluation = 1;
let prochainIdDevoir = 1;
let historiqueDevoirs = [];
let prochainIdClasse = 3;

function entrerEcole() {
    ouvrirSection("ecole");
}




function ouvrirSection(section) {
    const contenu = document.getElementById("contenu");
    contenu.hidden = false;

    if (section === "classes") {
        afficherRobots();

    } else if (section === "emploi") {
        afficherEmploiDuTemps();

    } else if (section === "cours") {
        afficherMenuCours();

    } else if (section === "gestion") {
        afficherGestionClasses();

    } else if (section === "devoirs") {
        afficherCahierDevoirs();

    } else if (section === "evaluations") {
        afficherMenuEvaluations();

    } else {
        const sections = {
            ecole: [
                "🏫 Mon école",
                "Bienvenue dans ton école !"
            ]
        };

        const choix = sections[section];

        if (!choix) return;

        document.getElementById("section-contenu").innerHTML = `
            <h2>${choix[0]}</h2>
            <p>${choix[1]}</p>
        `;
    }

    contenu.scrollIntoView({ behavior: "smooth" });
}


function afficherRobots() {
    const zone = document.getElementById("section-contenu");

    zone.innerHTML = `
        <h2>🤖 Mes robots élèves</h2>
        <p>Inscris tes robots et choisis leur classe.</p>

        <form id="form-robot" class="robot-form">
            <label for="nom-robot">Nom du robot</label>
            <input id="nom-robot" name="nom" maxlength="30"
                placeholder="Exemple : Bolt" required>

            <label for="classe-robot">Classe</label>
            <select id="classe-robot" name="classeId" required>
                ${classes.map(c =>
                    `<option value="${c.id}">${echapperHTML(c.nom)}</option>`
                ).join("")}
            </select>

            <label for="matiere-robot">Matière préférée</label>
            <select id="matiere-robot" name="matiere">
                ${matieresDisponibles.map(m =>
                    `<option>${m}</option>`
                ).join("")}
            </select>

            <button type="submit" class="primary-button">
                ➕ Inscrire le robot
            </button>
        </form>

        <p id="message-robot" role="status"></p>
        <h3 id="nombre-robots"></h3>
        <div id="liste-robots" class="robot-list"></div>
    `;

    document.getElementById("form-robot").addEventListener(
        "submit",
        ajouterRobot
    );

    mettreAJourListeRobots();
}

function ajouterRobot(event) {
    event.preventDefault();

    const donnees = new FormData(event.currentTarget);
    const nom = String(donnees.get("nom")).trim();
    const classeId = Number(donnees.get("classeId"));
    const matiere = String(donnees.get("matiere"));

    if (!nom || !classes.some(c => c.id === classeId)) return;

    robots.push({
        id: prochainIdRobot++,
        nom,
        classeId,
        niveau: 1,
        matierePreferee: matiere
    });

    sauvegarderDonnees();

    mettreAJourListeRobots();

    document.getElementById("message-robot").textContent =
        `${nom} est inscrit dans la classe ${classes.find(c => c.id === classeId).nom} !`;

    event.currentTarget.reset();
}

function mettreAJourListeRobots() {
    const liste = document.getElementById("liste-robots");
    const compteur = document.getElementById("nombre-robots");

    if (!liste || !compteur) return;

    compteur.textContent = `${robots.length} robot(s) élève(s)`;

    liste.innerHTML = robots.map(robot => {
        const classe = classes.find(c => c.id === robot.classeId);

        return `
            <article class="robot-card">
                <div class="robot-avatar">🤖</div>
                <div class="robot-info">
                    <h3>${echapperHTML(robot.nom)}</h3>
                    <p>Classe : ${classe ? echapperHTML(classe.nom) : "Non affecté"}</p>
                    <p>Niveau : ${robot.niveau}</p>
                    <p>Matière préférée : ${echapperHTML(robot.matierePreferee)}</p>
                    <label for="affectation-${robot.id}">Changer de classe</label>
                    <select id="affectation-${robot.id}" data-robot-id="${robot.id}">
                        ${classes.map(c => `
                            <option value="${c.id}" ${c.id === robot.classeId ? "selected" : ""}>
                                ${echapperHTML(c.nom)}
                            </option>
                        `).join("")}
                    </select>
                </div>
                <button type="button" class="delete-button"
                    data-id="${robot.id}" aria-label="Supprimer le robot">
                    🗑️
                </button>
            </article>
        `;
    }).join("");

    liste.querySelectorAll("[data-robot-id]").forEach(select => {
        select.addEventListener("change", () => {
            const robot = robots.find(r => r.id === Number(select.dataset.robotId));
            if (!robot) return;

            robot.classeId = Number(select.value);
            mettreAJourListeRobots();

            document.getElementById("message-robot").textContent =
                `${robot.nom} a changé de classe.`;
        });
    });

    liste.querySelectorAll(".delete-button").forEach(bouton => {
        bouton.addEventListener("click", () => {
            const id = Number(bouton.dataset.id);
            robots = robots.filter(r => r.id !== id);
            mettreAJourListeRobots();
            document.getElementById("message-robot").textContent =
                "Robot retiré de l'école.";
        });
    });
}

function afficherGestionClasses() {
    const zone = document.getElementById("section-contenu");

    zone.innerHTML = `
        <h2>🏫 Gestion des classes</h2>
        <p>Organise les classes de la maternelle et de l'école élémentaire.</p>

        <form id="form-classe" class="robot-form">
            <label for="niveau-classe">Niveau scolaire</label>
            <select id="niveau-classe" name="niveau" required>
                ${niveauxScolaires.map(n => `<option>${n}</option>`).join("")}
            </select>

            <label for="nom-classe">Nom de la classe</label>
            <input id="nom-classe" name="nom" maxlength="40"
                placeholder="Exemple : CM1 B" required>

            <button type="submit" class="primary-button">
                ➕ Créer la classe
            </button>
        </form>

        <p id="message-classe" role="status"></p>
        <div id="liste-classes"></div>
    `;

    document.getElementById("form-classe").addEventListener(
        "submit",
        ajouterClasse
    );

    mettreAJourListeClasses();
}


function ajouterClasse(event) {
    event.preventDefault();

    const donnees = new FormData(event.currentTarget);
    const niveau = String(donnees.get("niveau"));
    const nom = String(donnees.get("nom")).trim();

    if (!niveauxScolaires.includes(niveau) || !nom) return;

    if (classes.some(c => c.nom.toLowerCase() === nom.toLowerCase())) {
        document.getElementById("message-classe").textContent =
            "Une classe porte déjà ce nom. Choisis-en un autre.";
        return;
    }

    // 1. Créer la classe
    const nouvelleClasse = {
        id: prochainIdClasse++,
        nom,
        niveau
    };

    classes.push(nouvelleClasse);

    // 2. Préparer les noms déjà utilisés dans l'école
    const nomsUtilises = new Set(
        robots.map(robot => robot.nom.toLowerCase())
    );

    // 3. Générer automatiquement 20 élèves
    for (let i = 0; i < 20; i++) {
        let nomComplet;
        let tentatives = 0;

        do {
            const prenom = prenomsEleves[
                Math.floor(Math.random() * prenomsEleves.length)
            ];

            const nomFamille = nomsEleves[
                Math.floor(Math.random() * nomsEleves.length)
            ];

            nomComplet = `${prenom} ${nomFamille}`;
            tentatives++;
        } while (
            nomsUtilises.has(nomComplet.toLowerCase()) &&
            tentatives < 2000
        );

        if (nomsUtilises.has(nomComplet.toLowerCase())) {
            document.getElementById("message-classe").textContent =
                "Impossible de générer assez de noms uniques.";
            break;
        }

        nomsUtilises.add(nomComplet.toLowerCase());

        robots.push({
            id: prochainIdRobot++,
            nom: nomComplet,
            classeId: nouvelleClasse.id,
            niveau: 1,
            matierePreferee: matieresDisponibles[
                Math.floor(Math.random() * matieresDisponibles.length)
            ]
        });
    }

    // 4. Actualiser l'affichage
    mettreAJourListeClasses();

    document.getElementById("message-classe").textContent =
        `La classe ${nom} a été créée avec ${
            robots.filter(r => r.classeId === nouvelleClasse.id).length
        } élèves !`;

    event.currentTarget.reset();

    sauvegarderDonnees();
}

function mettreAJourListeClasses() {
    const liste = document.getElementById("liste-classes");
    if (!liste) return;

    liste.innerHTML = niveauxScolaires.map(niveau => {
        const classesNiveau = classes.filter(c => c.niveau === niveau);

        return `
            <section class="class-group">
                <h3>${echapperHTML(niveau)}</h3>
                ${classesNiveau.length
                    ? classesNiveau.map(c => {
                        const nombre = robots.filter(r => r.classeId === c.id).length;
                        return `
                            <article class="robot-card">
                                <div class="robot-info">
                                    <strong>${echapperHTML(c.nom)}</strong>
                                    <p>${nombre} robot(s) élève(s)</p>
                                </div>
                                <button type="button" class="delete-button"
                                    data-classe-id="${c.id}"
                                    ${nombre ? "disabled title='Déplace les élèves avant de supprimer cette classe'" : ""}>
                                    🗑️
                                </button>
                            </article>
                        `;
                    }).join("")
                    : "<p>Aucune classe créée pour ce niveau.</p>"
                }
            </section>
        `;
    }).join("");

    liste.querySelectorAll("[data-classe-id]").forEach(bouton => {
        bouton.addEventListener("click", () => {
            const id = Number(bouton.dataset.classeId);
            const classe = classes.find(c => c.id === id);

            if (!classe || robots.some(r => r.classeId === id)) return;

            classes = classes.filter(c => c.id !== id);
            mettreAJourListeClasses();
        });
    });
}

function echapperHTML(texte) {
    return String(texte).replace(/[&<>"']/g, c => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[c]);
}

function retourAccueil() {
    document.getElementById("contenu").hidden = true;
}


const joursCours = [
    "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"
];

const creneauxCours = [
    "08:00 - 09:00",
    "09:00 - 10:00",
    "10:00 - 11:00",
    "11:00 - 12:00",
    "13:00 - 14:00",
    "14:00 - 15:00",
    "15:00 - 16:00"
];

let emploisDuTemps = {};


let historiqueAppels = [];
let coursEnCours = null;

function afficherEmploiDuTemps() {
    const zone = document.getElementById("section-contenu");

    if (classes.length === 0) {
        zone.innerHTML = `
            <h2>📅 Emploi du temps</h2>
            <p>Crée d'abord une classe dans la gestion scolaire.</p>
        `;
        return;
    }

    zone.innerHTML = `
        <h2>📅 Emploi du temps</h2>
        <p>Choisis une classe, puis clique sur un créneau pour programmer un cours.</p>

        <div class="timetable-controls">
            <label for="choix-classe-emploi">
                Classe
                <select id="choix-classe-emploi">
                    ${classes.map(c => `
                        <option value="${c.id}">${echapperHTML(c.nom)}</option>
                    `).join("")}
                </select>
            </label>
        </div>

        <p class="timetable-help">
            Clique sur une case pour choisir une matière.
            Le mercredi est disponible pour organiser les cours du matin.
        </p>

        <div class="timetable-wrap">
            <table class="timetable">
                <thead>
                    <tr>
                        <th>Horaire</th>
                        ${joursCours.map(jour => `<th>${jour}</th>`).join("")}
                    </tr>
                </thead>
                <tbody id="corps-emploi"></tbody>
            </table>
        </div>

        <p id="message-emploi" role="status"></p>
    `;

    document.getElementById("choix-classe-emploi")
        .addEventListener("change", dessinerEmploiDuTemps);

    dessinerEmploiDuTemps();
}

function cleCours(classeId, jour, horaire) {
    return `${classeId}|${jour}|${horaire}`;
}

function dessinerEmploiDuTemps() {
    const classeId = Number(
        document.getElementById("choix-classe-emploi").value
    );

    const corps = document.getElementById("corps-emploi");

    corps.innerHTML = creneauxCours.map(horaire => `
        <tr>
            <td>${horaire}</td>
            ${joursCours.map(jour => {
                const cle = cleCours(classeId, jour, horaire);
                const matiere = emploisDuTemps[cle] || "";

                return `
                    <td>
                        <button type="button"
                            class="timetable-cell ${matiere ? "" : "empty"}"
                            data-matiere="${echapperHTML(matiere)}"
                            data-cle="${cle.replace(/"/g, "&quot;")}"
                            title="Modifier le cours">
                            ${matiere ? echapperHTML(matiere) : "+ Ajouter"}
                        </button>
                    </td>
                `;
            }).join("")}
        </tr>
    `).join("");

    corps.querySelectorAll(".timetable-cell").forEach(bouton => {
        bouton.addEventListener("click", () => {
            modifierCours(bouton.dataset.cle);
        });
    });
}

function modifierCours(cle) {
    const matieres = [
        "Aucun cours",
        ...matieresDisponibles
    ];

    const choix = prompt(
        "Choisis une matière en saisissant son numéro :\n\n" +
        matieres.map((matiere, index) =>
            `${index} : ${matiere}`
        ).join("\n")
    );

    if (choix === null) return;

    const index = Number(choix);

    if (
        choix.trim() === "" ||
        !Number.isInteger(index) ||
        index < 0 ||
        index >= matieres.length
    ) {
        document.getElementById("message-emploi").textContent =
            "Numéro invalide. Réessaie en cliquant sur une case.";
        return;
    }

    if (index === 0) {
        delete emploisDuTemps[cle];
    } else {
        emploisDuTemps[cle] = matieres[index];
    }

    dessinerEmploiDuTemps();

    document.getElementById("message-emploi").textContent =
        "Emploi du temps modifié !";
}


function afficherAppel() {
    const zone = document.getElementById("section-contenu");

    if (classes.length === 0) {
        zone.innerHTML = `
            <h2>📖 Cours et appel</h2>
            <p>Tu dois d'abord créer une classe dans Gestion scolaire.</p>
        `;
        return;
    }

    zone.innerHTML = `
        <h2>📖 Cours et appel</h2>
        <p>Choisis une classe pour faire l'appel avant le cours.</p>

        <label for="classe-appel">Classe :</label>
        <select id="classe-appel">
            ${classes.map(classe => `
                <option value="${classe.id}">
                    ${echapperHTML(classe.nom)}
                </option>
            `).join("")}
        </select>

        <div id="liste-appel"></div>
        <p id="message-appel"></p>
    `;

    document.getElementById("classe-appel").addEventListener("change", afficherListeAppel);
    afficherListeAppel();
}

function afficherListeAppel() {
    const select = document.getElementById("classe-appel");
    const liste = document.getElementById("liste-appel");

    if (!select || !liste) return;

    const classeId = Number(select.value);
    const robotsDeLaClasse = robots.filter(
        robot => robot.classeId === classeId
    );

    if (robotsDeLaClasse.length === 0) {
        liste.innerHTML = "<p>Il n'y a aucun robot dans cette classe.</p>";
        return;
    }

    liste.innerHTML = `
        <h3>📝 Liste des élèves</h3>
        ${robotsDeLaClasse.map(robot => `
            <div class="robot-card">
                <strong>🤖 ${echapperHTML(robot.nom)}</strong>

                <label for="presence-${robot.id}">Présence :</label>
                <select id="presence-${robot.id}" class="presence-robot">
                    <option value="Présent">✅ Présent</option>
                    <option value="Absent">❌ Absent</option>
                    <option value="En retard">⏰ En retard</option>
                </select>
            </div>
        `).join("")}

        <button type="button" id="terminer-appel">
            ✅ Terminer l'appel
        </button>
    `;

    document.getElementById("terminer-appel").addEventListener("click", terminerAppel);
}

function terminerAppel() {
    const classeSelect = document.getElementById("classe-appel");
    const message = document.getElementById("message-appel");

    const classeId = Number(classeSelect.value);
    const classe = classes.find(c => c.id === classeId);

    if (!classe) {
    message.textContent = "Classe introuvable.";
    return;
}

    const resultats = robots
        .filter(robot => robot.classeId === classeId)
        .map(robot => {
            const select = document.getElementById(`presence-${robot.id}`);

            return {
                nom: robot.nom,
                presence: select ? select.value : "Présent"
            };
        });


historiqueAppels.push({
    date: new Date().toLocaleString("fr-FR"),
    classe: classe.nom,
    resultats: resultats
});

sauvegarderDonnees();

    const presents = resultats.filter(r => r.presence === "Présent").length;
    const absents = resultats.filter(r => r.presence === "Absent").length;
    const retards = resultats.filter(r => r.presence === "En retard").length;

    message.innerHTML = `
        <h3>📋 Appel terminé — ${echapperHTML(classe.nom)}</h3>
        <p>✅ Présents : ${presents}</p>
        <p>❌ Absents : ${absents}</p>
        <p>⏰ En retard : ${retards}</p>
        <p>Le professeur peut maintenant commencer le cours !</p>
    `;
}


function afficherMenuCours() {
    const zone = document.getElementById("section-contenu");

    zone.innerHTML = `
        <h2>📚 Espace professeur</h2>
        <p>Prépare tes cours et organise le travail de tes élèves robots.</p>


<article class="robot-card">
    <div class="robot-info">
        <h3>📊 Bulletins des élèves</h3>
        <p>Consulte les résultats de chaque classe.</p>
        <button type="button" id="bouton-bulletins">
            Ouvrir les bulletins
        </button>
    </div>
</article>

        <div class="robot-list">
            <article class="robot-card">
                <div class="robot-info">
                    <h3>📋 Faire l'appel</h3>
                    <p>Vérifie les présences de tes élèves.</p>
                    <button type="button" id="bouton-appel">
                        Commencer l'appel
                    </button>
                </div>
            </article>

            <article class="robot-card">
                <div class="robot-info">
                    <h3>📖 Donner une leçon</h3>
                    <p>Choisis une classe et une matière à enseigner.</p>
                    <button type="button" id="bouton-lecon">
                        Préparer une leçon
                    </button>
                </div>
            </article>

            <article class="robot-card">
                <div class="robot-info">
                    <h3>✏️ Exercices</h3>
                    <p>Prépare des exercices pour tes élèves.</p>
                    <button type="button" id="bouton-exercices">
                        Préparer les exercices
                    </button>
                </div>
            </article>

            <article class="robot-card">
                <div class="robot-info">
                    <h3>✅ Corrections</h3>
                    <p>Consulte et corrige les travaux des élèves.</p>
                    <button type="button" id="bouton-corrections">
                        Ouvrir les corrections
                    </button>
                </div>
            </article>
        </div>
    `;

    document.getElementById("bouton-appel").addEventListener(
        "click",
        afficherAppel
    );

    document.getElementById("bouton-lecon").addEventListener(
        "click",
        afficherPreparationLecon
    );

    document.getElementById("bouton-exercices").addEventListener(
        "click",
        () => afficherFonctionCours("exercices")
    );

    document.getElementById("bouton-corrections").addEventListener(
        "click",
        () => afficherFonctionCours("corrections")
    );

    document.getElementById("bouton-bulletins").addEventListener(
    "click",
    afficherBulletins
);
}

function afficherFonctionCours(type) {
    const zone = document.getElementById("section-contenu");

    const titres = {
        exercices: "✏️ Préparation des exercices",
        corrections: "✅ Corrections des travaux"
    };

    zone.innerHTML = `
        <h2>${titres[type]}</h2>
        <p>Cette fonctionnalité sera développée dans les prochaines étapes.</p>
        <button type="button" id="retour-menu-cours">
            ↩️ Retour à l'espace professeur
        </button>
    `;

    document.getElementById("retour-menu-cours").addEventListener(
        "click",
        afficherMenuCours
    );
}



function afficherPreparationLecon() {
    const zone = document.getElementById("section-contenu");

    if (classes.length === 0) {
        zone.innerHTML = `
            <h2>📖 Préparer une leçon</h2>
            <p>Crée d'abord une classe dans Gestion scolaire.</p>
            <button id="retour-menu-cours" type="button">↩️ Retour</button>
        `;

        document.getElementById("retour-menu-cours")
            .addEventListener("click", afficherMenuCours);
        return;
    }

    zone.innerHTML = `
        <h2>📖 Préparer une leçon</h2>

        <form id="form-preparation-lecon" class="robot-form">
            <label for="classe-lecon">Classe</label>
            <select id="classe-lecon" name="classeId" required>
                ${classes.map(c => `
                    <option value="${c.id}">
                        ${echapperHTML(c.nom)} — ${echapperHTML(c.niveau)}
                    </option>
                `).join("")}
            </select>

            <label for="matiere-lecon">Matière</label>
            <select id="matiere-lecon" name="matiere" required>
                ${matieresDisponibles.map(m => `
                    <option value="${echapperHTML(m)}">${echapperHTML(m)}</option>
                `).join("")}
            </select>

            <label for="type-lecon">Type de leçon</label>
            <select id="type-lecon" name="type" required>
                <option value="preparee">Choisir une leçon préparée</option>
                <option value="personnalisee">Créer ma propre leçon</option>
            </select>

            <div id="choix-lecon-preparee">
                <label for="lecon-catalogue">Leçon disponible</label>
                <select id="lecon-catalogue" name="leconId"></select>
            </div>

            <div id="champs-lecon-personnalisee" hidden>
                <label for="titre-lecon">Titre</label>
                <input id="titre-lecon" name="titre" maxlength="100">

                <label for="contenu-lecon">Contenu de la leçon</label>
                <textarea id="contenu-lecon" name="contenu" rows="5"></textarea>

                <label for="question-lecon">Question pour les élèves</label>
                <input id="question-lecon" name="question" maxlength="300">

                <label for="reponse-1">Réponse 1</label>
                <input id="reponse-1" name="reponse1" maxlength="150">

                <label for="reponse-2">Réponse 2</label>
                <input id="reponse-2" name="reponse2" maxlength="150">

                <label for="reponse-3">Réponse 3</label>
                <input id="reponse-3" name="reponse3" maxlength="150">

                <label for="bonne-reponse">Bonne réponse</label>
                <select id="bonne-reponse" name="bonneReponse">
                    <option value="0">Réponse 1</option>
                    <option value="1">Réponse 2</option>
                    <option value="2">Réponse 3</option>
                </select>
            </div>

            <button type="submit" class="primary-button">
                🚀 Commencer la leçon
            </button>
        </form>

        <p id="message-preparation" role="status"></p>

        <button id="retour-menu-cours" type="button">
            ↩️ Retour à l'espace professeur
        </button>
    `;

    const selectType = document.getElementById("type-lecon");
    const selectClasse = document.getElementById("classe-lecon");
    const selectMatiere = document.getElementById("matiere-lecon");

    function actualiserChoixLecons() {
        const classe = classes.find(
            c => c.id === Number(selectClasse.value)
        );

        const lecons = catalogueLecons.filter(lecon =>
            lecon.niveau === classe?.niveau &&
            lecon.matiere === selectMatiere.value
        );

        document.getElementById("lecon-catalogue").innerHTML =
            lecons.length
                ? lecons.map(lecon => `
                    <option value="${lecon.id}">
                        ${echapperHTML(lecon.titre)}
                    </option>
                `).join("")
                : `<option value="">Aucune leçon préparée pour ce choix</option>`;

        document.getElementById("choix-lecon-preparee").hidden =
            selectType.value !== "preparee";

        document.getElementById("champs-lecon-personnalisee").hidden =
            selectType.value !== "personnalisee";
    }

    selectType.addEventListener("change", actualiserChoixLecons);
    selectClasse.addEventListener("change", actualiserChoixLecons);
    selectMatiere.addEventListener("change", actualiserChoixLecons);

    actualiserChoixLecons();

    document.getElementById("form-preparation-lecon")
        .addEventListener("submit", commencerLecon);

    document.getElementById("retour-menu-cours")
        .addEventListener("click", afficherMenuCours);
}


function commencerLecon(event) {
    event.preventDefault();

    const donnees = new FormData(event.currentTarget);
    const classeId = Number(donnees.get("classeId"));
    const matiere = String(donnees.get("matiere"));
    const type = String(donnees.get("type"));

    const classe = classes.find(c => c.id === classeId);

    if (!classe || !matieresDisponibles.includes(matiere)) {
        return;
    }

    let lecon;

    if (type === "preparee") {
        const leconId = Number(donnees.get("leconId"));

        lecon = catalogueLecons.find(l =>
            l.id === leconId &&
            l.niveau === classe.niveau &&
            l.matiere === matiere
        );

        if (!lecon) {
            document.getElementById("message-preparation").textContent =
                "Aucune leçon préparée disponible pour cette classe et cette matière.";
            return;
        }
    } else {
        const titre = String(donnees.get("titre") || "").trim();
        const contenu = String(donnees.get("contenu") || "").trim();
        const question = String(donnees.get("question") || "").trim();

        const reponses = [
            String(donnees.get("reponse1") || "").trim(),
            String(donnees.get("reponse2") || "").trim(),
            String(donnees.get("reponse3") || "").trim()
        ];

        const bonneReponse = Number(donnees.get("bonneReponse"));

        if (
            !titre || !contenu || !question ||
            reponses.some(r => !r) ||
            !Number.isInteger(bonneReponse) ||
            bonneReponse < 0 || bonneReponse > 2
        ) {
            document.getElementById("message-preparation").textContent =
                "Remplis tous les champs de ta leçon et ses trois réponses.";
            return;
        }

        lecon = {
            id: Date.now(),
            niveau: classe.niveau,
            matiere,
            titre,
            contenu,
            question,
            reponses,
            bonneReponse
        };
    }

    zoneCoursEnPreparation = {
        ...lecon,
        classeId: classe.id,
        classeNom: classe.nom,
        matiere
    };

    const nombreEleves = robots.filter(
        robot => robot.classeId === classeId
    ).length;

    afficherLeconEnCours(nombreEleves);
}

let zoneCoursEnPreparation = null;



function afficherLeconEnCours(nombreEleves) {
    const zone = document.getElementById("section-contenu");
    const lecon = zoneCoursEnPreparation;

    if (!lecon) {
        afficherMenuCours();
        return;
    }

    const eleves = robots.filter(
        robot => robot.classeId === lecon.classeId
    );

    let resultatsRobots = [];

    zone.innerHTML = `
        <div class="lecon-en-cours">
            <h2>📚 ${echapperHTML(lecon.titre)}</h2>

            <p><strong>🏫 Classe :</strong> ${echapperHTML(lecon.classeNom)}</p>
            <p><strong>📖 Matière :</strong> ${echapperHTML(lecon.matiere)}</p>
            <p><strong>🤖 Élèves :</strong> ${eleves.length}</p>

            <hr>

            <h3>👨‍🏫 Leçon du jour</h3>
            <p>${echapperHTML(lecon.contenu).replace(/\n/g, "<br>")}</p>

            <hr>

            <h3>❓ Question pour les élèves</h3>
            <p>${echapperHTML(lecon.question)}</p>

            <button id="faire-repondre-robots" type="button">
                🤖 Faire répondre toute la classe
            </button>

            <div id="resultats-classe"></div>

            <hr>

            <h3>✍️ Réponse du professeur</h3>

            <form id="form-reponse-lecon">
                ${lecon.reponses.map((reponse, index) => `
                    <label class="reponse-lecon">
                        <input
                            type="radio"
                            name="reponse"
                            value="${index}"
                            required
                        >
                        ${echapperHTML(reponse)}
                    </label>
                `).join("")}

                <button type="submit" class="primary-button">
                    ✅ Corriger ma réponse
                </button>
            </form>

            <p id="resultat-reponse" role="status"></p>

            <button id="terminer-lecon" type="button">
                🏁 Terminer la leçon
            </button>

            <button id="retour-menu-cours" type="button">
                ↩️ Retour à l'espace professeur
            </button>
        </div>
    `;

    document.getElementById("faire-repondre-robots")
        .addEventListener("click", function() {
            resultatsRobots = eleves.map(robot => {
                const connaitReponse = Math.random() < 0.7;
                let reponseChoisie;

                if (connaitReponse || lecon.reponses.length < 2) {
                    reponseChoisie = lecon.bonneReponse;
                } else {
                    const mauvaisesReponses = lecon.reponses
                        .map((_, index) => index)
                        .filter(index => index !== lecon.bonneReponse);

                    reponseChoisie = mauvaisesReponses[
                        Math.floor(Math.random() * mauvaisesReponses.length)
                    ];
                }

                return {
                    nom: robot.nom,
                    reponse: reponseChoisie,
                    correct: reponseChoisie === lecon.bonneReponse
                };
            });

            const bonnesReponses = resultatsRobots.filter(
                resultat => resultat.correct
            ).length;


historiqueResultats.push({
    date: new Date().toLocaleString("fr-FR"),
    classe: lecon.classeNom,
    matiere: lecon.matiere,
    lecon: lecon.titre,
    totalEleves: resultatsRobots.length,
    bonnesReponses: bonnesReponses,
    eleves: resultatsRobots.map(resultat => ({
        nom: resultat.nom,
        reponse: lecon.reponses[resultat.reponse],
        correct: resultat.correct
    }))
});

sauvegarderDonnees();

            document.getElementById("resultats-classe").innerHTML = `
                <h3>📊 Résultats de la classe</h3>
                <p>
                    ${bonnesReponses} bonne(s) réponse(s) sur
                    ${resultatsRobots.length} élèves.
                </p>

                <ul>
                    ${resultatsRobots.map(resultat => `
                        <li>
                            ${echapperHTML(resultat.nom)} :
                            ${echapperHTML(lecon.reponses[resultat.reponse])}
                            ${resultat.correct ? "✅" : "❌"}
                        </li>
                    `).join("")}
                </ul>
            `;
        });

    document.getElementById("form-reponse-lecon")
        .addEventListener("submit", function(event) {
            event.preventDefault();

            const choix = document.querySelector(
                'input[name="reponse"]:checked'
            );

            if (!choix) return;

            const resultat = document.getElementById("resultat-reponse");

            if (Number(choix.value) === lecon.bonneReponse) {
                resultat.textContent = "🎉 Bravo ! C'est la bonne réponse !";
            } else {
                resultat.textContent =
                    "📘 Ce n'est pas la bonne réponse. Relis la leçon et réessaie !";
            }
        });

    document.getElementById("terminer-lecon")
        .addEventListener("click", afficherMenuCours);

    document.getElementById("retour-menu-cours")
        .addEventListener("click", afficherMenuCours);
}


const catalogueLecons = [
    {
        id: 1,
        niveau: "CP",
        matiere: "Mathématiques",
        titre: "Additionner des nombres",
        contenu: "Une addition permet de réunir des quantités. Par exemple, 3 + 2 = 5.",
        question: "Combien font 3 + 2 ?",
        reponses: ["4", "5", "6"],
        bonneReponse: 1
    },
    {
        id: 2,
        niveau: "CP",
        matiere: "Français",
        titre: "Reconnaître les voyelles",
        contenu: "Les principales voyelles sont A, E, I, O, U et Y.",
        question: "Quelle lettre est une voyelle ?",
        reponses: ["B", "A", "T"],
        bonneReponse: 1
    },
    {
        id: 3,
        niveau: "CE2",
        matiere: "Mathématiques",
        titre: "Les tables de multiplication",
        contenu: "Multiplier, c'est additionner plusieurs fois la même quantité. Par exemple, 4 × 3 = 12.",
        question: "Combien font 4 × 3 ?",
        reponses: ["7", "12", "16"],
        bonneReponse: 1
    },
    {
        id: 4,
        niveau: "CM1",
        matiere: "Mathématiques",
        titre: "Les multiplications",
        contenu: "Pour multiplier 23 par 3, on calcule 20 × 3 puis 3 × 3. On additionne les résultats : 60 + 9 = 69.",
        question: "Combien font 23 × 3 ?",
        reponses: ["66", "69", "72"],
        bonneReponse: 1
    },
    {
        id: 5,
        niveau: "CM1",
        matiere: "Français",
        titre: "Le sujet et le verbe",
        contenu: "Le sujet indique qui fait l'action. Le verbe exprime généralement une action ou un état. Exemple : Le robot court. Le sujet est « Le robot » et le verbe est « court ».",
        question: "Dans « Le robot chante », quel est le verbe ?",
        reponses: ["Le robot", "chante", "le"],
        bonneReponse: 1
    },
    {
        id: 6,
        niveau: "CM2",
        matiere: "Mathématiques",
        titre: "Les fractions",
        contenu: "Une fraction représente une ou plusieurs parts d'un tout partagé en parts égales. Dans 3/4, le 4 indique le nombre total de parts égales.",
        question: "Dans la fraction 3/4, que représente le 4 ?",
        reponses: [
            "Le nombre de parts égales",
            "Le nombre de parts coloriées",
            "Le résultat d'une addition"
        ],
        bonneReponse: 0
    }
];


function afficherBulletins() {
    const zone = document.getElementById("section-contenu");

    zone.innerHTML = `
        <h2>📊 Bulletins des élèves</h2>
        <p>Choisis une classe pour consulter les résultats de ses élèves.</p>

        <label for="classe-bulletins">Classe :</label>
        <select id="classe-bulletins">
            ${classes.map(classe => `
                <option value="${classe.id}">
                    ${echapperHTML(classe.nom)}
                </option>
            `).join("")}
        </select>

        <div id="contenu-bulletins"></div>

        <button type="button" id="retour-menu-cours">
            ↩️ Retour à l'espace professeur
        </button>
    `;

    document.getElementById("classe-bulletins")
        .addEventListener("change", afficherResultatsBulletins);

    document.getElementById("retour-menu-cours")
        .addEventListener("click", afficherMenuCours);

    afficherResultatsBulletins();
}


function afficherResultatsBulletins() {
    const select = document.getElementById("classe-bulletins");
    const zone = document.getElementById("contenu-bulletins");

    if (!select || !zone) return;

    const classeId = Number(select.value);
    const classe = classes.find(c => c.id === classeId);

    if (!classe) {
        zone.innerHTML = "<p>Aucune classe disponible.</p>";
        return;
    }

    const eleves = robots.filter(
        robot => robot.classeId === classeId
    );

    zone.innerHTML = `
        <h3>🏫 Classe ${echapperHTML(classe.nom)}</h3>
        <p>Nombre d'élèves : ${eleves.length}</p>

        ${eleves.map(eleve => {
            const resultats = historiqueResultats.flatMap(historique =>
                historique.classe === classe.nom
                    ? historique.eleves
                        .filter(resultat => resultat.nom === eleve.nom)
                        .map(resultat => ({
                            ...resultat,
                            lecon: historique.lecon,
                            matiere: historique.matiere,
                            date: historique.date
                        }))
                    : []
            );

            const bonnesReponses = resultats.filter(
                resultat => resultat.correct
            ).length;

            return `
                <article class="robot-card">
                    <div class="robot-info">
                        <h4>🤖 ${echapperHTML(eleve.nom)}</h4>
                        <p>Leçons enregistrées : ${resultats.length}</p>
                        <p>Bonnes réponses : ${bonnesReponses}</p>

                        ${resultats.length
                            ? `
                                <details>
                                    <summary>Voir les résultats</summary>
                                    <ul>
                                        ${resultats.map(resultat => `
                                            <li>
                                                ${echapperHTML(resultat.lecon)}
                                                (${echapperHTML(resultat.matiere)})
                                                — ${resultat.correct ? "✅ Réussi" : "❌ À revoir"}
                                                <br>
                                                Réponse :
                                                ${echapperHTML(resultat.reponse)}
                                                <br>
                                                <small>${echapperHTML(resultat.date)}</small>
                                            </li>
                                        `).join("")}
                                    </ul>
                                </details>
                            `
                            : "<p>Aucun résultat enregistré pour le moment.</p>"
                        }
                    </div>
                </article>
            `;
        }).join("")}
    `;
}


function afficherCahierDevoirs() {
    const zone = document.getElementById("section-contenu");

    zone.innerHTML = `
        <h2>📚 Cahier de devoirs</h2>
        <p>Prépare du travail pour tes élèves robots.</p>

        <form id="form-devoir" class="robot-form">
            <label for="classe-devoir">Classe</label>
            <select id="classe-devoir" name="classeId" required>
                ${classes.map(classe => `
                    <option value="${classe.id}">
                        ${echapperHTML(classe.nom)} — ${echapperHTML(classe.niveau)}
                    </option>
                `).join("")}
            </select>

            html
<label for="type-devoir">Type de devoir</label>
<select id="type-devoir" name="type" required>
    <option value="Exercices">✏️ Exercices</option>
    <option value="Leçon à revoir">📖 Leçon à revoir</option>
    <option value="Évaluation">📝 Évaluation</option>
    <option value="Lecture">📚 Lecture</option>
    <option value="Poésie à apprendre">🎤 Poésie à apprendre</option>
    <option value="Mots à apprendre">🔤 Mots à apprendre</option>
    <option value="Recherche">🔎 Recherche</option>
    <option value="Autre">📋 Autre travail</option>
</select>



            <label for="matiere-devoir">Matière</label>
            <select id="matiere-devoir" name="matiere" required>
                ${matieresDisponibles.map(matiere => `
                    <option value="${echapperHTML(matiere)}">
                        ${echapperHTML(matiere)}
                    </option>
                `).join("")}
            </select>

            <label for="titre-devoir">Titre du devoir</label>
            <input
                id="titre-devoir"
                name="titre"
                maxlength="100"
                placeholder="Exemple : Les multiplications"
                required
            >

            <label for="consignes-devoir">Consignes</label>
            <textarea
                id="consignes-devoir"
                name="consignes"
                rows="5"
                maxlength="2000"
                placeholder="Explique le travail à réaliser..."
                required
            ></textarea>

            <label for="date-devoir">Date limite</label>
            <input
                id="date-devoir"
                name="dateLimite"
                type="date"
                required
            >

            <button type="submit" class="primary-button">
                📤 Donner le devoir à la classe
            </button>
        </form>

        <p id="message-devoir" role="status"></p>

        <h3>📋 Devoirs distribués</h3>
        <div id="liste-devoirs"></div>

        <button type="button" id="retour-accueil-devoirs">
            ↩️ Retour à l'accueil
        </button>
    `;

    const dateMinimum = new Date();
    dateMinimum.setMinutes(
        dateMinimum.getMinutes() - dateMinimum.getTimezoneOffset()
    );

    document.getElementById("date-devoir").min =
        dateMinimum.toISOString().slice(0, 10);

    document.getElementById("form-devoir").addEventListener(
        "submit",
        enregistrerDevoir
    );

    document.getElementById("retour-accueil-devoirs").addEventListener(
        "click",
        retourAccueil
    );

    afficherListeDevoirs();
}


function enregistrerDevoir(event) {
    event.preventDefault();

    const donnees = new FormData(event.currentTarget);

    const classeId = Number(donnees.get("classeId"));
    const matiere = String(donnees.get("matiere") || "");
    const type = String(donnees.get("type") || "");
    const titre = String(donnees.get("titre") || "").trim();
    const consignes = String(donnees.get("consignes") || "").trim();
    const dateLimite = String(donnees.get("dateLimite") || "");

    const classe = classes.find(c => c.id === classeId);

    if (
        !classe ||
        !matieresDisponibles.includes(matiere) ||
        !titre ||
        !consignes ||
        !dateLimite
    ) {
        document.getElementById("message-devoir").textContent =
            "Vérifie tous les champs avant de distribuer le devoir.";
        return;
    }

    devoirs.push({
        id: prochainIdDevoir++,
        classeId: classe.id,
        classeNom: classe.nom,
        matiere,
        type,
        titre,
        consignes,
        dateLimite,
        dateCreation: new Date().toLocaleDateString("fr-FR"),
        resultats: []
    });
    sauvegarderDonnees();

    document.getElementById("message-devoir").textContent =
        `✅ Le devoir « ${titre} » a été donné à la classe ${classe.nom} !`;

    event.currentTarget.reset();

    afficherListeDevoirs();
}


function afficherListeDevoirs() {
    const liste = document.getElementById("liste-devoirs");

    if (!liste) return;

    if (devoirs.length === 0) {
        liste.innerHTML = "<p>Aucun devoir distribué pour le moment.</p>";
        return;
    }

    liste.innerHTML = [...devoirs].reverse().map(devoir => `
        <article class="robot-card">
            <div class="robot-info">
                <h3>📝 ${echapperHTML(devoir.titre)}</h3>
                <p>🏫 Classe : ${echapperHTML(devoir.classeNom)}</p>
                <p>📌 Type : ${echapperHTML(devoir.type || "Exercices")}</p>
                <p>📚 Matière : ${echapperHTML(devoir.matiere)}</p>
                <p>📅 Date limite : ${echapperHTML(devoir.dateLimite)}</p>
                <p>📖 Consignes :</p>
                <p>${echapperHTML(devoir.consignes).replace(/\n/g, "<br>")}</p>
                <button type="button" onclick="faireDevoir(${devoir.id})">
    ✏️ Faire ce devoir
</button>
            </div>
        </article>
    `).join("");
}

function sauvegarderDonnees() {
    const sauvegarde = {
    classes,
    robots,
    devoirs,
    evaluations,
    prochainIdEvaluation,
    historiqueResultats,
    emploisDuTemps,
    historiqueAppels,
    historiqueDevoirs,
    prochainIdRobot,
    prochainIdDevoir,
    prochainIdClasse
};

    try {
        localStorage.setItem(
            "ecoleRobotsSauvegarde",
            JSON.stringify(sauvegarde)
        );
    } catch (erreur) {
        console.error("Erreur de sauvegarde :", erreur);
    }
}

function chargerDonnees() {
    try {
        const texteSauvegarde = localStorage.getItem(
            "ecoleRobotsSauvegarde"
        );

        if (!texteSauvegarde) return;

        const sauvegarde = JSON.parse(texteSauvegarde);

        if (Array.isArray(sauvegarde.classes)) {
            classes = sauvegarde.classes;
        }

        if (Array.isArray(sauvegarde.robots)) {
            robots = sauvegarde.robots;
        }

        if (Array.isArray(sauvegarde.devoirs)) {
            devoirs = sauvegarde.devoirs;
        }

        if (Array.isArray(sauvegarde.evaluations)) {
    evaluations = sauvegarde.evaluations;
}

if (Number.isInteger(sauvegarde.prochainIdEvaluation)) {
    prochainIdEvaluation = sauvegarde.prochainIdEvaluation;
}

        if (Array.isArray(sauvegarde.historiqueResultats)) {
            historiqueResultats = sauvegarde.historiqueResultats;
        }

        if (
        sauvegarde.emploisDuTemps &&
        typeof sauvegarde.emploisDuTemps === "object"
        ) {
        emploisDuTemps = sauvegarde.emploisDuTemps;
        }

        if (Array.isArray(sauvegarde.historiqueAppels)) {
        historiqueAppels = sauvegarde.historiqueAppels;
        }

        if (Array.isArray(sauvegarde.historiqueDevoirs)) {
        historiqueDevoirs = sauvegarde.historiqueDevoirs;
        }

        if (Number.isInteger(sauvegarde.prochainIdRobot)) {
            prochainIdRobot = sauvegarde.prochainIdRobot;
        }

        if (Number.isInteger(sauvegarde.prochainIdDevoir)) {
            prochainIdDevoir = sauvegarde.prochainIdDevoir;
        }

        if (Number.isInteger(sauvegarde.prochainIdClasse)) {
            prochainIdClasse = sauvegarde.prochainIdClasse;
        }
    } catch (erreur) {
        console.error("Erreur de chargement :", erreur);
    }
}


// Charger les données sauvegardées dès que le fichier est prêt.
chargerDonnees();

// Sauvegarder automatiquement les données quand la page se ferme.
window.addEventListener("beforeunload", sauvegarderDonnees);


function afficherMenuEvaluations() {
    const zone = document.getElementById("section-contenu");

    zone.innerHTML = `
        <div class="evaluations">
            <h2>📝 Mes évaluations</h2>
            <p>Prépare les contrôles de tes élèves robots.</p>

            <form id="form-evaluation">
                <label for="evaluation-titre">Nom de l'évaluation</label>
                <input
                    type="text"
                    id="evaluation-titre"
                    name="titre"
                    placeholder="Exemple : Contrôle sur les additions"
                    required
                >

                <label for="evaluation-classe">Classe</label>
                <select id="evaluation-classe" name="classeId" required>
                    ${classes.map(classe => `
                        <option value="${classe.id}">
                            ${echapperHTML(classe.nom)}
                        </option>
                    `).join("")}
                </select>

                <label for="evaluation-matiere">Matière</label>
                <select id="evaluation-matiere" name="matiere" required>
                    ${matieresDisponibles.map(matiere => `
                        <option value="${echapperHTML(matiere)}">
                            ${echapperHTML(matiere)}
                        </option>
                    `).join("")}
                </select>

                <button type="submit" class="primary-button">
                    ➕ Créer l'évaluation
                </button>
            </form>

            <p id="message-evaluation" role="status"></p>
            <div id="liste-evaluations"></div>
        </div>
    `;

    document.getElementById("form-evaluation")
        .addEventListener("submit", creerEvaluation);

    afficherListeEvaluations();
}

function creerEvaluation(event) {
    event.preventDefault();

    const donnees = new FormData(event.currentTarget);

    const titre = String(donnees.get("titre") || "").trim();
    const classeId = Number(donnees.get("classeId"));
    const matiere = String(donnees.get("matiere") || "");

    const classe = classes.find(c => c.id === classeId);

    if (!titre || !classe || !matieresDisponibles.includes(matiere)) {
        document.getElementById("message-evaluation").textContent =
            "Vérifie le titre, la classe et la matière.";
        return;
    }

    evaluations.push({
        id: prochainIdEvaluation++,
        titre,
        classeId,
        classeNom: classe.nom,
        matiere,
        date: new Date().toLocaleDateString("fr-FR"),
        questions: [],
        notes: []
    });

    sauvegarderDonnees();

    document.getElementById("message-evaluation").textContent =
        `✅ L'évaluation « ${titre} » a été créée pour la classe ${classe.nom}.`;

    event.currentTarget.reset();

    afficherListeEvaluations();
}

function afficherListeEvaluations() {
    const liste = document.getElementById("liste-evaluations");

    if (!liste) return;

    if (evaluations.length === 0) {
        liste.innerHTML = "<p>Aucune évaluation créée pour le moment.</p>";
        return;
    }

    liste.innerHTML = `
        <h3>📋 Évaluations préparées</h3>

        ${evaluations.map(evaluation => `
            <article class="evaluation-card">
                <h4>${echapperHTML(evaluation.titre)}</h4>
                <p>🏫 Classe : ${echapperHTML(evaluation.classeNom)}</p>
                <p>📚 Matière : ${echapperHTML(evaluation.matiere)}</p>
                <p>📅 Créée le : ${echapperHTML(evaluation.date)}</p>
                <p>❓ Questions : ${evaluation.questions.length}</p>
            </article>
        `).join("")}
    `;
}
