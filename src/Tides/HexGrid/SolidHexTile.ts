import * as THREE from 'three';
import Tile from './Tile';

class SolidHexTile extends Tile {
  private _position: THREE.Vector3;
  private selectionOutline: THREE.Line | null = null;

  size: number;
  height: number;

  constructor(q: number, r: number, size: number, height: number) {
    super(q, r);  // Передаем q и r в родительский класс Tile
    this._position = this.hexToCartesian(q, r, size);
    this.size = size;
    this.height = height;
  }

  public get position(): THREE.Vector3 {
    return this._position;
  }

  public set position(value: THREE.Vector3) {
    this._position = value;
  }

  createMesh(): THREE.Mesh {
    const geometry = new THREE.CylinderGeometry(this.size, this.size, this.height, 6);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(this.position.x, this.position.y + this.height / 2, this.position.z);
    return mesh;
  }

  // Реализация метода для выделения тайла
  toSelect() {
    if (!this.selectionOutline) {
      const hexRadius = this.size; // Используем размер тайла для расчета радиуса
      const hexShape = new THREE.Shape();
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const x = Math.cos(angle) * hexRadius;
        const y = Math.sin(angle) * hexRadius;
        if (i === 0) {
          hexShape.moveTo(x, y);
        } else {
          hexShape.lineTo(x, y);
        }
      }
      hexShape.closePath();

      // Используем шейп для создания линии
      const points = hexShape.getPoints();
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ color: 0x0000ff }); // Синяя рамка
      const line = new THREE.LineLoop(geometry, material);

      // Немного поднимаем рамку над тайлом
      line.position.y = this.height / 2 + 0.1;
      this.selectionOutline = line;

      // Добавляем рамку к тайлу
      this.linkToObject3D.add(this.selectionOutline);
    }
  }

  // Реализация метода для сброса выделения
  resetSelection() {
    if (this.selectionOutline) {
      this.linkToObject3D.remove(this.selectionOutline);
      this.selectionOutline.geometry.dispose();
      this.selectionOutline.material.dispose();
      this.selectionOutline = null;
    }
  }
}

export default SolidHexTile;
