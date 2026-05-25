import { marked } from "https://esm.sh/marked@13.0.2";
import DOMPurify from "https://esm.sh/dompurify@3.1.6";

const SPONSOR_URL = "https://github.com/sponsors/Tiggreee";
const docs = [
  { file: "README.md", title: "Inicio del curso" },
  { file: "ruta-data-interactiva.md", title: "Ruta interactiva" },
  { file: "semana-01.md", title: "Semana 1" },
  { file: "semana-02.md", title: "Semana 2" },
  { file: "semana-03.md", title: "Semana 3" },
  { file: "semana-04.md", title: "Semana 4" },
  { file: "frases-clave.md", title: "Frases clave" },
  { file: "vocabulario-tech.md", title: "Vocabulario" },
  { file: "cheat-sheet-entrevistas.md", title: "Cheat sheet" },
  { file: "bitacora.md", title: "Bitacora" },
  { file: "ilustraciones-referenciadas.md", title: "Ilustraciones" }
];

const quizData = [
  {
    level: "Nivel 1/10",
    question: "Elige la mejor presentacion profesional para iniciar desde cero:",
    options: [
      "Hola, no se mucho pero aqui ando.",
      "Estoy aprendiendo analisis de datos y quiero comunicar hallazgos con claridad.",
      "Solo me interesan las cosas faciles.",
      "No tengo nada que aportar."
    ],
    answerIndex: 1,
    explanation: "Perfecto: directo, profesional y realista.",
    speakPrompt: "Di en voz alta: Estoy aprendiendo analisis de datos y quiero comunicar hallazgos con claridad."
  },
  {
    level: "Nivel 2/10",
    question: "Si no entiendes una solicitud de datos, cual es la respuesta correcta?",
    options: [
      "Mando algo al azar.",
      "Mejor no respondo.",
      "Puedes confirmar metrica, rango de fechas y segmento para consultar bien?",
      "Lo reviso la proxima semana."
    ],
    answerIndex: 2,
    explanation: "Bien: aclaras alcance antes de ejecutar.",
    speakPrompt: "Di en voz alta: Puedes confirmar metrica, rango de fechas y segmento para consultar bien?"
  },
  {
    level: "Nivel 3/10",
    question: "Que frase comunica mejor un hallazgo?",
    options: [
      "Hay cosas raras en el grafico.",
      "La retencion subio 12% en Q2, impulsada por clientes recurrentes.",
      "Todo va normal, supongo.",
      "No hay forma de explicarlo."
    ],
    answerIndex: 1,
    explanation: "Exacto: numero + contexto + causa.",
    speakPrompt: "Di en voz alta: La retencion subio 12% en Q2, impulsada por clientes recurrentes."
  },
  {
    level: "Nivel 4/10",
    question: "Para una entrevista, que cierre es mas fuerte?",
    options: [
      "Gracias, avisan.",
      "Soy perfecto para todo.",
      "Gracias por el tiempo, me interesa aportar a su equipo de analitica.",
      "Necesito respuesta hoy."
    ],
    answerIndex: 2,
    explanation: "Cierre profesional y claro.",
    speakPrompt: "Di en voz alta: Gracias por el tiempo, me interesa aportar a su equipo de analitica."
  },
  {
    level: "Nivel 5/10",
    question: "Cual frase muestra buena practica en datos?",
    options: [
      "Publico sin validar.",
      "Validamos definiciones de metrica antes de reportar.",
      "Borro outliers sin revisar.",
      "Si no cuadra, no importa."
    ],
    answerIndex: 1,
    explanation: "Correcto: validacion antes de comunicar.",
    speakPrompt: "Di en voz alta: Validamos definiciones de metrica antes de reportar."
  },
  {
    level: "Nivel 6/10",
    question: "Como pides feedback en equipo?",
    options: [
      "No necesito feedback.",
      "Revisas mi resumen y me marcas una mejora puntual?",
      "Corrige todo por mi.",
      "Lo dejamos asi."
    ],
    answerIndex: 1,
    explanation: "Pedir feedback especifico acelera mejora.",
    speakPrompt: "Di en voz alta: Revisas mi resumen y me marcas una mejora puntual?"
  },
  {
    level: "Nivel 7/10",
    question: "Cual frase sirve para audiencia no tecnica?",
    options: [
      "Aplicamos una agregacion compleja y ya.",
      "El principal hallazgo es simple: menos abandono despues del nuevo onboarding.",
      "No puedo explicarlo sin SQL.",
      "Es muy tecnico para todos."
    ],
    answerIndex: 1,
    explanation: "Bien: traduces lo tecnico a negocio.",
    speakPrompt: "Di en voz alta: El principal hallazgo es simple: menos abandono despues del nuevo onboarding."
  },
  {
    level: "Nivel 8/10",
    question: "Si detectas datos incompletos, que haces?",
    options: [
      "Sigo sin reportar problema.",
      "Documento limitaciones, limpio y vuelvo a validar.",
      "Relleno con ceros sin avisar.",
      "Mejor no digo nada."
    ],
    answerIndex: 1,
    explanation: "Tal cual: transparencia y control de calidad.",
    speakPrompt: "Di en voz alta: Documento limitaciones, limpio y vuelvo a validar."
  },
  {
    level: "Nivel 9/10",
    question: "Que frase muestra ownership?",
    options: [
      "No es mi problema.",
      "Hoy cierro validacion y comparto resumen ejecutivo.",
      "Alguien mas lo hara.",
      "No tengo tiempo."
    ],
    answerIndex: 1,
    explanation: "Excelente: compromiso + entrega.",
    speakPrompt: "Di en voz alta: Hoy cierro validacion y comparto resumen ejecutivo."
  },
  {
    level: "Nivel 10/10",
    question: "Cual frase final refleja crecimiento real?",
    options: [
      "No aprendi mucho.",
      "Puedo explicar datos en ingles con estructura, evidencia y recomendacion.",
      "Solo memorice frases.",
      "No quiero presentar."
    ],
    answerIndex: 1,
    explanation: "10/10: completaste la ruta de comunicacion.",
    speakPrompt: "Di en voz alta: Puedo explicar datos en ingles con estructura, evidencia y recomendacion."
  }
];

const docList = document.querySelector("#doc-list");
const content = document.querySelector("#content");
const status = document.querySelector("#status");
const searchInput = document.querySelector("#search");
const startRouteButton = document.querySelector("#start-route-button");

const registerForm = document.querySelector("#register-form");
const loginForm = document.querySelector("#login-form");
const authStatus = document.querySelector("#auth-status");
const oauthMsg = document.querySelector("#oauth-msg");
const oauthButtons = document.querySelectorAll(".oauth-btn");

const quizLevel = document.querySelector("#quiz-level");
const quizQuestion = document.querySelector("#quiz-question");
const quizSpeak = document.querySelector("#quiz-speak");
const quizOptions = document.querySelector("#quiz-options");
const quizNext = document.querySelector("#quiz-next");
const quizFeedback = document.querySelector("#quiz-feedback");
const quizProgress = document.querySelector("#quiz-progress");
const rewardBox = document.querySelector("#reward-box");
const sponsorCta = document.querySelector("#sponsor-cta");
const rewardModal = document.querySelector("#reward-modal");
const rewardTimer = document.querySelector("#reward-timer");
const bookLink = document.querySelector("#book-link");
const revealTargets = document.querySelectorAll("[data-reveal]");

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

let currentQuestionIndex = 0;
let currentSelection = null;
let solvedQuestions = 0;
let completionSent = false;
let currentUser = JSON.parse(localStorage.getItem("auth-user") || "null");

marked.setOptions({ gfm: true, breaks: false });

function slugFromFile(file) {
  return file.replace(".md", "");
}

function fileFromRoute() {
  const route = (location.hash || "#/README").replace("#/", "").trim();
  const normalized = route.toLowerCase();
  const found = docs.find((doc) => slugFromFile(doc.file).toLowerCase() === normalized);
  return found?.file || "README.md";
}

function updateAuthStatus() {
  if (!authStatus) return;
  if (currentUser) {
    authStatus.textContent = `Sesion activa: ${currentUser.name || currentUser.email}`;
  } else {
    authStatus.textContent = "Aun no has iniciado sesion.";
  }
}

function renderDocList(filterText = "") {
  const query = filterText.trim().toLowerCase();
  const selectedFile = fileFromRoute();
  const visibleDocs = docs.filter((doc) => {
    if (!query) return true;
    return `${doc.title} ${doc.file}`.toLowerCase().includes(query);
  });

  docList.innerHTML = "";
  visibleDocs.forEach((doc) => {
    const li = document.createElement("li");
    const button = document.createElement("button");
    button.className = "doc-link";
    button.textContent = doc.title;
    if (doc.file === selectedFile) button.classList.add("active");
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
    if (!res.ok) throw new Error(`No se pudo cargar ${file}`);
    const markdown = await res.text();
    content.innerHTML = DOMPurify.sanitize(marked.parse(markdown));
    status.textContent = `Documento cargado: ${file}`;
  } catch (error) {
    content.innerHTML = `<h2>Error al cargar documento</h2><p>No se pudo abrir ${file}. Verifica que exista en el repositorio.</p>`;
    status.textContent = "Error de carga";
    console.error(error);
  }
  renderDocList(searchInput.value);
}

async function fetchJson(url, fallback = null, options) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.warn("Backend fallback:", error.message);
    return fallback;
  }
}

async function registerWithBackend(payload) {
  const result = await fetchJson("/api/auth/register", null, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (result?.ok) return result.user;

  const localUsers = JSON.parse(localStorage.getItem("local-users") || "[]");
  if (localUsers.some((u) => u.email === payload.email)) {
    throw new Error("Ese correo ya existe.");
  }
  const localUser = { name: payload.name, email: payload.email, source: "local-fallback" };
  localUsers.push({ ...localUser, password: payload.password });
  localStorage.setItem("local-users", JSON.stringify(localUsers));
  return localUser;
}

async function loginWithBackend(payload) {
  const result = await fetchJson("/api/auth/login", null, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (result?.ok) return result.user;

  const localUsers = JSON.parse(localStorage.getItem("local-users") || "[]");
  const found = localUsers.find((u) => u.email === payload.email && u.password === payload.password);
  if (!found) throw new Error("Credenciales invalidas.");
  return { name: found.name, email: found.email, source: "local-fallback" };
}

async function handleRegister(event) {
  event.preventDefault();
  const payload = {
    name: document.querySelector("#register-name").value.trim(),
    email: document.querySelector("#register-email").value.trim().toLowerCase(),
    password: document.querySelector("#register-password").value
  };

  try {
    currentUser = await registerWithBackend(payload);
    localStorage.setItem("auth-user", JSON.stringify(currentUser));
    updateAuthStatus();
    authStatus.textContent = `Cuenta creada. Bienvenido ${currentUser.name}.`;
    registerForm.reset();
  } catch (error) {
    authStatus.textContent = error.message;
  }
}

async function handleLogin(event) {
  event.preventDefault();
  const payload = {
    email: document.querySelector("#login-email").value.trim().toLowerCase(),
    password: document.querySelector("#login-password").value
  };

  try {
    currentUser = await loginWithBackend(payload);
    localStorage.setItem("auth-user", JSON.stringify(currentUser));
    updateAuthStatus();
    authStatus.textContent = `Sesion iniciada: ${currentUser.name || currentUser.email}.`;
    loginForm.reset();
  } catch (error) {
    authStatus.textContent = error.message;
  }
}

function handleStartRoute() {
  if (!currentUser) {
    document.querySelector("#registro").scrollIntoView({ behavior: "smooth", block: "start" });
    authStatus.textContent = "Primero registrate o inicia sesion para comenzar la ruta.";
    return;
  }
  location.hash = "#/ruta-data-interactiva";
  document.querySelector(".layout").scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderQuiz() {
  const current = quizData[currentQuestionIndex];
  quizLevel.textContent = current.level;
  quizQuestion.textContent = current.question;
  quizSpeak.textContent = current.speakPrompt;
  quizProgress.textContent = `${solvedQuestions}/10`;
  quizOptions.innerHTML = "";
  quizFeedback.textContent = "";
  quizNext.disabled = true;
  currentSelection = null;

  current.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "quiz-option";
    button.textContent = option;
    button.addEventListener("click", () => {
      const allOptions = quizOptions.querySelectorAll(".quiz-option");
      allOptions.forEach((item) => item.classList.remove("correct", "wrong"));
      currentSelection = index;
      if (index === current.answerIndex) {
        button.classList.add("correct");
        quizFeedback.textContent = current.explanation;
        quizNext.disabled = false;
      } else {
        button.classList.add("wrong");
        quizFeedback.textContent = "No avanza hasta elegir la correcta. Intenta otra vez.";
        quizNext.disabled = true;
      }
    });
    quizOptions.appendChild(button);
  });
}

async function sendChallengeCompletion() {
  if (completionSent || !currentUser) return;
  completionSent = true;

  await fetchJson(
    "/api/challenge/complete",
    null,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        learnerName: currentUser.name || currentUser.email,
        score: 10,
        total: 10
      })
    }
  );
}

function openRewardModal() {
  if (!rewardModal) return;
  let seconds = 5;
  rewardTimer.textContent = String(seconds);
  rewardModal.showModal();

  const tick = setInterval(() => {
    seconds -= 1;
    rewardTimer.textContent = String(seconds);
    if (seconds <= 0) {
      clearInterval(tick);
      rewardModal.close();
      window.location.href = SPONSOR_URL;
    }
  }, 1000);
}

function handleQuizNext() {
  if (currentSelection !== quizData[currentQuestionIndex].answerIndex) return;

  solvedQuestions += 1;
  if (solvedQuestions >= 10) {
    quizProgress.textContent = "10/10";
    quizFeedback.textContent = "Completaste el challenge. Premio desbloqueado.";
    quizNext.disabled = true;
    rewardBox.hidden = false;
    sendChallengeCompletion();
    return;
  }

  currentQuestionIndex += 1;
  renderQuiz();
}

function setupRevealAnimations() {
  if (!revealTargets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          if (entry.target.id === "challenge-mode") {
            const quizPanel = document.querySelector("#quiz-panel");
            if (quizPanel) {
              quizPanel.classList.add("quiz-live");
            }
          }
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealTargets.forEach((target) => observer.observe(target));
}

async function loadBackendOverview() {
  const overview = await fetchJson("/api/stats/overview");
  if (!overview) {
    backendMessageEl.textContent = "Modo sin backend en vivo: activa npm run dev para estadisticas reales.";
    return;
  }
  kpiLearners.textContent = String(overview.totalLearners);
  kpiActive.textContent = String(overview.activeToday);
  kpiQuiz.textContent = `${overview.avgQuizScore}%`;
  kpiSpeaking.textContent = `${overview.avgSpeakingScore}%`;
  kpiCompletion.textContent = `${overview.completionRate}%`;
  kpiModule.textContent = overview.topModule;
}

async function loadLeaderboard() {
  const ranking = await fetchJson("/api/stats/leaderboard", []);
  leaderboardEl.innerHTML = "";
  ranking.forEach((row, index) => {
    const li = document.createElement("li");
    li.textContent = `#${index + 1} ${row.name} | quiz ${row.avgScore}% | speaking ${row.avgSpeaking}% | streak ${row.streak}`;
    leaderboardEl.appendChild(li);
  });
}

async function loadCaseOfDay() {
  const data = await fetchJson("/api/case-of-day");
  if (!data) return;
  caseTitleEl.textContent = data.title;
  caseHookEl.textContent = data.hook;
  caseTaskEl.textContent = data.task;
}

async function registerAttempt() {
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

  const result = await fetchJson("/api/events", null, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  backendMessageEl.textContent = result ? "Intento registrado. Estadisticas actualizadas." : "No se pudo registrar en backend.";
  await loadBackendOverview();
  await loadLeaderboard();
}

searchInput.addEventListener("input", (event) => renderDocList(event.target.value));
window.addEventListener("hashchange", loadDocument);
startRouteButton.addEventListener("click", handleStartRoute);
registerForm.addEventListener("submit", handleRegister);
loginForm.addEventListener("submit", handleLogin);
quizNext.addEventListener("click", handleQuizNext);
sponsorCta.addEventListener("click", openRewardModal);
bookLink.href = SPONSOR_URL;

oauthButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const provider = button.dataset.oauth;
    oauthMsg.textContent = `OAuth con ${provider} queda listo al conectar credenciales en backend. Ahora puedes usar registro propio.`;
  });
});

if (logAttemptEl) {
  logAttemptEl.addEventListener("click", registerAttempt);
}

updateAuthStatus();
renderDocList();
loadDocument();
renderQuiz();
loadBackendOverview();
loadLeaderboard();
loadCaseOfDay();
setupRevealAnimations();
