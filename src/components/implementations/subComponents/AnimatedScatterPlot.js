/* 
	Donny Bertucci: @xnought
	Summary: 
		AnimatedScatterPlot.js is a component that handles logic for animating change in the backward pass
*/
import React, { Component } from "react";
import "../d3.css";
import * as d3 from "d3";

class AnimatedScatterPlot extends Component {
	/* 
		plot points and handle for the selected point 
		@param node, formattedPoints, select
	*/
	plotPoints(node, formattedPoints, select) {
		const pointValue = { x: this.props.X[select], y: this.props.y[select] };
		const isSelected = (index, selectIndex) => index === selectIndex;
		const selectStyle = { color: "#4BA3C3", radius: 5 };
		const defaultStyle = { color: "grey", radius: 2 };

		/* Now need to plot said data */
		node.selectAll("circle")
			.data(formattedPoints)
			.enter()
			.append("circle")
			.attr("cx", (d) => d.x)
			.attr("cy", (d) => d.y)
			.attr("r", (_, i) =>
				isSelected(i, select) ? selectStyle.radius : defaultStyle.radius
			)
			.style("fill", (_, i) =>
				isSelected(i, select) ? selectStyle.color : defaultStyle.color
			);

		/* plots the selected coordinate */
		node.append("text")
			.attr("x", formattedPoints[select].x + 10)
			.attr("y", formattedPoints[select].y)
			.attr("fill", selectStyle.color)
			.attr("font-size", "12px")
			.text(`(${pointValue.x.toFixed(2)},${pointValue.y.toFixed(2)})`);
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

	/* 
		animates the change in line
	 */
	animateLineChange(node, color, array1, array2, duration) {
		node.attr("d", d3.line()(array1))
			.attr("stroke", color)
			.attr("fill", "none");
		node.transition().duration(duration).attr("d", d3.line()(array2));
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
		const { xScale, yScale } = this.generateScales(
			start,
			stop,
			width,
			height,
			padding
		);
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
			.attr("id", "scatterline")
			.attr("stroke", "none")
			.attr("fill", "none");
	}
	updateAll() {
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

		const { xScale, yScale } = this.generateScales(
			start,
			stop,
			width,
			height,
			padding
		);
		const svg = d3.select(`#animatedPlot${id}`).select("svg");
		let dataSet = [];
		let realYhat = [];
		let zeroArray = [];
		let potentialYhat = [];
		for (let i = 0; i < X.length; i++) {
			dataSet.push({
				x: xScale(X[i]),
				y: yScale(y[i]),
			});

			const xNum = xScale(X[i]);
			realYhat.push([xNum, yScale(yhat[i])]);
			potentialYhat.push([xNum, yScale(potential[i])]);
			zeroArray.push([xNum, yScale(0)]);
		}
		svg.selectAll("circle").remove();
		svg.selectAll("text").remove();
		const line = svg.select("#scatterline");
		this.plotPoints(svg, dataSet, select);
		if (this.props.status === "reset") {
			line.attr("id", "scatterline")
				.attr("stroke", "none")
				.attr("fill", "none");
		} else {
			if (this.props.status === "real") {
				this.animateLineChange(line, "black", zeroArray, realYhat, 750);
			} else if (this.props.status === "pred") {
				this.animateLineChange(
					line,
					"orangered",
					realYhat,
					potentialYhat,
					750
				);
			}
		}
	}
	componentDidUpdate() {
		this.updateAll();
	}
	shouldComponentUpdate() {
		return !this.props.shouldNotRender;
	}

	render() {
		const { id } = this.props;
		return <div id={`animatedPlot${id}`}></div>;
	}
}

export default AnimatedScatterPlot;
