import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const dataPath = path.join(__dirname, "data", "store.json");
const distDir = path.join(rootDir, "dist");

const app = express();
const port = Number(process.env.PORT || 8787);

app.use(express.json({ limit: "1mb" }));

function readStore() {
  const raw = fs.readFileSync(dataPath, "utf-8");
  return JSON.parse(raw);
}

function writeStore(store) {
  fs.writeFileSync(dataPath, JSON.stringify(store, null, 2));
}

function toDateOnly(iso) {
  return new Date(iso).toISOString().slice(0, 10);
}

function computeOverview(store) {
  const totalLearners = store.learners.length;
  const today = new Date().toISOString().slice(0, 10);
  const activeToday = store.learners.filter((l) => toDateOnly(l.lastActive) === today).length;

  const avgQuizScore =
    store.attempts.length === 0
      ? 0
      : Math.round(store.attempts.reduce((acc, attempt) => acc + attempt.score, 0) / store.attempts.length);

  const avgSpeakingScore =
    store.attempts.length === 0
      ? 0
      : Math.round(
          store.attempts.reduce((acc, attempt) => acc + (attempt.speakingScore || 0), 0) / store.attempts.length
        );

  const modules = ["foundations", "design", "sql", "storytelling"];
  const expectedCompletions = totalLearners * modules.length;
  const completionRate = expectedCompletions === 0 ? 0 : Math.round((store.completions.length / expectedCompletions) * 100);

  const moduleCompletions = modules.map((module) => ({
    module,
    completions: store.completions.filter((c) => c.module === module).length
  }));

  const topModule = moduleCompletions.sort((a, b) => b.completions - a.completions)[0]?.module || "foundations";

  return {
    totalLearners,
    activeToday,
    avgQuizScore,
    avgSpeakingScore,
    completionRate,
    topModule
  };
}

function computeModuleStats(store) {
  const modules = ["foundations", "design", "sql", "storytelling"];

  return modules.map((module) => {
    const moduleAttempts = store.attempts.filter((a) => a.module === module);
    const moduleCompletions = store.completions.filter((c) => c.module === module).length;
    const avgScore =
      moduleAttempts.length === 0
        ? 0
        : Math.round(moduleAttempts.reduce((acc, item) => acc + item.score, 0) / moduleAttempts.length);

    return {
      module,
      attempts: moduleAttempts.length,
      completions: moduleCompletions,
      avgScore
    };
  });
}

function computeEngagement(store) {
  const last7 = [...Array(7)].map((_, index) => {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - (6 - index));
    return date.toISOString().slice(0, 10);
  });

  const daily = last7.map((day) => {
    const events = store.events.filter((event) => toDateOnly(event.timestamp) === day).length;
    const attempts = store.attempts.filter((attempt) => toDateOnly(attempt.timestamp) === day).length;

    return { day, events, attempts };
  });

  return { daily };
}

function computeLeaderboard(store) {
  const byLearner = new Map();

  for (const attempt of store.attempts) {
    if (!byLearner.has(attempt.learnerId)) {
      byLearner.set(attempt.learnerId, { total: 0, count: 0, speakingTotal: 0 });
    }

    const entry = byLearner.get(attempt.learnerId);
    entry.total += attempt.score;
    entry.speakingTotal += attempt.speakingScore || 0;
    entry.count += 1;
  }

  const ranking = store.learners
    .map((learner) => {
      const stat = byLearner.get(learner.id) || { total: 0, count: 0, speakingTotal: 0 };
      const avgScore = stat.count === 0 ? 0 : Math.round(stat.total / stat.count);
      const avgSpeaking = stat.count === 0 ? 0 : Math.round(stat.speakingTotal / stat.count);

      return {
        learnerId: learner.id,
        name: learner.name,
        level: learner.level,
        streak: learner.streak,
        avgScore,
        avgSpeaking
      };
    })
    .sort((a, b) => b.avgScore - a.avgScore)
    .slice(0, 5);

  return ranking;
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "data-english-backend", timestamp: new Date().toISOString() });
});

app.get("/api/stats/overview", (_req, res) => {
  const store = readStore();
  res.json(computeOverview(store));
});

app.get("/api/stats/modules", (_req, res) => {
  const store = readStore();
  res.json(computeModuleStats(store));
});

app.get("/api/stats/engagement", (_req, res) => {
  const store = readStore();
  res.json(computeEngagement(store));
});

app.get("/api/stats/leaderboard", (_req, res) => {
  const store = readStore();
  res.json(computeLeaderboard(store));
});

app.get("/api/case-of-day", (_req, res) => {
  const store = readStore();
  const dayIndex = new Date().getUTCDate() % store.cases.length;
  res.json(store.cases[dayIndex]);
});

app.post("/api/events", (req, res) => {
  const { learnerName, type, module, score, speakingScore } = req.body || {};

  if (!learnerName || !type) {
    return res.status(400).json({ error: "learnerName and type are required" });
  }

  const store = readStore();
  const learnerId = learnerName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  let learner = store.learners.find((item) => item.id === learnerId);
  if (!learner) {
    learner = {
      id: learnerId,
      name: learnerName,
      level: "A2",
      track: "data-analyst",
      streak: 1,
      lastActive: new Date().toISOString()
    };
    store.learners.push(learner);
  } else {
    learner.lastActive = new Date().toISOString();
  }

  store.events.push({
    type,
    module: module || "general",
    timestamp: new Date().toISOString()
  });

  if (typeof score === "number") {
    store.attempts.push({
      learnerId: learner.id,
      module: module || "general",
      score,
      speakingScore: typeof speakingScore === "number" ? speakingScore : Math.max(60, score - 5),
      timestamp: new Date().toISOString()
    });
  }

  writeStore(store);

  return res.status(201).json({ ok: true, learnerId, overview: computeOverview(store) });
});

if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));

  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/")) {
      return next();
    }

    return res.sendFile(path.join(distDir, "index.html"));
  });
}

app.listen(port, () => {
  console.log(`Data English backend listening on http://localhost:${port}`);
});
