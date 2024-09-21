// ObjectFactory.ts
import {Object3D} from 'three';
import * as THREE from 'three';
import {GLTF, GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {ToolsNames} from '../constants.ts';


export const objectFactory = async (type: ToolsNames): Promise<THREE.Object3D | null> => {
  switch (type) {
    case ToolsNames.WALL:
      return createWall();
    case ToolsNames.UNIT:
      return createUnit();
    case ToolsNames.STORE:
      return createStore();
    default:
      return null;
  }
};

const createConcreteTexture = () => {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext('2d');
  if (!context) return null;

  // Fill the background with a darker color
  context.fillStyle = '#555555'; // Darker gray
  context.fillRect(0, 0, size, size);

  // Adding noise
  const imageData = context.getImageData(0, 0, size, size);
  const data = imageData.data;

  // Increase the noise intensity
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 100; // Range from -50 to +50
    data[i] = Math.min(255, Math.max(0, data[i] + noise));     // Red channel
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise)); // Green channel
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise)); // Blue channel
  }

  context.putImageData(imageData, 0, 0);

  // Create the texture from the canvas
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1); // Repeat the texture
  texture.needsUpdate = true;

  return texture;
};

const createWall = async (): Promise<Object3D> => {
  const SIZE = 2;

  // Создание шестиугольной формы
  const hexShape = new THREE.Shape();
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const x = Math.cos(angle) * SIZE;
    const z = Math.sin(angle) * SIZE;
    if (i === 0) {
      hexShape.moveTo(x, z);
    } else {
      hexShape.lineTo(x, z);
    }
  }
  hexShape.closePath();

  const extrudeSettings = {
    depth: -1,
    bevelEnabled: false,
    // @ts-ignore
    UVGenerator: THREE.ExtrudeGeometry.WorldUVGenerator
  };

  const prismGeometry = new THREE.ExtrudeGeometry(hexShape, extrudeSettings);

  // Получение текстуры бетона
  const concreteTexture = createConcreteTexture();

  // Применение текстуры к материалу
  const fillMaterial = new THREE.MeshStandardMaterial({
    map: concreteTexture,
    normalMap: concreteTexture,
    side: THREE.DoubleSide,
    roughness: 0.9,
    metalness: 0.0
  });

  // Создание меша призмы
  const prismMesh = new THREE.Mesh(prismGeometry, fillMaterial);

  // Создание геометрии ребер
  const edgesGeometry = new THREE.EdgesGeometry(prismGeometry);

  // Создание материала для линий
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x555555 }); // Чёрный цвет

  // Создание линий из геометрии ребер и материала
  const wireframe = new THREE.LineSegments(edgesGeometry, lineMaterial);

  // Создание группы для объединения меша и линий
  const group = new THREE.Group();
  group.add(prismMesh);
  group.add(wireframe);
  group.traverse((child) => child.castShadow = true);
  group.traverse((child) => child.receiveShadow = true);
  return group;
};

const createUnit = async () => {
  const geometry = new THREE.SphereGeometry(1.7, 32, 32);
  const material = new THREE.MeshStandardMaterial({ color: 0xaaff00 });
  const unit = new THREE.Mesh(geometry, material);

  // Назначаем тип юниту для идентификации
  unit.userData = { type: 'unit' };
  return unit;
};


const createStore = async () => {
  const loader = new GLTFLoader();

  try {
    const gltf = await new Promise<GLTF>((resolve, reject) => {
      loader.load(
        'generator.glb', // Замените на правильный путь к вашей модели
        (gltf: GLTF) => resolve(gltf),
        undefined,
        (error: Error) => reject(error)
      );
    });

    const model = gltf.scene.children[0];
    model.scale.setScalar(3)
    // Опционально: настройте масштаб, позицию и вращение модели
    console.log(model);
    // add helper box around the model
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    model.position.y += size.y / 4;
    model.position.z -= 0.25;

    const wrapper = new THREE.Group();

    wrapper.add(model);
    wrapper.rotateX(-Math.PI / 2);
    // Назначаем тип для идентификации
    wrapper.userData = { type: 'store' };

    return wrapper;
  } catch (error) {
    console.error('Ошибка при загрузке модели:', error);
    return null;
  }
};
