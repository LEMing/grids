import * as THREE from 'three';
import Tile from './Tile';
import SolidHexTile from './SolidHexTile';
import WireframeHexTile from './WireframeHexTile';

class TileFactory {
  createTile(position: THREE.Vector3, size: number, height: number): Tile {
    if (height > 0.2) {
      return new SolidHexTile(position, size, height);
    } else {
      return new WireframeHexTile(position, size);
    }
  }
}

export default TileFactory;
