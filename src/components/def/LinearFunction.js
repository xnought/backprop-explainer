import React, { Component } from "react";
import {
	Typography,
	Slider,
	Box,
	Card,
	CardContent,
	CardActions,
} from "@material-ui/core";

class LinearFunction extends Component {
	constructor(props) {
		super(props);
		this.state = {
			input: 0,
			output: 0,
		};
		this.compute = this.compute.bind(this);
	}
	compute(input) {
		const linfunc = (x) => 2 * x + 1;
		const output = linfunc(input);
		this.setState({ input, output });
	}
	componentDidMount() {
		this.compute(34);
	}

	render() {
		return (
			<Box display="flex">
				<Box minWidth={300}>
					<Card variant="outlined">
						<CardContent>
							<Slider
								value={this.state.input}
								onChange={(e, n) => {
									this.compute(n);
								}}
								color="secondary"
							></Slider>
							<Typography variant="h5">
								f(
								<Typography color="secondary" variant="inline">
									{this.state.input}
								</Typography>
								) = 2(
								<Typography color="secondary" variant="inline">
									{this.state.input}
								</Typography>
								) + 1 ={" "}
								<Typography
									style={{ color: "#8db600" }}
									variant="inline"
								>
									{this.state.output}
								</Typography>
							</Typography>
						</CardContent>
					</Card>
				</Box>
			</Box>
		);
	}
}

export default LinearFunction;
