# CINEPULSE 🎬

CINEPULSE is a polished, single-page cinema discovery dashboard presented as **REELTIME**. It combines a cinematic interface with interactive movie rankings, live-style updates, search, genre filtering, watchlists, detail modals, and release countdowns.

## Features

- Featured movie hero section with rotating highlights
- Trending movie grid with animated ranking updates
- Search titles, genres, and directors
- Filter movies by genre
- Add and remove movies from a watchlist
- Movie detail modal with synopsis, cast, director, runtime, and score
- Live signal feed and momentum chart
- Coming-soon release countdowns
- Responsive layout for desktop, tablet, and mobile screens
- Reduced-motion support for accessibility
- No build step or framework required

## Technology

- HTML5
- CSS3
- Vanilla JavaScript
- Tailwind CSS via CDN
- Google Fonts: Inter and Space Grotesk
- Browser APIs including `localStorage`, animations, and timers

## Getting started

### Option 1: Open directly

Open `index.html` in a modern browser.

### Option 2: Run a local server

From the project directory, run one of the following commands:

```bash
python -m http.server 8000
```

Then visit [http://localhost:8000](http://localhost:8000).

If you use Node.js, you can also run:

```bash
npx serve .
```

## How it works

The application keeps its movie catalogue in the page's JavaScript data model. The interface derives trending rankings, charts, ticker updates, filters, countdowns, and watchlist state in the browser. The watchlist is persisted locally, so it remains available when the page is revisited in the same browser.

## Project structure

```text
.
├── index.html   # Markup, styles, movie data, and application logic
└── README.md    # Project documentation
```

## Notes

CINEPULSE currently uses sample movie data and simulated live updates. It does not connect to an external movie database or streaming provider.

## License

No license has been specified yet. Until a license is added, all rights are reserved by the project owner.
