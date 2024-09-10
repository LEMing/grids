import * as THREE from 'three';
import Tile from './Tile';

class WireframeHexTile extends Tile {
  _position: THREE.Vector3;
  size: number;

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
    // Create the hexagonal shape for the plane (without intermediate edges)
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

    // Create the fill geometry from the hexagonal shape
    const fillGeometry = new THREE.ShapeGeometry(hexShape);

    // Transparent fill material (for the plane)
    const fillMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.0, // Make the fill transparent
      side: THREE.DoubleSide // Ensure both sides of the mesh are rendered
    });

    // Wireframe edges using the same hex shape
    const edgeGeometry = new THREE.EdgesGeometry(fillGeometry);
    const edgeMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });

    // Create the mesh for the transparent fill
    const fillMesh = new THREE.Mesh(fillGeometry, fillMaterial);

    // Create the wireframe outline from the edges
    const wireframe = new THREE.LineSegments(edgeGeometry, edgeMaterial);

    // Group the two meshes together
    const tileGroup = new THREE.Group();
    tileGroup.add(fillMesh);
    tileGroup.add(wireframe);

    // Position the tile (no rotation required)
    tileGroup.position.set(this.position.x, this.position.y, this.position.z);
    tileGroup.rotation.x = Math.PI / 2;
    tileGroup.rotation.z = Math.PI / 6;

    return tileGroup;
  }
}

export default WireframeHexTile;
