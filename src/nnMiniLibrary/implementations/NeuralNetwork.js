/* 
	Donny Bertucci: @xnought
	Summary: 
		This creates the definiton and implemntation of the neural network in a non vectorized more manual way 
		designed to show all the operations
	TODO: add the update that would update to the weights sgd style and compute forward once more to see difference
*/
import { Neuron } from "./Neuron";
import { MeanSquaredErrorLoss } from "./Loss";
export class NeuralNetwork {
	/* here we construct the Neuron model */
	constructor(shape, weights, biases) {
		this.model = [];
		this.loss = new MeanSquaredErrorLoss();
		this.shape = shape;

		/* HERE WE CONSTRUCT THE MODEL ON CLASS CREATION */
		for (let layer = 0; layer < weights.length; layer++) {
			let dense = [];
			for (let neuron = 0; neuron < weights[layer].length; neuron++) {
				dense.push(
					new Neuron(weights[layer][neuron], biases[layer][neuron])
				);
			}
			this.model.push(dense);
		}
	}
	/* Next are some helper functions */
	sum(array) {
		return array.reduce((a, b) => a + b);
	}
	add(array1, array2) {
		const array1Length = array1.length;
		const array2Length = array2.length;
		if (array2Length != array1Length) {
			console.error(
				`${array1Length} does not match ${array2Length}, so returned empty array`
			);
			return [];
		} else {
			let result = new Array(array1Length);
			for (let i = 0; i < array1.length; i++) {
				result[i] = array1[i] + array2[i];
			}
			return result;
		}
	}
	zeros(length) {
		let result = new Array(length);
		for (let i = 0; i < length; i++) {
			result[i] = 0;
		}
		return result;
	}
	dReLU(input) {
		return input > 0 ? 1 : 0;
	}
	dLinear(input) {
		return 1;
	}

	ReLU(input) {
		return Math.max(0, input);
	}

	linear(input) {
		return input;
	}

	/* 
		Purpose: to feed forward the entire layer
		@param input, label
		@store model, yhat, loss
	*/
	forward(input, label) {
		let inputs = [input];
		const lastLayer = this.model.length;
		const outputNeuron = 0;
		/* First iterate through each layer */
		for (let layer = 0; layer < lastLayer - 1; layer++) {
			/* Then iterate through each neuron in the layer */
			let outputs = [];
			for (let neuron = 0; neuron < this.model[layer].length; neuron++) {
				/* Then feed forward each individual neuron and push to output array */
				this.model[layer][neuron].forward(inputs, this.ReLU);
				outputs.push(this.model[layer][neuron].output);
			}

			/* Then outputs will be the inputs for the next layer */
			inputs = outputs;
		}
		this.model[lastLayer - 1][0].forward(inputs, this.linear);
		this.yhat = this.model[lastLayer - 1][outputNeuron].output;
		this.loss.forward(this.yhat, label);
	}
	/* 
		Purpose: to feed backward the entire model per layer
	*/
	backward() {
		const { sum, add, zeros } = this;
		this.loss.backward();
		let dValues = [this.loss.dInputs];
		const lastLayer = this.model.length;
		/* take care of output neuron */
		const outputNeuron = 0;
		this.model[lastLayer - 1][outputNeuron].backward(
			dValues[outputNeuron],
			this.dLinear
		);
		dValues = this.model[lastLayer - 1][outputNeuron].dInputs;
		//dValues = [this.model[lastLayer - 1][0].dInputsSum];
		/* Iterate backwards */
		//for (let layer = lastLayer - 2; layer >= 0; layer--) {
		///* First sum the dvalues */
		//dValue = sum(dValues);
		//dValues = [];
		////dValues = zeros(this.model[layer].length);
		//for (let neuron = 0; neuron < this.model[layer].length; neuron++) {
		//this.model[layer][neuron].backward(dValue, this.dReLU);
		////this.model[layer][neuron].backward(dValues[], this.dReLU);
		//dValues.push(this.model[layer][neuron].dInputsSum);
		////dValues = add(dValues, this.model[layer][neuron].dInputs)
		//}
		//}

		/* We are given the dInputs from the previous output neuron in the form [neurons] called dValues */

		/* We want to start the second to last layer */
		for (let layer = lastLayer - 2; layer >= 0; layer--) {
			let dInputs = zeros(this.model[layer][0].inputs.length);
			for (let neuron = 0; neuron < this.model[layer].length; neuron++) {
				this.model[layer][neuron].backward(dValues[neuron], this.dReLU);
				dInputs = add(dInputs, this.model[layer][neuron].dInputs);
			}
			dValues = dInputs; //we transfer the dInputs into dValues for the next layer back
		}
	}
	/* 
		Purpose: to update all the weights using gradient descent
		@param lr: learning rate
	*/
	update(lr) {
		/* First create the gradient descent */
		const gd = (weight, lr, dweight) => weight - lr * dweight;
		/* Iterate over the model */
		for (let layer = 0; layer < this.model.length; layer++) {
			for (let neuron = 0; neuron < this.model[layer].length; neuron++) {
				for (
					let i = 0;
					i < this.model[layer][neuron].dWeights.length;
					i++
				) {
					const newWeights = gd(
						this.model[layer][neuron].weights[i],
						lr,
						this.model[layer][neuron].dWeights[i]
					);
					const newBias = gd(
						this.model[layer][neuron].bias,
						lr,
						this.model[layer][neuron].dBias
					);

					/* Formally update the model weights */
					this.model[layer][neuron].weights[i] = newWeights;
					this.model[layer][neuron].bias[i] = newBias;
				}
			}
		}
	}

	throttleForward(neuron, layer, change, label) {
		/* First Change the value of the output of this neuron */
		const calcChange = this.model[layer][neuron].output + change;
		this.model[layer][neuron].output = calcChange;

		/* First construct the inputs for the next layer which is made out of the new outputs */
		let inputs = [];
		for (let n = 0; n < this.model[layer].length; n++) {
			inputs.push(this.model[layer][n].output);
		}

		const lastLayer = this.model.length;
		for (let l = layer + 1; l < lastLayer - 1; l++) {
			/* Then iterate through each neuron in the layer */
			let outputs = [];
			for (let n = 0; n < this.model[l].length; n++) {
				/* Then feed forward each individual neuron and push to output array */
				this.model[l][n].forward(inputs, this.ReLU);
				outputs.push(this.model[l][n].output);
			}

			/* Then outputs will be the inputs for the next layer */
			inputs = outputs;
		}
		this.model[lastLayer - 1][0].forward(inputs, this.linear);
		this.yhat = this.model[lastLayer - 1][0].output;
		this.loss.forward(this.yhat, label);
	}
}
