import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { MenuScene } from './scenes/MenuScene';
import { MapScene } from './scenes/MapScene';
import { CombatScene } from './scenes/CombatScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 1024,
  height: 640,
  backgroundColor: '#02040a',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene, MenuScene, MapScene, CombatScene],
  render: {
    antialias: true,
    pixelArt: false,
  },
  audio: {
    disableWebAudio: false,
  },
};

export function createGame(): Phaser.Game {
  return new Phaser.Game(config);
}
