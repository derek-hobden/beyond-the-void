import './style.css';
import { createGame } from './game/config';

document.addEventListener('contextmenu', (e) => {
  if ((e.target as HTMLElement).closest('#game-container')) e.preventDefault();
});

createGame();
