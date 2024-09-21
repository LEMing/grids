import * as THREE from 'three';
import HexTileCoordinates from './HexTileCoordinates'; // Добавляем новый класс координат

abstract class Tile {
  public _linkToObject3D: undefined | THREE.Object3D;
  public hexCoordinates: HexTileCoordinates;

  protected constructor(q: number, r: number) {
    this._linkToObject3D = undefined;
    this.hexCoordinates = new HexTileCoordinates(q, r);
  }

  abstract createMesh(): THREE.Object3D;

  public room: THREE.Group = new THREE.Group();

  abstract toSelect(color: number): void;  // Объявляем как абстрактный метод
  abstract resetSelection(): void;  // Объявляем как абстрактный метод

  addToTheRoom(object: THREE.Object3D) {
    if (this.room.children.length > 0) {
      const lastObject = this.room.children[this.room.children.length - 1];
      object.position.z = lastObject.position.z - 1;
    }
    this.room.add(object);
  }

  removeFromTheRoom(object: THREE.Object3D) {
    this.room.remove(object);
  }

  execute(): THREE.Object3D {
    let object3D;
    if (!this._linkToObject3D) {
      object3D = this.createMesh();
      object3D.userData.tile = this;
      this._linkToObject3D = object3D;
      this._linkToObject3D.add(this.room);
    }
    return this.linkToObject3D;
  }

  public get linkToObject3D(): THREE.Object3D {
    if (!this._linkToObject3D) {
      return this.execute();
    }
    return this._linkToObject3D;
  }

  public set linkToObject3D(value: THREE.Object3D) {
    this._linkToObject3D = value;
  }

  private findMesh(object3D: THREE.Object3D): THREE.Mesh | undefined {
    if (object3D instanceof THREE.Mesh) {
      return object3D;
    }
    for (const child of object3D.children) {
      const mesh = this.findMesh(child);
      if (mesh) {
        return mesh;
      }
    }
  }

  get position(): THREE.Vector3 {
    return this.linkToObject3D ? this.linkToObject3D.position : new THREE.Vector3();
  }

  hexToCartesian(q: number, r: number, size: number): THREE.Vector3 {
    const x = size * Math.sqrt(3) * (q + r / 2);
    const z = size * 3 / 2 * r;
    return new THREE.Vector3(x, 0, z);
  }

  fadeOutTile() {
    const mesh = this.findMesh(this.linkToObject3D);
    const material = mesh?.material as THREE.MeshStandardMaterial;
    if (material) {
      let currentOpacity = 1;

      const fade = () => {
        currentOpacity -= 0.01;
        if (currentOpacity <= 0) {
          currentOpacity = 0;
        }
        material.opacity = currentOpacity;
        if (currentOpacity > 0) {
          requestAnimationFrame(fade);
        }
      };

      requestAnimationFrame(fade);
    }
  }

  getMesh(): THREE.Mesh {
    const mesh = this.linkToObject3D.children.find(child => child instanceof THREE.Mesh)
    return mesh as THREE.Mesh;
  }

  changeTileColor(color: number) {
    if (this.linkToObject3D) {
      const mesh = this.getMesh();
      const material = mesh.material as THREE.MeshStandardMaterial;
      material.color.set(color);
    }
  }
}

export default Tile;
