# Specification

## Summary
**Goal:** Add a dedicated, patient-accessible Flowers Chain mini-game experience and enrich the page with calming, wellness-oriented content and optional audio.

**Planned changes:**
- Create a new in-app route for the Flowers Chain game (e.g., `/game/flowers-chain`) with a fully client-side interactive tile-chaining game (grid/board, adjacent matching selection, scoring, start/restart, and an end condition with results screen).
- Update the Home page “Flowers Chain” promo card to navigate to the new game route while leaving other promo cards unchanged.
- Add English “How to Play” instructions on the game page and a small rotating set of calming, flower/relaxation micro-content displayed near the game (client-side rotation only).
- Add optional calming audio controls on the game page (play/pause plus mute/volume) using a locally bundled audio asset; ensure the game remains usable without autoplay.
- Add and reference new static visual assets for the game (flower tiles and an optional soft background/banner) from `frontend/public/assets/generated`.

**User-visible outcome:** Users can open Flowers Chain from the Home promo card to play a flower tile chaining game with live scoring, restart and end/results flow, helpful “How to Play” text, rotating calming snippets, and optional on-page calming audio controls.
