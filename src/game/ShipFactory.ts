import type {
  CrewMember,
  RoomState,
  RoomType,
  ShipLayout,
  ShipState,
  WeaponState,
} from './types';
import { CREW_NAMES, PLAYER_LAYOUT } from './data/ships';

function createRooms(layout: ShipLayout): RoomState[] {
  return layout.rooms.map((def, i) => ({
    id: `room-${i}`,
    def,
    health: def.maxHealth,
    power: 0,
    maxPower: def.type === 'empty' ? 0 : 2,
    manned: def.type === 'bridge' || def.type === 'weapons',
    onFire: false,
    breached: false,
  }));
}

function createWeapons(layout: ShipLayout): WeaponState[] {
  return layout.weapons.map((def) => ({
    def,
    charge: 0,
    powered: true,
    autoFire: false,
  }));
}

function createCrew(count: number, roomIds: string[]): CrewMember[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `crew-${i}`,
    name: CREW_NAMES[i % CREW_NAMES.length],
    roomId: roomIds[i % roomIds.length] ?? null,
    targetRoomId: null,
    health: 100,
    skill: 1 + Math.floor(Math.random() * 2),
    x: 0,
    y: 0,
  }));
}

const DEFAULT_POWER: Record<RoomType, number> = {
  bridge: 1,
  weapons: 2,
  shields: 2,
  engines: 1,
  oxygen: 1,
  medbay: 0,
  empty: 0,
};

export function createShip(layout: ShipLayout, isPlayer: boolean): ShipState {
  const rooms = createRooms(layout);
  const roomIds = rooms.map((r) => r.id);

  return {
    layout,
    hull: layout.hullMax,
    hullMax: layout.hullMax,
    shields: 0,
    maxShields: 0,
    power: layout.maxPower,
    maxPower: layout.maxPower,
    powerAlloc: { ...DEFAULT_POWER },
    rooms,
    weapons: createWeapons(layout),
    crew: isPlayer ? createCrew(3, roomIds.slice(0, 3)) : createCrew(2, roomIds.slice(0, 2)),
    evasion: 0,
    isPlayer,
  };
}

export function createPlayerShip(): ShipState {
  const ship = createShip(PLAYER_LAYOUT, true);
  applyPower(ship);
  return ship;
}

export function applyPower(ship: ShipState): void {
  ship.rooms.forEach((room) => {
    room.power = ship.powerAlloc[room.def.type] ?? 0;
    room.manned = ship.crew.some((c) => c.roomId === room.id);
  });

  const shieldRoom = ship.rooms.find((r) => r.def.type === 'shields');
  const engineRoom = ship.rooms.find((r) => r.def.type === 'engines');

  if (shieldRoom && shieldRoom.power > 0) {
    const bonus = shieldRoom.manned ? 1 : 0;
    ship.maxShields = shieldRoom.power + bonus;
    ship.shields = Math.min(ship.shields, ship.maxShields);
  } else {
    ship.maxShields = 0;
    ship.shields = 0;
  }

  if (engineRoom && engineRoom.power > 0) {
    const bonus = engineRoom.manned ? 10 : 0;
    ship.evasion = engineRoom.power * 5 + bonus;
  } else {
    ship.evasion = 0;
  }

  ship.weapons.forEach((w, i) => {
    const weaponRoom = ship.rooms.find((r) => r.def.type === 'weapons');
    w.powered = (weaponRoom?.power ?? 0) > i;
  });
}

export function getRoomCenter(room: RoomState, cellSize: number, offsetX: number, offsetY: number) {
  const { x, y, w, h } = room.def;
  return {
    x: offsetX + (x + w / 2) * cellSize,
    y: offsetY + (y + h / 2) * cellSize,
  };
}

export function getShipDimensions(layout: ShipLayout) {
  let maxX = 0;
  let maxY = 0;
  layout.rooms.forEach((r) => {
    maxX = Math.max(maxX, r.x + r.w);
    maxY = Math.max(maxY, r.y + r.h);
  });
  return { cols: maxX, rows: maxY };
}
