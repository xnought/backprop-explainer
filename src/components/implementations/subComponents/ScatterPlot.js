/* 
	Donny Bertucci: @xnought
	Summary: 
		ScatterPlot.js plot the points and the line on the graph
*/
import React, { Component } from "react";
import "../d3.css";
import * as d3 from "d3";

class ScatterPlot extends Component {
	/* 
		plot the points using d3	
	*/
	plotPoints(node, formattedPoints, select) {
		/* Now need to plot said data */
		node.selectAll("circle")
			.data(formattedPoints)
			.enter()
			.append("circle")
			.attr("cx", (d) => d.x)
			.attr("cy", (d) => d.y)
			.attr("r", (_, i) => (i === select ? 5 : 2))
			.style("fill", (_, i) => (i === select ? "orange" : "grey"));
	}
	/* 
		Generate the d3 scales 	
		@return {xScale, yScale}	
	*/
	generateScales(start, stop, width, height, padding) {
		const xScale = d3
			.scaleLinear()
			.domain([start, stop])
			.range([0, width - 2 * padding]);
		const yScale = d3
			.scaleLinear()
			.domain([start, stop])
			.range([height - 2 * padding, 0]);
		return { xScale, yScale };
	}

	/* This is where we initialize the Scatter Plot */
	async componentDidMount() {
		/* destructure props */
		const { width, height, padding, start, stop, id } = this.props;
		/* set container and append svg */
		const container = d3.select(`#scatter${id}`);
		const svg = container
			.append("svg")
			.attr("width", width)
			.attr("height", height)
			.style("overflow", "visible");
		svg.append("rect")
			.attr("width", width)
			.attr("height", height)
			.attr("class", "cord");

		/* generate the scales */
		const { xScale, yScale } = this.generateScales(
			start,
			stop,
			width,
			height,
			padding
		);
		/* create axes */
		const xAxis = d3.axisBottom().scale(xScale);
		const yAxis = d3.axisRight().scale(yScale);
		/* intitialize all parts of the graph */
		svg.append("g")
			.attr("class", "axis")
			.attr("transform", `translate(0,${height - 2 * padding})`)
			.call(xAxis);
		svg.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(" + (width - 2 * padding) + ",0)")
			.call(yAxis);
		svg.append("line")
			.attr("x1", 0)
			.attr("y1", (height + 1) / 2)
			.attr("x2", width)
			.attr("y2", (height + 1) / 2)
			.attr("class", "split");
		svg.append("line")
			.attr("x1", (width + 1) / 2)
			.attr("y1", 0)
			.attr("x2", (width + 1) / 2)
			.attr("y2", height)
			.attr("class", "split");
		svg.append("path")
			.attr("id", "scatterline")
			.attr("stroke", "none")
			.attr("fill", "none");
	}
	componentDidUpdate() {
		const {
			width,
			height,
			padding,
			start,
			stop,
			X,
			y,
			yhat,
			id,
			select,
			duration,
		} = this.props;
		const { xScale, yScale } = this.generateScales(
			start,
			stop,
			width,
			height,
			padding
		);
		const svg = d3.select(`#scatter${id}`).select("svg");

		/* push data */
		let dataSet = [];
		let curve = [];
		for (let i = 0; i < X.length; i++) {
			dataSet.push({
				x: xScale(X[i]),
				y: yScale(y[i]),
			});
			curve.push([xScale(X[i]), yScale(yhat[i])]);
		}
		svg.selectAll("circle").remove();
		this.plotPoints(svg, dataSet, select);
		svg.select("#scatterline")
			.transition()
			.duration(duration)
			.attr("d", d3.line()(curve))
			.attr("stroke", "black")
			.attr("fill", "none");
	}

	render() {
		const { id } = this.props;
		return <div id={`scatter${id}`}></div>;
	}
}

export default ScatterPlot;
