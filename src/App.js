import React, { Component } from "react";
import { Bar, MainTool } from "./components/exports";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		const bar = <Bar title={"Backpropogation Explainer"} />;
		return (
			<div>
				<MainTool />
			</div>
		);
	}
}

export default App;
