import React, { Component } from "react";
import "../d3.css";
import * as d3 from "d3";

class AnimatedScatterPlot extends Component {
	plotPoints(node, formattedPoints, select) {
		/* Now need to plot said data */
		node.selectAll("circle")
			.data(formattedPoints)
			.enter()
			.append("circle")
			.attr("cx", (d) => d.x)
			.attr("cy", (d) => d.y)
			.attr("r", (_, i) => (i === select ? 5 : 2))
			.style("fill", (_, i) => (i === select ? "#4BA3C3" : "grey"));
	}
	/* This will plot the real line and have an animation till it gets into place */
	animateTruePredictions(svg, a) {
		svg.select("#epic")
			.transition()
			.duration(1000)
			.ease(d3.easeLinear)
			.attr("d", d3.line()(a))
			.attr("stroke", "blue")
			.attr("fill", "none");
	}

	/* This is where we initialize the Scatter Plot */
	async componentDidMount() {
		const { width, height, padding, start, stop, id } = this.props;
		const container = d3.select(`#animatedPlot${id}`);

		const svg = container
			.append("svg")
			.attr("width", width)
			.attr("height", height)
			.style("overflow", "visible");
		svg.append("rect")
			.attr("width", width)
			.attr("height", height)
			.attr("class", "cord");
		let xScale = d3
			.scaleLinear()
			.domain([start, stop])
			.range([0, width - 2 * padding]);

		let yScale = d3
			.scaleLinear()
			.domain([start, stop])
			.range([height - 2 * padding, 0]);

		let xAxis = d3.axisBottom().scale(xScale);
		let yAxis = d3.axisRight().scale(yScale);
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
			.attr("id", "epic")
			.attr("stroke", "none")
			.attr("fill", "none");
	}
	a() {
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
			potential,
		} = this.props;

		let xScale = d3
			.scaleLinear()
			.domain([start, stop])
			.range([0, width - 2 * padding]);

		let yScale = d3
			.scaleLinear()
			.domain([start, stop])
			.range([height - 2 * padding, 0]);
		const svg = d3.select(`#animatedPlot${id}`).select("svg");
		let dataSet = [];
		for (let i = 0; i < X.length; i++) {
			dataSet.push({
				x: xScale(X[i]),
				y: yScale(y[i]),
			});
		}
		let realYhat = [];
		let zeroArray = [];
		let potentialYhat = [];
		for (let i = 0; i < X.length; i++) {
			const xNum = xScale(X[i]);
			realYhat.push([xNum, yScale(yhat[i])]);
			potentialYhat.push([xNum, yScale(potential[i])]);
			zeroArray.push([xNum, yScale(0)]);
		}
		svg.selectAll("circle").remove();
		this.plotPoints(svg, dataSet, select);
		if (this.props.status === "reset") {
			svg.select("#epic")
				.attr("id", "epic")
				.attr("stroke", "none")
				.attr("fill", "none");
		} else {
			if (this.props.status === "real") {
				/* This is how we plot the point */
				svg.select("#epic")
					.attr("d", d3.line()(zeroArray))
					.attr("stroke", "black")
					.attr("fill", "none");
				svg.select("#epic")
					.transition()
					.duration(750)
					.attr("d", d3.line()(realYhat));
			} else if (this.props.status === "pred") {
				svg.select("#epic")
					.attr("d", d3.line()(realYhat))
					.attr("stroke", "orangered")
					.attr("fill", "none");
				svg.select("#epic")
					.transition()
					.duration(750)
					.attr("d", d3.line()(potentialYhat));
			}
		}
	}
	shouldComponentUpdate() {
		return !this.props.shouldNotRender;
	}

	render() {
		this.a();
		const { id } = this.props;
		return <div id={`animatedPlot${id}`}></div>;
	}
}

export default AnimatedScatterPlot;
