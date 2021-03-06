
export function distanceFrom(
  refPoint: { x: number; y: number },
  checkPoint: { x: number; y: number }
): number {
  const checkX = refPoint.x;
  const checkY = refPoint.y;
  return Math.floor(Math.sqrt(Math.pow(checkPoint.x - checkX, 2) + Math.pow(checkPoint.y - checkY, 2)));
}
