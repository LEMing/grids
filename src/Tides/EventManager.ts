import React from 'react';
import * as THREE from 'three';
import {ToolsNames} from '../constants.ts';
import Tile from './HexGrid/Tile';

export class EventManager {
  private readonly camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private raycaster: THREE.Raycaster;
  private readonly mouse: THREE.Vector2;
  private readonly hoveredTileRef: React.MutableRefObject<Tile | null>;

  constructor(
    camera: THREE.PerspectiveCamera,
    scene: THREE.Scene,
    mouse: THREE.Vector2,
    hoveredTileRef: React.MutableRefObject<Tile | null>
  ) {
    this.camera = camera;
    this.scene = scene;
    this.raycaster = new THREE.Raycaster();
    this.mouse = mouse;
    this.hoveredTileRef = hoveredTileRef;
    console.log('EventManager initialized');
  }

  onMouseMove(event: MouseEvent) {
    this.hoveredTileRef.current = this.getHoveredTile(event);
    this.handleMouseEvents(this.hoveredTileRef);
  };

  async onMouseClick(
    selectedTool: ToolsNames,
    createObjectFn: (type: ToolsNames) => Promise<THREE.Mesh | null>
  ) {
    switch (selectedTool) {
      case ToolsNames.WALL:
      case ToolsNames.UNIT:
      case ToolsNames.STORE:
        console.log('Create object function');
        if (this.hoveredTileRef.current) {
          const tile = this.hoveredTileRef.current;
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
        if (this.hoveredTileRef.current) {
          const tile = this.hoveredTileRef.current;
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

  getHoveredTile(event: MouseEvent) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObjects(this.scene.children, true);

    if (intersects.length > 0) {
      const hoveredObject = intersects[0].object;

      const tile = hoveredObject.userData.tile as Tile || hoveredObject.parent?.userData.tile as Tile;
      if (tile) {
        return tile || null;
      }
    }
    return null;
  }

  handleMouseEvents = (
    hoveredTileRef: React.MutableRefObject<Tile | null>
  ) => {
    if (hoveredTileRef.current) {
      const tile = hoveredTileRef.current;
      tile.changeTileColor(0x0000FF);
      tile.fadeOutTile();  // Подсвечиваем тайл
      // Получаем мировые координаты объекта
      const worldPosition = new THREE.Vector3();
      tile.linkToObject3D.getWorldPosition(worldPosition);  // Преобразуем локальные координаты в мировые
    }
  };

}
