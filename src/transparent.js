import * as tf from "@tensorflow/tfjs";

export default class Dense {
	constructor(nNeurons, nInputs) {
		this.weights = tf.randomNormal([nNeurons, nInputs]);
		this.biases = tf.zeros([nNeurons, 1]);
	}
	R = (x) => tf.relu(x);
	G = async (x) => tf.grad(await this.R);
}
