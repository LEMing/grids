class HexTileCoordinates {
  public q: number;
  public r: number;
  public s: number;

  constructor(q: number, r: number) {
    this.q = q;
    this.r = r;
    this.s = -q - r;
    if (this.q + this.r + this.s !== 0) {
      throw new Error('Invalid hex coordinates: q + r + s must equal 0');
    }
  }

  // Метод для нахождения расстояния между тайлами
  distanceTo(other: HexTileCoordinates): number {
    return Math.max(
      Math.abs(this.q - other.q),
      Math.abs(this.r - other.r),
      Math.abs(this.s - other.s)
    );
  }

  // Метод для нахождения соседей
  getNeighbors(): HexTileCoordinates[] {
    const directions = [
      new HexTileCoordinates(1, 0),
      new HexTileCoordinates(-1, 0),
      new HexTileCoordinates(0, 1),
      new HexTileCoordinates(0, -1),
      new HexTileCoordinates(1, -1),
      new HexTileCoordinates(-1, 1)
    ];

    return directions.map(dir => new HexTileCoordinates(this.q + dir.q, this.r + dir.r));
  }
}

export default HexTileCoordinates;
