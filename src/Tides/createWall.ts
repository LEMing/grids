import { Object3D } from 'three';
import * as THREE from 'three';
const createBrushedConcreteTexture = (size = 512) => {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext('2d');
  if (!context) return null;

  // Fill background with a base concrete color
  context.fillStyle = '#7a7a7a'; // A medium gray for concrete
  context.fillRect(0, 0, size, size);

  // Add directional noise to simulate brushed effect
  const addBrushedEffect = () => {
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const value = Math.floor(Math.random() * 30) + 200; // Light gray noise
        context.fillStyle = `rgba(${value}, ${value}, ${value}, 0.1)`;
        context.fillRect(i, j, 1, 1);
      }
    }
  };

  // Apply directional blur for the brushed effect
  const addBrushedBlur = () => {
    context.globalAlpha = 0.6;
    for (let i = 0; i < size; i++) {
      const lineWidth = Math.random() * 1.5 + 0.5; // Vary brush stroke width
      context.fillStyle = 'rgba(255, 255, 255, 0.05)';
      context.fillRect(i, 0, lineWidth, size);
    }
    context.globalAlpha = 1;
  };

  // Add random dirt spots
  const addDirt = (intensity = 50) => {
    for (let i = 0; i < intensity; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const radius = Math.random() * 20;
      context.fillStyle = `rgba(100, 100, 100, ${Math.random() * 0.3})`;
      context.beginPath();
      context.arc(x, y, radius, 0, 2 * Math.PI);
      context.fill();
    }
  };

  // Add scratches
  const addScratches = (scratchCount = 15) => {
    for (let i = 0; i < scratchCount; i++) {
      context.strokeStyle = 'rgba(50, 50, 50, 0.4)';
      context.lineWidth = Math.random() * 1 + 0.2;
      context.beginPath();
      context.moveTo(Math.random() * size, Math.random() * size);
      context.lineTo(Math.random() * size, Math.random() * size);
      context.stroke();
    }
  };

  // Call functions to generate layers of texture
  addBrushedEffect();
  addBrushedBlur();
  addDirt(100); // Increase dirt intensity
  addScratches(25); // More scratches for realism

  // Create texture from the canvas
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);
  texture.needsUpdate = true;

  return texture;
};

const createConcreteTexture = (size = 512) => {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext('2d');
  if (!context) return null;

  // Create the base concrete texture with noise and scratches
  const createNoise = (intensity = 50) => {
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const value = Math.floor(Math.random() * 255);
        context.fillStyle = `rgba(${value}, ${value}, ${value}, ${intensity / 100})`;
        context.fillRect(i, j, 1, 1);
      }
    }
  };

  const addScratches = (scratchCount = 10) => {
    for (let i = 0; i < scratchCount; i++) {
      context.strokeStyle = 'rgba(50, 50, 50, 0.2)';
      context.lineWidth = Math.random() * 2 + 0.5;
      context.beginPath();
      context.moveTo(Math.random() * size, Math.random() * size);
      context.lineTo(Math.random() * size, Math.random() * size);
      context.stroke();
    }
  };

  // Fill background with concrete base color
  context.fillStyle = '#777777';
  context.fillRect(0, 0, size, size);

  // Add noise and scratches for the concrete texture
  createNoise(100); // Adjust intensity for stronger noise
  addScratches(20); // Increase scratch count for more detail

  // Create texture from canvas
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);
  texture.needsUpdate = true;

  return texture;
};

const createNormalMap = (size = 512) => {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext('2d');
  if (!context) return null;

  // Generate random normal map values for rough surface
  const createNoise = () => {
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const value = Math.floor(Math.random() * 255);
        context.fillStyle = `rgb(${value}, ${value}, ${value})`;
        context.fillRect(i, j, 1, 1);
      }
    }
  };

  createNoise();

  const normalMap = new THREE.CanvasTexture(canvas);
  normalMap.wrapS = THREE.RepeatWrapping;
  normalMap.wrapT = THREE.RepeatWrapping;
  normalMap.repeat.set(1, 1);
  normalMap.needsUpdate = true;

  return normalMap;
};

const createChessGridTexture = () => {
  const size = 512; // Size of the canvas for the texture
  const gridSize = 8; // Number of squares per row/column
  const squareSize = size / gridSize;

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext('2d');
  if (!context) return null;

  // Draw the chess grid pattern
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      context.fillStyle = (i + j) % 2 === 0 ? '#333333' : '#AAAAAA'; // Alternating black and white squares
      context.fillRect(i * squareSize, j * squareSize, squareSize, squareSize);
    }
  }

  // Create the texture from the canvas
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;

  // Adjust texture repeat to match the grid size
  texture.repeat.set(1, 1);
  texture.needsUpdate = true;
  return texture;
};


const createWall = async (): Promise<Object3D> => {
  const SIZE = 2;

  // Create a hexagonal shape
  const hexShape = new THREE.Shape();
  const size = SIZE - 0.25; // Tile size considering the borders
  const angleStep = (Math.PI * 2) / 6; // Six sides
  for (let i = 0; i < 6; i++) {
    const x = size * Math.cos(i * angleStep);
    const y = size * Math.sin(i * angleStep);
    if (i === 0) {
      hexShape.moveTo(x, y);
    } else {
      hexShape.lineTo(x, y);
    }
  }
  hexShape.closePath(); // Close the hexagon contour

  // Extrusion parameters to create tile volume
  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: 1 - 0.25, // Tile thickness
    bevelEnabled: true, // Enable beveling (chamfer)
    bevelSize: 0.125, // Bevel size
    bevelThickness: 0.125, // Bevel thickness
    bevelSegments: 2, // Number of segments for smoothing the edge
    UVGenerator: {
      generateTopUV: (
        _geometry: THREE.ExtrudeGeometry,
        vertices: number[],
        indexA: number,
        indexB: number,
        indexC: number
      ): THREE.Vector2[] => {
        // Get the positions of the vertices
        const ax = vertices[indexA * 3];
        const ay = vertices[indexA * 3 + 1];
        const bx = vertices[indexB * 3];
        const by = vertices[indexB * 3 + 1];
        const cx = vertices[indexC * 3];
        const cy = vertices[indexC * 3 + 1];

        // Map the vertex positions to UV coordinates
        const mapUV = (x: number, y: number) => {
          // Scale and translate the coordinates to [0,1] range
          const u = (x + size) / (2 * size);
          const v = (y + size * Math.sin(Math.PI / 3)) / (2 * size * Math.sin(Math.PI / 3));
          return new THREE.Vector2(u, v);
        };

        return [mapUV(ax, ay), mapUV(bx, by), mapUV(cx, cy)];
      },
      generateSideWallUV: (
        _geometry: THREE.ExtrudeGeometry,
        vertices: number[],
        indexA: number,
        indexB: number,
        indexC: number,
        indexD: number
      ): THREE.Vector2[] => {
        const gridSize = 1; // Number of squares per row/column

        // Get the positions of the vertices for the side face
        const ax = vertices[indexA * 3];
        const ay = vertices[indexA * 3 + 1];
        const az = vertices[indexA * 3 + 2];

        const bx = vertices[indexB * 3];
        const by = vertices[indexB * 3 + 1];
        const bz = vertices[indexB * 3 + 2];

        const dx = vertices[indexD * 3];
        const dy = vertices[indexD * 3 + 1];
        const dz = vertices[indexD * 3 + 2];

        // Calculate edge length in XY plane
        const edgeLength = Math.hypot(bx - ax, by - ay);

        // Physical dimensions of the hexagon
        const hexWidth = size * 2; // From -size to +size
        const hexHeight = size * 2 * Math.sin(Math.PI / 3); // Height of the hexagon

        // Physical size of one texture square on the top face
        const squarePhysicalWidth = hexWidth / gridSize; // Width per square
        const squarePhysicalHeight = hexHeight / gridSize; // Height per square

        // U Coordinates along the edge length
        const u0 = 0;
        const u1 = edgeLength / squarePhysicalWidth;

        // V Coordinates based on the height (depth of the extrusion)
        const v0 = az / squarePhysicalHeight;
        const v1 = dz / squarePhysicalHeight;

        return [
          new THREE.Vector2(u0, v0),
          new THREE.Vector2(u1, v0),
          new THREE.Vector2(u1, v1),
          new THREE.Vector2(u0, v1),
        ];
      },
    },
  };

  // Create the extrusion
  const geometry = new THREE.ExtrudeGeometry(hexShape, extrudeSettings);
  geometry.computeVertexNormals();

  const brushedConcreteTexture = createBrushedConcreteTexture();

  // Use the brushed concrete texture in the material
  const material = new THREE.MeshStandardMaterial({
    metalness: 0.3, // Slight metalness for a concrete look
    roughness: 0.9, // High roughness for aged concrete
    map: brushedConcreteTexture, // Brushed concrete texture
  });


  // Create the hexagonal tile
  const hexMesh = new THREE.Mesh(geometry, material);
  hexMesh.rotation.z = Math.PI / 2; // Tile lies on the XY plane

  hexMesh.receiveShadow = true;

  // Group to combine the tile and edges
  const group = new THREE.Group();
  group.rotateZ(-Math.PI / 2);
  group.add(hexMesh);

  return group;
};

export { createWall };
