/* 
	Donny Bertucci: @xnought
	Summary: 
		File that brings everything together
*/

import React, { Component } from "react";
import headerTitleSVG from "./headerTitle.svg";
import ReactGa from "react-ga";
import { BackpropTool, Explanation, Acknowledge } from "./components/exports";
import { Element } from "react-scroll";

class App extends Component {
	componentDidMount() {
		/* Counting pageviews, probobaly shouldve just made my own API */
		ReactGa.initialize(`${process.env.REACT_APP_GAID}`);
		ReactGa.pageview("/");
	}
	render() {
		const header = (
			<div>
				<img
					src={headerTitleSVG}
					alt={"header with title"}
					width="100%"
				/>
			</div>
		);
		return (
			<div>
				{header}
				<Explanation />
				<Element name="mainTool">
					<BackpropTool />
				</Element>
				<Element name="acknowledgements">
					<Acknowledge />
				</Element>
				<br />
			</div>
		);
	}
}

export default App;
