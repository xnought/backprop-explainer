import React, { Component } from "react";
import "./d3.css";
import * as d3 from "d3";

class Loss extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	componentDidMount() {
		const container = d3.select("#sweet");
		const height = 100;
		const width = 300;
		const padding = 0;
		let xScale = d3
			.scaleLinear()
			.domain([0, -1])
			.range([0, width - 2 * padding]);

		let yScale = d3
			.scaleLinear()
			.domain([0, 1])
			.range([height - 2 * padding, 0]);
		const svg = container
			.append("svg")
			.attr("width", width)
			.attr("height", height)
			.style("overflow", "visible");

		svg.append("rect")
			.attr("width", width)
			.attr("height", height)
			.attr("class", "cord");
		let xAxis = d3.axisBottom().scale(xScale);
		let yAxis = d3.axisRight().scale(yScale);
		svg.append("g")
			.attr("class", "axis")
			.attr("id", "x")
			.attr("transform", `translate(0,${height - 2 * padding})`)
			.call(xAxis);

		svg.append("g")
			.attr("class", "axis")
			.attr("id", "y")
			.attr("transform", "translate(" + (width - 2 * padding) + ",0)")
			.call(yAxis.ticks(0));
		svg.append("path")
			.attr("id", "line")
			.attr("stroke", "none")
			.attr("fill", "none");
		//svg.append("text").attr("x", 1).attr("y", -5).text("loss:");
	}
	componentDidUpdate() {
		const { lossArray, loss } = this.props;
		const height = 100;
		const width = 300;
		const start = 0;
		const stop = lossArray.length - 1;
		const padding = 0;
		let xScale = d3
			.scaleLinear()
			.domain([start, stop])
			.range([0, width - 2 * padding]);

		let lossMin = d3.min(lossArray);
		let lossMax = d3.max(lossArray);
		let yScale = d3
			.scaleLinear()
			.domain([lossMin, lossMax])
			.range([height - 2 * padding, 0]);
		const svg = d3.select("#sweet").select("svg");
		let a = [];
		for (let i = 0; i < lossArray.length; i++) {
			a.push([xScale(i), yScale(lossArray[i])]);
		}

		let xAxis = d3.axisBottom().scale(xScale);
		let yAxis = d3.axisRight().scale(yScale);
		svg.select("#x")
			.attr("transform", `translate(0,${height - 2 * padding})`)
			.call(xAxis.ticks(5));

		svg.select("#y")
			.attr("transform", "translate(" + (width - 2 * padding) + ",0)")
			.call(yAxis.ticks(5));
		svg.select("#line")
			.attr("d", d3.line()(a))
			.attr("stroke", "#F50257")
			.attr("fill", "none");
	}
	render() {
		return <div id="sweet"></div>;
	}
}

export default Loss;
