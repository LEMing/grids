import * as THREE from 'three';
import HexTileCoordinates from './HexTileCoordinates'; // Добавляем новый класс координат

abstract class Tile {
  public _linkToMesh: undefined | THREE.Object3D;
  public hexCoordinates: HexTileCoordinates;

  protected constructor(q: number, r: number) {
    this._linkToMesh = undefined;
    this.hexCoordinates = new HexTileCoordinates(q, r); // Добавляем координаты
  }

  abstract createMesh(): THREE.Object3D;

  execute(): THREE.Object3D {
    let mesh;
    if (!this._linkToMesh) {
      mesh = this.createMesh();
      this._linkToMesh = mesh;
    }
    return this.linkToMesh;
  }

  public get linkToMesh(): THREE.Object3D {
    if (!this._linkToMesh) {
      return this.execute();
    }
    return this._linkToMesh;
  }

  public set linkToMesh(value: THREE.Object3D) {
    this._linkToMesh = value;
  }

  get position(): THREE.Vector3 {
    return this.linkToMesh ? this.linkToMesh.position : new THREE.Vector3();
  }

  // Преобразование шестиугольных координат в декартовы
  hexToCartesian(q: number, r: number, size: number): THREE.Vector3 {
    const x = size * Math.sqrt(3) * (q + r / 2);
    const z = size * 3 / 2 * r;
    return new THREE.Vector3(x, 0, z);
  }
}

export default Tile;
