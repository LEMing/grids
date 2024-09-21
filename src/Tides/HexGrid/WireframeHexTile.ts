import * as THREE from 'three';
import Tile from './Tile';

class WireframeHexTile extends Tile {
  _position: THREE.Vector3;
  size: number;
  private selectionOutline: THREE.Mesh | null = null; // Поле для хранения объёмного гексагонального выделения
  private pointerLight: THREE.PointLight | null = null; // Поле для хранения Point Light

  constructor(q: number, r: number, size: number) {
    super(q, r);  // Передаем q и r в родительский класс Tile
    this._position = this.hexToCartesian(q, r, size);
    this.size = size;
  }

  public get position(): THREE.Vector3 {
    return this._position;
  }

  public set position(value: THREE.Vector3) {
    this._position = value;
  }

  createMesh(): THREE.Group {
    // Создание шестиугольной формы
    const hexShape = new THREE.Shape();
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const x = Math.cos(angle) * this.size;
      const z = Math.sin(angle) * this.size;
      if (i === 0) {
        hexShape.moveTo(x, z);
      } else {
        hexShape.lineTo(x, z);
      }
    }
    hexShape.closePath();

    // Создание геометрии заполнения
    const fillGeometry = new THREE.ShapeGeometry(hexShape);

    // Прозрачный материал для заполнения
    const fillMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.0, // Полностью прозрачный
      shadowSide: THREE.DoubleSide,
      side: THREE.DoubleSide
    });

    // Внешняя рамка из линий
    const edgeGeometry = new THREE.EdgesGeometry(fillGeometry);
    const edgeMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });

    // Прозрачный меш
    const fillMesh = new THREE.Mesh(fillGeometry, fillMaterial);
    fillMesh.userData.tile = this;
    fillMesh.receiveShadow = true;

    // Создание линии для проволочной сетки
    const wireframe = new THREE.LineSegments(edgeGeometry, edgeMaterial);
    wireframe.userData.tile = this;

    // Объединение всех объектов в одну группу
    const tileGroup = new THREE.Group();
    fillMesh.name = 'FillMesh';
    tileGroup.add(fillMesh);
    tileGroup.add(wireframe);

    // Позиционирование плитки
    tileGroup.position.set(this.position.x, this.position.y, this.position.z);
    tileGroup.rotation.x = Math.PI / 2;
    tileGroup.rotation.z = Math.PI / 6;
    tileGroup.userData.tile = this;

    return tileGroup;
  }

  // Реализация метода для выделения тайла с объемной рамкой
  toSelect(color: number = 0x0000FF) {
    if (!this.selectionOutline) {
      const outlineWidth = 0
      const hexShape = new THREE.Shape();
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const x = Math.cos(angle) * (this.size + outlineWidth);
        const y = Math.sin(angle) * (this.size + outlineWidth);
        if (i === 0) {
          hexShape.moveTo(x, y);
        } else {
          hexShape.lineTo(x, y);
        }
      }
      hexShape.closePath();

      // Создание объёмной геометрии с использованием ExtrudeGeometry
      const height = 1;
      const extrudeSettings = { depth: height, bevelEnabled: false };
      const extrudeGeometry = new THREE.ExtrudeGeometry(hexShape, extrudeSettings);
      const extrudeMaterial = new THREE.MeshStandardMaterial({ color, opacity: 0.4, transparent: true });

      // Создание объёмного гексагона
      const extrudeMesh = new THREE.Mesh(extrudeGeometry, extrudeMaterial);

      // Добавление в сцену
      this.linkToObject3D.add(extrudeMesh);
      this.selectionOutline = extrudeMesh;

      // Добавление Point Light внутрь гексагона
      const lightColor = 0x0000ff;
      const pointLight = new THREE.PointLight(lightColor, 1, 4);
      if (this.room.children.length > 0) {
        const lastChildPositionZ = this.room.children[this.room.children.length - 1].position.z;
        console.log(lastChildPositionZ)
        this.selectionOutline.position.z = lastChildPositionZ - 1 - height;;
        console.log(this.selectionOutline.position.z)
      } else {
        this.selectionOutline.position.z = -height;
      }
      pointLight.position.copy(this.selectionOutline.position);
      pointLight.position.add(new THREE.Vector3(0, 0, 0.5));
      this.linkToObject3D.add(pointLight);
      this.pointerLight = pointLight;
    }
  }

  // Реализация метода для сброса выделения
  resetSelection() {
    if (this.selectionOutline) {
      this.linkToObject3D.remove(this.selectionOutline);
      this.selectionOutline.geometry.dispose();
      if (this.selectionOutline.material instanceof THREE.Material) {
        this.selectionOutline.material.dispose();
      }
      this.selectionOutline = null;
    }

    // Удаление Point Light при сбросе выделения
    if (this.pointerLight) {
      this.linkToObject3D.remove(this.pointerLight);
      this.pointerLight.dispose();
      this.pointerLight = null;
    }
  }
}

export default WireframeHexTile;
