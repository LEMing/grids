import { useCallback, useEffect } from 'react';
import * as THREE from 'three';
import HexGrid from './HexGrid/HexGrid';
import TileFactory from './HexGrid/TileFactory'; // Use the factory for tile creation

const useTides = (
  camera: THREE.PerspectiveCamera | null,
  scene: THREE.Scene | null
) => {
  const raycaster = new THREE.Raycaster();
  let clickPosition: THREE.Vector2;

  const createNewTile = useCallback((position: THREE.Vector2) => {
    if (scene) {
      // Create a solid hex tile using the factory
      const newTile = new TileFactory().createTile(new THREE.Vector3(position.x, 0, position.y), 5, 5); // Solid tile with height 5
      const newTileMesh = newTile.createMesh();
      scene.add(newTileMesh);
    }
  }, [scene]);

  const onDocumentMouseDown = useCallback((event: MouseEvent) => {
    if (camera && scene) {
      const mouse = new THREE.Vector2();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children);

      if (intersects.length > 0) {
        clickPosition = new THREE.Vector2(intersects[0].point.x, intersects[0].point.y);
        createNewTile(clickPosition);
      } else {
        console.log('No intersection found');
      }
    }
  }, [camera, scene, createNewTile]);

  // Set up the mouse event listener and clean it up when the component unmounts
  useEffect(() => {
    document.addEventListener('mousedown', onDocumentMouseDown);
    return () => document.removeEventListener('mousedown', onDocumentMouseDown);
  }, [onDocumentMouseDown]);

  // Generate Hexagonal Grid using HexGrid class
  useEffect(() => {
    if (scene) {
      const hexGrid = new HexGrid(10, 5, new TileFactory()); // Inject TileFactory for grid creation
      hexGrid.addToScene(scene); // Add the grid to the scene
    }
  }, [scene]);
};

export default useTides;
