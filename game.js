
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
let exercices = [];
let prochainIdExercice = 1;
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

    
    } else if (section === "eleves") {
        afficherEspaceEleves();


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

    if (type === "corrections") {
        zone.innerHTML = `
            <h2>✅ Corrections des travaux</h2>
            <p>Les réponses des robots seront affichées ici.</p>
            <button type="button" id="retour-menu-cours">
                ↩️ Retour à l'espace professeur
            </button>
        `;

        document.getElementById("retour-menu-cours").addEventListener(
            "click",
            afficherMenuCours
        );
        return;
    }

    zone.innerHTML = `
        <h2>✏️ Préparation des exercices</h2>

        <label for="exercice-classe">Classe :</label>
        <select id="exercice-classe">
            ${classes.map(classe => `
                <option value="${classe.id}">
                    ${echapperHTML(classe.nom)}
                </option>
            `).join("")}
        </select>

        <br><br>

        <label for="exercice-matiere">Matière :</label>
        <select id="exercice-matiere">
            ${matieresDisponibles.map(matiere => `
                <option value="${echapperHTML(matiere)}">
                    ${echapperHTML(matiere)}
                </option>
            `).join("")}
        </select>

        <br><br>

        <label for="exercice-titre">Titre de l'exercice :</label>
        <input
            type="text"
            id="exercice-titre"
            placeholder="Exemple : Les multiplications"
        >

        <br><br>

        <label for="exercice-consigne">Consigne :</label>
        <textarea
            id="exercice-consigne"
            rows="3"
            placeholder="Explique ce que les robots doivent faire..."
        ></textarea>

        <br><br>

        <button type="button" id="ajouter-question-exercice">
            ➕ Ajouter une question
        </button>

        <div id="questions-exercice"></div>

        <br>

        <button type="button" id="enregistrer-exercice">
            💾 Enregistrer l'exercice
        </button>

        <button type="button" id="retour-menu-cours">
            ↩️ Retour à l'espace professeur
        </button>
    `;

    const zoneQuestions = document.getElementById("questions-exercice");
    let nombreQuestions = 0;

    
document.getElementById("ajouter-question-exercice")
    .addEventListener("click", function () {
        nombreQuestions++;

        const bloc = document.createElement("div");
        bloc.className = "question-exercice";
        bloc.dataset.numero = nombreQuestions;

        bloc.innerHTML = `
            <hr>
            <h3>Question ${nombreQuestions}</h3>

            <label>Énoncé :</label>
            <input
                type="text"
                class="question-enonce"
                placeholder="Écris la question"
            >

            <br><br>

            <label>Réponse attendue :</label>
            <input
                type="text"
                class="question-reponse"
                placeholder="Écris la bonne réponse"
            >

            <br><br>

            <button type="button" class="supprimer-question">
                🗑️ Supprimer cette question
            </button>
        `;

        bloc.querySelector(".supprimer-question").addEventListener(
            "click",
            function () {
                bloc.remove();
            }
        );

        zoneQuestions.appendChild(bloc);
        bloc.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });

    document.getElementById("enregistrer-exercice")
        .addEventListener("click", () => {
            const classeId = Number(
                document.getElementById("exercice-classe").value
            );
            const matiere = document.getElementById("exercice-matiere").value;
            const titre = document.getElementById("exercice-titre").value.trim();
            const consigne = document.getElementById("exercice-consigne").value.trim();

            const blocs = [...zoneQuestions.querySelectorAll(".question-exercice")];

            const questions = blocs.map(bloc => ({
                enonce: bloc.querySelector(".question-enonce").value.trim(),
                reponse: bloc.querySelector(".question-reponse").value.trim()
            }));

            if (!titre) {
                alert("Écris un titre pour l'exercice.");
                return;
            }

            if (questions.length === 0) {
                alert("Ajoute au moins une question.");
                return;
            }

            if (questions.some(q => !q.enonce || !q.reponse)) {
                alert("Complète toutes les questions et leurs réponses attendues.");
                return;
            }

            const classe = classes.find(c => c.id === classeId);

           
const nouvelExercice = {
    id: prochainIdExercice++,
    titre,
    consigne,
    classeId,
    classeNom: classe ? classe.nom : "Classe inconnue",
    matiere,
    questions,
    reponsesRobots: [],
    statut: "à distribuer",
    date: new Date().toLocaleDateString("fr-FR")
};

exercices.push(nouvelExercice);

sauvegarderDonnees();

alert("Exercice enregistré ! Tu peux maintenant le distribuer aux robots.");

afficherFonctionCours("exercices");

            sauvegarderDonnees();

            alert("Exercice enregistré !");

            afficherFonctionCours("exercices");
        });

    document.getElementById("retour-menu-cours").addEventListener(
        "click",
        afficherMenuCours
    );

    // Ajouter automatiquement la première question
document.getElementById("ajouter-question-exercice").click();
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
    exercices,
    prochainIdExercice,
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

        if (Array.isArray(sauvegarde.exercices)) {
exercices = sauvegarde.exercices;
}

if (Number.isInteger(sauvegarde.prochainIdExercice)) {
prochainIdExercice = sauvegarde.prochainIdExercice;
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
    notes: [],
    statut: "brouillon"
});

sauvegarderDonnees();

document.getElementById("message-evaluation").textContent =
    `✅ L'évaluation « ${titre} » a été créée. Tu peux maintenant préparer ses questions.`;

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
            <p>❓ Questions : ${(evaluation.questions || []).length}</p>
            <p>🎯 Total : ${(evaluation.questions || []).reduce(
                (total, question) => total + (Number(question.points) || 0), 0
            )} points</p>

            <button
                type="button"
                class="primary-button"
                onclick="ouvrirPreparationEvaluation(${Number(evaluation.id)})"
            >
                ✏️ Préparer les questions
            </button>
        </article>
    `).join("")}
`;

}

function ouvrirPreparationEvaluation(evaluationId) {
const evaluation = evaluations.find(
element => element.id === Number(evaluationId)
);

if (!evaluation) {
    alert("Évaluation introuvable.");
    return;
}

if (!Array.isArray(evaluation.questions)) {
    evaluation.questions = [];
}

const zone = document.getElementById("section-contenu");

zone.innerHTML = `
    <div class="evaluations">
        <h2>✏️ Préparer les questions</h2>
        <h3>${echapperHTML(evaluation.titre)}</h3>

        <p>🏫 Classe : ${echapperHTML(evaluation.classeNom)}</p>
        <p>📚 Matière : ${echapperHTML(evaluation.matiere)}</p>

        <form id="form-question">
            <label for="question-texte">Énoncé de la question</label>
            <textarea
                id="question-texte"
                name="texte"
                placeholder="Écris la question ici..."
                required
            ></textarea>

            <label for="question-type">Type de réponse</label>
            <select id="question-type" name="type">
                <option value="texte">Réponse écrite</option>
                <option value="qcm">Choix multiple (QCM)</option>
            </select>

            <div id="zone-choix-qcm" hidden>
                <label for="question-choix">Choix possibles (un par ligne)</label>
                <textarea
                    id="question-choix"
                    name="choix"
                    placeholder="Choix A&#10;Choix B&#10;Choix C"
                ></textarea>
            </div>

            <label for="question-points">Nombre de points</label>
            <input
                id="question-points"
                name="points"
                type="number"
                min="1"
                max="100"
                value="1"
                required
            >

            <button type="submit" class="primary-button">
                ➕ Ajouter la question
            </button>
        </form>

        <p id="message-question" role="status"></p>

        <h3>📋 Questions créées</h3>
        <div id="liste-questions"></div>

        <button
    type="button"
    class="primary-button"
    onclick="publierEvaluation(${Number(evaluation.id)})"
>
    📢 Publier l'évaluation
</button>

        <button
            type="button"
            class="primary-button"
            onclick="retourListeEvaluations()"
        >
            ↩️ Retour aux évaluations
        </button>
    </div>
`;

const formulaire = document.getElementById("form-question");
const typeQuestion = document.getElementById("question-type");
const zoneChoix = document.getElementById("zone-choix-qcm");

typeQuestion.addEventListener("change", () => {
    zoneChoix.hidden = typeQuestion.value !== "qcm";
});

formulaire.addEventListener("submit", event => {
    event.preventDefault();

    const donnees = new FormData(formulaire);
    const texte = String(donnees.get("texte") || "").trim();
    const type = String(donnees.get("type") || "texte");
    const points = Number(donnees.get("points"));
    const choixTexte = String(donnees.get("choix") || "").trim();
    const choix = choixTexte
        .split("\n")
        .map(choix => choix.trim())
        .filter(choix => choix.length > 0);

    if (!texte || !Number.isInteger(points) || points < 1 || points > 100) {
        document.getElementById("message-question").textContent =
            "Vérifie l'énoncé et le nombre de points.";
        return;
    }

    if (type === "qcm" && choix.length < 2) {
        document.getElementById("message-question").textContent =
            "Pour un QCM, indique au moins deux choix, un par ligne.";
        return;
    }

    evaluation.questions.push({
        id: Date.now(),
        texte,
        type,
        choix: type === "qcm" ? choix : [],
        points
    });

    sauvegarderDonnees();

    ouvrirPreparationEvaluation(evaluation.id);

    document.getElementById("message-question").textContent =
        "✅ Question ajoutée.";
});

afficherQuestionsEvaluation(evaluation);

}

function afficherQuestionsEvaluation(evaluation) {
const liste = document.getElementById("liste-questions");
if (!liste) return;

if (evaluation.questions.length === 0) {
    liste.innerHTML = "<p>Aucune question pour le moment.</p>";
    return;
}

liste.innerHTML = evaluation.questions.map((question, index) => `
    <article class="evaluation-card">
        <h4>Question ${index + 1}</h4>
        <p>${echapperHTML(question.texte)}</p>
        <p>Type : ${question.type === "qcm" ? "QCM" : "Réponse écrite"}</p>
        ${question.type === "qcm" ? `
            <ul>
                ${question.choix.map(choix => `<li>${echapperHTML(choix)}</li>`).join("")}
            </ul>
        ` : ""}
        <p>🎯 ${Number(question.points)} point(s)</p>

        <button
            type="button"
            onclick="supprimerQuestionEvaluation(${Number(evaluation.id)}, ${Number(question.id)})"
        >
            🗑️ Supprimer
        </button>
    </article>
`).join("");

}

function supprimerQuestionEvaluation(evaluationId, questionId) {
const evaluation = evaluations.find(
element => element.id === Number(evaluationId)
);

if (!evaluation) return;

evaluation.questions = evaluation.questions.filter(
    question => question.id !== Number(questionId)
);

sauvegarderDonnees();
ouvrirPreparationEvaluation(evaluation.id);

}

function retourListeEvaluations() {
afficherMenuEvaluations();
}

function publierEvaluation(evaluationId) {
const evaluation = evaluations.find(
element => element.id === Number(evaluationId)
);

if (!evaluation) {
    alert("Évaluation introuvable.");
    return;
}

if (!Array.isArray(evaluation.questions) || evaluation.questions.length === 0) {
    alert("Ajoute au moins une question avant de publier.");
    return;
}

evaluation.statut = "publiee";
sauvegarderDonnees();

alert(`✅ L'évaluation « ${evaluation.titre} » est publiée pour la classe ${evaluation.classeNom}.`);

ouvrirPreparationEvaluation(evaluation.id);

}



function afficherEspaceEleves() {
    const zone = document.getElementById("section-contenu");

    zone.innerHTML = `
        <div class="evaluations">
            <h2>🧑‍🎓 Espace élèves</h2>
            <p>Choisis une classe pour afficher ses évaluations.</p>

            <label for="choix-classe-eleve">🏫 Classe</label>
            <select id="choix-classe-eleve">
                <option value="">-- Choisir une classe --</option>
                ${classes.map(classe => `
                    <option value="${classe.id}">
                        ${echapperHTML(classe.nom)}
                    </option>
                `).join("")}
            </select>

            <div id="liste-evaluations-eleve">
                <p>📚 Choisis une classe pour commencer.</p>
            </div>
        </div>
    `;

    const choixClasse = document.getElementById("choix-classe-eleve");

    choixClasse.addEventListener("change", function () {
        afficherEvaluationsClasse(Number(this.value));
    });
}


function afficherEvaluationsEleve() {
    const choixClasse = document.getElementById("choix-classe-eleve");
    const choixRobot = document.getElementById("choix-robot-eleve");
    const liste = document.getElementById("liste-evaluations-eleve");

    const classeId = Number(choixClasse.value);
    const robotId = Number(choixRobot.value);

    if (!choixClasse.value || !choixRobot.value) {
        liste.innerHTML = "<p>⚠️ Choisis d'abord une classe et un robot.</p>";
        return;
    }

    const robot = robots.find(element => element.id === robotId);

    if (!robot || robot.classeId !== classeId) {
        liste.innerHTML = "<p>⚠️ Vérifie le robot sélectionné.</p>";
        return;
    }

    const evaluationsDisponibles = evaluations.filter(evaluation =>
        evaluation.statut === "publiee" &&
        evaluation.classeId === classeId
    );

    if (evaluationsDisponibles.length === 0) {
        liste.innerHTML = `
            <p>📚 Bonjour ${echapperHTML(robot.nom)} !</p>
            <p>Aucune évaluation n'est publiée pour ta classe pour le moment.</p>
        `;
        return;
    }

    liste.innerHTML = `
        <h3>📝 Tes évaluations</h3>
        <p>Bonjour ${echapperHTML(robot.nom)} ! Voici les contrôles disponibles.</p>

        ${evaluationsDisponibles.map(evaluation => `
            <article class="evaluation-card">
                <h4>${echapperHTML(evaluation.titre)}</h4>
                <p>📚 Matière : ${echapperHTML(evaluation.matiere)}</p>
                <p>❓ Questions : ${evaluation.questions.length}</p>
                <p>🎯 Total : ${evaluation.questions.reduce(
                    (total, question) => total + Number(question.points || 0), 0
                )} points</p>
                <p>📌 Statut : À passer</p>
            </article>
        `).join("")}
    `;
}


function afficherEvaluationsClasse(classeId) {
    const liste = document.getElementById("liste-evaluations-eleve");
    if (!liste) return;

    const evaluationsDisponibles = evaluations.filter(evaluation =>
        evaluation.statut === "publiee" &&
        evaluation.classeId === Number(classeId)
    );

    if (!classeId) {
        liste.innerHTML = "<p>🏫 Choisis une classe pour voir ses évaluations.</p>";
        return;
    }

    if (evaluationsDisponibles.length === 0) {
        liste.innerHTML = `
            <p>📚 Aucune évaluation publiée pour cette classe.</p>
        `;
        return;
    }

    liste.innerHTML = `
        <h3>📝 Évaluations de la classe</h3>

        ${evaluationsDisponibles.map(evaluation => `
            <article class="evaluation-card">
                <h4>${echapperHTML(evaluation.titre)}</h4>
                <p>📚 Matière : ${echapperHTML(evaluation.matiere)}</p>
                <p>❓ Questions : ${(evaluation.questions || []).length}</p>
                <p>🎯 Total : ${(evaluation.questions || []).reduce(
                    (total, question) => total + Number(question.points || 0), 0
                )} points</p>
                <button type="button" class="primary-button"
    onclick="ouvrirEvaluationClasse(${Number(evaluation.id)})">
    ✏️ Passer l'évaluation
</button>
            </article>
        `).join("")}
    `;
}

function ouvrirEvaluationEleve(evaluationId) {
    const evaluation = evaluations.find(
        element => element.id === Number(evaluationId)
    );

    if (!evaluation || evaluation.statut !== "publiee") {
        alert("Cette évaluation n'est pas disponible.");
        return;
    }

    const choixRobot = document.getElementById("choix-robot-eleve");
    const robotId = choixRobot ? Number(choixRobot.value) : 0;
    const robot = robots.find(element => element.id === robotId);

    if (!robot || robot.classeId !== evaluation.classeId) {
        alert("Choisis d'abord un robot de la classe concernée.");
        return;
    }

    const zone = document.getElementById("section-contenu");

    zone.innerHTML = `
        <div class="evaluations">
            <h2>📝 ${echapperHTML(evaluation.titre)}</h2>
            <p>🤖 Élève : ${echapperHTML(robot.nom)}</p>
            <p>📚 Matière : ${echapperHTML(evaluation.matiere)}</p>
            <p>Réponds à toutes les questions avant de rendre ta copie.</p>

            <form id="form-reponses-eleve">
                ${evaluation.questions.map((question, index) => `
                    <article class="evaluation-card">
                        <h3>Question ${index + 1}</h3>
                        <p>${echapperHTML(question.texte)}</p>
                        <p>🎯 ${Number(question.points)} point(s)</p>

                        ${question.type === "qcm" ? `
                            <label for="reponse-${index}">Ta réponse</label>
                            <select id="reponse-${index}" name="reponse-${index}" required>
                                <option value="">-- Choisir une réponse --</option>
                                ${(question.choix || []).map(choix => `
                                    <option value="${echapperHTML(choix)}">
                                        ${echapperHTML(choix)}
                                    </option>
                                `).join("")}
                            </select>
                        ` : `
                            <label for="reponse-${index}">Ta réponse écrite</label>
                            <textarea id="reponse-${index}"
                                name="reponse-${index}"
                                rows="4" required
                                placeholder="Écris ta réponse ici..."></textarea>
                        `}
                    </article>
                `).join("")}

                <button type="submit" class="primary-button">
                    📬 Rendre ma copie
                </button>
            </form>

            <p id="message-copie" role="status"></p>

            <button type="button" class="primary-button"
                onclick="afficherEspaceEleves()">
                ↩️ Retour à l'espace élèves
            </button>
        </div>
    `;

    document.getElementById("form-reponses-eleve").addEventListener("submit", function(event) {
        event.preventDefault();

        const donnees = new FormData(event.currentTarget);

        const reponses = evaluation.questions.map((question, index) => ({
            questionId: question.id,
            texteQuestion: question.texte,
            points: Number(question.points),
            reponse: String(donnees.get(`reponse-${index}`) || "").trim()
        }));

        if (reponses.some(reponse => !reponse.reponse)) {
            document.getElementById("message-copie").textContent =
                "⚠️ Réponds à toutes les questions avant de rendre ta copie.";
            return;
        }

        if (!Array.isArray(evaluation.copies)) {
            evaluation.copies = [];
        }

        evaluation.copies.push({
            id: Date.now(),
            robotId: robot.id,
            robotNom: robot.nom,
            reponses,
            date: new Date().toLocaleString("fr-FR"),
            statut: "à corriger",
            note: null
        });

        sauvegarderDonnees();

        document.getElementById("message-copie").textContent =
            "✅ Ta copie a été rendue au professeur !";
        event.currentTarget.querySelector("button[type='submit']").disabled = true;
    });
}


function ouvrirEvaluationClasse(evaluationId) {
    const evaluation = evaluations.find(
        element => element.id === Number(evaluationId)
    );

    if (!evaluation || evaluation.statut !== "publiee") {
        alert("Cette évaluation n'est pas disponible.");
        return;
    }

    const robotsClasse = robots.filter(
        robot => robot.classeId === evaluation.classeId
    );

    if (robotsClasse.length === 0) {
        alert("Cette classe ne contient aucun robot.");
        return;
    }

    const zone = document.getElementById("section-contenu");

    zone.innerHTML = `
        <div class="evaluations">
            <h2>📝 ${echapperHTML(evaluation.titre)}</h2>
            <p>🏫 Classe : ${echapperHTML(evaluation.classeNom)}</p>
            <p>🤖 ${robotsClasse.length} robot(s) dans cette classe</p>
            <p>Chaque robot aura sa propre copie.</p>

            <div id="copies-classe">
                ${robotsClasse.map(robot => {
                    const copieExistante = (evaluation.copies || []).some(
                        copie => copie.robotId === robot.id
                    );

                    return `
                        <article class="evaluation-card">
                            <h3>🤖 ${echapperHTML(robot.nom)}</h3>
                            ${
                                copieExistante
                                ? `<p>✅ Copie déjà rendue</p>`
                                : `
                                    <button type="button"
                                        class="primary-button"
                                        onclick="ouvrirCopieRobot(${Number(evaluation.id)}, ${Number(robot.id)})">
                                        ✏️ Passer l'évaluation
                                    </button>
                                `
                            }
                        </article>
                    `;
                }).join("")}
            </div>

            <button type="button" class="primary-button"
                onclick="afficherEspaceEleves()">
                ↩️ Retour aux évaluations
            </button>
        </div>
    `;
}


function ouvrirCopieRobot(evaluationId, robotId) {
    const evaluation = evaluations.find(
        element => element.id === Number(evaluationId)
    );

    const robot = robots.find(
        element => element.id === Number(robotId)
    );

    if (!evaluation || evaluation.statut !== "publiee" ||
        !robot || robot.classeId !== evaluation.classeId) {
        alert("Évaluation ou robot introuvable.");
        return;
    }

    if (!Array.isArray(evaluation.copies)) {
        evaluation.copies = [];
    }

    if (evaluation.copies.some(copie => copie.robotId === robot.id)) {
        alert("Ce robot a déjà rendu sa copie.");
        ouvrirEvaluationClasse(evaluation.id);
        return;
    }

    const zone = document.getElementById("section-contenu");

    zone.innerHTML = `
        <div class="evaluations">
            <h2>📝 ${echapperHTML(evaluation.titre)}</h2>
            <p>🤖 Élève : ${echapperHTML(robot.nom)}</p>
            <p>📚 Matière : ${echapperHTML(evaluation.matiere)}</p>

            <form id="form-copie-classe">
                ${evaluation.questions.map((question, index) => `
                    <article class="evaluation-card">
                        <h3>Question ${index + 1}</h3>
                        <p>${echapperHTML(question.texte)}</p>
                        <p>🎯 ${Number(question.points)} point(s)</p>

                        ${question.type === "qcm" ? `
                            <label for="reponse-classe-${index}">
                                Ta réponse
                            </label>
                            <select id="reponse-classe-${index}"
                                name="reponse-${index}" required>
                                <option value="">-- Choisir une réponse --</option>
                                ${(question.choix || []).map(choix => `
                                    <option value="${echapperHTML(choix)}">
                                        ${echapperHTML(choix)}
                                    </option>
                                `).join("")}
                            </select>
                        ` : `
                            <label for="reponse-classe-${index}">
                                Ta réponse écrite
                            </label>
                            <textarea id="reponse-classe-${index}"
                                name="reponse-${index}"
                                rows="4" required
                                placeholder="Écris ta réponse ici..."></textarea>
                        `}
                    </article>
                `).join("")}

                <button type="submit" class="primary-button">
                    📬 Rendre la copie de ${echapperHTML(robot.nom)}
                </button>
            </form>

            <p id="message-copie-classe" role="status"></p>

            <button type="button" class="primary-button"
                onclick="ouvrirEvaluationClasse(${Number(evaluation.id)})">
                ↩️ Retour à la classe
            </button>
        </div>
    `;

    document.getElementById("form-copie-classe")
        .addEventListener("submit", function(event) {
            event.preventDefault();

            const donnees = new FormData(event.currentTarget);

            const reponses = evaluation.questions.map((question, index) => ({
                questionId: question.id,
                texteQuestion: question.texte,
                points: Number(question.points),
                reponse: String(
                    donnees.get(`reponse-${index}`) || ""
                ).trim()
            }));

            if (reponses.some(reponse => !reponse.reponse)) {
                document.getElementById("message-copie-classe").textContent =
                    "⚠️ Réponds à toutes les questions avant de rendre ta copie.";
                return;
            }

            evaluation.copies.push({
                id: Date.now(),
                robotId: robot.id,
                robotNom: robot.nom,
                reponses,
                date: new Date().toLocaleString("fr-FR"),
                statut: "à corriger",
                note: null
            });

            sauvegarderDonnees();

            document.getElementById("message-copie-classe").textContent =
                "✅ Copie rendue avec succès !";

            event.currentTarget.querySelector(
                'button[type="submit"]'
            ).disabled = true;
        });
}


function afficherCopiesACorriger() {
    const zone = document.getElementById("section-contenu");

    const copies = [];

    evaluations.forEach(evaluation => {
        (evaluation.copies || []).forEach(copie => {
            copies.push({
                evaluation: evaluation,
                copie: copie
            });
        });
    });

    zone.innerHTML = `
        <div class="evaluations">
            <h2>🧑‍🏫 Correction des copies</h2>
            <p>Voici les évaluations rendues par les robots.</p>

            ${
                copies.length === 0
                ? `<p>📭 Aucune copie rendue pour le moment.</p>`
                : copies.map(element => `
                    <article class="evaluation-card">
                        <h3>📝 ${echapperHTML(element.evaluation.titre)}</h3>
                        <p>🤖 Élève : ${echapperHTML(element.copie.robotNom)}</p>
                        <p>📚 Matière : ${echapperHTML(element.evaluation.matiere)}</p>
                        <p>📅 Rendue le : ${echapperHTML(element.copie.date)}</p>
                        <p>📌 Statut : ${echapperHTML(element.copie.statut)}</p>

                        <button type="button" class="primary-button"
                            onclick="corrigerCopie(${Number(element.evaluation.id)}, ${Number(element.copie.id)})">
                            ✏️ Corriger cette copie
                        </button>
                    </article>
                `).join("")
            }
        </div>
    `;
}


function corrigerCopie(evaluationId, copieId) {
    const evaluation = evaluations.find(
        element => element.id === Number(evaluationId)
    );

    if (!evaluation) {
        alert("Évaluation introuvable.");
        return;
    }

    const copie = (evaluation.copies || []).find(
        element => element.id === Number(copieId)
    );

    if (!copie) {
        alert("Copie introuvable.");
        return;
    }

    const zone = document.getElementById("section-contenu");
    const totalPoints = (evaluation.questions || []).reduce(
        (total, question) => total + Number(question.points || 0), 0
    );

    zone.innerHTML = `
        <div class="evaluations">
            <h2>📝 Correction : ${echapperHTML(evaluation.titre)}</h2>
            <p>🤖 Élève : ${echapperHTML(copie.robotNom)}</p>
            <p>📚 Matière : ${echapperHTML(evaluation.matiere)}</p>

            ${(copie.reponses || []).map((reponse, index) => `
                <article class="evaluation-card">
                    <h3>Question ${index + 1}</h3>
                    <p><strong>Énoncé :</strong>
                        ${echapperHTML(reponse.texteQuestion || "")}</p>
                    <p><strong>Réponse du robot :</strong></p>
                    <p>${echapperHTML(reponse.reponse || "")}</p>
                    <label for="points-${index}">
                        Points obtenus (maximum ${Number(reponse.points || 0)})
                    </label>
                    <input
                        id="points-${index}"
                        type="number"
                        min="0"
                        max="${Number(reponse.points || 0)}"
                        step="0.5"
                        value="${Number(reponse.pointsObtenus || 0)}"
                        required>
                </article>
            `).join("")}

            <p><strong>Total possible : ${totalPoints} points</strong></p>

            <label for="commentaire-copie">💬 Commentaire du professeur</label>
            <textarea id="commentaire-copie" rows="3"
                placeholder="Bravo, à revoir, conseils...">${echapperHTML(copie.commentaire || "")}</textarea>

            <button type="button" class="primary-button"
                id="enregistrer-correction">
                💾 Enregistrer la note
            </button>

            <button type="button" class="primary-button"
                onclick="afficherCopiesACorriger()">
                ↩️ Retour aux copies
            </button>

            <p id="message-correction" role="status"></p>
        </div>
    `;

    document.getElementById("enregistrer-correction")
        .addEventListener("click", function () {
            const notes = (copie.reponses || []).map((reponse, index) => {
                const champ = document.getElementById(`points-${index}`);
                return {
                    points: Number(reponse.points || 0),
                    obtenus: Number(champ.value)
                };
            });

            const notesValides = notes.every((note, index) => {
                const champ = document.getElementById(`points-${index}`);
                return champ.value.trim() !== "" &&
                    Number.isFinite(note.obtenus) &&
                    note.obtenus >= 0 &&
                    note.obtenus <= note.points;
            });

            if (!notesValides) {
                document.getElementById("message-correction").textContent =
                    "⚠️ Vérifie les points de chaque question.";
                return;
            }

            copie.reponses.forEach((reponse, index) => {
                reponse.pointsObtenus = notes[index].obtenus;
            });

            const pointsObtenus = notes.reduce(
                (total, note) => total + note.obtenus, 0
            );

            copie.note = totalPoints > 0
                ? Math.round((pointsObtenus / totalPoints) * 20 * 100) / 100
                : 0;

            copie.commentaire =
                document.getElementById("commentaire-copie").value.trim();

            copie.statut = "corrigée";

            sauvegarderDonnees();

            document.getElementById("message-correction").textContent =
                `✅ Note enregistrée : ${copie.note}/20`;
        });
}
