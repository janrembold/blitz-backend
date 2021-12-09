import { Game } from '../constants/Game';
import { getRandomInt } from './random';

export interface Coordinates {
  x: number;
  y: number;
}

export const getRandomWorldPosition = (): Coordinates => ({
  x: getRandomInt(Game.SAFE_AREA, Game.WORLD_WIDTH - Game.SAFE_AREA),
  y: getRandomInt(Game.SAFE_AREA, Game.WORLD_HEIGHT - Game.SAFE_AREA),
});
