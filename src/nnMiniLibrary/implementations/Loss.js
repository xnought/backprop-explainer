/* 
	Donny Bertucci: @xnought
	Summary: 
		exports the losses to be used for the neural network
		
*/
export class MeanSquaredErrorLoss {
	/* 
		Purpose: feed forward of the nerual network
		@param yhat, y
		@stores y, yhat, subStep, squareStep, output
	*/
	forward(yhat, y) {
		const subStep = yhat - y;
		const squareStep = (this.output = Math.pow(yhat - y, 2));

		this.subStep = subStep;
		this.squareStep = squareStep;
		this.output = squareStep;
	}
	/* 
		Purpose: feed backward of the nerual network
		@stores dInputs
	*/
	backward() {
		this.dInputs = 2 * this.subStep;
	}
}
