/* 
	Donny Bertucci: @xnought
	Summary: 
		This is the class definiton and implmentation of Neuron for Nerual Network
*/
export class Neuron {
	constructor(weights, bias) {
		this.weights = weights;
		this.bias = bias;
	}
	/* Next functions are just helper functions for the operations */
	mult(array1, array2) {
		return array1.map((item, i) => {
			return item * array2[i];
		});
	}
	dMult(dvalues, oppositeParameter) {
		return this.mult(dvalues, oppositeParameter);
	}
	sum(array) {
		return array.reduce((a, b) => a + b);
	}
	dSum(dvalue, numInputs) {
		let dSumArray = [];
		for (let i = 0; i < numInputs; i++) {
			dSumArray.push(dvalue);
		}
		return dSumArray;
	}
	linear(input) {
		return input;
	}

	/* 
		Purpose: feed forward of single neuron
		@param: inputs, activation
		@store inputs, multStep, sumStep, actStep, output
	*/
	forward(inputs, activation) {
		/* Destructure the class values */
		const { weights, bias } = this;
		const { mult, sum } = this;
		/* propogate forward */
		const multStep = mult(inputs, weights);
		const sumStep = sum(multStep) + bias;
		const actStep = activation(sumStep);

		/* Save values */
		this.inputs = inputs;
		this.multStep = multStep;
		this.sumStep = sumStep;
		this.actStep = actStep;
		this.output = actStep;
	}

	/* 
		Purpose: feed backward of single neuron
		@param: dvalue, activation
		@store inputs, multStep, sumStep, actStep, output
	*/
	backward(dvalue, activation) {
		/* Destructure the class values */
		const { inputs, weights, actStep } = this;
		const { dSum, mult, sum } = this;
		/* propgate backwards */
		const dActStep = activation(actStep) * dvalue;
		const dSumStep = dSum(dActStep, inputs.length);
		const dBias = dActStep;
		const dWeights = mult(dSumStep, inputs);
		const dInputs = mult(dSumStep, weights);
		const dInputsSum = sum(dInputs);

		/* Save values */
		this.dvalue = dvalue;
		this.dActStep = dActStep;
		this.dSumStep = dSumStep;
		this.dBias = dBias;
		this.dWeights = dWeights;
		this.dInputs = dInputs;
		this.dInputsSum = dInputsSum;
	}
}
