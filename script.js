"use strict";

function initKartUp() {
  const $ = (selector) => document.querySelector(selector);

  const requiredIds = [
    "app", "profileBtn", "dialog", "dialogBody",
    "raceScreen", "raceCanvas", "pauseBtn",
    "leftBtn", "rightBtn", "raceTitle", "racePlace",
    "raceCoins", "raceKnowledge", "raceTimer",
    "raceSpeed", "raceToast", "raceProgressFill"
  ];

  const missing = requiredIds.filter((id) => !document.getElementById(id));

  if (missing.length) {
    console.error("Éléments HTML manquants :", missing);
    alert(
      "Le fichier index.html est incomplet. Éléments manquants : " +
      missing.join(", ")
    );
    return;
  }

  const ONLINE_URL =
    "https://commerce-kart-tom.dejonghe-tom45.chatgpt.site/";

  const STORAGE_KEY = "ck-league-v2";

  function esc(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);
  }

  // --------------------------------------------------
  // QUESTIONS
  // Format : [question, réponses, index correct, explication]
  // --------------------------------------------------

  const bank = [
    [
      [
        "Votre nouvelle offre est inconnue. Quelle action privilégier ?",
        [
          "Une campagne de découverte sur les réseaux sociaux",
          "Une relance de devis",
          "Un programme de fidélité"
        ],
        0,
        "La publicité et les réseaux sociaux permettent de faire connaître l’offre à une nouvelle audience."
      ],
      [
        "Votre campagne a coûté 300 € et généré 600 visiteurs. Quel est le coût par visiteur ?",
        ["2 €", "0,50 €", "50 €"],
        1,
        "Coût par visiteur = dépenses / visiteurs = 300 / 600 = 0,50 €."
      ],
      [
        "Quel indicateur mesure le nombre d’affichages de votre publicité ?",
        ["Le taux de closing", "Le churn", "Les impressions"],
        2,
        "Les impressions comptent les affichages. Elles ne correspondent pas nécessairement à des personnes uniques."
      ],
      [
        "Une affiche a été vue 10 000 fois mais n’a généré aucune visite. Que vérifier en priorité ?",
        [
          "La clarté du message et de l’appel à l’action",
          "Le NPS des clients historiques",
          "Le cycle de négociation"
        ],
        0,
        "La visibilité seule ne garantit pas le trafic : le message doit donner envie d’agir."
      ]
    ],
    [
      [
        "Vous voulez recueillir des contacts intéressés. Quelle action choisir ?",
        [
          "Un formulaire pour télécharger un guide utile",
          "Une hausse des prix immédiate",
          "Une relance des factures"
        ],
        0,
        "Un contenu utile associé à un formulaire permet de convertir une partie de l’audience en leads."
      ],
      [
        "Vous dépensez 400 € pour obtenir 20 leads. Quel est votre CPL ?",
        ["5 €", "20 €", "80 €"],
        1,
        "CPL signifie coût par lead : 400 / 20 = 20 € par lead."
      ],
      [
        "Sur 500 visiteurs, 25 remplissent le formulaire. Quel est le taux de conversion visiteur → lead ?",
        ["20 %", "0,5 %", "5 %"],
        2,
        "Taux de conversion = 25 / 500 × 100 = 5 %."
      ],
      [
        "Un webinaire attire beaucoup de monde, mais presque aucun contact. Que faire ?",
        [
          "Supprimer toute inscription et tout suivi",
          "Ajouter une invitation claire à demander un guide ou un rendez-vous",
          "Mesurer uniquement le nombre de vues"
        ],
        1,
        "Il faut proposer une prochaine étape pertinente pour transformer l’intérêt en contact exploitable."
      ]
    ],
    [
      [
        "Un prospect demande une démonstration. Quel est votre objectif principal ?",
        [
          "Qualifier son besoin, son budget et son calendrier",
          "Diffuser une publicité générique",
          "Lui vendre sans écouter ses attentes"
        ],
        0,
        "La qualification aide à repérer les prospects dont le besoin correspond à l’offre."
      ],
      [
        "Sur 40 leads, 10 répondent aux critères de qualification. Quel est le taux de qualification ?",
        ["40 %", "25 %", "10 %"],
        1,
        "Taux de qualification = 10 / 40 × 100 = 25 %."
      ],
      [
        "Quel indicateur est le plus adapté au suivi d’une campagne de prise de rendez-vous ?",
        [
          "Le nombre de rendez-vous obtenus",
          "Le nombre d’impressions uniquement",
          "Le taux de rétention"
        ],
        0,
        "Les rendez-vous obtenus indiquent si les prospects avancent vers un échange commercial concret."
      ],
      [
        "Votre équipe dispose de 50 leads et de peu de temps. Quelle méthode utiliser ?",
        [
          "Appeler uniquement le premier de la liste",
          "Accorder la même priorité à tous sans information",
          "Établir un scoring fondé sur des critères de pertinence"
        ],
        2,
        "Le scoring sert à hiérarchiser les leads selon des critères explicites, puis à adapter le suivi."
      ]
    ],
    [
      [
        "Vous avez signé 6 ventes sur 20 opportunités clôturées. Quel est le taux de closing ?",
        ["30 %", "6 %", "70 %"],
        0,
        "Taux de closing = ventes gagnées / opportunités clôturées × 100 = 6 / 20 × 100 = 30 %."
      ],
      [
        "Un prospect hésite sur une proposition. Quelle action est la plus pertinente ?",
        [
          "Faire une remise sans échange",
          "Clarifier ses objections puis adapter la proposition",
          "Relancer une campagne de notoriété"
        ],
        1,
        "Écouter les objections permet de répondre au vrai frein et de défendre une proposition adaptée."
      ],
      [
        "Votre chiffre d’affaires est de 3 000 € pour 15 commandes. Quel est le panier moyen ?",
        ["45 €", "450 €", "200 €"],
        2,
        "Panier moyen = chiffre d’affaires / nombre de commandes = 3 000 / 15 = 200 €."
      ],
      [
        "Vous dépensez 1 200 € pour acquérir 12 nouveaux clients. Quel est le CPA client ?",
        ["100 €", "10 €", "1 000 €"],
        0,
        "CPA client = dépenses d’acquisition / nouveaux clients = 1 200 / 12 = 100 €."
      ]
    ],
    [
      [
        "Quel levier favorise la fidélisation après une vente ?",
        [
          "Un suivi personnalisé et un accompagnement à l’usage",
          "L’arrêt des échanges après le paiement",
          "Une publicité sans lien avec le besoin"
        ],
        0,
        "La qualité de l’accueil, du suivi et du service contribue à la rétention et à la recommandation."
      ],
      [
        "Sur 100 clients présents au début, 8 partent pendant la période. Quel est le churn simplifié ?",
        ["92 %", "8 %", "80 %"],
        1,
        "Churn = clients perdus / clients au début × 100 = 8 %."
      ],
      [
        "Une enquête compte 60 % de promoteurs et 15 % de détracteurs. Quel est le NPS ?",
        ["75", "45", "4"],
        1,
        "NPS = pourcentage de promoteurs − pourcentage de détracteurs = 60 − 15 = +45."
      ],
      [
        "Quelle différence entre rétention et CLV ?",
        [
          "Aucune : ce sont deux noms du chiffre d’affaires",
          "La rétention compte les impressions ; la CLV compte les leads",
          "La rétention mesure la conservation des clients ; la CLV estime leur valeur sur la relation"
        ],
        2,
        "La CLV est une estimation de la valeur client dans la durée."
      ]
    ]
  ];

  // --------------------------------------------------
  // MONDES ET GARAGE
  // --------------------------------------------------

  const courses = [
    {
      name: "Prairie de la Notoriété",
      phase: "Notoriété",
      goal: "Faites connaître votre offre.",
      color: "#398d63",
      sky: "#c1e9ef",
      land: "#73c17a",
      icon: "🌱",
      desc: "Un premier tour entre collines et moulins.",
      kpi: "Visiteurs · impressions · coût par visiteur",
      actions: "Référencement, publicité, réseaux sociaux, événements."
    },
    {
      name: "Lagon des Leads",
      phase: "Intérêt",
      goal: "Transformez l’audience en contacts.",
      color: "#2386c0",
      sky: "#c6edfb",
      land: "#60cbbf",
      icon: "🌊",
      desc: "Collectez les bons contacts au bord du lagon.",
      kpi: "Nombre de leads · CPL · conversion visiteur → lead",
      actions: "Contenus, livres blancs, webinaires, formulaires."
    },
    {
      name: "Canyon de la Qualification",
      phase: "Considération",
      goal: "Repérez les prospects sérieux.",
      color: "#b87a30",
      sky: "#ffe5c7",
      land: "#d59762",
      icon: "🏜️",
      desc: "Gardez le cap et qualifiez vos opportunités.",
      kpi: "Taux de qualification · rendez-vous obtenus",
      actions: "Appels de qualification, démonstrations, scoring."
    },
    {
      name: "Métropole du Closing",
      phase: "Décision",
      goal: "Transformez les opportunités en ventes.",
      color: "#8a61c6",
      sky: "#ded6f6",
      land: "#a59bc9",
      icon: "🌆",
      desc: "Négociez les virages jusqu’à la signature.",
      kpi: "Taux de closing · CPA · cycle de vente · panier moyen",
      actions: "Proposition, négociation, relances."
    },
    {
      name: "Route de la Fidélité",
      phase: "Fidélisation",
      goal: "Donnez envie de revenir.",
      color: "#cf5f89",
      sky: "#f8d9eb",
      land: "#c88fba",
      icon: "🌈",
      desc: "La dernière ligne droite vers la relation durable.",
      kpi: "Rétention · churn · CLV · NPS",
      actions: "Accueil client, suivi, enquêtes, ventes additionnelles."
    }
  ];

  const questionItems = [
    ["Mégaphone", "Visiteurs", "Impressions", "Mégaphone"],
    ["Formulaire", "CPL", "Conversion", "Guide utile"],
    ["Démonstration", "Qualification", "Rendez-vous", "Scoring"],
    ["Closing", "Proposition", "Panier moyen", "CPA"],
    ["Suivi client", "Churn", "NPS", "CLV"]
  ];

  courses.forEach((course, index) => {
    course.items = [...new Set(questionItems[index])];
  });

  const skins = [
    {
      id: "red", name: "Rouge Départ", color: "#ef493b",
      price: 0, level: 1, rarity: "CLASSIQUE"
    },
    {
      id: "blue", name: "Bleu Turbo", color: "#398de5",
      price: 100, level: 1, rarity: "CLASSIQUE"
    },
    {
      id: "mint", name: "Menthe Sprint", color: "#36c398",
      price: 160, level: 2, rarity: "RARE"
    },
    {
      id: "purple", name: "Violet Comète", color: "#a46bea",
      price: 230, level: 3, rarity: "RARE"
    },
    {
      id: "gold", name: "Or du Podium", color: "#ffc742",
      price: 350, level: 4, rarity: "ÉPIQUE"
    },
    {
      id: "pink", name: "Rose Électrique", color: "#ed74b2",
      price: 280, level: 3, rarity: "ÉPIQUE"
    },
    {
      id: "night", name: "Minuit Racing", color: "#314761",
      price: 400, level: 5, rarity: "LÉGENDAIRE"
    },
    {
      id: "ice", name: "Glacier", color: "#80dbe9",
      price: 500, level: 6, rarity: "LÉGENDAIRE"
    }
  ];

  const avatars = ["🧑‍🚀", "🦊", "🐼", "🤖", "🐸", "🦁"];

  let db = { profiles: [], active: null };
  let page = "world";
  let race = null;
  let frame = 0;
  let last = 0;
  let keys = { left: false, right: false };
  let chosenAvatar = avatars[0];

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (
      saved &&
      Array.isArray(saved.profiles) &&
      saved.profiles.every((p) =>
        typeof p.id === "string" &&
        typeof p.name === "string" &&
        Number.isFinite(p.xp) &&
        p.xp >= 0 &&
        Number.isFinite(p.coins) &&
        p.coins >= 0 &&
        Array.isArray(p.badges) &&
        Array.isArray(p.owned) &&
        Array.isArray(p.records) &&
        Array.isArray(p.collection)
      )
    ) {
      db = saved;
    }
  } catch (error) {
    console.warn("Sauvegarde locale indisponible :", error);
  }

  function pilot() {
    return db.profiles.find((p) => p.id === db.active) || null;
  }

  function level(p) {
    return 1 + Math.floor(p.xp / 250);
  }

  function skin(p) {
    return skins.find((s) => s.id === p.skin) || skins[0];
  }

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    } catch (error) {
      console.warn("Impossible de sauvegarder la progression :", error);
    }
  }

  function uid() {
    if (globalThis.crypto?.randomUUID) {
      return globalThis.crypto.randomUUID();
    }

    return Date.now().toString(36) + Math.random().toString(36).slice(2);
  }

  function openDialog(html) {
    $("#dialogBody").innerHTML = html;
    const dialog = $("#dialog");

    if (!dialog.open) {
      if (typeof dialog.showModal === "function") {
        dialog.showModal();
      } else {
        dialog.setAttribute("open", "");
      }
    }
  }

  function closeDialog() {
    const dialog = $("#dialog");

    if (typeof dialog.close === "function") {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
    }
  }

  function header() {
    const p = pilot();

    $("#profileBtn").innerHTML = p
      ? `
        <span>${p.avatar}</span>
        <div>
          ${esc(p.name)}
          <small>Niv. ${level(p)} · ◉ ${p.coins}</small>
        </div>
      `
      : "＋ Créer mon pilote";

    document.querySelectorAll("[data-page]").forEach((button) => {
      button.classList.toggle("active", button.dataset.page === page);
    });
  }

  // --------------------------------------------------
  // ILLUSTRATIONS
  // --------------------------------------------------

  function kartSVG(color = "#ef493b") {
    return `
      <svg viewBox="0 0 140 145" aria-hidden="true">
        <ellipse cx="70" cy="124" rx="45" ry="10" fill="#17233422"/>
        <rect x="24" y="79" width="20" height="38" rx="7" fill="#27313d"/>
        <rect x="96" y="79" width="20" height="38" rx="7" fill="#27313d"/>
        <rect x="25" y="27" width="16" height="29" rx="5" fill="#27313d"/>
        <rect x="99" y="27" width="16" height="29" rx="5" fill="#27313d"/>
        <path
          d="M40 35 Q70 16 100 35 L102 111 Q70 129 38 111Z"
          fill="${color}" stroke="#202631" stroke-width="3"
        />
        <path d="M64 30h12v88H64Z" fill="white" opacity=".8"/>
        <rect x="47" y="52" width="46" height="36" rx="12" fill="#263c4b"/>
        <circle cx="70" cy="62" r="19" fill="#ffe0a4"
          stroke="#202631" stroke-width="2"/>
        <path d="M51 61q0-26 19-26t19 26" fill="${color}"
          stroke="#202631" stroke-width="2"/>
        <path d="M51 54h38v12H51Z" fill="#324959"/>
        <path d="M49 37H91" stroke="white" stroke-width="4"/>
        <rect x="34" y="104" width="72" height="10" rx="4"
          fill="${color}" stroke="#202631" stroke-width="3"/>
      </svg>
    `;
  }

  function innerSVG(svg) {
    return svg.replace(/<\/?svg[^>]*>/g, "");
  }

  function worldSVG() {
    const checkpoints = [
      [190, 200, "1", "#4ca777"],
      [390, 158, "2", "#3c9bcc"],
      [610, 220, "3", "#d3954c"],
      [300, 350, "4", "#9577d0"],
      [493, 330, "5", "#df7eaa"]
    ];

    const trees = [
      [110, 240], [140, 130], [255, 112], [282, 310],
      [180, 360], [575, 356], [640, 290], [462, 105]
    ];

    const road =
      "M165 174C190 95 330 140 370 170S570 90 615 190" +
      "S485 285 520 330S300 410 220 340S100 260 165 174Z";

    return `
      <svg class="worldart" viewBox="0 0 750 480"
        role="img" aria-label="Carte des cinq mondes de course">
        <defs>
          <linearGradient id="sea" x2="0" y2="1">
            <stop stop-color="#91d5e7"/>
            <stop offset="1" stop-color="#69b5d6"/>
          </linearGradient>
          <pattern id="checks" width="18" height="18"
            patternUnits="userSpaceOnUse">
            <rect width="18" height="18" fill="white"/>
            <path d="M0 0h9v9H0zM9 9h9v9H9z" fill="#263545"/>
          </pattern>
        </defs>

        <g fill="white" opacity=".75">
          <ellipse cx="140" cy="55" rx="70" ry="16"/>
          <ellipse cx="155" cy="41" rx="32" ry="23"/>
          <ellipse cx="595" cy="80" rx="65" ry="15"/>
          <ellipse cx="575" cy="66" rx="33" ry="24"/>
        </g>

        <ellipse cx="400" cy="305" rx="315" ry="140"
          fill="#a6d6e0" opacity=".4"/>

        <path
          d="M70 265Q30 160 155 125L310 100Q360 30 470 70
             L610 145Q735 210 680 315L560 405Q420 470 260 405L135 355Z"
          fill="#81a77c" stroke="#5b9576" stroke-width="2"
          transform="translate(0 20)"
        />

        <path
          d="M70 265Q30 160 155 125L310 100Q360 30 470 70
             L610 145Q735 210 680 315L560 405Q420 470 260 405L135 355Z"
          fill="#a0ce82"
        />

        <path
          d="M380 90Q390 150 330 210T345 360L430 420
             Q480 375 430 320T430 190Q485 120 450 72Z"
          fill="url(#sea)"
        />

        <path d="M480 200q55-80 160-10l35 85-80 45-100-25Z"
          fill="#e5b47e"/>

        <path d="${road}" fill="none" stroke="#f8f0c8" stroke-width="54"/>
        <path d="${road}" fill="none" stroke="#626b82" stroke-width="40"/>
        <path d="${road}" fill="none" stroke="#d0d6e0"
          stroke-width="2" stroke-dasharray="12 13"/>

        <g fill="#4a9d69" stroke="#347e56" stroke-width="2">
          ${trees.map(([x, y]) => `
            <path d="M${x} ${y - 30}l-19 31h10l-17 20h52l-17-20h10Z"/>
            <path d="M${x} ${y + 21}v13" stroke="#a27c51" stroke-width="7"/>
          `).join("")}
        </g>

        <g fill="#b87351">
          <path d="M555 250l28-65 20 65Z"/>
          <path d="M590 263l35-79 24 79Z"/>
        </g>

        <g stroke="#65728a" stroke-width="2">
          <path d="M265 342v-70l26-9v79Z" fill="#dae4e9"/>
          <path d="M295 353v-99l27-9v108Z" fill="#b2c6d9"/>
          <path d="M328 359v-62l26-9v71Z" fill="#ece6cf"/>
        </g>

        <path d="M438 320q34-75 83-30" fill="none"
          stroke="#ed7c8a" stroke-width="9"/>
        <path d="M445 324q28-69 73-29" fill="none"
          stroke="#ffd555" stroke-width="8"/>
        <path d="M452 328q25-63 62-29" fill="none"
          stroke="#7ddbb1" stroke-width="7"/>

        <g transform="translate(170 200)">
          <path d="M0 0v-62" stroke="#273848" stroke-width="5"/>
          <path d="M0-62h47v32H0" fill="url(#checks)"/>
        </g>

        ${checkpoints.map(([x, y, number, color]) => `
          <g>
            <circle cx="${x}" cy="${y + 5}" r="23" fill="#27354544"/>
            <circle cx="${x}" cy="${y}" r="23"
              fill="${color}" stroke="white" stroke-width="5"/>
            <text x="${x}" y="${y + 6}" fill="white"
              font-size="19" font-weight="900" text-anchor="middle">
              ${number}
            </text>
          </g>
        `).join("")}

        <g transform="translate(185 244) rotate(18) scale(.42)">
          ${innerSVG(kartSVG())}
        </g>
      </svg>
    `;
  }

  function thumbnail(index) {
    const c = courses[index];

    return `
      <svg viewBox="0 0 230 140" aria-hidden="true">
        <rect width="230" height="140" fill="${c.sky}"/>
        <circle cx="180" cy="25" r="17" fill="#fff3bf"/>
        <path d="M0 75q45-60 85 0q45-75 145 0v65H0" fill="${c.land}"/>
        <path d="M80 145q-5-30 50-45t-5-55" fill="none"
          stroke="#f5ebcf" stroke-width="40"/>
        <path d="M80 145q-5-30 50-45t-5-55" fill="none"
          stroke="#667188" stroke-width="29"/>
        <path d="M80 145q-5-30 50-45t-5-55" fill="none"
          stroke="#d8e0ec" stroke-width="2" stroke-dasharray="7 9"/>
        <text x="28" y="100" font-size="45">${c.icon}</text>
        <g transform="translate(125 65) scale(.43)">
          ${innerSVG(kartSVG(c.color))}
        </g>
      </svg>
    `;
  }

  // --------------------------------------------------
  // NAVIGATION ET ACCUEIL
  // --------------------------------------------------

  function render() {
    header();

    switch (page) {
      case "garage":
        garage();
        break;
      case "league":
        league();
        break;
      case "academy":
        academy();
        break;
      case "online":
        online();
        break;
      default:
        world();
    }
  }

  function firstLocked(p) {
    for (let i = 0; i < courses.length; i++) {
      if (!p.badges.includes(i)) return i;
    }

    return 0;
  }

  function pilotTitle(p) {
    if (p.badges.length === 5) return "Maître de la conversion";
    if (level(p) >= 5) return "As du circuit";
    if (level(p) >= 3) return "Pilote confirmé";
    return "Jeune espoir";
  }

  function world() {
    const p = pilot();
    const xp = p ? p.xp % 250 : 0;

    $("#app").innerHTML = `
      <section class="hero">
        <div class="heroCopy">
          <span class="eyebrow">
            LA LIGUE DE LA PERFORMANCE COMMERCIALE
          </span>

          <h1>
            Le savoir fait<br>
            passer la <em>vitesse<br>supérieure.</em>
          </h1>

          <p>
            Cinq mondes. Des défis à attraper.
            Prenez le volant, maîtrisez vos KPI et devenez
            une légende de la conversion.
          </p>

          <button class="btn yellow" id="heroPlay">
            ${p ? "JOUER EN SOLO" : "CRÉER MON PILOTE"}
            <span>▶</span>
          </button>

          <small>
            Courses de ~40 s hors défis · Clavier & tactile · 3 rivaux IA
          </small>
        </div>

        ${worldSVG()}
      </section>

      <div class="ribbon">
        <span>⚑ 5 MONDES À EXPLORER</span>
        <span>✦ DE L’XP À GAGNER</span>
        <span>◉ VOTRE GARAGE À PERSONNALISER</span>
      </div>

      <div class="container">
        <section class="onlineBanner">
          <div>
            <span class="eyebrow">LE PADDOCK EST OUVERT</span>
            <h3>Vos amis. Vos karts. Un seul podium.</h3>
            <p>Retrouvez les parties par code sur la version en ligne.</p>
          </div>
          <button class="btn yellow" id="onlineWorld">
            JOUER À PLUSIEURS →
          </button>
        </section>

        <section class="pilotstrip">
          <div class="pilotinfo">
            <div class="pilotavatar">${p ? p.avatar : "🧑‍🚀"}</div>
            <div>
              <h3>${p ? esc(p.name) : "Votre aventure commence ici."}</h3>
              <p>
                ${p
                  ? `Pilote niveau ${level(p)} · ${pilotTitle(p)}`
                  : "Créez un pilote pour sauvegarder vos exploits."}
              </p>
            </div>
          </div>

          <div>
            <span class="label">
              ${p ? `PROCHAIN NIVEAU : ${level(p) + 1}` : "VOTRE PROGRESSION"}
            </span>
            <div class="xpbar">
              <i style="width:${xp / 250 * 100}%"></i>
            </div>
            <div class="xptext">
              <span>${xp} / 250 XP</span>
              <span>${p ? p.xp : 0} XP au total</span>
            </div>
          </div>

          <div class="stat">
            <b>◉ ${p ? p.coins : 0}</b>
            <small>PIÈCES AU GARAGE</small>
          </div>

          <div class="stat">
            <b>🏅 ${p ? p.badges.length : 0}/5</b>
            <small>BADGES REMPORTÉS</small>
          </div>
        </section>

        <div class="sectionhead">
          <div>
            <span class="eyebrow">LA CARTE DU CHAMPIONNAT</span>
            <h2>Votre prochaine ligne de départ.</h2>
            <p>
              Attrapez les cubes de savoir.
              Réussissez au moins 2 défis sur 3 pour débloquer
              le monde suivant.
            </p>
          </div>
          <span class="countpill">
            ${p ? p.badges.length : 0} / 5 mondes maîtrisés
          </span>
        </div>

        <div class="coursegrid">
          ${courses.map((c, index) => {
            const unlocked = p && (
              index === 0 || p.badges.includes(index - 1)
            );

            const records = p
              ? p.records.filter((record) => record.course === index)
              : [];

            const best = records.length
              ? Math.max(...records.map((record) => record.correct))
              : 0;

            return `
              <article class="course"
                style="--c:${c.color};--sky:${c.sky}">
                <div class="courseVisual">
                  ${thumbnail(index)}
                  <span class="courseNum">MONDE 0${index + 1}</span>
                  <span class="lock">
                    ${p && p.badges.includes(index)
                      ? "🏅"
                      : unlocked ? "" : "🔒"}
                  </span>
                </div>

                <div class="courseBody">
                  <small>${c.phase}</small>
                  <h3>${c.name}</h3>
                  <p>${c.desc}</p>

                  <div class="courseMeta">
                    <span>⚡ ~40 s</span>
                    <span class="stars">
                      ${"★".repeat(best)}${"☆".repeat(3 - best)}
                    </span>
                  </div>

                  <button
                    class="btn small ${unlocked ? "" : "white"}"
                    data-course="${index}">
                    ${!p
                      ? "Choisir un pilote"
                      : unlocked
                        ? "Prendre le départ →"
                        : `🔒 Monde ${index} requis`}
                  </button>
                </div>
              </article>
            `;
          }).join("")}
        </div>

        <section class="features">
          <div>
            <span class="icon">🎮</span>
            <h3>Du pilotage, pas seulement un quiz.</h3>
            <p>
              Changez de trajectoire, évitez les plots et attrapez
              les objets. Chaque bonne réponse déclenche un turbo.
            </p>
          </div>

          <div>
            <span class="icon">✦</span>
            <h3>Votre savoir devient votre style.</h3>
            <p>
              Gagnez de l’XP et dépensez vos pièces dans des
              carrosseries. Les looks ne changent pas la vitesse.
            </p>
          </div>

          <div>
            <span class="icon">🏆</span>
            <h3>Votre groupe, votre championnat.</h3>
            <p>
              Comparez vos profils locaux et retrouvez vos amis
              sur la version en ligne.
            </p>
          </div>
        </section>
      </div>

      <div class="marquee">
        NOTORIÉTÉ ✦ INTÉRÊT ✦ CONSIDÉRATION ✦ DÉCISION ✦ FIDÉLISATION
      </div>
    `;

    $("#heroPlay").onclick = () => {
      if (!pilot()) {
        profiles();
      } else {
        brief(firstLocked(pilot()));
      }
    };

    $("#onlineWorld").onclick = () => {
      page = "online";
      render();
      window.scrollTo(0, 0);
    };

    document.querySelectorAll("[data-course]").forEach((button) => {
      button.onclick = () => {
        const p = pilot();

        if (!p) return profiles();

        const index = Number(button.dataset.course);

        if (index > 0 && !p.badges.includes(index - 1)) {
          locked(index);
          return;
        }

        brief(index);
      };
    });
  }

  function online() {
    $("#app").innerHTML = `
      <section class="pagehead">
        <span class="eyebrow">MULTIJOUEUR</span>
        <h1>Ensemble sur la grille.</h1>
        <p>Retrouvez vos amis sur la version en ligne de Kart’Up.</p>
      </section>

      <div class="container">
        <div class="notice">
          Cette version locale contient le mode solo.
          Les parties par code utilisent le serveur du jeu en ligne.
          La progression locale reste propre à ce navigateur.
        </div>

        <a class="btn yellow"
          href="${ONLINE_URL}?partie="
          target="_blank"
          rel="noopener noreferrer">
          OUVRIR LE JEU EN LIGNE →
        </a>
      </div>
    `;
  }

  function locked(index) {
    openDialog(`
      <span class="eyebrow">MONDE VERROUILLÉ</span>
      <h2>Une étape à la fois.</h2>
      <p>
        Remportez le badge du monde ${index},
        avec au moins 2 bonnes réponses sur 3,
        pour accéder à ce circuit.
      </p>
      <button class="btn yellow" id="ok">Retour à la carte</button>
    `);

    $("#ok").onclick = closeDialog;
  }

  // --------------------------------------------------
  // PROFILS
  // --------------------------------------------------

  function profiles() {
    openDialog(`
      <span class="eyebrow">LE PADDOCK</span>
      <h2>Choisissez votre pilote.</h2>
      <p>
        Plusieurs pilotes peuvent jouer à tour de rôle sur cet appareil.
        Chaque progression est sauvegardée dans ce navigateur.
      </p>

      <div class="profilelist">
        ${db.profiles.map((p) => `
          <button data-pilot="${esc(p.id)}">
            <span>${p.avatar} ${esc(p.name)}</span>
            <small>
              Niv. ${level(p)} · ${p.xp} XP
              ${p.id === db.active ? "✓" : ""}
            </small>
          </button>
        `).join("")}
      </div>

      <div class="row">
        <button class="btn yellow" id="createPilot">
          ＋ Nouveau pilote
        </button>
        <button class="btn white" id="closeProfile">Fermer</button>
      </div>
    `);

    document.querySelectorAll("[data-pilot]").forEach((button) => {
      button.onclick = () => {
        db.active = button.dataset.pilot;
        persist();
        closeDialog();
        render();
      };
    });

    $("#createPilot").onclick = createPilot;
    $("#closeProfile").onclick = closeDialog;
  }

  function createPilot() {
    chosenAvatar = avatars[0];

    openDialog(`
      <span class="eyebrow">NOUVELLE RECRUE</span>
      <h2>Votre place sur la grille.</h2>

      <form id="pilotForm">
        <label for="pilotName">Nom du pilote</label>

        <input class="field"
          id="pilotName"
          placeholder="Votre pseudo"
          maxlength="20"
          required
          autocomplete="off">

        <p>Choisissez votre avatar</p>

        <div class="avatarselect">
          ${avatars.map((avatar, index) => `
            <button type="button"
              data-avatar="${avatar}"
              class="${index === 0 ? "selected" : ""}"
              aria-label="Avatar ${index + 1}">
              ${avatar}
            </button>
          `).join("")}
        </div>

        <p>
          Un kart rouge et votre premier monde vous attendent.
          Les pièces sont virtuelles.
        </p>

        <button class="btn yellow" type="submit">
          REJOINDRE LA LIGUE →
        </button>
      </form>
    `);

    document.querySelectorAll("[data-avatar]").forEach((button) => {
      button.onclick = () => {
        chosenAvatar = button.dataset.avatar;

        document.querySelectorAll("[data-avatar]").forEach((item) => {
          item.classList.toggle("selected", item === button);
        });
      };
    });

    $("#pilotForm").onsubmit = (event) => {
      event.preventDefault();

      const name = $("#pilotName").value.trim();
      if (!name) return;

      const p = {
        id: uid(),
        name,
        avatar: chosenAvatar,
        xp: 0,
        coins: 0,
        badges: [],
        owned: ["red"],
        skin: "red",
        records: [],
        collection: []
      };

      db.profiles.push(p);
      db.active = p.id;

      persist();
      closeDialog();
      render();
    };

    $("#pilotName").focus();
  }

  // --------------------------------------------------
  // GARAGE
  // --------------------------------------------------

  function garage() {
    const p = pilot();

    $("#app").innerHTML = `
      <section class="pagehead">
        <span class="eyebrow">VOTRE SIGNATURE SUR LE CIRCUIT</span>
        <h1>Le garage des pilotes.</h1>
        <p>Des pièces gagnées en course. Un style qui vous ressemble.</p>
      </section>

      <div class="container">
        <div class="notice">
          ◉ <strong>${p ? p.coins : 0} pièces disponibles.</strong>
          Toutes les carrosseries ont les mêmes performances.
        </div>

        <div class="garagegrid">
          ${skins.map((s) => `
            <article class="shopitem">
              <div class="kartdisplay">${kartSVG(s.color)}</div>
              <span class="tag">
                ${s.rarity} · NIVEAU ${s.level}
              </span>
              <h3>${s.name}</h3>
              <p>
                ${p && p.owned.includes(s.id)
                  ? "Dans votre collection"
                  : `◉ ${s.price} pièces`}
              </p>

              <button
                class="btn small ${p && p.skin === s.id ? "white" : "yellow"}"
                data-skin="${s.id}">
                ${!p
                  ? "Créer un pilote"
                  : p.skin === s.id
                    ? "✓ Équipé"
                    : p.owned.includes(s.id)
                      ? "Équiper"
                      : level(p) < s.level
                        ? `🔒 Niveau ${s.level}`
                        : `Débloquer · ${s.price} ◉`}
              </button>
            </article>
          `).join("")}
        </div>
      </div>
    `;

    document.querySelectorAll("[data-skin]").forEach((button) => {
      button.onclick = () => buy(button.dataset.skin);
    });
  }

  function buy(id) {
    const p = pilot();
    if (!p) return profiles();

    const selected = skins.find((s) => s.id === id);
    if (!selected) return;

    if (p.owned.includes(id)) {
      p.skin = id;
      persist();
      render();
      return;
    }

    if (level(p) < selected.level || p.coins < selected.price) {
      const needsLevel = level(p) < selected.level;

      openDialog(`
        <span class="eyebrow">ENCORE UN PETIT TOUR ?</span>
        <h2>
          ${needsLevel
            ? `Niveau ${selected.level} requis.`
            : "Quelques pièces vous séparent de ce kart."}
        </h2>
        <p>
          ${needsLevel
            ? "Gagnez de l’XP en terminant des courses et en répondant aux défis."
            : `Il vous manque ${selected.price - p.coins} pièces.`}
        </p>
        <button class="btn yellow" id="backShop">
          Retour au garage
        </button>
      `);

      $("#backShop").onclick = closeDialog;
      return;
    }

    openDialog(`
      <span class="eyebrow">NOUVELLE CARROSSERIE</span>
      <h2>${selected.name}</h2>
      <div class="kartdisplay">${kartSVG(selected.color)}</div>
      <p>
        Débloquer et équiper pour
        <strong>${selected.price} pièces virtuelles</strong> ?
        Solde après achat : ${p.coins - selected.price} pièces.
      </p>

      <div class="row">
        <button class="btn white" id="cancelBuy">Annuler</button>
        <button class="btn yellow" id="confirmBuy">Débloquer</button>
      </div>
    `);

    $("#cancelBuy").onclick = closeDialog;

    $("#confirmBuy").onclick = () => {
      if (p.coins < selected.price || p.owned.includes(id)) return;

      p.coins -= selected.price;
      p.owned.push(id);
      p.skin = id;

      persist();
      closeDialog();
      render();
    };
  }

  // --------------------------------------------------
  // CLASSEMENT ET ACADÉMIE
  // --------------------------------------------------

  function league() {
    const ranked = [...db.profiles].sort(
      (a, b) => b.xp - a.xp || b.badges.length - a.badges.length
    );

    $("#app").innerHTML = `
      <section class="pagehead">
        <span class="eyebrow">LA LIGUE DES PILOTES</span>
        <h1>Chaque XP compte.</h1>
        <p>Votre classement local. Votre prochaine rivalité.</p>
      </section>

      <div class="container">
        <div class="notice">
          Ce classement compare les profils de ce navigateur.
          Classement par XP, puis nombre de badges.
        </div>

        <table class="leagueTable">
          <thead>
            <tr>
              <th>RANG</th>
              <th>PILOTE</th>
              <th>NIVEAU</th>
              <th>XP</th>
              <th>BADGES</th>
              <th>COURSES</th>
            </tr>
          </thead>

          <tbody>
            ${ranked.map((p, index) => `
              <tr class="${p.id === db.active ? "me" : ""}">
                <td>${["🥇", "🥈", "🥉"][index] || index + 1}</td>
                <td>
                  ${p.avatar} <strong>${esc(p.name)}</strong>
                  ${p.id === db.active ? " · vous" : ""}
                </td>
                <td>${level(p)}</td>
                <td>${p.xp}</td>
                <td>${p.badges.length}/5</td>
                <td>${p.records.length}</td>
              </tr>
            `).join("") || `
              <tr>
                <td colspan="6">
                  La grille est vide. Créez votre premier pilote !
                </td>
              </tr>
            `}
          </tbody>
        </table>

        <div class="row">
          <button class="btn yellow" id="addRival">
            ＋ Choisir / créer un pilote
          </button>
        </div>
      </div>
    `;

    $("#addRival").onclick = profiles;
  }

  function academy() {
    const p = pilot();

    $("#app").innerHTML = `
      <section class="pagehead">
        <span class="eyebrow">LE SAVOIR SOUS LE CAPOT</span>
        <h1>L’académie du circuit.</h1>
        <p>
          Les cinq phases du parcours commercial,
          vos objets et vos dernières leçons.
        </p>
      </section>

      <div class="container">
        <div class="academygrid">
          ${courses.map((c) => `
            <article class="lesson" style="--c:${c.color}">
              <h3>${c.icon} ${c.phase}</h3>
              <p><b>Objectif</b><br>${c.goal}</p>
              <p><b>Actions clés</b><br>${c.actions}</p>
              <p><b>KPI à suivre</b><br>${c.kpi}</p>
              <div class="itemlist">
                ${c.items.map((item) => `
                  <span>
                    ${p && p.collection.includes(item) ? "✓" : "◇"}
                    ${item}
                  </span>
                `).join("")}
              </div>
            </article>
          `).join("")}
        </div>

        <div class="sectionhead" style="margin-top:35px">
          <div>
            <span class="eyebrow">CARNET DE PILOTAGE</span>
            <h2>Vos dernières courses.</h2>
          </div>
        </div>

        ${p && p.records.length
          ? p.records.slice(-8).reverse().map((record) => `
            <article class="lesson"
              style="--c:${courses[record.course].color};margin-bottom:15px">
              <h3>
                ${courses[record.course].name} ·
                ${record.rank}${record.rank === 1 ? "er" : "e"}
              </h3>
              <p>
                ${record.correct}/3 défis réussis ·
                +${record.xp} XP · +${record.coins} pièces
              </p>
              ${(record.answers || []).map((answer) => `
                <p>
                  <b>${answer.ok ? "✓" : "↺"} ${esc(answer.q)}</b><br>
                  ${esc(answer.explanation)}
                </p>
              `).join("")}
            </article>
          `).join("")
          : "<p>Aucune course terminée pour le moment.</p>"
        }

        <div class="notice" style="margin-top:25px">
          Les situations chiffrées des défis sont fictives.
          CPL = coût par lead ; CPA = coût par action ;
          CLV = valeur client estimée ; churn = attrition ;
          NPS = promoteurs − détracteurs.
        </div>

        <a class="btn white"
          href="${ONLINE_URL}plateau.html"
          target="_blank"
          rel="noopener noreferrer">
          Ouvrir la version plateau ↗
        </a>
      </div>
    `;
  }

  // --------------------------------------------------
  // PRÉPARATION DE LA COURSE
  // --------------------------------------------------

  function brief(index) {
    if (!pilot()) return profiles();

    const c = courses[index];

    openDialog(`
      <span class="eyebrow">MONDE 0${index + 1} · ${c.phase}</span>
      <h2>${c.name}</h2>

      ${thumbnail(index)}

      <p><b>Votre mission :</b> ${c.goal}</p>

      <div class="itemlist">
        ${c.items.map((item) => `<span>✦ ${item}</span>`).join("")}
      </div>

      <p>
        <b>← → ou A / D :</b> changez de trajectoire.
        L’accélération est automatique.<br>
        <b>◉ Pièces :</b> ramassez-les pour le garage.<br>
        <b>✦ Cubes de savoir :</b> attrapez-les pour ouvrir un défi.
        Une bonne réponse offre un turbo de 5 secondes.<br>
        <b>Plots :</b> évitez-les, ils vous ralentissent.<br>
        <b>Espace :</b> mettre en pause.
      </p>

      <p>
        Réussissez <b>2 défis sur 3</b> pour obtenir le badge.
        Les cubes manqués sont proposés au stand final.
      </p>

      <div class="row">
        <button class="btn white" id="cancelRace">Plus tard</button>
        <button class="btn yellow" id="beginRace">DÉPART ▶</button>
      </div>
    `);

    $("#cancelRace").onclick = closeDialog;

    $("#beginRace").onclick = () => {
      closeDialog();
      startRace(index);
    };
  }

  const canvas = $("#raceCanvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    $("#app").textContent =
      "Votre navigateur ne permet pas d’afficher le circuit.";
    return;
  }

  let W = 1280;
  let H = 720;

  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);

    W = window.innerWidth;
    H = window.innerHeight;

    canvas.width = W * ratio;
    canvas.height = H * ratio;

    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  window.addEventListener("resize", resize);

  function startRace(index) {
    const p = pilot();
    if (!p) return profiles();

    cancelAnimationFrame(frame);
    resize();

    const order = bank[index].map((question, i) => i);

    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }

    race = {
      course: index,
      owner: p.id,
      color: skin(p).color,
      distance: 0,
      time: 0,
      x: 0,
      coins: 0,
      correct: 0,
      answered: 0,
      answers: [],
      objects: [],
      mode: "countdown",
      countdown: 3,
      boost: 0,
      slow: 0,
      hits: 0,
      quizOrder: order.slice(0, 3),
      toast: 3,
      rewarded: false,
      bots: [
        {
          name: "Nova", speed: 69, color: "#5b95e8",
          lane: -0.62, offset: 30
        },
        {
          name: "Pixel", speed: 72, color: "#edbf45",
          lane: 0.62, offset: 15
        },
        {
          name: "Bolt", speed: 75, color: "#b375e3",
          lane: 0, offset: 60
        }
      ]
    };

    for (let z = 190; z < 2470; z += 95) {
      const lane = [-0.62, 0, 0.62][Math.floor(Math.random() * 3)];

      race.objects.push({
        z, lane, type: "coin", taken: false
      });

      if (z % 3 === 1) {
        race.objects.push({
          z: z + 42,
          lane: -lane || 0.62,
          type: "cone",
          taken: false
        });
      }
    }

    [350, 1050, 1750].forEach((z, index) => {
      race.objects.push({
        z,
        lane: [0, -0.62, 0.62][index],
        type: "knowledge",
        taken: false
      });
    });

    $("#raceScreen").hidden = false;
    document.body.style.overflow = "hidden";

    keys = { left: false, right: false };
    last = 0;

    toast("Attrapez les cubes ✦ et les pièces !");
    frame = requestAnimationFrame(loop);
  }

  // --------------------------------------------------
  // DESSIN DU CIRCUIT
  // --------------------------------------------------

  function project(z, lane = 0) {
    const t = Math.max(0, Math.min(1, 1 - z / 800));

    const bend =
      Math.sin((race.distance + z) / 440) * W * 0.115 -
      Math.sin(race.distance / 440) * W * 0.065;

    const half = 30 + Math.pow(t, 1.25) * W * 0.43;

    return {
      x: W / 2 + bend * t + lane * half,
      y: H * 0.32 + Math.pow(t, 2) * H * 0.69,
      half,
      scale: 0.08 + Math.pow(t, 1.6) * 1.1
    };
  }

  function poly(points, fill) {
    ctx.fillStyle = fill;
    ctx.beginPath();

    points.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point[0], point[1]);
      } else {
        ctx.lineTo(point[0], point[1]);
      }
    });

    ctx.closePath();
    ctx.fill();
  }

  function rounded(x, y, width, height, radius, fill) {
    ctx.fillStyle = fill;
    ctx.beginPath();

    if (typeof ctx.roundRect === "function") {
      ctx.roundRect(x, y, width, height, radius);
    } else {
      ctx.rect(x, y, width, height);
    }

    ctx.fill();
  }

  function kart(x, y, scale, color, bot = false) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    ctx.fillStyle = "#12233344";
    ctx.beginPath();
    ctx.ellipse(0, 3, 43, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    rounded(-42, -39, 17, 34, 5, "#202b3c");
    rounded(25, -39, 17, 34, 5, "#202b3c");
    rounded(-31, -64, 12, 22, 4, "#202b3c");
    rounded(19, -64, 12, 22, 4, "#202b3c");

    poly([[-26, -56], [24, -56], [32, -6], [-32, -6]], color);

    rounded(-6, -57, 12, 49, 1, "#ffffffcc");
    rounded(-20, -49, 40, 26, 8, "#344356");

    ctx.fillStyle = "#ffe2ae";
    ctx.beginPath();
    ctx.arc(0, -50, 17, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(0, -53, 19, Math.PI, Math.PI * 2);
    ctx.lineTo(19, -46);
    ctx.lineTo(-19, -46);
    ctx.fill();

    rounded(-17, -55, 34, 10, 4, "#293b50");
    rounded(-32, -16, 64, 10, 3, color);

    if (!bot && race.boost > 0) {
      poly(
        [[-19, 0], [-8, 22], [0, 5], [10, 28], [20, 0]],
        "#ffc93c"
      );
      poly([[-9, 0], [0, 19], [10, 0]], "#fff5a1");
    }

    ctx.restore();
  }

  function renderRace() {
    if (!race) return;

    const c = courses[race.course];

    ctx.clearRect(0, 0, W, H);

    const sky = ctx.createLinearGradient(0, 0, 0, H * 0.5);
    sky.addColorStop(0, c.sky);
    sky.addColorStop(1, "#f8f7e4");

    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = "#fff5bd";
    ctx.beginPath();
    ctx.arc(W * 0.8, H * 0.17, 32, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffffffaa";

    [
      [0.13, 0.16, 60],
      [0.4, 0.12, 40],
      [0.87, 0.27, 70]
    ].forEach(([x, y, width]) => {
      ctx.beginPath();
      ctx.ellipse(W * x, H * y, width, 12, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    poly([
      [0, H * 0.38],
      [0, H * 0.28],
      [W * 0.13, H * 0.18],
      [W * 0.3, H * 0.33],
      [W * 0.47, H * 0.21],
      [W * 0.64, H * 0.34],
      [W * 0.8, H * 0.18],
      [W, H * 0.3],
      [W, H]
    ], c.land);

    ctx.fillStyle = c.land;
    ctx.fillRect(0, H * 0.34, W, H);

    for (let z = 800; z > 0; z -= 15) {
      const a = project(z);
      const b = project(z - 15);
      const stripe = Math.floor((race.distance + z) / 45) % 2;

      poly([
        [a.x - a.half - 8, a.y],
        [a.x + a.half + 8, a.y],
        [b.x + b.half + 8, b.y],
        [b.x - b.half - 8, b.y]
      ], stripe ? "#faf5e4" : "#eb645b");

      poly([
        [a.x - a.half, a.y],
        [a.x + a.half, a.y],
        [b.x + b.half, b.y],
        [b.x - b.half, b.y]
      ], stripe ? "#59677e" : "#5d6b81");

      if (Math.floor((race.distance + z) / 40) % 2 === 0) {
        [-0.33, 0.33].forEach((lane) => {
          poly([
            [a.x + a.half * lane - 1, a.y],
            [a.x + a.half * lane + 1, a.y],
            [b.x + b.half * lane + 2, b.y],
            [b.x + b.half * lane - 2, b.y]
          ], "#ffffff77");
        });
      }
    }

    for (let index = 0; index < 12; index++) {
      const z = (index * 83 - race.distance % 83 + 800) % 800;
      const p = project(z);
      const s = p.scale;

      for (const side of [-1, 1]) {
        const x = p.x + side * (p.half + 45 * s);
        const y = p.y;

        ctx.fillStyle = "#927257";
        ctx.fillRect(x - 4 * s, y - 33 * s, 8 * s, 33 * s);

        if (race.course === 2) {
          poly([
            [x - 22 * s, y],
            [x - 12 * s, y - 95 * s],
            [x + 8 * s, y - 75 * s],
            [x + 28 * s, y]
          ], "#b9784e");
        } else if (race.course === 3) {
          rounded(
            x - 17 * s, y - 115 * s,
            34 * s, 115 * s, 2, "#7784ad"
          );

          ctx.fillStyle = "#f8db8f";

          for (let j = 0; j < 4; j++) {
            ctx.fillRect(
              x - 8 * s,
              y - (j * 22 + 22) * s,
              15 * s,
              7 * s
            );
          }
        } else {
          poly([
            [x, y - 100 * s],
            [x - 35 * s, y - 30 * s],
            [x + 35 * s, y - 30 * s]
          ], race.course === 4 ? "#b977b7" : "#398d68");

          poly([
            [x, y - 73 * s],
            [x - 43 * s, y - 5 * s],
            [x + 43 * s, y - 5 * s]
          ], race.course === 4 ? "#ce97ca" : "#449e71");
        }
      }
    }

    const visible = race.objects
      .filter((object) =>
        !object.taken &&
        object.z - race.distance > -5 &&
        object.z - race.distance < 780
      )
      .map((object) => ({
        ...object,
        depth: object.z - race.distance,
        object: true
      }));

    race.bots.forEach((bot) => {
      const z =
        bot.offset + bot.speed * race.time - race.distance + 80;

      if (z > 15 && z < 780) {
        visible.push({ ...bot, depth: z, object: false });
      }
    });

    visible.sort((a, b) => b.depth - a.depth);

    visible.forEach((object) => {
      const p = project(object.depth, object.lane);
      const s = p.scale;

      if (!object.object) {
        kart(p.x, p.y, s * 0.75, object.color, true);

        ctx.fillStyle = "#fff";
        ctx.font = `bold ${Math.max(10, 13 * s)}px Outfit, sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText(object.name, p.x, p.y - 80 * s);

        return;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.scale(s, s);

      ctx.fillStyle = "#152a3433";
      ctx.beginPath();
      ctx.ellipse(0, 2, 22, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      if (object.type === "coin") {
        ctx.fillStyle = "#d49b17";
        ctx.beginPath();
        ctx.ellipse(0, -24, 13, 21, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "#fff3ac";
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = "#fff0a4";
        ctx.font = "bold 23px Outfit, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("◉", 0, -16);
      }

      if (object.type === "cone") {
        poly([[0, -51], [-23, 0], [23, 0]], "#ff773c");
        poly(
          [[-8, -32], [8, -32], [13, -21], [-13, -21]],
          "#fff6de"
        );
        rounded(-28, -3, 56, 8, 2, "#d65a28");
      }

      if (object.type === "knowledge") {
        const bob = Math.sin(race.time * 4) * 5;

        ctx.shadowColor = "#66caff";
        ctx.shadowBlur = 18;

        poly([
          [0, -65 + bob],
          [27, -50 + bob],
          [27, -17 + bob],
          [0, -3 + bob],
          [-27, -17 + bob],
          [-27, -50 + bob]
        ], "#5ba7eb");

        ctx.shadowBlur = 0;

        poly([
          [0, -65 + bob],
          [27, -50 + bob],
          [0, -35 + bob],
          [-27, -50 + bob]
        ], "#bdeaff");

        ctx.fillStyle = "white";
        ctx.font = "bold 31px Outfit, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("✦", 0, -21 + bob);
      }

      ctx.restore();
    });

    const player = project(80, race.x);

    kart(
      player.x,
      player.y,
      Math.min(1.25, W / 650 + 0.2),
      race.color
    );

    if (race.boost > 0) {
      ctx.strokeStyle = "#ffffff99";
      ctx.lineWidth = 3;

      for (let i = 0; i < 10; i++) {
        const x = (i * W / 10 + race.time * 130) % W;
        ctx.beginPath();
        ctx.moveTo(x, H * 0.5);
        ctx.lineTo(W * 0.5 + (x - W * 0.5) * 1.5, H);
        ctx.stroke();
      }
    }

    if (race.mode === "countdown") {
      ctx.fillStyle = "#20334377";
      ctx.fillRect(0, 0, W, H);
      ctx.textAlign = "center";
      ctx.font = "900 110px Outfit, sans-serif";
      ctx.fillStyle = "white";
      ctx.fillText(Math.ceil(race.countdown), W / 2, H * 0.55);
      ctx.font = "700 17px Outfit, sans-serif";
      ctx.fillText("À VOS MARQUES…", W / 2, H * 0.63);
    }

    const rank = 1 + race.bots.filter(
      (bot) => bot.offset + bot.speed * race.time > race.distance
    ).length;

    const seconds = Math.floor(race.time);

    $("#raceTitle").textContent = c.name;
    $("#racePlace").textContent =
      `${rank}${rank === 1 ? "er" : "e"} / 4`;
    $("#raceCoins").textContent = `◉ ${race.coins}`;
    $("#raceKnowledge").textContent = `✦ ${race.correct} / 3`;
    $("#raceTimer").textContent =
      `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
    $("#raceSpeed").textContent =
      `${Math.round(race.mode === "running" ? speed() : 0)} km/h`;

    $("#raceProgressFill").style.width =
      `${Math.min(100, race.distance / 2600 * 100)}%`;
  }

  // --------------------------------------------------
  // BOUCLE DE JEU
  // --------------------------------------------------

  function speed() {
    return Math.max(
      25,
      70 + (race.boost > 0 ? 35 : 0) - (race.slow > 0 ? 40 : 0)
    );
  }

  function toast(message) {
    $("#raceToast").textContent = message;
    if (race) race.toast = 3;
  }

  function loop(timestamp) {
    if (!race) return;

    const dt = Math.min(0.04, last ? (timestamp - last) / 1000 : 0);
    last = timestamp;

    if (race.mode === "countdown") {
      race.countdown -= dt;

      if (race.countdown <= 0) {
        race.mode = "running";
        toast("C’est parti ! Attrapez les cubes de savoir ✦");
      }
    }

    if (race.mode === "running") {
      race.time += dt;
      race.distance += speed() * dt;
      race.boost = Math.max(0, race.boost - dt);
      race.slow = Math.max(0, race.slow - dt);

      race.x = Math.max(
        -0.92,
        Math.min(
          0.92,
          race.x +
          ((keys.right ? 1 : 0) - (keys.left ? 1 : 0)) * dt * 1.6
        )
      );

      race.toast -= dt;

      if (race.toast <= 0) {
        $("#raceToast").textContent =
          "✦ Cubes = défis & turbo · ◉ Pièces = garage";
      }

      for (const object of race.objects) {
        const z = object.z - race.distance;

        if (
          !object.taken &&
          z < 90 &&
          z > 50 &&
          Math.abs(object.lane - race.x) < 0.35
        ) {
          object.taken = true;

          if (object.type === "coin") {
            race.coins++;
            toast("◉ +1 pièce pour le garage");
          }

          if (object.type === "cone") {
            race.hits++;
            race.slow = 2;
            toast("Attention au plot ! Ralentissement 2 s");
          }

          if (object.type === "knowledge") {
            askQuestion(false);
            break;
          }
        }
      }

      if (race.distance >= 2600 && race.mode === "running") {
        race.distance = 2600;

        if (race.answered < 3) {
          askQuestion(true);
        } else {
          finishRace();
        }
      }
    }

    if (race) {
      renderRace();
      frame = requestAnimationFrame(loop);
    }
  }

  // --------------------------------------------------
  // QUESTIONS EN COURSE
  // --------------------------------------------------

  function askQuestion(atStand) {
    if (!race || race.answered >= 3) return;

    keys = { left: false, right: false };
    race.mode = "question";

    const questionIndex = race.quizOrder[race.answered];
    const question = bank[race.course][questionIndex];
    const item = questionItems[race.course][questionIndex];

    openDialog(`
      <span class="eyebrow">
        ${atStand ? "ARRÊT AU STAND" : "CUBE DE SAVOIR ATTRAPÉ"}
        · ${race.answered + 1}/3
      </span>

      <h2>✦ ${item}</h2>
      <p><strong>${esc(question[0])}</strong></p>

      <div>
        ${question[1].map((answer, index) => `
          <button class="option" data-answer="${index}">
            ${String.fromCharCode(65 + index)} · ${esc(answer)}
          </button>
        `).join("")}
      </div>

      <p>
        La course et les rivaux sont en pause pendant le défi.
        Bonne réponse : +50 XP et un turbo à la reprise.
      </p>

      <div id="questionFeedback"></div>
    `);

    document.querySelectorAll("[data-answer]").forEach((button) => {
      button.onclick = () => {
        if (!race || race.mode !== "question") return;

        race.mode = "feedback";

        const choice = Number(button.dataset.answer);
        const correct = choice === question[2];

        race.answered++;

        if (correct) {
          race.correct++;
          if (race.distance < 2600) race.boost = 5;
        }

        race.answers.push({
          q: question[0],
          ok: correct,
          explanation: question[3],
          answer: question[1][choice],
          item
        });

        document.querySelectorAll("[data-answer]").forEach((option) => {
          option.disabled = true;
          option.classList.toggle(
            "correct",
            Number(option.dataset.answer) === question[2]
          );
          option.classList.toggle(
            "wrong",
            option === button && !correct
          );
        });

        $("#questionFeedback").innerHTML = `
          <div class="feedback">
            <b>
              ${correct
                ? `Bien joué ! +50 XP${race.distance < 2600 ? " · Turbo prêt ⚡" : ""}`
                : "Une nouvelle chose apprise."}
            </b><br>
            ${esc(question[3])}
          </div>

          <button class="btn yellow" id="resumeQuestion">
            ${race.distance >= 2600
              ? race.answered < 3
                ? "Défi suivant →"
                : "Voir les récompenses →"
              : "REPRENDRE LA COURSE ▶"}
          </button>
        `;

        $("#resumeQuestion").onclick = () => {
          closeDialog();

          if (!race) return;

          if (race.distance >= 2600) {
            if (race.answered < 3) {
              askQuestion(true);
            } else {
              finishRace();
            }
          } else {
            race.mode = "running";

            toast(
              correct
                ? "⚡ TURBO ! Accélération pendant 5 secondes"
                : "Reprenez la piste, le prochain cube vous attend."
            );
          }
        };
      };
    });
  }

  // --------------------------------------------------
  // PAUSE ET RÉSULTATS
  // --------------------------------------------------

  function pauseRace() {
    if (!race || !["running", "countdown"].includes(race.mode)) return;

    const previousMode = race.mode;
    race.mode = "paused";
    keys = { left: false, right: false };

    openDialog(`
      <span class="eyebrow">ARRÊT AU STAND</span>
      <h2>Un petit temps mort.</h2>
      <p>Votre progression sera récompensée à l’arrivée.</p>

      <div class="row">
        <button class="btn yellow" id="continueRace">Reprendre ▶</button>
        <button class="btn white" id="quitRace">Quitter la course</button>
      </div>
    `);

    $("#continueRace").onclick = () => {
      closeDialog();
      if (race) race.mode = previousMode;
    };

    $("#quitRace").onclick = () => {
      closeDialog();
      stopRace();
      render();
    };
  }

  function stopRace() {
    cancelAnimationFrame(frame);
    race = null;
    keys = { left: false, right: false };
    $("#raceScreen").hidden = true;
    document.body.style.overflow = "";
  }

  function finishRace() {
    if (!race || race.rewarded) return;

    race.rewarded = true;

    const result = race;
    const p = db.profiles.find((profile) => profile.id === result.owner);

    if (!p) {
      stopRace();
      render();
      return;
    }

    const rank = 1 + result.bots.filter(
      (bot) => bot.offset + bot.speed * result.time > result.distance
    ).length;

    const xp = 40 + result.correct * 50 + result.coins * 2;
    const coins = 20 + result.correct * 15 + result.coins;
    const previousLevel = level(p);

    const newBadge =
      result.correct >= 2 && !p.badges.includes(result.course);

    p.xp += xp;
    p.coins += coins;

    result.answers.filter((answer) => answer.ok).forEach((answer) => {
      if (answer.item && !p.collection.includes(answer.item)) {
        p.collection.push(answer.item);
      }
    });

    if (newBadge) p.badges.push(result.course);

    p.records.push({
      course: result.course,
      correct: result.correct,
      xp,
      coins,
      rank,
      seconds: Math.round(result.time),
      answers: result.answers,
      date: new Date().toISOString()
    });

    persist();
    stopRace();
    render();

    openDialog(`
      <span class="eyebrow">
        DRAPEAU À DAMIER · ${courses[result.course].phase}
      </span>

      <div class="badgeArt">
        ${["🏆", "🥈", "🥉"][rank - 1] || "🏁"}
      </div>

      <h2>
        ${rank}${rank === 1 ? "er" : "e"} sur le circuit.
        ${result.correct === 3
          ? "Sans-faute !"
          : result.correct >= 2
            ? "Mission accomplie !"
            : "Une belle base pour progresser."}
      </h2>

      <p>
        ${result.correct}/3 bonnes réponses ·
        ${result.coins} pièces attrapées ·
        ${result.hits} plots touchés ·
        ${Math.round(result.time)} s de conduite.
      </p>

      <div class="rewards">
        <div class="reward">
          <b>+${xp}</b>
          <small>XP GAGNÉS</small>
        </div>
        <div class="reward">
          <b>+${coins} ◉</b>
          <small>PIÈCES GAGNÉES</small>
        </div>
        <div class="reward">
          <b>${newBadge ? "🏅" : result.correct >= 2 ? "✓" : "↻"}</b>
          <small>
            ${newBadge
              ? "NOUVEAU BADGE"
              : result.correct >= 2
                ? "MONDE MAÎTRISÉ"
                : "BADGE À RETENTER"}
          </small>
        </div>
      </div>

      ${level(p) > previousLevel ? `
        <div class="feedback">
          ✦ NIVEAU SUPÉRIEUR ! Vous passez au niveau ${level(p)}.
        </div>
      ` : ""}

      <p>
        XP : 40 à l’arrivée + 50 par bonne réponse + 2 par pièce.<br>
        Monnaie : 20 à l’arrivée + 15 par bonne réponse + les pièces.
      </p>

      ${newBadge && result.course < 4 ? `
        <div class="feedback">
          🔓 ${courses[result.course + 1].name} est maintenant accessible.
        </div>
      ` : ""}

      <div class="row">
        <button class="btn white" id="resultReview">Le débriefing</button>
        <button class="btn yellow" id="resultContinue">
          ${result.correct >= 2 && result.course < 4
            ? "MONDE SUIVANT →"
            : "RETOUR À LA CARTE"}
        </button>
      </div>
    `);

    $("#resultReview").onclick = () => {
      closeDialog();
      page = "academy";
      render();
      window.scrollTo(0, 0);
    };

    $("#resultContinue").onclick = () => {
      closeDialog();

      if (result.correct >= 2 && result.course < 4) {
        brief(result.course + 1);
      }
    };
  }

  // --------------------------------------------------
  // COMMANDES CLAVIER ET TACTILES
  // --------------------------------------------------

  $("#pauseBtn").onclick = pauseRace;

  $("#profileBtn").onclick = () => {
    if (!race) profiles();
  };

  document.querySelectorAll("[data-page]").forEach((button) => {
    button.onclick = () => {
      if (race) return;
      page = button.dataset.page;
      render();
      window.scrollTo(0, 0);
    };
  });

  window.addEventListener("keydown", (event) => {
    if (!race) return;

    const key = event.key.toLowerCase();

    if (["arrowleft", "arrowright", "a", "d", "q", " "].includes(key)) {
      event.preventDefault();
    }

    if (key === " " && !event.repeat) {
      pauseRace();
      return;
    }

    if (race.mode !== "running") return;

    if (["arrowleft", "a", "q"].includes(key)) {
      keys.left = true;
    }

    if (["arrowright", "d"].includes(key)) {
      keys.right = true;
    }
  });

  window.addEventListener("keyup", (event) => {
    const key = event.key.toLowerCase();

    if (["arrowleft", "a", "q"].includes(key)) keys.left = false;
    if (["arrowright", "d"].includes(key)) keys.right = false;
  });

  window.addEventListener("blur", () => {
    keys = { left: false, right: false };
    pauseRace();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      keys = { left: false, right: false };
      pauseRace();
    }
  });

  for (const [id, direction] of [
    ["leftBtn", "left"],
    ["rightBtn", "right"]
  ]) {
    const button = document.getElementById(id);
    button.style.touchAction = "none";

    button.onpointerdown = (event) => {
      event.preventDefault();

      if (button.setPointerCapture) {
        button.setPointerCapture(event.pointerId);
      }

      if (race?.mode === "running") {
        keys[direction] = true;
      }
    };

    const release = () => {
      keys[direction] = false;
    };

    button.onpointerup = release;
    button.onpointercancel = release;
    button.onlostpointercapture = release;
  }

  $("#dialog").addEventListener("cancel", (event) => {
    if (race) event.preventDefault();
  });

  // Démarrage de l’interface.
  render();
}

// Attend que les éléments du HTML soient disponibles.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initKartUp, { once: true });
} else {
  initKartUp();
}