import React, { Component } from "react";
import {
	Typography,
	Slider,
	Box,
	Card,
	CardContent,
	CardActions,
	Button,
} from "@material-ui/core";

class NestedFunction extends Component {
	constructor(props) {
		super(props);
		this.state = {
			input: 0,
			output1: 0,
			output2: 0,
			output3: 0,
			weights: [],
			biases: [],
		};
		this.compute = this.compute.bind(this);
		this.initParams = this.initParams.bind(this);
	}
	compute(input) {
		const { weights, biases } = this.state;
		const linfunc = (x, w, b) => w * x + b;
		const relu = (x) => Math.max(0, x);

		const output1 = linfunc(input, weights[0], biases[0]).toFixed(3);
		const output2 = linfunc(output1, weights[1], biases[1]).toFixed(3);
		const output3 = linfunc(output2, weights[2], biases[2]).toFixed(3);
		this.setState({ input, output1, output2, output3 });
	}
	genRandomArray(length) {
		let arr = new Array(length);
		for (let i = 0; i < arr.length; i++) {
			arr[i] = +Math.random().toFixed(2);
		}
		return arr;
	}
	async initParams() {
		const weights = this.genRandomArray(3);
		const biases = this.genRandomArray(3);
		this.setState({ weights, biases });
	}
	async componentDidMount() {
		await this.initParams();
		this.compute(34);
	}

	render() {
		const {
			input,
			output1,
			output2,
			output3,
			weights,
			biases,
		} = this.state;
		const fixedInput = input.toFixed(3);
		const outputArr = [
			{ output: output1, color: "#8db600" },
			{ output: output2, color: "#FF8F00" },
			{ output: output3, color: "blue" },
		];
		return (
			<Box display="flex">
				<Box width={580}>
					<Card variant="outlined">
						<CardContent>
							<Slider
								value={this.state.input}
								onChange={(e, n) => {
									this.compute(n);
								}}
								color="secondary"
							></Slider>

							<Box display="flex" justifyContent="center">
								<Box justifyContent="center">
									<svg width={500} height={64}>
										<path
											d={`M${36} 16, ${100} 16`}
											stroke={"#f50557"}
											strokeDasharray="25, 4"
											strokeWidth={3 * weights[0] + 0.2}
										></path>
										<text x={40} y={40} fill={"#f50557"}>
											{fixedInput}
										</text>
										{outputArr.map((d, i) => (
											<g>
												<rect
													x={100 + 100 * i}
													y={0}
													width={32}
													height={32}
													fill="lightgrey"
												></rect>
												<text x={111 + 100 * i} y={22}>
													{i + 1}
												</text>
												<path
													d={`M${132 + 100 * i} 16, ${
														200 + 100 * i
													} 16`}
													stroke={d.color}
													strokeDasharray="25, 4"
													strokeWidth={
														i < 2
															? 3 *
																	weights[
																		i + 1
																	] +
															  0.2
															: 1
													}
												></path>
												<text
													x={140 + 100 * i}
													y={40}
													fill={d.color}
												>
													{d.output}
												</text>
											</g>
										))}
									</svg>
								</Box>
							</Box>
							<Typography variant="h5">
								neuron1(
								<Typography color="secondary" variant="inline">
									{fixedInput}
								</Typography>
								) = {weights[0]}(
								<Typography color="secondary" variant="inline">
									{fixedInput}
								</Typography>
								) + {biases[0]} ={" "}
								<Typography
									style={{ color: "#8db600" }}
									variant="inline"
								>
									{this.state.output1}
								</Typography>
							</Typography>

							<Typography variant="h5">
								neuron2(
								<Typography
									style={{ color: "#8db600" }}
									variant="inline"
								>
									{this.state.output1}
								</Typography>
								) = {weights[1]}(
								<Typography
									style={{ color: "#8db600" }}
									variant="inline"
								>
									{this.state.output1}
								</Typography>
								) + {biases[1]} ={" "}
								<Typography
									style={{ color: "#FF8F00" }}
									variant="inline"
								>
									{this.state.output2}
								</Typography>
							</Typography>
							<Typography variant="h5">
								neuron3(
								<Typography
									style={{ color: "#FF8F00" }}
									variant="inline"
								>
									{this.state.output2}
								</Typography>
								) = {weights[2]}(
								<Typography
									style={{ color: "#FF8F00" }}
									variant="inline"
								>
									{this.state.output2}
								</Typography>
								) + {biases[2]}={" "}
								<Typography
									style={{ color: "blue" }}
									variant="inline"
								>
									{this.state.output3}
								</Typography>
							</Typography>
						</CardContent>
						<CardActions>
							<Button
								size="small"
								onClick={async () => {
									await this.initParams();
									//this.compute(this.state.input);
								}}
							>
								new Weights and biases
							</Button>
						</CardActions>
					</Card>
				</Box>
			</Box>
		);
	}
}

export default NestedFunction;
