export const getDistanceBetweenCoordinates = (xA: number, yA: number, xB: number, yB: number): number => {
  const xDiff = xA - xB;
  const yDiff = yA - yB;

  return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
};

export const getRoutingPointsTotalDistance = (routingPoints: [x: number, y: number][]) => {
  let distance = 0;
  const routeCount = routingPoints.length;

  for (let index = 1; index < routeCount; index++) {
    distance += getDistanceBetweenCoordinates(
      routingPoints[index - 1][0],
      routingPoints[index - 1][1],
      routingPoints[index][0],
      routingPoints[index][1],
    );
  }

  return distance;
};
