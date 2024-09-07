import { useCallback, useEffect, useRef } from 'react';
import * as THREE from 'three';
import HexGrid from './HexGrid/HexGrid';
import TileFactory from './HexGrid/TileFactory';

const useTides = (
  camera: THREE.PerspectiveCamera | null,
  scene: THREE.Scene | null
) => {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const hoveredTileRef = useRef<THREE.Object3D | null>(null); // To store the currently hovered tile

  // Function to gradually fade back the tile's opacity to transparent
  const fadeOutTile = (tile: THREE.Object3D) => {
    const material = (tile as THREE.Mesh).material as THREE.MeshBasicMaterial;
    let currentOpacity = material.opacity;

    const fade = () => {
      currentOpacity -= 0.1; // Decrease the opacity over time
      if (currentOpacity <= 0) {
        currentOpacity = 0;
      }
      material.opacity = currentOpacity;
      if (currentOpacity > 0) {
        requestAnimationFrame(fade); // Continue the fade-out animation
      }
    };

    requestAnimationFrame(fade); // Start the animation
  };

  // Function to handle mouse hover
  const onDocumentMouseMove = useCallback((event: MouseEvent) => {
    if (camera && scene) {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children);

      if (intersects.length > 0) {
        const intersectedTile = intersects[0].object;

        // If hovering over a new tile, update the opacity
        if (hoveredTileRef.current !== intersectedTile) {
          if (hoveredTileRef.current) {
            fadeOutTile(hoveredTileRef.current); // Fade out the previously hovered tile
          }

          hoveredTileRef.current = intersectedTile;

          // Set the new hovered tile's opacity to 1 (fully visible)
          const material = (intersectedTile as THREE.Mesh).material as THREE.MeshBasicMaterial;
          material.opacity = 1.0;
        }
      } else if (hoveredTileRef.current) {
        // If no tile is being hovered anymore, fade out the last hovered tile
        fadeOutTile(hoveredTileRef.current);
        hoveredTileRef.current = null;
      }
    }
  }, [camera, scene]);

  // Set up the mouse move event listener and clean it up when the component unmounts
  useEffect(() => {
    document.addEventListener('mousemove', onDocumentMouseMove);
    return () => document.removeEventListener('mousemove', onDocumentMouseMove);
  }, [onDocumentMouseMove]);

  // Generate Hexagonal Grid using HexGrid class
  useEffect(() => {
    if (scene) {
      const hexGrid = new HexGrid(10, 5, new TileFactory()); // Inject TileFactory for grid creation
      hexGrid.addToScene(scene); // Add the grid to the scene
    }
  }, [scene]);

  return null; // Hook doesn't render anything directly
};

export default useTides;
