/* 
	Donny Bertucci: @xnought
	Summary: 
		Exports some tools that make it easier to deal with the data
*/

/* 
	Purpose: format the weight array given from tensorflow
	@param uweights (unformatted weights), shape
	@return layer (formated weights per layer)
*/
export function formatWeightArray(uweights, shape) {
	let layer = [];
	/* Increment over each layer l */
	for (let l = 0; l < uweights.length; l++) {
		/* First num in shape is input neuron which is why we skip here by adding 1 */
		let increment = shape[l + 1];
		let weightSet = [];
		/* Increment over each neuron */
		for (let t = 0; t < increment; t++) {
			let weights = [];
			/* Increment over each weight per neuron */
			for (let w = t; w < uweights[l].length; w += increment) {
				weights.push(uweights[l][w]);
			}
			weightSet.push(weights);
		}
		layer.push(weightSet);
	}
	return layer;
}

/* 
	Purpose: to turn a 2d array into the same array but fixed to a certian number of numbers/figures
	@param arr  (not fixed array), fixed
	@return arr (fixed array)
*/
export function toFunc2DArray(arr, fixed) {
	for (let i = 0; i < arr.length; i++) {
		for (let e = 0; e < arr[i].length; e++) {
			arr[i][e] = +arr[i][e].toFixed(fixed);
		}
	}
	return arr;
}

/* 
	Purpose: Flattens the array
	@param array
	@return flattenedArray
*/
export function flatten(array) {
	let flattendArray = [];
	for (let i = 0; i < array.length; i++) {
		for (let e = 0; e < array[i].length; e++) {
			flattendArray.push(array[i][e]);
		}
	}
	return flattendArray;
}

/* 
	Purpose: generate random integer from 0 to given paramter
	@param max
	@return Number [0,max)
*/
export function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}

/* 
	Purpose: turn tensor to array
	@param tensor 
	@return array
*/
export function tensorToArray(tensor) {
	return Array.from(tensor.dataSync());
}
