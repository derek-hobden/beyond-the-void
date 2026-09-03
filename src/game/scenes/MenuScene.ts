import Phaser from 'phaser';
import { audio } from '../AudioManager';
import { GameState } from '../GameState';

export class MenuScene extends Phaser.Scene {
  private stars: { x: number; y: number; speed: number; size: number; alpha: number }[] = [];

  constructor() {
    super({ key: 'MenuScene' });
  }

  create(): void {
    const { width, height } = this.scale;

    for (let i = 0; i < 200; i++) {
      this.stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speed: 0.2 + Math.random() * 1.5,
        size: Math.random() > 0.9 ? 2 : 1,
        alpha: 0.3 + Math.random() * 0.7,
      });
    }

    this.add.rectangle(width / 2, height / 2, width, height, 0x02040a);

    const title = this.add.text(width / 2, height * 0.28, 'BEYOND THE VOID', {
      fontFamily: 'Orbitron',
      fontSize: '52px',
      color: '#88ccff',
      stroke: '#224466',
      strokeThickness: 4,
    }).setOrigin(0.5);

    this.tweens.add({
      targets: title,
      alpha: { from: 0.85, to: 1 },
      duration: 2000,
      yoyo: true,
      repeat: -1,
    });

    this.add.text(width / 2, height * 0.38, 'An FTL-inspired roguelike', {
      fontFamily: 'Rajdhani',
      fontSize: '22px',
      color: '#6688aa',
    }).setOrigin(0.5);

    const shipGraphic = this.add.graphics();
    this.drawShipSilhouette(shipGraphic, width / 2, height * 0.55);

    const startBtn = this.createButton(width / 2, height * 0.75, 'LAUNCH MISSION', () => {
      audio.playSfx('click');
      audio.playSfx('jump');
      GameState.startNewRun();
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.time.delayedCall(500, () => {
        this.scene.start('MapScene');
      });
    });

    this.add.text(width / 2, height * 0.88, 'Click rooms in combat \u00b7 Manage power \u00b7 Jump between sectors', {
      fontFamily: 'Rajdhani',
      fontSize: '16px',
      color: '#445566',
      align: 'center',
    }).setOrigin(0.5);

    this.tweens.add({
      targets: startBtn,
      scaleX: 1.02,
      scaleY: 1.02,
      duration: 1200,
      yoyo: true,
      repeat: -1,
    });

    audio.resume().then(() => {
      audio.startMusic('menu');
      audio.startAmbience();
    });

    this.cameras.main.fadeIn(800);
  }

  update(_time: number, delta: number): void {
    const g = this.children.getByName('starfield') as Phaser.GameObjects.Graphics;
    if (!g) {
      const ng = this.add.graphics().setName('starfield').setDepth(-1);
      this.renderStars(ng, delta);
    } else {
      this.renderStars(g, delta);
    }
  }

  private renderStars(g: Phaser.GameObjects.Graphics, delta: number): void {
    const { width, height } = this.scale;
    g.clear();
    this.stars.forEach((s) => {
      s.x -= s.speed * (delta / 16);
      if (s.x < 0) {
        s.x = width;
        s.y = Math.random() * height;
      }
      g.fillStyle(0xffffff, s.alpha);
      g.fillRect(s.x, s.y, s.size, s.size);
    });
  }

  private drawShipSilhouette(g: Phaser.GameObjects.Graphics, cx: number, cy: number): void {
    g.fillStyle(0x1a3050, 0.9);
    g.fillTriangle(cx + 80, cy, cx - 60, cy - 30, cx - 60, cy + 30);
    g.fillStyle(0x2a4a70, 0.8);
    g.fillRect(cx - 60, cy - 25, 100, 50);
    g.fillStyle(0x44aaff, 0.4);
    g.fillCircle(cx - 50, cy, 8);
    g.fillCircle(cx - 20, cy - 10, 6);
    g.fillCircle(cx - 20, cy + 10, 6);
  }

  private createButton(x: number, y: number, label: string, onClick: () => void) {
    const container = this.add.container(x, y);
    const bg = this.add.rectangle(0, 0, 280, 56, 0x1a3a5a, 0.9)
      .setStrokeStyle(2, 0x44aaff);
    const text = this.add.text(0, 0, label, {
      fontFamily: 'Orbitron',
      fontSize: '20px',
      color: '#aaddff',
    }).setOrigin(0.5);

    container.add([bg, text]);
    container.setSize(280, 56);
    container.setInteractive({ useHandCursor: true });

    container.on('pointerover', () => {
      bg.setFillStyle(0x2a5a8a);
      audio.playSfx('click');
    });
    container.on('pointerout', () => bg.setFillStyle(0x1a3a5a, 0.9));
    container.on('pointerdown', onClick);

    return container;
  }
}
