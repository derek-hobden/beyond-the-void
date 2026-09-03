import type { GameRun, MapNode } from './types';
import { generateSectorMap } from './data/sectors';
import { createPlayerShip } from './ShipFactory';

class GameStateManager {
  run: GameRun | null = null;
  paused = false;
  combatResult: 'victory' | 'defeat' | null = null;
  rewardScrap = 0;

  startNewRun(): GameRun {
    this.run = {
      scrap: 50,
      sector: 1,
      fuel: 15,
      nodes: generateSectorMap(1),
      playerShip: createPlayerShip(),
    };
    this.combatResult = null;
    this.rewardScrap = 0;
    return this.run;
  }

  getCurrentNode(): MapNode | undefined {
    return this.run?.nodes.find((n) => n.current);
  }

  visitNode(nodeId: string): void {
    if (!this.run) return;
    const node = this.run.nodes.find((n) => n.id === nodeId);
    if (!node || !node.connections.some((c) => this.run!.nodes.find((n) => n.id === c)?.current)) {
      return;
    }
    this.run.nodes.forEach((n) => {
      n.current = n.id === nodeId;
      if (n.id === nodeId) n.visited = true;
    });
  }

  addScrap(amount: number): void {
    if (this.run) this.run.scrap += amount;
  }

  advanceSector(): void {
    if (!this.run) return;
    this.run.sector++;
    this.run.nodes = generateSectorMap(this.run.sector);
    this.run.playerShip.hull = Math.min(
      this.run.playerShip.hull + 5,
      this.run.playerShip.hullMax,
    );
  }
}

export const GameState = new GameStateManager();
