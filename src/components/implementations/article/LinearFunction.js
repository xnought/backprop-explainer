import React, { Component } from "react";
import { $, $$ } from "./Typeset";
import { Typography, Slider, Box, Card, CardContent } from "@material-ui/core";

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
		const { input, output } = this.state;
		return (
			<Box display="flex">
				<Box minWidth={300}>
					<Card variant="outlined">
						<CardContent>
							<Slider
								value={input}
								onChange={(e, n) => {
									this.compute(n);
								}}
								color="secondary"
							></Slider>
							{$$(`f(${input}) = 2(${input}) + 1 = ${output}`)}
						</CardContent>
					</Card>
				</Box>
			</Box>
		);
	}
}

export default LinearFunction;
