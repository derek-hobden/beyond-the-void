import Phaser from 'phaser';
import { audio } from '../AudioManager';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    this.load.on('progress', (value: number) => {
      this.registry.set('loadProgress', value);
    });
  }

  create(): void {
    this.createTextures();
    audio.init().then(() => {
      this.scene.start('MenuScene');
    });
  }

  private createTextures(): void {
  const g = this.make.graphics({ x: 0, y: 0 });

  g.clear();
  g.fillStyle(0xffffff, 1);
  g.fillCircle(4, 4, 4);
  g.generateTexture('particle', 8, 8);

  g.clear();
  g.fillStyle(0xffffff, 0.8);
  g.fillRect(0, 0, 2, 8);
  g.generateTexture('laser-beam', 2, 8);

  g.clear();
  g.fillStyle(0xffffff, 1);
  g.fillCircle(6, 6, 6);
  g.generateTexture('glow', 12, 12);

  g.clear();
  g.fillStyle(0x4488ff, 0.6);
  g.fillCircle(8, 8, 8);
  g.generateTexture('shield-bubble', 16, 16);

  g.destroy();
  }
}
