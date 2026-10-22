# Beat Bugs · Backyard Orchestra
A React rhythm game and composition toy by John Parker. Five original insect musicians play kick, snare, hi-hat, bells and bass through Web Audio. Includes a 16-step looping sequencer, tempo 60–180 BPM, per-instrument mute/solo, three presets, three checked rhythm quests and eight locally saved compositions.

Node 22+: `npm ci`, `npm run dev`, `npm test`, `npm run build`. Deploy as Vite to Vercel with dist output.

Play starts audio after interaction. Tap seeds, press Tab/Enter/Space, or swipe the sequencer on narrow screens. Space on the page starts/stops; keys 1–5 audition instruments. Master mute silences playback. Stop clears scheduled visuals and voices. Clear grid resets the band; presets restore a starting point. Saves validate their data and recover from unavailable storage. No accounts, network audio files or personal data.

Audio uses a 25ms lookahead scheduler with a 120ms horizon and AudioContext time, separate visual beat updates, synthesized pitched instruments and generated filtered-noise percussion. Reduced motion preserves the visual playhead while removing creature bouncing. Original generated midnight garden artwork integrates with code-native SVG insects. Imaginary insect characters, real rhythm patterns.
