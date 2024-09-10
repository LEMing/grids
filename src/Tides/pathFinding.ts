import Tile from './HexGrid/Tile.ts';

// Функция для поиска соседей в шестиугольной системе координат
const getNeighbors = (tile: Tile, allTiles: Tile[]): Tile[] => {
  const neighbors: Tile[] = [];
  const directions = [
    { q: 1, r: 0 },
    { q: -1, r: 0 },
    { q: 0, r: 1 },
    { q: 0, r: -1 },
    { q: 1, r: -1 },
    { q: -1, r: 1 }
  ];

  directions.forEach(direction => {
    const neighbor = allTiles.find(t =>
      t.hexCoordinates.q === tile.hexCoordinates.q + direction.q &&
      t.hexCoordinates.r === tile.hexCoordinates.r + direction.r
    );
    if (neighbor) neighbors.push(neighbor);
  });

  return neighbors;
};

// Манхэттенское расстояние (шестиугольная система)
const heuristic = (a: Tile, b: Tile) => {
  return Math.max(
    Math.abs(a.hexCoordinates.q - b.hexCoordinates.q),
    Math.abs(a.hexCoordinates.r - b.hexCoordinates.r),
    Math.abs(a.hexCoordinates.s - b.hexCoordinates.s)
  );
};

export const findPath = (startTile: Tile, endTile: Tile, allTiles: Tile[]): Tile[] => {
  const openSet: Tile[] = [startTile];
  const cameFrom = new Map<Tile, Tile>();

  const gScore = new Map<Tile, number>();
  const fScore = new Map<Tile, number>();

  allTiles.forEach(tile => {
    gScore.set(tile, Infinity);
    fScore.set(tile, Infinity);
  });

  gScore.set(startTile, 0);
  fScore.set(startTile, heuristic(startTile, endTile));

  while (openSet.length > 0) {
    openSet.sort((a, b) => (fScore.get(a) || Infinity) - (fScore.get(b) || Infinity));
    const current = openSet.shift() as Tile;

    if (current === endTile) {
      // Восстанавливаем путь
      const path: Tile[] = [];
      let temp: Tile | undefined = current;
      while (temp) {
        path.push(temp);
        temp = cameFrom.get(temp);
      }
      return path.reverse();
    }

    const neighbors = getNeighbors(current, allTiles); // Используем координаты для нахождения соседей
    for (const neighbor of neighbors) {
      const tentativeGScore = (gScore.get(current) || Infinity) + 1; // Для соседей расстояние всегда 1
      if (tentativeGScore < (gScore.get(neighbor) || Infinity)) {
        cameFrom.set(neighbor, current);
        gScore.set(neighbor, tentativeGScore);
        fScore.set(neighbor, tentativeGScore + heuristic(neighbor, endTile));
        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        }
      }
    }
  }

  return []; // Если пути нет
};
