import React, { Component } from "react";
import headerSvg from "./header.svg";
import ReactGa from "react-ga";
import { MainTool, Explanation } from "./components/exports";
import { Typography } from "@material-ui/core";

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	componentDidMount() {
		ReactGa.initialize("UA-192166007-1");
		ReactGa.pageview("/");
	}
	render() {
		const mainTool = <MainTool />;
		const header = (
			<div>
				<img src={headerSvg} width="100%" />
				<Typography
					style={{
						position: "relative",
						bottom: 200,
						left: 100,
						color: "white",
					}}
					variant="h2"
				>
					<b>How Neural Networks Learn </b>
				</Typography>
				<Typography
					style={{
						position: "relative",
						bottom: 200,
						left: 100,
						color: "white",
					}}
					variant="h6"
				>
					Learn backpropogation and optimization with interactive
					tools
				</Typography>
			</div>
		);
		const acks = (
			<div>
				<h1>
					Reserve this space under the main tool for refereces, credit
					acknowledgements
				</h1>
			</div>
		);
		return (
			<div>
				{header}
				<Explanation />
				<MainTool />
				{acks}
				<h1>Nice</h1>
				<h1>Nice</h1>
				<h1>Nice</h1>
				<h1>Nice</h1>
				<h1>Nice</h1>
				<h1>Nice</h1>
				<h1>Nice</h1>
			</div>
		);
	}
}

export default App;
