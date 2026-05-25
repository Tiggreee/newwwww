import { marked } from "https://esm.sh/marked@13.0.2";
import DOMPurify from "https://esm.sh/dompurify@3.1.6";

const docs = [
  { file: "README.md", title: "Inicio del curso" },
  { file: "ruta-data-interactiva.md", title: "Data route interactive" },
  { file: "semana-01.md", title: "Semana 1" },
  { file: "semana-02.md", title: "Semana 2" },
  { file: "semana-03.md", title: "Semana 3" },
  { file: "semana-04.md", title: "Semana 4" },
  { file: "frases-clave.md", title: "Frases clave" },
  { file: "vocabulario-tech.md", title: "Vocabulario tech" },
  { file: "cheat-sheet-entrevistas.md", title: "Cheat sheet entrevistas" },
  { file: "bitacora.md", title: "Bitacora" },
  {
    file: "ilustraciones-referenciadas.md",
    title: "Ilustraciones referenciadas"
  }
];

const docList = document.querySelector("#doc-list");
const content = document.querySelector("#content");
const status = document.querySelector("#status");
const searchInput = document.querySelector("#search");
const quizLevel = document.querySelector("#quiz-level");
const quizQuestion = document.querySelector("#quiz-question");
const quizSpeak = document.querySelector("#quiz-speak");
const quizOptions = document.querySelector("#quiz-options");
const quizNext = document.querySelector("#quiz-next");
const quizFeedback = document.querySelector("#quiz-feedback");

const kpiLearners = document.querySelector("#kpi-learners");
const kpiActive = document.querySelector("#kpi-active");
const kpiQuiz = document.querySelector("#kpi-quiz");
const kpiSpeaking = document.querySelector("#kpi-speaking");
const kpiCompletion = document.querySelector("#kpi-completion");
const kpiModule = document.querySelector("#kpi-module");
const leaderboardEl = document.querySelector("#leaderboard");
const caseTitleEl = document.querySelector("#case-title");
const caseHookEl = document.querySelector("#case-hook");
const caseTaskEl = document.querySelector("#case-task");
const learnerNameEl = document.querySelector("#learnerName");
const logAttemptEl = document.querySelector("#log-attempt");
const backendMessageEl = document.querySelector("#backend-message");

const quizData = [
  {
    level: "Level 1 - Introductions in data context",
    question: "Choose the most professional intro for a junior data analyst profile:",
    options: [
      "Hi, I do many things in tech and stuff.",
      "I'm learning data analysis and I focus on SQL and clear reporting.",
      "I know everything about dashboards already.",
      "I only work if the tasks are easy."
    ],
    answerIndex: 1,
    explanation: "Excelente: clara, honesta y alineada al rol.",
    speakPrompt: "Say it out loud: I'm learning data analysis and I focus on SQL and clear reporting."
  },
  {
    level: "Level 2 - Clarify and ask for support",
    question: "You did not understand a SQL request. Which answer is best?",
    options: [
      "This makes no sense.",
      "Can you clarify the metric and time range so I can query it correctly?",
      "I will guess and send something.",
      "No, I can't do this."
    ],
    answerIndex: 1,
    explanation: "Muy bien: pide contexto con lenguaje profesional y accionable.",
    speakPrompt: "Say it out loud: Can you clarify the metric and time range so I can query it correctly?"
  },
  {
    level: "Level 3 - Communicate insights",
    question: "Pick the strongest sentence to present a finding:",
    options: [
      "The chart is interesting.",
      "Sales are weird in Q2.",
      "Revenue increased 12% in Q2, mainly driven by repeat customers.",
      "Data is data."
    ],
    answerIndex: 2,
    explanation: "Correcto: incluye numero, periodo y causa probable.",
    speakPrompt: "Say it out loud: Revenue increased 12% in Q2, mainly driven by repeat customers."
  },
  {
    level: "Level 4 - Interview close",
    question: "Choose the best closing line for a data analyst interview:",
    options: [
      "Thanks, bye.",
      "I am perfect for this role.",
      "Thank you for your time. I'd love to contribute to your analytics team.",
      "Please reply quickly."
    ],
    answerIndex: 2,
    explanation: "Excelente cierre: respetuoso, seguro y profesional.",
    speakPrompt: "Say it out loud: Thank you for your time. I'd love to contribute to your analytics team."
  }
];

let currentQuestionIndex = 0;
let currentSelection = null;
let completionNote = "";

marked.setOptions({
  gfm: true,
  breaks: false
});

function slugFromFile(file) {
  return file.replace(".md", "");
}

function fileFromRoute() {
  const route = (location.hash || "#/README").replace("#/", "").trim();
  const normalized = route.toLowerCase();

  const found = docs.find((doc) => slugFromFile(doc.file).toLowerCase() === normalized);
  return found?.file || "README.md";
}

function renderDocList(filterText = "") {
  const query = filterText.trim().toLowerCase();
  const selectedFile = fileFromRoute();

  const visibleDocs = docs.filter((doc) => {
    if (!query) return true;
    const haystack = `${doc.title} ${doc.file}`.toLowerCase();
    return haystack.includes(query);
  });

  docList.innerHTML = "";

  visibleDocs.forEach((doc) => {
    const li = document.createElement("li");
    const button = document.createElement("button");
    button.className = "doc-link";
    button.textContent = doc.title;

    if (doc.file === selectedFile) {
      button.classList.add("active");
    }

    button.addEventListener("click", () => {
      location.hash = `#/${slugFromFile(doc.file)}`;
    });

    li.appendChild(button);
    docList.appendChild(li);
  });

  if (visibleDocs.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No hay documentos con ese filtro.";
    docList.appendChild(li);
  }
}

async function loadDocument() {
  const file = fileFromRoute();
  status.textContent = `Mostrando ${file}`;

  try {
    const res = await fetch(`./${file}`);

    if (!res.ok) {
      throw new Error(`No se pudo cargar ${file}`);
    }

    const markdown = await res.text();
    const unsafeHtml = marked.parse(markdown);
    content.innerHTML = DOMPurify.sanitize(unsafeHtml);
    status.textContent = `Documento cargado: ${file}`;
  } catch (error) {
    content.innerHTML = `
      <h2>Error al cargar documento</h2>
      <p>No se pudo abrir ${file}. Verifica que exista en el repositorio.</p>
    `;
    status.textContent = "Error de carga";
    console.error(error);
  }

  renderDocList(searchInput.value);
}

searchInput.addEventListener("input", (event) => {
  renderDocList(event.target.value);
});

window.addEventListener("hashchange", loadDocument);

function renderQuiz() {
  if (!quizLevel || !quizQuestion || !quizOptions || !quizNext || !quizFeedback || !quizSpeak) {
    return;
  }

  const current = quizData[currentQuestionIndex];
  quizLevel.textContent = current.level;
  quizQuestion.textContent = current.question;
  quizSpeak.textContent = current.speakPrompt;
  quizOptions.innerHTML = "";
  quizFeedback.textContent = completionNote;
  completionNote = "";
  currentSelection = null;
  quizNext.disabled = true;

  current.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "quiz-option";
    button.textContent = option;

    button.addEventListener("click", () => {
      currentSelection = index;
      const allOptions = quizOptions.querySelectorAll(".quiz-option");
      allOptions.forEach((item) => {
        item.classList.remove("correct", "wrong");
      });

      if (index === current.answerIndex) {
        button.classList.add("correct");
        quizFeedback.textContent = current.explanation;
      } else {
        button.classList.add("wrong");
        quizFeedback.textContent = "Casi. Elige la opcion mas clara, profesional y concreta.";
      }

      quizNext.disabled = index !== current.answerIndex;
    });

    quizOptions.appendChild(button);
  });
}

if (quizNext) {
  quizNext.addEventListener("click", () => {
    if (currentSelection === null) {
      return;
    }

    currentQuestionIndex += 1;

    if (currentQuestionIndex >= quizData.length) {
      currentQuestionIndex = 0;
      completionNote =
        "Excelente. Completaste el ciclo. Repite las frases en voz alta y graba un audio de 60 segundos.";
    }

    renderQuiz();
  });
}

async function fetchJson(url, fallback = null) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Request failed: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error(error);
    return fallback;
  }
}

async function loadBackendOverview() {
  const overview = await fetchJson("/api/stats/overview");
  if (!overview) {
    if (backendMessageEl) {
      backendMessageEl.textContent = "Backend no disponible. Inicia npm run dev para modo full stack.";
    }
    return;
  }

  if (kpiLearners) kpiLearners.textContent = String(overview.totalLearners);
  if (kpiActive) kpiActive.textContent = String(overview.activeToday);
  if (kpiQuiz) kpiQuiz.textContent = `${overview.avgQuizScore}%`;
  if (kpiSpeaking) kpiSpeaking.textContent = `${overview.avgSpeakingScore}%`;
  if (kpiCompletion) kpiCompletion.textContent = `${overview.completionRate}%`;
  if (kpiModule) kpiModule.textContent = overview.topModule;
}

async function loadLeaderboard() {
  const ranking = await fetchJson("/api/stats/leaderboard", []);
  if (!leaderboardEl) {
    return;
  }

  leaderboardEl.innerHTML = "";
  ranking.forEach((row, index) => {
    const li = document.createElement("li");
    li.textContent = `#${index + 1} ${row.name} | quiz ${row.avgScore}% | speaking ${row.avgSpeaking}% | streak ${row.streak}`;
    leaderboardEl.appendChild(li);
  });
}

async function loadCaseOfDay() {
  const currentCase = await fetchJson("/api/case-of-day");
  if (!currentCase) {
    return;
  }

  if (caseTitleEl) caseTitleEl.textContent = currentCase.title;
  if (caseHookEl) caseHookEl.textContent = currentCase.hook;
  if (caseTaskEl) caseTaskEl.textContent = currentCase.task;
}

async function registerAttempt() {
  if (!learnerNameEl || !backendMessageEl) {
    return;
  }

  const learnerName = learnerNameEl.value.trim();
  if (!learnerName) {
    backendMessageEl.textContent = "Escribe un nombre para registrar el intento.";
    return;
  }

  const payload = {
    learnerName,
    type: "quiz-correct",
    module: "storytelling",
    score: 84,
    speakingScore: 80
  };

  try {
    const res = await fetch("/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error("No se pudo registrar el evento.");
    }

    backendMessageEl.textContent = "Intento registrado. Estadisticas actualizadas.";
    await loadBackendOverview();
    await loadLeaderboard();
  } catch (error) {
    backendMessageEl.textContent = "Error registrando intento en backend.";
    console.error(error);
  }
}

if (logAttemptEl) {
  logAttemptEl.addEventListener("click", registerAttempt);
}

renderDocList();
loadDocument();
renderQuiz();
loadBackendOverview();
loadLeaderboard();
loadCaseOfDay();
