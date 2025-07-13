# 🕹️ Tic-Tac-Toe AI Coach (Full Stack)

A full-stack Tic-Tac-Toe trainer built with **React + Tailwind CSS (Frontend)** and **Flask + SQLite + SQLAlchemy (Backend)**. Designed not just to play — but to help users **improve** their gameplay by analyzing move decisions and providing coaching feedback.

---

## 🎯 Project Motivation

The goal is to go beyond a simple game:

- Let users play Tic-Tac-Toe with a random AI opponent.
- Log every move made during a game.
- Give **insightful feedback** on user decisions (e.g., missed strategic moves).
- Persist the full game history + insights in a local SQLite database.

Ideal for beginner-friendly exposure to **AI strategy, game logging, full-stack app development**, and user experience design.

---

## 📁 Folder Structure

```bash
tic-tac-toe/
├── backend/
│   ├── app/
│   │   ├── main.py                 # Flask app with route registration
│   │   ├── models/
│   │   │   ├── database.py         # SQLAlchemy DB engine + session setup
│   │   │   └── game_log_model.py   # GameLog SQLAlchemy model
│   │   ├── routes/
│   │   │   ├── game_routes.py      # API routes for new game, move
│   │   │   └── log_game.py         # Route to save move logs to DB
│   │   └── services/
│   │       └── tic_tac_toe_engine.py  # Core game logic + AI move
│   └── requirements.txt           # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── gameApi.ts          # Calls to backend API
│   │   ├── components/
│   │   │   ├── GameBoard.tsx       # Main game UI and logic
│   │   │   ├── GameCell.tsx        # Single cell component
│   │   │   ├── GameStatus.tsx      # Game status display
│   │   │   └── Header.tsx / Footer.tsx # UI layout
│   │   ├── types/                  # TypeScript types
│   └── public/ / dist/            # Static and build files
├── game_log_test.json             # Sample payload for backend testing
├── tictactoe.db                   # (Git-ignored) Local SQLite DB
├── .gitignore                     # Git ignore rules (add backend rules too)
└── README.md                      # You're here 🙂
```
## ⚙️ Tech Stack

| Layer       | Tools/Frameworks                             |
|-------------|----------------------------------------------|
| Frontend    | React, Tailwind CSS, Vite, TypeScript        |
| Backend     | Python, Flask, SQLAlchemy, SQLite            |
| Dev Tools   | VS Code, Git, DB Browser for SQLite          |
| Logging     | SQLAlchemy + SQLite game_log table           |

---

## 🔁 Gameplay & Logging Flow

1. Player makes a move → frontend calls `/api/move`
2. Backend updates board and lets AI (random 'O') respond
3. After game ends:
   - Move history + insights are POSTed to `/api/log-game`
   - Backend saves game to `tictactoe.db`
4. You can inspect logs using [DB Browser for SQLite](https://sqlitebrowser.org)

---

## 🚀 Setup Instructions

### 🔧 Backend Setup (Flask + SQLite)

```bash
cd backend
pip install -r requirements.txt
PYTHONPATH=backend python -m app.main
```

## 🎨 Frontend Setup (React + Tailwind + Vite)

```bash
cd frontend
npm install
npm run dev

```

## 🧑‍💻 Author

```bash
Karthiek Duggirala
Full-stack developer | AI Engineer | Game enthusiast
```