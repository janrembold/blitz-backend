export const getDistanceBetweenCoordinates=(xA:number, yA:number, xB:number, yB:number):number =>{ 
	const xDiff = xA - xB; 
	const yDiff = yA - yB; 

	return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
}