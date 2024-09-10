import Tile from './Tile';
import SolidHexTile from './SolidHexTile';
import WireframeHexTile from './WireframeHexTile';

class TileFactory {
  createTile(q: number, r: number, size: number, height: number): Tile {
    let tile: Tile;

    if (height > 0.2) {
      tile = new SolidHexTile(q, r, size, height);
    } else {
      tile = new WireframeHexTile(q, r, size);
    }

    // Добавляем q и r в userData объекта mesh
    if (tile.linkToMesh) {
      tile.linkToMesh.userData = { q, r, type: 'tile' };  // Обновляем userData
    }

    return tile;
  }
}



export default TileFactory;
