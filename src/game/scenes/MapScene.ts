import Phaser from 'phaser';
import { audio } from '../AudioManager';
import { GameState } from '../GameState';
import { SECTOR_NAMES } from '../data/sectors';
import type { MapNode } from '../types';

export class MapScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MapScene' });
  }

  create(): void {
    const run = GameState.run!;
    const { width, height } = this.scale;

    this.add.rectangle(width / 2, height / 2, width, height, 0x02040a);

    // Nebula wash
    const neb = this.add.graphics();
    neb.fillStyle(0x1a3a6a, 0.1);
    neb.fillCircle(width * 0.7, height * 0.3, 260);
    neb.fillStyle(0x3a2060, 0.08);
    neb.fillCircle(width * 0.25, height * 0.75, 200);

    // Stars
    const stars = this.add.graphics();
    for (let i = 0; i < 100; i++) {
      stars.fillStyle(0xffffff, 0.2 + Math.random() * 0.5);
      stars.fillCircle(Math.random() * width, Math.random() * height, Math.random() > 0.85 ? 1.5 : 1);
    }

    this.add.text(40, 28, `SECTOR ${run.sector}: ${SECTOR_NAMES[(run.sector - 1) % SECTOR_NAMES.length]}`, {
      fontFamily: 'Orbitron',
      fontSize: '22px',
      color: '#88aacc',
    });

    this.add.text(40, 58, 'Select a connected beacon to jump', {
      fontFamily: 'Rajdhani',
      fontSize: '16px',
      color: '#556677',
    });

    this.add.text(width - 40, 30, `SCRAP: ${run.scrap}`, {
      fontFamily: 'Rajdhani',
      fontSize: '20px',
      color: '#ffcc44',
    }).setOrigin(1, 0);

    this.add.text(width - 40, 55, `HULL: ${run.playerShip.hull}/${run.playerShip.hullMax}`, {
      fontFamily: 'Rajdhani',
      fontSize: '18px',
      color: '#ff8888',
    }).setOrigin(1, 0);

    const g = this.add.graphics();
    run.nodes.forEach((node) => {
      node.connections.forEach((connId) => {
        const other = run.nodes.find((n) => n.id === connId);
        if (!other || other.id < node.id) return;
        const visited = node.visited && other.visited;
        g.lineStyle(2, visited ? 0x4488aa : 0x1a2a3a, visited ? 0.85 : 0.45);
        g.lineBetween(node.x, node.y, other.x, other.y);
      });
    });

    run.nodes.forEach((node) => this.createNode(node));

    // Legend
    const legend = [
      { c: 0xcc4444, t: 'Combat' },
      { c: 0x44cc88, t: 'Shop' },
      { c: 0x4488cc, t: 'Event' },
      { c: 0xcc44cc, t: 'Boss' },
    ];
    legend.forEach((L, i) => {
      const x = 40 + i * 120;
      this.add.circle(x, height - 28, 6, L.c);
      this.add.text(x + 12, height - 28, L.t, {
        fontFamily: 'Rajdhani',
        fontSize: '14px',
        color: '#778899',
      }).setOrigin(0, 0.5);
    });

    audio.startMusic('map');
    this.cameras.main.fadeIn(500);
  }

  private createNode(node: MapNode): void {
    const colors: Record<string, number> = {
      combat: 0xcc4444,
      shop: 0x44cc88,
      event: 0x4488cc,
      boss: 0xcc44cc,
    };
    const icons: Record<string, string> = {
      combat: '\u2694',
      shop: '\u25c6',
      event: '?',
      boss: '\u2620',
    };

    const isCurrent = node.current;
    const canVisit = this.canVisitNode(node);

    const container = this.add.container(node.x, node.y);

    const radius = node.type === 'boss' ? 28 : 22;
    const alpha = node.visited && !isCurrent ? 0.5 : 1;
    const color = isCurrent ? 0x44aaff : (node.visited ? 0x335566 : colors[node.type]);

    const circle = this.add.circle(0, 0, radius, color, alpha * 0.8);
    circle.setStrokeStyle(isCurrent ? 3 : 2, isCurrent ? 0x88ddff : 0x446688);

    const icon = this.add.text(0, 0, icons[node.type], {
      fontSize: node.type === 'boss' ? '24px' : '18px',
      color: '#ffffff',
    }).setOrigin(0.5);

    container.add([circle, icon]);

    if (canVisit) {
      container.setSize(radius * 2, radius * 2);
      container.setInteractive({ useHandCursor: true });
      this.tweens.add({
        targets: circle,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 800,
        yoyo: true,
        repeat: -1,
      });
      container.on('pointerover', () => circle.setFillStyle(0x55bbff, 0.9));
      container.on('pointerout', () => circle.setFillStyle(color, alpha * 0.8));
      container.on('pointerdown', () => this.onNodeClick(node));
    }
  }

  private canVisitNode(node: MapNode): boolean {
    if (node.visited && !node.current) return false;
    if (node.current) return false;
    const current = GameState.getCurrentNode();
    return !!current?.connections.includes(node.id);
  }

  private onNodeClick(node: MapNode): void {
    audio.playSfx('click');
    GameState.visitNode(node.id);

    this.cameras.main.fadeOut(400, 0, 0, 0);
    this.time.delayedCall(400, () => {
      if (node.type === 'combat' || node.type === 'boss') {
        this.scene.start('CombatScene', { enemyTier: node.type === 'boss' ? 2 : Math.floor(Math.random() * 2) });
      } else if (node.type === 'shop') {
        GameState.addScrap(25);
        this.showMessage('Found spare parts! +25 scrap');
      } else {
        const hull = GameState.run!.playerShip;
        hull.hull = Math.min(hull.hull + 3, hull.hullMax);
        this.showMessage('Crew rested. Hull repaired +3');
      }
    });
  }

  private showMessage(msg: string): void {
    const { width, height } = this.scale;
    const text = this.add.text(width / 2, height / 2, msg, {
      fontFamily: 'Rajdhani',
      fontSize: '28px',
      color: '#aaddff',
      backgroundColor: '#0a1a2a',
      padding: { x: 20, y: 12 },
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: text,
      alpha: 1,
      duration: 300,
      onComplete: () => {
        this.time.delayedCall(1500, () => {
          this.scene.restart();
        });
      },
    });
  }
}
