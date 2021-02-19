import react, { Component } from "react";
import style from "./d3.css";
import * as d3 from "d3";
class NN extends Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.initNeuralNetwork = this.initNeuralNetwork.bind(this);
	}
	initNeuralNetwork() {
		const height = 500;
		const width = 1000;
		const rw = 50;
		const rh = 50;
		const svg = d3
			.select("#nn")
			.append("svg")
			.attr("width", width)
			.attr("height", height);

		let start = { x: 50, y: 50 };
		let stop = { x: 500, y: 250 };

		const link = d3
			.linkHorizontal()
			.x((d) => d.x + rw / 2)
			.y((d) => d.y + rh / 2);
		var data1 = {
			source: {
				x: 0,
				y: 0,
			},
			target: {
				x: 500,
				y: 1000,
			},
		};
		var data = {
			source: start,
			target: stop,
		};

		//svg.append("path")
		//.attr("stroke", "blue")
		//.attr("fill", "none")
		//.attr("class", "edge")
		//.attr("d", link(data1));
		svg.append("path")
			.attr("stroke", "blue")
			.attr("fill", "none")
			.attr("class", "edge")
			.attr("d", link(data));

		svg.append("rect")
			.attr("x", start.x)
			.attr("y", start.y)
			.attr("width", rw)
			.attr("height", rh)
			.attr("class", "node");

		svg.append("rect")
			.attr("x", stop.x)
			.attr("y", stop.y)
			.attr("width", rw)
			.attr("height", rh)
			.attr("class", "node");
	}
	componentDidMount() {
		this.initNeuralNetwork();
	}
	render() {
		return <div id="nn"></div>;
	}
}

export default NN;
