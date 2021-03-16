import { Box, Card, CardContent, Slider, Button } from "@material-ui/core";
import React, { Component } from "react";
import { ScatterPlot } from "../../exports";
import { $ } from "./Typeset";
import * as tf from "@tensorflow/tfjs";

class LinearScatter extends Component {
	constructor(props) {
		super(props);
		this.state = {
			weight: -0.82,
			bias: -0.02,
			loss: 0,
			domain: [],
			range: [],
			line: [],
			show: false,
		};
	}
	//Define the loss function
	loss(y, y_pred, len) {
		const outputLoss = tf.tidy(() => {
			const yTensor = tf.tensor(y);
			const y_predTensor = tf.tensor(y_pred);
			const compute =
				(1 / (2 * len)) *
				tf.sum(tf.pow(tf.sub(y_predTensor, yTensor), 2)).dataSync()[0];
			return compute;
		});
		return outputLoss;
	}
	computeLine(weight, bias, domain) {
		const line = (X) => weight * X + bias;
		let output = new Array(domain.length);
		for (let i = 0; i < domain.length; i++) {
			output[i] = line(domain[i]);
		}
		return output;
	}
	zeros(length) {
		let array = new Array(length);
		for (let i = 0; i < length; i++) array[i] = 0;
		return array;
	}
	range(start, stop, increment) {
		let array = [];
		for (let i = start; i <= stop; i += increment) array.push(i);
		return array;
	}
	dataGenerator() {
		const initDomain = this.range(-1, 1, 0.1);
		const initRange = this.computeLine(0.65, -0.3, initDomain);
		const initLine = this.computeLine(
			this.state.weight,
			this.state.bias,
			initDomain
		);
		const loss = this.loss(initRange, initLine, initRange.length);
		this.setState({
			domain: initDomain,
			range: initRange,
			line: initLine,
			loss,
		});
	}
	componentDidMount() {
		this.dataGenerator();
	}
	render() {
		const width = 400;
		const { domain, range, bias, weight, line, loss, show } = this.state;
		return (
			<Box display="flex" justifyContent="center">
				<Box style={{ filter: `blur(${show ? 0 : 25}px)` }}>
					<ScatterPlot
						width={width}
						height={width}
						padding={0}
						start={-1}
						stop={1}
						X={domain}
						y={range}
						yhat={line}
						id={69}
						select={-1}
						duration={0}
					/>
				</Box>

				<Box marginLeft={7}>
					<Card variant="outlined">
						<CardContent>
							<h2>Manual Best Fit</h2>
							<p>
								Manually tune{" "}
								<em style={{ color: "#4050B5" }}>weight</em> and{" "}
								<em style={{ color: "#F50257" }}>bias</em> and
								try to reach a{" "}
								<em style={{ color: "red" }}>loss</em> of 0
							</p>
							<Slider
								value={weight}
								onChange={(e, n) => {
									const newLine = this.computeLine(
										weight,
										bias,
										domain
									);
									const loss = this.loss(
										range,
										newLine,
										range.length
									);
									this.setState({
										weight: n,
										line: newLine,
										loss,
									});
								}}
								min={-1}
								step={0.01}
								max={1}
								valueLabelDisplay="auto"
								color="primary"
							></Slider>
							<Slider
								value={bias}
								onChange={(e, n) => {
									const newLine = this.computeLine(
										weight,
										bias,
										domain
									);
									const loss = this.loss(
										range,
										newLine,
										range.length
									);
									this.setState({
										bias: n,
										line: newLine,
										loss,
									});
								}}
								min={-1}
								step={0.01}
								valueLabelDisplay="auto"
								max={1}
								color="secondary"
							></Slider>

							<h3>
								{$("\\text{neuron}(x) = ")}{" "}
								<em style={{ color: "#4050B5" }}>
									{$(`${weight}`)}
								</em>
								{$("x + ")}{" "}
								<em style={{ color: "#F50257" }}>
									{$(`${bias}`)}
								</em>
							</h3>
							<h3>
								MSE loss:{" "}
								{$(
									`\\frac{1}{J}\\sum_{i = 0}^J (\\hat{y} - y)^2 =`
								)}
								<em style={{ color: "darkred" }}>
									{" "}
									{$(`${loss.toFixed(7)}`)}
								</em>
							</h3>
							<Button
								size="small"
								variant="contained"
								style={{
									backgroundColor: "#155676",
									color: "white",
								}}
								onClick={() => {
									this.setState({ show: !this.state.show });
								}}
							>
								Click to Reveal Graph
							</Button>
						</CardContent>
					</Card>
				</Box>
			</Box>
		);
	}
}

export default LinearScatter;
