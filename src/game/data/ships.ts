import type { ShipLayout, WeaponDef } from '../types';

const LASER: WeaponDef = {
  type: 'laser',
  name: 'Burst Laser',
  chargeTime: 3.5,
  damage: 1,
  shieldPierce: 0,
  systemDamage: 1,
  color: 0xff4444,
};

const MISSILE: WeaponDef = {
  type: 'missile',
  name: 'Artemis Missile',
  chargeTime: 6,
  damage: 2,
  shieldPierce: 99,
  systemDamage: 2,
  color: 0xffaa22,
};

const ION: WeaponDef = {
  type: 'ion',
  name: 'Ion Blast',
  chargeTime: 5,
  damage: 0,
  shieldPierce: 99,
  systemDamage: 3,
  color: 0x44aaff,
};

export const PLAYER_LAYOUT: ShipLayout = {
  name: 'Kestrel Cruiser',
  hullMax: 30,
  maxPower: 8,
  weapons: [LASER, MISSILE],
  rooms: [
    { type: 'bridge', x: 0, y: 1, w: 1, h: 1, maxHealth: 3 },
    { type: 'weapons', x: 1, y: 0, w: 2, h: 1, maxHealth: 4 },
    { type: 'shields', x: 1, y: 1, w: 1, h: 1, maxHealth: 3 },
    { type: 'engines', x: 2, y: 1, w: 1, h: 1, maxHealth: 3 },
    { type: 'oxygen', x: 1, y: 2, w: 1, h: 1, maxHealth: 2 },
    { type: 'medbay', x: 2, y: 2, w: 1, h: 1, maxHealth: 2 },
    { type: 'empty', x: 0, y: 2, w: 1, h: 1, maxHealth: 2 },
  ],
};

export const ENEMY_LAYOUTS: ShipLayout[] = [
  {
    name: 'Scout Fighter',
    hullMax: 15,
    maxPower: 4,
    weapons: [LASER],
    rooms: [
      { type: 'bridge', x: 0, y: 0, w: 1, h: 1, maxHealth: 2 },
      { type: 'weapons', x: 1, y: 0, w: 1, h: 1, maxHealth: 2 },
      { type: 'engines', x: 0, y: 1, w: 2, h: 1, maxHealth: 2 },
    ],
  },
  {
    name: 'Pirate Raider',
    hullMax: 22,
    maxPower: 6,
    weapons: [LASER, LASER],
    rooms: [
      { type: 'bridge', x: 0, y: 0, w: 1, h: 1, maxHealth: 3 },
      { type: 'weapons', x: 1, y: 0, w: 2, h: 1, maxHealth: 3 },
      { type: 'shields', x: 0, y: 1, w: 1, h: 1, maxHealth: 2 },
      { type: 'engines', x: 1, y: 1, w: 1, h: 1, maxHealth: 2 },
      { type: 'empty', x: 2, y: 1, w: 1, h: 1, maxHealth: 2 },
    ],
  },
  {
    name: 'Mantis Destroyer',
    hullMax: 35,
    maxPower: 8,
    weapons: [LASER, MISSILE, ION],
    rooms: [
      { type: 'bridge', x: 0, y: 0, w: 1, h: 1, maxHealth: 4 },
      { type: 'weapons', x: 1, y: 0, w: 2, h: 1, maxHealth: 4 },
      { type: 'shields', x: 0, y: 1, w: 1, h: 1, maxHealth: 3 },
      { type: 'engines', x: 1, y: 1, w: 1, h: 1, maxHealth: 3 },
      { type: 'oxygen', x: 2, y: 1, w: 1, h: 1, maxHealth: 2 },
      { type: 'medbay', x: 0, y: 2, w: 2, h: 1, maxHealth: 3 },
    ],
  },
];

export const CREW_NAMES = [
  'Astra', 'Kael', 'Nova', 'Rex', 'Zara', 'Orion', 'Lyra', 'Vex',
];

export const ROOM_COLORS: Record<string, number> = {
  bridge: 0x3a5a8a,
  weapons: 0x8a3a3a,
  shields: 0x3a6a8a,
  engines: 0x5a6a3a,
  oxygen: 0x3a8a6a,
  medbay: 0x6a3a8a,
  empty: 0x2a2a3a,
};

export const ROOM_LABELS: Record<string, string> = {
  bridge: 'BRIDGE',
  weapons: 'WEAPONS',
  shields: 'SHIELDS',
  engines: 'ENGINES',
  oxygen: 'O2',
  medbay: 'MEDBAY',
  empty: 'CARGO',
};
