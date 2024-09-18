import * as THREE from 'three';
import Tile from './HexGrid/Tile.ts';
import { moveUnitToTile } from './unitMovement';
import { stopAnimation } from './unitAnimation';
import { findPath } from './pathFinding';

export class UnitController {
  private setSelectedUnit: React.Dispatch<React.SetStateAction<THREE.Object3D | null>>;
  private setMixer: React.Dispatch<React.SetStateAction<THREE.AnimationMixer | null>>;
  private mixer: THREE.AnimationMixer | null;
  private selectedUnit: THREE.Object3D | null;


  constructor(
    setSelectedUnit: React.Dispatch<React.SetStateAction<THREE.Object3D | null>>,
    setMixer: React.Dispatch<React.SetStateAction<THREE.AnimationMixer | null>>,
    mixer: THREE.AnimationMixer | null,
    selectedUnit: THREE.Object3D | null,

  ) {
    this.setSelectedUnit = setSelectedUnit;
    this.setMixer = setMixer;
    this.mixer = mixer;
    this.selectedUnit = selectedUnit;

  }

  async handleUnitMovement(
    tile: Tile | null,
    allTiles: Tile[],
    pathLine: THREE.Line | null,
    scene: THREE.Scene | null
  ) {
    if (!this.selectedUnit || !tile) return;

    const startTile = allTiles.find(t => t.hexCoordinates.q === this.selectedUnit!.userData.q && t.hexCoordinates.r === this.selectedUnit!.userData.r);
    const endTile = allTiles.find(t => t.hexCoordinates.q === tile.hexCoordinates.q && t.hexCoordinates.r === tile.hexCoordinates.r);

    if (!startTile || !endTile) {
      console.error('Start or end tile not found.');
      return;
    }

    startTile.highlightTile(0xff0000); // Start Tile
    endTile.highlightTile(0x0000ff);   // End Tile

    const path = findPath(startTile, endTile, allTiles);
    if (pathLine) scene?.remove(pathLine);
    // const newPathLine = drawPath(path, scene as THREE.Scene);

    for (const pathTile of path) {
      await moveUnitToTile(this.selectedUnit, pathTile.linkToObject3D as THREE.Mesh);
    }

    startTile.resetTileHighlight(0x00ff00); // Reset Start Tile color
    endTile.resetTileHighlight(0x00ff00);   // Reset End Tile color

    stopAnimation(this.mixer, this.setMixer);
    this.setSelectedUnit(null);
  }

  animate() {
    const clock = new THREE.Clock();

    const animateLoop = () => {
      if (this.mixer) {
        this.mixer.update(clock.getDelta());
      }
      requestAnimationFrame(animateLoop);
    };
    animateLoop();
  }
}
