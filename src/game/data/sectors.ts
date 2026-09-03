import type { MapNode } from '../types';

export function generateSectorMap(sector: number): MapNode[] {
  const nodes: MapNode[] = [];
  const rows = 5;
  const cols = 3;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const id = `n-${row}-${col}`;
      let type: MapNode['type'] = 'combat';

      if (row === 0 && col === 1) type = 'combat';
      else if (row === rows - 1 && col === 1) type = 'boss';
      else if (row === 2 && col === 0) type = 'shop';
      else if (row === 2 && col === 2) type = 'event';
      else if (Math.random() > 0.6) type = 'event';
      else type = 'combat';

      nodes.push({
        id,
        type,
        x: 120 + col * 280,
        y: 80 + row * 110,
        connections: [],
        visited: row === 0,
        current: row === 0 && col === 1,
      });
    }
  }

  for (let row = 0; row < rows - 1; row++) {
    for (let col = 0; col < cols; col++) {
      const current = nodes[row * cols + col];
      const below = [col - 1, col, col + 1]
        .filter((c) => c >= 0 && c < cols)
        .map((c) => nodes[(row + 1) * cols + c]);

      below.forEach((n) => {
        if (!current.connections.includes(n.id)) {
          current.connections.push(n.id);
        }
        if (!n.connections.includes(current.id)) {
          n.connections.push(current.id);
        }
      });
    }
  }

  if (sector > 1) {
    nodes.forEach((n) => {
      n.visited = false;
      n.current = false;
    });
    nodes[1].visited = true;
    nodes[1].current = true;
  }

  return nodes;
}

export const SECTOR_NAMES = [
  'Kepler Expanse',
  'Orion Fringe',
  'Nebula Drift',
  'Void Sector',
];
