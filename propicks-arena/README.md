# ProPicks Arena

A sportsbook + casino prototype: sportsbook, wallet, casino games, admin console
(events, odds, settlement, players, site content).

## Run it locally in VS Code

1. Open this folder in VS Code.
2. Open a terminal (`` Ctrl+` ``) and run:
   ```
   npm install
   npm run dev
   ```
3. Open the URL it prints (usually `http://localhost:5173`).

Log in as `admin` / `admin123` for the admin console, or register a new account
to play as a user.

## Notes

- Data (accounts, events, bets, site content) is saved in your browser's
  localStorage via `src/storageShim.js`, which stands in for the storage API
  used in the Claude artifact preview. Clearing your browser storage resets it.
- This is a demo/prototype: there's no real backend, and the wallet uses a
  fictional currency (Arena Credits) with no real payment processing.
