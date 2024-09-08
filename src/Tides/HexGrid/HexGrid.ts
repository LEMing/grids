import * as THREE from 'three';
import Tile from './Tile';  // Base interface for tiles
import TileFactory from './TileFactory';  // Factory for creating tiles

class HexGrid {
  radius: number;
  tileSize: number;
  tileFactory: TileFactory;
  tiles: Tile[];

  constructor(radius: number, tileSize: number, tileFactory: TileFactory) {
    this.radius = radius;
    this.tileSize = tileSize;
    this.tileFactory = tileFactory;
    this.tiles = [];
  }

  generateGrid(): void {
    for (let q = -this.radius; q <= this.radius; q++) {
      const r1 = Math.max(-this.radius, -q - this.radius);
      const r2 = Math.min(this.radius, -q + this.radius);
      for (let r = r1; r <= r2; r++) {
        const tile = this.tileFactory.createTile(q, r, this.tileSize, 0.2);
        this.tiles.push(tile);
      }
    }
  }

  addToScene(scene: THREE.Scene): void {
    this.generateGrid();
    this.tiles.forEach((tile, index) => {
      const mesh = tile.execute();
      mesh.name = `Tile ${index}`;
      scene.add(mesh);
    });
  }

  getAllTiles(): Tile[] {
    return this.tiles;
  }
}

export default HexGrid;
