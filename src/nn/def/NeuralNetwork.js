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
		const { sum } = this;
		this.loss.backward();
		let dValues = [this.loss.dInputs];
		const lastLayer = this.model.length;
		let dValue = sum(dValues);
		/* take care of output neuron */
		this.model[lastLayer - 1][0].backward(dValue, this.dLinear);
		dValues = [this.model[lastLayer - 1][0].dInputsSum];
		/* Iterate backwards */
		for (let layer = lastLayer - 2; layer >= 0; layer--) {
			/* First sum the dvalues */
			dValue = sum(dValues);
			dValues = [];
			for (let neuron = 0; neuron < this.model[layer].length; neuron++) {
				this.model[layer][neuron].backward(dValue, this.dReLU);
				dValues.push(this.model[layer][neuron].dInputsSum);
			}
		}
	}
}
