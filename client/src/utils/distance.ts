export const distanceToDisplay = (distance: number) =>
  distance > 1000 ? `${Math.round(distance / 100) / 10}km` : `${distance}m`;
