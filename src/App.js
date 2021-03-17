import React, { Component } from "react";
import headerSvg from "./header.svg";
import headerTitleSVG from "./headerTitle.svg";
import ReactGa from "react-ga";
import { MainTool, Explanation } from "./components/exports";
import { Typography, Button, Box } from "@material-ui/core";
import { Element } from "react-scroll";

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
				<img src={headerTitleSVG} width="100%" />
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
				<Element name="mainTool">
					<MainTool />
				</Element>
				{acks}
			</div>
		);
	}
}

export default App;
