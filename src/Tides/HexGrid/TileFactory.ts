import * as THREE from 'three';
import Tile from './Tile';
import SolidHexTile from './SolidHexTile';
import WireframeHexTile from './WireframeHexTile';

class TileFactory {
  createTile(q: number, r: number, size: number, height: number): Tile {
    const position = this.hexToCartesian(q, r, size);
    let tile: Tile;

    if (height > 0.2) {
      tile = new SolidHexTile(position, q, r, size, height);
    } else {
      tile = new WireframeHexTile(position, q, r, size);
    }

    // Добавляем q и r в userData объекта mesh
    if (tile.linkToMesh) {
      tile.linkToMesh.userData = { q, r, type: 'tile' };  // Обновляем userData
    }

    return tile;
  }

  // Преобразование шестиугольных координат в декартовы
  hexToCartesian(q: number, r: number, size: number): THREE.Vector3 {
    const x = size * Math.sqrt(3) * (q + r / 2);
    const z = size * 3 / 2 * r;
    return new THREE.Vector3(x, 0, z);
  }
}



export default TileFactory;
