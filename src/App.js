import React, { Component } from "react";
import { Bar, MainTool } from "./components/exports";

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		return (
			<div>
				<Bar title={"Backpropogation Explainer"} />
				<MainTool />
			</div>
		);
	}
}

export default App;
