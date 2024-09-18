import Tile from './HexGrid/Tile';

export class TileController {
  private allTiles: Tile[];
  private hoveredTileRef: React.MutableRefObject<Tile | null>;

  constructor(allTiles: Tile[], hoveredTileRef: React.MutableRefObject<Tile | null>) {
    this.allTiles = allTiles;
    this.hoveredTileRef = hoveredTileRef;
  }

  getHoveredTile() {
    return this.hoveredTileRef.current;
  }

  findTileByCoordinates(q: number, r: number): Tile | undefined {
    return this.allTiles.find(tile => tile.hexCoordinates.q === q && tile.hexCoordinates.r === r);
  }

  highlightTile(tile: Tile, color: number) {
    tile.highlightTile(color);
  }

  resetTileHighlight(tile: Tile, color: number) {
    tile.resetTileHighlight(color);
  }
}
