export type RoomType =
  | 'bridge'
  | 'weapons'
  | 'shields'
  | 'engines'
  | 'oxygen'
  | 'medbay'
  | 'empty';

export type WeaponType = 'laser' | 'missile' | 'ion';

export interface RoomDef {
  type: RoomType;
  x: number;
  y: number;
  w: number;
  h: number;
  maxHealth: number;
}

export interface WeaponDef {
  type: WeaponType;
  name: string;
  chargeTime: number;
  damage: number;
  shieldPierce: number;
  systemDamage: number;
  color: number;
}

export interface ShipLayout {
  name: string;
  rooms: RoomDef[];
  maxPower: number;
  weapons: WeaponDef[];
  hullMax: number;
}

export interface RoomState {
  id: string;
  def: RoomDef;
  health: number;
  power: number;
  maxPower: number;
  manned: boolean;
  onFire: boolean;
  breached: boolean;
}

export interface WeaponState {
  def: WeaponDef;
  charge: number;
  powered: boolean;
  autoFire: boolean;
}

export interface CrewMember {
  id: string;
  name: string;
  roomId: string | null;
  targetRoomId: string | null;
  health: number;
  skill: number;
  x: number;
  y: number;
}

export interface ShipState {
  layout: ShipLayout;
  hull: number;
  hullMax: number;
  shields: number;
  maxShields: number;
  power: number;
  maxPower: number;
  powerAlloc: Record<RoomType, number>;
  rooms: RoomState[];
  weapons: WeaponState[];
  crew: CrewMember[];
  evasion: number;
  isPlayer: boolean;
}

export type MapNodeType = 'combat' | 'shop' | 'event' | 'boss';

export interface MapNode {
  id: string;
  type: MapNodeType;
  x: number;
  y: number;
  connections: string[];
  visited: boolean;
  current: boolean;
}

export interface GameRun {
  scrap: number;
  sector: number;
  fuel: number;
  nodes: MapNode[];
  playerShip: ShipState;
}

export interface Projectile {
  id: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  speed: number;
  damage: number;
  shieldPierce: number;
  systemDamage: number;
  color: number;
  fromPlayer: boolean;
  weaponType: WeaponType;
  targetRoomId?: string;
}
