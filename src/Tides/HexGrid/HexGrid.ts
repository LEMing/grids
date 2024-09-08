import * as THREE from 'three';
import Tile from './Tile';  // Base interface for tiles
import TileFactory from './TileFactory';  // Factory for creating tiles

class HexGrid {
  radius: number;
  tileSize: number;
  tileFactory: TileFactory;  // Inject the factory

  constructor(radius: number, tileSize: number, tileFactory: TileFactory) {
    this.radius = radius;
    this.tileSize = tileSize;
    this.tileFactory = tileFactory;  // Use factory for creating tiles
  }

  generateGrid(): Tile[] {
    const hexTiles: Tile[] = [];
    const width = Math.sqrt(3) * this.tileSize;  // Horizontal distance between centers of hexagons
    const height = 2 * this.tileSize;            // Vertical distance between centers of hexagons

    for (let q = -this.radius; q <= this.radius; q++) {
      const r1 = Math.max(-this.radius, -q - this.radius);
      const r2 = Math.min(this.radius, -q + this.radius);
      for (let r = r1; r <= r2; r++) {
        const x = width * (q + r / 2);
        const z = height * 0.75 * r;
        const position = new THREE.Vector3(x, -0.1, z);

        // Create a tile using the factory
        const tile: Tile = this.tileFactory.createTile(position, this.tileSize, 0.2);  // Use TileFactory without "this."
        hexTiles.push(tile);
      }
    }

    return hexTiles;
  }

  addToScene(scene: THREE.Scene): void {
    const hexTiles = this.generateGrid();
    hexTiles.forEach((tile, index) => {
      const mesh = tile.createMesh();
      mesh.name = `Tile ${index}`;
      scene.add(mesh);
    });
  }
}

export default HexGrid;
