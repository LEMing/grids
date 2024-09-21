import * as THREE from 'three';
import {ToolsNames} from '../constants.ts';
import Tile from './HexGrid/Tile';

export class EventManager {
  private readonly camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private renderer: THREE.Renderer;
  private raycaster: THREE.Raycaster;
  private readonly mouse: THREE.Vector2;
  private hoveredTile: Tile | null;
  private previousHoveredTile: Tile | null; // Добавляем поле для предыдущего тайла
  private helperLine: THREE.Line | null;

  // Constants for offset and ray length
  private readonly HELPER_LINE_OFFSET = new THREE.Vector3(0, 0.1, 0);
  private readonly HELPER_LINE_LENGTH = 500;

  // Reusable objects for calculations
  private readonly startPoint: THREE.Vector3;
  private readonly endPoint: THREE.Vector3;
  private readonly positionArray: Float32Array;

  constructor(
    camera: THREE.PerspectiveCamera,
    scene: THREE.Scene,
    renderer: THREE.Renderer,
  ) {
    this.camera = camera;
    this.scene = scene;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.hoveredTile = null;
    this.previousHoveredTile = null; // Инициализируем предыдущий выделенный тайл как null
    this.renderer = renderer;
    this.helperLine = null;

    // Initialize reusable objects
    this.startPoint = new THREE.Vector3();
    this.endPoint = new THREE.Vector3();
    this.positionArray = new Float32Array(6); // 3 components each for start and end points

    console.log('EventManager initialized');
  }

  updateHelper() {
    if (this.helperLine) {
      this.startPoint.copy(this.raycaster.ray.origin).add(this.HELPER_LINE_OFFSET);
      this.endPoint.copy(this.raycaster.ray.direction)
      .multiplyScalar(this.HELPER_LINE_LENGTH)
      .add(this.raycaster.ray.origin)
      .add(this.HELPER_LINE_OFFSET);

      this.positionArray[0] = this.startPoint.x;
      this.positionArray[1] = this.startPoint.y;
      this.positionArray[2] = this.startPoint.z;
      this.positionArray[3] = this.endPoint.x;
      this.positionArray[4] = this.endPoint.y;
      this.positionArray[5] = this.endPoint.z;

      const positionAttribute = this.helperLine.geometry.attributes.position;
      positionAttribute.array = this.positionArray;
      positionAttribute.needsUpdate = true;
    } else {
      const offset = this.HELPER_LINE_OFFSET;
      const line = this.createHelperLine(offset);
      this.helperLine = line;
      this.scene.add(line);
    }
  }

  createHelperLine(offset = this.HELPER_LINE_OFFSET) {
    const startPoint = this.raycaster.ray.origin.clone().add(offset);
    const endPoint = this.raycaster.ray.direction.clone()
    .multiplyScalar(this.HELPER_LINE_LENGTH)
    .add(this.raycaster.ray.origin)
    .add(offset);

    const positions = new Float32Array([
      startPoint.x, startPoint.y, startPoint.z,
      endPoint.x, endPoint.y, endPoint.z
    ]);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const line = new THREE.Line(lineGeometry, lineMaterial);
    line.name = 'helperLine';
    return line;
  }

  onMouseMove(event: MouseEvent, selectedTool: ToolsNames) {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    this.hoveredTile = this.getHoveredTile(event);
    const color = selectedTool === ToolsNames.DELETE? 0xff0000 : 0x0000ff;
    this.selectTile(color);
    this.updateHelper();
  }

  async onMouseClick(
    event: MouseEvent,
    selectedTool: ToolsNames,
    createObjectFn: (type: ToolsNames) => Promise<THREE.Mesh | null>
  ) {
    this.hoveredTile = this.getHoveredTile(event);
    switch (selectedTool) {
      case ToolsNames.WALL:
      case ToolsNames.UNIT:
      case ToolsNames.STORE:
        if (this.hoveredTile) {
          const tile = this.hoveredTile;
          const object = await createObjectFn(selectedTool);
          if (object) {
            object.castShadow = true;
            tile.addToTheRoom(object);
            tile.resetSelection();
            tile.toSelect(0x0000FF);
          }
        }
        break;
      case ToolsNames.DELETE:
        if (this.hoveredTile) {
          const tile = this.hoveredTile;
          if (tile.room.children.length > 0) {
            tile.room.remove(tile.room.children[tile.room.children.length - 1]);
            tile.resetSelection();
            tile.toSelect(0xFF0000);
          }
        }
        break;
      default:
        console.error('Unknown tool selected');
        break;
    }
  }

  getIntersectsWithName(name: string) {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);
    return intersects.filter((intersect) => intersect.object.name === name);
  }

  getHoveredTile(event: MouseEvent) {
    this.mouse.x = (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1;

    const intersects = this.getIntersectsWithName('FillMesh');
    if (intersects.length > 0) {
      const hoveredObject = intersects[0].object;
      const tile = hoveredObject.userData.tile as Tile || hoveredObject.parent?.userData.tile as Tile;
      if (tile) {
        return tile || null;
      }
    }
    return null;
  }

  selectTile = (color: number) => {
    if (this.previousHoveredTile && this.previousHoveredTile !== this.hoveredTile) {
      // Сбросить цвет предыдущего тайла, если он отличается от текущего
      this.previousHoveredTile.resetSelection(); // Заменить на оригинальный цвет тайла
    }

    if (this.hoveredTile) {
      const tile = this.hoveredTile;
      tile.toSelect(color); // Устанавливаем синий цвет для выделенного тайла
    }

    // Обновляем предыдущий выделенный тайл
    this.previousHoveredTile = this.hoveredTile;
  };
}
