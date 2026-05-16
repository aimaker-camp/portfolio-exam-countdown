import { useState, useEffect } from "react";
import "./App.css";

type Exam = { id: string; name: string; date: string; color: string };

const COLORS = ["rose", "amber", "emerald", "indigo", "fuchsia", "violet"];
const STORAGE = "exam-countdowns";

function daysUntil(d: string): number {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const t = new Date(d); t.setHours(0, 0, 0, 0);
  return Math.ceil((t.getTime() - today.getTime()) / 86400000);
}

function rallyQuote(days: number): string {
  if (days < 0) return "MISSION COMPLETED ・ 不管結果如何,你撐到了這天。";
  if (days === 0) return "TODAY IS THE DAY ・ 深呼吸,你準備好了。";
  if (days === 1) return "T-MINUS 1 ・ 早點睡,文具帶齊。";
  if (days <= 3) return "T-MINUS 3 ・ 衝刺最後階段,重點題型多看 1 次。";
  if (days <= 7) return "T-MINUS 7 ・ 整理筆記 + 練模擬題。";
  if (days <= 14) return "T-MINUS 14 ・ 把弱科再加強一次。";
  if (days <= 30) return "T-MINUS 30 ・ 排好進度,每天進步一點。";
  if (days <= 90) return "T-MINUS 90 ・ 還來得及,但別再拖了。";
  return "LONG-RANGE OBJECTIVE ・ 養成習慣最重要。";
}

export default function App() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [color, setColor] = useState("rose");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE);
    if (saved) {
      try {
        const p = JSON.parse(saved);
        if (Array.isArray(p)) setExams(p);
      } catch { /* ignore */ }
    } else {
      setExams([{ id: "demo", name: "114 學測", date: "2026-01-17", color: "rose" }]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE, JSON.stringify(exams));
  }, [exams]);

  function addExam(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !date) return;
    setExams((es) => [
      ...es,
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: name.trim().slice(0, 24),
        date,
        color,
      },
    ]);
    setName("");
    setDate("");
  }

  function removeExam(id: string) {
    setExams((es) => es.filter((e) => e.id !== id));
  }

  const sorted = [...exams].sort((a, b) => (a.date < b.date ? -1 : 1));

  return (
    <div className="ops">
      <header className="ops-bar">
        <a href="https://ai-class-summer.vercel.app/portfolio" className="ops-back">
          ◄◄ PORTFOLIO
        </a>
        <span className="ops-id">UNIT 00-AIMAKER ・ CONFIDENTIAL</span>
      </header>

      <main className="ops-main">
        <div className="banner">
          <p className="ops-kicker">▌COUNTDOWN MODE ・ ACTIVE</p>
          <h1 className="ops-h1">
            EXAMS<br />
            <span className="ops-h1-alt">incoming.</span>
          </h1>
          <p className="ops-sub">每場考試 ・ 每天剩多少 ・ 每天該幹嘛</p>
        </div>

        <div className="ops-grid">
          {/* Form */}
          <aside className="ops-form-wrap">
            <form onSubmit={addExam} className="ops-form">
              <h2 className="form-title">▸ ADD TARGET</h2>
              <div className="ops-field">
                <label>TARGET NAME</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={24}
                  placeholder="例:期末考數學"
                  required
                />
              </div>
              <div className="ops-field">
                <label>D-DAY</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="ops-field">
                <label>COLOR CODE</label>
                <div className="ops-colors">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`ops-swatch ops-${c} ${color === c ? "ops-swatch-on" : ""}`}
                      aria-label={c}
                    />
                  ))}
                </div>
              </div>
              <button
                type="submit"
                disabled={!name.trim() || !date}
                className="ops-submit"
              >
                ◆ ADD TO MISSION LIST
              </button>
            </form>
          </aside>

          {/* List */}
          <div className="ops-list">
            {sorted.length === 0 ? (
              <div className="empty">
                <p>▸ NO ACTIVE TARGETS</p>
                <p className="empty-sub">add one to begin countdown</p>
              </div>
            ) : (
              sorted.map((exam) => {
                const days = daysUntil(exam.date);
                const isPast = days < 0;
                return (
                  <article
                    key={exam.id}
                    className={`mission ops-${exam.color} ${isPast ? "mission-past" : ""}`}
                  >
                    <div className="mission-head">
                      <span className="mission-date">D-DAY ・ {exam.date}</span>
                      <button
                        onClick={() => removeExam(exam.id)}
                        className="mission-del"
                      >
                        ×
                      </button>
                    </div>
                    <h3 className="mission-name">{exam.name}</h3>
                    <div className="mission-counter">
                      {isPast ? (
                        <span className="mission-done">COMPLETE</span>
                      ) : (
                        <>
                          <span className="mission-num">{days}</span>
                          <span className="mission-unit">DAYS</span>
                        </>
                      )}
                    </div>
                    <div className="mission-quote">
                      ▸ {rallyQuote(days)}
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>
      </main>

      <footer className="ops-foot">
        <p>// this work was made by AI ・ 你的孩子也能做出自己的版本</p>
        <a href="https://ai-class-summer.vercel.app/#register" className="ops-cta">
          REPORT ・ AI 造物營
        </a>
      </footer>
    </div>
  );
}
