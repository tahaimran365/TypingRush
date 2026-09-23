import { useState } from "react";
import "./index.css";

// the paragraphs to type
const paragraphs = [
  "The quick brown fox jumps over the lazy dog every single morning.",
  "Typing fast takes daily practice, but soon your fingers will fly.",
  "A calm mind and steady hands make the best typist in the room."
];

// helpers for saved scores (localStorage keeps them after refresh)
function getScores() {
  return JSON.parse(localStorage.getItem("scores") || "[]");
}
function saveScore(one) {
  const list = getScores();
  list.push(one);
  list.sort((a, b) => b.wpm - a.wpm);
  localStorage.setItem("scores", JSON.stringify(list.slice(0, 10)));
}

export default function App() {
  // useState = React's memory:  [value, functionToChangeIt]
  const [screen, setScreen]   = useState("setup");
  const [mode, setMode]       = useState("single");
  const [names, setNames]     = useState(["", ""]);   // competition names
  const [single, setSingle]   = useState("");          // single name
  const [players, setPlayers] = useState([]);
  const [turn, setTurn]       = useState(0);
  const [results, setResults] = useState([]);
  const [text, setText]       = useState("");
  const [typed, setTyped]     = useState("");
  const [start, setStart]     = useState(0);

  // start the test
  function startTest() {
    let list;
    if (mode === "single") {
      list = [single || "Player"];
    } else {
      list = names.filter(n => n !== "");
      if (list.length < 2) { alert("Add at least 2 players"); return; }
    }
    setPlayers(list);
    setTurn(0);
    setResults([]);
    setText(paragraphs[Math.floor(Math.random() * paragraphs.length)]);
    setTyped("");
    setStart(0);
    setScreen("test");
  }

  // runs on every key
  function onType(e) {
    const value = e.target.value;
    let began = start;
    if (began === 0) { began = Date.now(); setStart(began); }  // timer starts
    setTyped(value);

    if (value.length >= text.length) {          // finished the paragraph
      let correct = 0;
      for (let i = 0; i < text.length; i++) if (value[i] === text[i]) correct++;
      const minutes = Math.max((Date.now() - began) / 60000, 0.001);
      const one = {
        name: players[turn],
        wpm: Math.round((correct / 5) / minutes),
        acc: Math.round((correct / value.length) * 100)
      };
      setResults([...results, one]);
      saveScore(one);
      setScreen("result");
    }
  }

  // live stats (worked out on every re-render)
  let correct = 0;
  for (let i = 0; i < typed.length; i++) if (typed[i] === text[i]) correct++;
  const mins = Math.max((Date.now() - start) / 60000, 0.001);
  const wpm = start ? Math.round((correct / 5) / mins) : 0;
  const acc = typed.length ? Math.round((correct / typed.length) * 100) : 100;
  const last = results[results.length - 1];

  return (
    <div className="app">
      <div className="brand">
        <h1>⚡ TypeRush</h1>
        <p>Test your typing speed — solo or in a competition</p>
      </div>

      {/* SETUP screen */}
      {screen === "setup" && (
        <div className="card">
          <div className="modes">
            <div className={"mode" + (mode === "single" ? " active" : "")} onClick={() => setMode("single")}>
              <div className="icon">🧍</div><b>Single</b>
              <div className="desc">Practice &amp; beat your best</div>
            </div>
            <div className={"mode" + (mode === "competition" ? " active" : "")} onClick={() => setMode("competition")}>
              <div className="icon">🏆</div><b>Competition</b>
              <div className="desc">Players take turns, then rank</div>
            </div>
          </div>

          {mode === "single" ? (
            <>
              <label>Your name</label>
              <input value={single} onChange={e => setSingle(e.target.value)} placeholder="Enter your name" />
            </>
          ) : (
            <>
              <label>Players (add 2 or more)</label>
              {/* .map = make one input box for each name in the list */}
              {names.map((n, i) => (
                <input key={i} value={n} placeholder={"Player " + (i + 1)}
                  onChange={e => { const c = [...names]; c[i] = e.target.value; setNames(c); }} />
              ))}
              <button className="btn ghost" onClick={() => setNames([...names, ""])}>+ Add player</button>
            </>
          )}

          <button className="btn full" onClick={startTest}>Start Test →</button>
          <button className="btn ghost full" onClick={() => setScreen("records")}>🏅 View Records</button>
        </div>
      )}

      {/* TEST screen */}
      {screen === "test" && (
        <div className="card">
          <p className="turn">Now typing: <b>{players[turn]}</b></p>
          <div className="stats">{wpm} WPM • {acc}%</div>
          <p id="para">
            {text.split("").map((ch, i) => {
              let cls = "";
              if (i < typed.length) cls = typed[i] === ch ? "correct" : "wrong";
              return <span key={i} className={cls}>{ch}</span>;
            })}
          </p>
          <textarea id="input" value={typed} onChange={onType} placeholder="Start typing here..." />
          <button className="btn ghost" onClick={() => setScreen("setup")}>Cancel</button>
        </div>
      )}

      {/* RESULT screen */}
      {screen === "result" && (
        <div className="card" id="result">
          <h2>{last.wpm} WPM</h2>
          <p>{last.name} • {last.acc}% accuracy</p>

          {mode === "competition" && turn < players.length - 1 &&
            <button className="btn full" onClick={() => { setTurn(turn + 1); setTyped(""); setStart(0); setScreen("test"); }}>Next Player</button>}

          {mode === "competition" && turn === players.length - 1 && <>
            <h3>Final Ranking</h3>
            {[...results].sort((a, b) => b.wpm - a.wpm).map((p, i) =>
              <p key={i}>{i + 1}. {p.name} — {p.wpm} WPM</p>)}
            <button className="btn full" onClick={() => setScreen("setup")}>Play Again</button>
          </>}

          {mode === "single" && <>
            <button className="btn" onClick={startTest}>Try Again</button>
            <button className="btn ghost" onClick={() => setScreen("records")}>Records</button>
            <button className="btn ghost" onClick={() => setScreen("setup")}>Home</button>
          </>}
        </div>
      )}

      {/* RECORDS screen */}
      {screen === "records" && (
        <div className="card" id="records">
          <h2>🏅 Records</h2>
          {getScores().length === 0
            ? <p>No records yet — take a test!</p>
            : getScores().map((p, i) => <p key={i}>{i + 1}. {p.name} — {p.wpm} WPM ({p.acc}%)</p>)}
          <button className="btn full" onClick={() => setScreen("setup")}>Back</button>
        </div>
      )}
    </div>
  );
}
