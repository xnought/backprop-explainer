import React, { Component } from "react";
import {
	Typography,
	Slider,
	Box,
	Card,
	CardContent,
	CardActions,
} from "@material-ui/core";

class NestedFunction extends Component {
	constructor(props) {
		super(props);
		this.state = {
			input: 0,
			output1: 0,
			output2: 0,
			output3: 0,
		};
		this.compute = this.compute.bind(this);
	}
	compute(input) {
		const linfunc = (x, w, b) => w * x + b;
		const relu = (x) => Math.max(0, x);

		const output1 = linfunc(input, 0.5, 1).toFixed(3);
		const output2 = linfunc(output1, 2.3, 0).toFixed(3);
		const output3 = linfunc(output2, -0.2, 0.1).toFixed(3);
		this.setState({ input, output1, output2, output3 });
	}
	componentDidMount() {
		this.compute(34);
	}

	render() {
		const { input, output1, output2, output3 } = this.state;
		const fixedInput = input.toFixed(3);
		const outputArr = [
			{ output: output1, color: "#8db600" },
			{ output: output2, color: "#FF8F00" },
			{ output: output3, color: "blue" },
		];
		return (
			<Box display="flex">
				<Box width={575}>
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
								) = 0.5(
								<Typography color="secondary" variant="inline">
									{fixedInput}
								</Typography>
								) + 1 ={" "}
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
								) = 2.3(
								<Typography
									style={{ color: "#8db600" }}
									variant="inline"
								>
									{this.state.output1}
								</Typography>
								) + 0 ={" "}
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
								) = -0.2(
								<Typography
									style={{ color: "#FF8F00" }}
									variant="inline"
								>
									{this.state.output2}
								</Typography>
								) + 0.1 ={" "}
								<Typography
									style={{ color: "blue" }}
									variant="inline"
								>
									{this.state.output3}
								</Typography>
							</Typography>
						</CardContent>
					</Card>
				</Box>
			</Box>
		);
	}
}

export default NestedFunction;
