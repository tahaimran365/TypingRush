# ⚡ TypeRush — Typing Speed Test (React)

A typing speed test built with **React**. Type the shown paragraph as fast
and accurately as you can — it shows your **WPM** and **accuracy**, saves
your best scores, and has a **Competition** mode where players take turns
and get ranked.

## How to run it

You need **Node.js** installed (get the LTS from https://nodejs.org).
Then, inside this folder:

```bash
npm install     # download React + Vite — only needed once
npm run dev     # start the app
```

Vite prints an address like `http://localhost:5173` — open it in your
browser.

## The files

```
index.html          the empty page React fills
package.json        the project info + what to install
vite.config.js      tells Vite to understand React (JSX)
src/
  main.jsx          starts the app
  App.jsx           THE WHOLE APP (this is the file to understand)
  index.css         all the styling (Ocean Mint theme)
```

## How App.jsx works (for a viva)

- **useState** — React's memory. `const [screen, setScreen] = useState("setup")`
  gives a variable and a function to change it. Changing it redraws the screen.
- **Screens** — shown with `{screen === "test" && (...)}` — only the matching
  screen is drawn.
- **One function per action** — `startTest`, `onType`.
- **.map** — repeats a tag for each item (the player inputs, the paragraph
  letters, the ranking list).
- **Formulas** — WPM = (correct characters ÷ 5) ÷ minutes; accuracy = correct
  ÷ typed × 100.

## Add more paragraphs

Open `src/App.jsx` and add strings to the `paragraphs` list at the top.
