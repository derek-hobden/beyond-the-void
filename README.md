# Beyond the Void

An FTL-inspired browser roguelike. Command the Kestrel through hostile sectors: manage reactor power, order crew between rooms, charge weapons, and jump beacon to beacon.

## Play

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43123](http://127.0.0.1:43123).

## Controls

| Action | Input |
|--------|--------|
| Pause / resume | `Space` |
| Add system power | Left-click WPN / SHD / ENG / O2 |
| Remove system power | Right-click power button |
| Fire | Click a charged weapon, then click an enemy room |
| Move crew | Click a crew dot, then click one of your rooms |
| Cancel targeting | `Esc` |

## Features

- Sector star map with combat, shops, events, and bosses
- Real-time ship combat with pause
- Shields, evasion, fires, breaches, and system damage
- Laser, missile, and ion weapons with projectile VFX
- Procedural soundtrack and SFX (Web Audio — no asset packs)

## Stack

Vite + TypeScript + Phaser 4 + Web Audio API
