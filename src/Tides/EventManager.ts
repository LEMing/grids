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
  private helperLine: THREE.Line | null;
// New constants for offset and ray length

  private readonly HELPER_LINE_OFFSET = new THREE.Vector3(0, 0.1, 0);
  private readonly HELPER_LINE_LENGTH = 500;

  // New reusable objects for calculations
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
      // Update existing helperLine geometry
      this.startPoint.copy(this.raycaster.ray.origin).add(this.HELPER_LINE_OFFSET);
      this.endPoint.copy(this.raycaster.ray.direction)
      .multiplyScalar(this.HELPER_LINE_LENGTH)
      .add(this.raycaster.ray.origin)
      .add(this.HELPER_LINE_OFFSET);

      // Update the position array
      this.positionArray[0] = this.startPoint.x;
      this.positionArray[1] = this.startPoint.y;
      this.positionArray[2] = this.startPoint.z;
      this.positionArray[3] = this.endPoint.x;
      this.positionArray[4] = this.endPoint.y;
      this.positionArray[5] = this.endPoint.z;

      // Update the buffer attribute
      const positionAttribute = this.helperLine.geometry.attributes.position;
      positionAttribute.array = this.positionArray;
      positionAttribute.needsUpdate = true;
    } else {      // Create new helperLine if it doesn't exist
      const offset = this.HELPER_LINE_OFFSET; // Small upward offset
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

  onMouseMove(event: MouseEvent) {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    this.hoveredTile = this.getHoveredTile(event);
    this.flashTile();
    this.updateHelper();
  };

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
        console.log('Create object function');
        if (this.hoveredTile) {
          const tile = this.hoveredTile;
          const worldPosition = new THREE.Vector3();
          tile.linkToObject3D.getWorldPosition(worldPosition);

          const object = await createObjectFn(selectedTool);

          if (object) {
            // object.position.copy(worldPosition);
            tile.room.add(object);
          }
        }
        break;
      case ToolsNames.DELETE:
        if (this.hoveredTile) {
          const tile = this.hoveredTile;
          if (tile.room.children.length > 0) {
            // Remove the first child from the room
            tile.room.remove(tile.room.children[0]);
          }
        }
        break;
      default:
        console.error('Unknown tool selected');
        break;
    }
  };

  getIntersectsWithName(name: string) {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);
    return intersects.filter((intersect) => intersect.object.name === name);
  }

  getHoveredTile(event: MouseEvent) {
    this.mouse.x = (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1;

    const intersects = this.getIntersectsWithName('FillMesh')
    if (intersects.length > 0) {
      const hoveredObject = intersects[0].object;

      const tile = hoveredObject.userData.tile as Tile || hoveredObject.parent?.userData.tile as Tile;
      if (tile) {
        return tile || null;
      }
    }
    return null;
  }

  flashTile = () => {
    if (this.hoveredTile) {
      const tile = this.hoveredTile;
      tile.changeTileColor(0x0000FF);
      tile.fadeOutTile();  // Подсвечиваем тайл
    }
  };

}
