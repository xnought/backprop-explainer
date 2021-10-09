/* 
	Donny Bertucci: @xnought
	Summary: 
		This component renders the contour and a dot to represent where we are
*/
import React, { Component } from "react";
import * as d3 from "d3";
import "./line.css";

const redColor = "red";

function addAxes({
	node,
	xScale,
	yScale,
	width,
	height,
	ticks = 10,
	padding = 0,
}) {
	const xAxis = d3.axisTop().scale(xScale),
		yAxis = d3.axisLeft().scale(yScale);

	node.select("#xAxis-contour")
		.attr("class", "axis")
		.attr("transform", `translate(0,0)`)
		.call(xAxis.ticks(ticks));
	node.select("#yAxis-contour")
		.attr("class", "axis")
		.attr("transform", "translate(" - (width - 2 * padding) + ",0)")
		.call(yAxis.ticks(ticks));
}

function updateLines({
	node,
	m = [
		[0, 0],
		[0, 0],
	],
	b = [
		[0, 0],
		[0, 0],
	],
	stroke = "none",
	mStroke = stroke,
	bStroke = stroke,
}) {
	node.select("#m-line")
		.attr("x1", m[0][0])
		.attr("y1", m[0][1])
		.attr("x2", m[1][0])
		.attr("y2", m[1][1])
		.attr("class", "line")
		.attr("id", "m-line")
		.style("stroke", mStroke);

	node.select("#b-line")
		.attr("x1", b[0][0])
		.attr("y1", b[0][1])
		.attr("x2", b[1][0])
		.attr("y2", b[1][1])
		.attr("id", "b-line")
		.attr("class", "line")
		.style("stroke", bStroke);
}

function updateLossText(
	node,
	{
		x = 0,
		y = 0,
		hidden = true,
		text = "none",
		textColor = redColor,
		rectFillColor = "hsla(0, 0%, 100%, 0.5)",
	}
) {
	const rectX = x + 10;
	const rectY = y + 10;
	node.select("#loss-rect")
		.attr("x", rectX)
		.attr("y", rectY)
		.attr("width", 100)
		.attr("height", 30)
		.attr("fill", hidden ? "none" : rectFillColor)
		.attr("stroke", hidden ? "none" : textColor);
	node.select("#loss-text")
		.attr("x", rectX + 10)
		.attr("y", rectY + 20)
		.attr("fill", hidden ? "none" : textColor)
		.text(text);
}

const mTransform = (m, width) => width / 2 + (m / 10) * width;
const bTransform = (b, height) => (b / 20) * height;

class ContourLoss extends Component {
	constructor(props) {
		super(props);
		this.state = {
			width: 200,
			height: 200,
		};
		this.loss = this.loss.bind(this);
	}
	loss(m, b) {
		const { data } = this.props;
		let x = data.X,
			y = data.y;
		let summed = 0;
		for (let i = 0; i < data.X.length; i++) {
			summed += Math.pow(m * x[i] + b - y[i], 2);
		}
		return summed / (2 * x.length);
	}
	async componentDidMount() {
		const { width, height } = await this.state;
		const svg = d3.select("#divContour").select("#contour");
		const { data, darkness } = await this.props;
		let n = width,
			m = height,
			values = new Array(n * m);

		/* 
			this code below was adapted from
			d3-contour documentation examples
		*/
		const ms = [],
			bs = [];
		for (let j = 0.5, k = 0; j < m; ++j) {
			for (let i = 0.5; i < n; ++i, ++k) {
				const tempM = (i / n) * 10 - 5;
				const tempB = (j / m) * 20;

				ms.push(tempM);
				bs.push(tempB);

				const outputLoss = this.loss(tempM, tempB);
				values[k] = outputLoss;
			}
		}

		const msExtrema = d3.extent(ms);
		const bsExtrema = d3.extent(bs);
		const getMin = (extrema) => extrema[0];
		const getMax = (extrema) => extrema[1];

		let thresholds = await d3
			.range(darkness, 20, 1)
			.map((i) => Math.pow(2, i));
		let color = d3.scaleSequentialLog(
			d3.extent(thresholds),
			d3.interpolateCool
		);
		const contours = d3.contours().size([n, m]).thresholds(thresholds)(
			values
		);

		const xScale = d3
				.scaleLinear()
				.domain([getMin(msExtrema), getMax(msExtrema)])
				.range([0, width]),
			yScale = d3
				.scaleLinear()
				.domain([getMin(bsExtrema), getMax(bsExtrema)])
				.range([0, height]);

		addAxes({
			node: svg,
			height,
			width,
			xScale,
			yScale,
			padding: 0,
			ticks: 10,
		});
		svg.append("g")
			.attr("fill", "none")
			.selectAll("path")
			.data(contours)
			.join("path")
			.attr("fill", (d) => color(d.value))
			.attr("d", d3.geoPath());

		svg.append("line")
			.attr("x1", 0)
			.attr("y1", 0)
			.attr("x2", 0)
			.attr("y2", 0)
			.attr("id", "b-line")
			.style("stroke", "none");

		svg.append("line")
			.attr("x1", 0)
			.attr("y1", 0)
			.attr("x2", 0)
			.attr("y2", 0)
			.attr("id", "m-line")
			.style("stroke", "none");

		svg.append("circle")
			.attr("cx", width / 2)
			.attr("cy", 0)
			.attr("r", 5)
			.style("fill", "none")
			.style("stoke", "none");

		svg.append("rect").attr("id", "loss-rect");
		svg.append("text").attr("id", "loss-text");
		updateLossText(svg, { hidden: true });
	}
	componentDidUpdate() {
		const { width, height } = this.state;
		const { loss, ms, m, b, wColor, bColor } = this.props;
		const svg = d3.select("#divContour").select("#contour");
		if (loss == null) {
			svg.select("circle")
				.attr("cx", width / 2)
				.attr("cy", 0)
				.attr("r", 5)
				.style("fill", "none")
				.style("stroke", "none");

			updateLines({ node: svg });
			svg.select("#m-text").attr("fill", "#0000");
			svg.select("#b-text").attr("fill", "#0000");
			updateLossText(svg, { hidden: true });
			return;
		}
		if (loss < 1000) {
			const newM = mTransform(m, width),
				newB = bTransform(b, height);
			svg.select("circle")
				.transition()
				.duration(200 - ms)
				.attr("cx", newM)
				.attr("cy", newB)
				.attr("r", 4)
				.style("stroke", "white")
				.style("stroke-width", 3)
				.style("fill", redColor)
				.style("opacity", "1.0");

			svg.select("#m-text")
				.text(`w = ${m.toFixed(2)}`)
				.attr("x", newM)
				.attr("y", -20)
				.attr("fill", wColor)
				.style("font-weight", 500);
			svg.select("#b-text")
				.text(`b = ${b.toFixed(2)}`)
				.attr("x", -20)
				.attr("y", newB + 5)
				.attr("fill", bColor)
				.style("font-weight", 500);

			updateLines({
				node: svg,
				b: [
					[-15, newB],
					[newM, newB],
				],
				m: [
					[newM, -15],
					[newM, newB],
				],
				mStroke: d3.color(wColor).brighter(),
				bStroke: d3.color(bColor).brighter(),
			});
			updateLossText(svg, {
				hidden: false,
				text: `loss: ${loss.toFixed(3)}`,
				x: newM,
				y: newB,
			});
		}
	}
	render() {
		const { width, height } = this.state;
		return (
			<div
				id="divContour"
				style={{
					paddingLeft: "85px",
					paddingTop: "40px",
					overflow: "visible",
				}}
			>
				<svg
					style={{ width, height, overflow: "visible" }}
					id="contour"
				>
					<g id="xAxis-contour" />
					<g id="yAxis-contour" />
					<text id="m-text" style={{ textAnchor: "middle" }}></text>
					<text id="b-text" style={{ textAnchor: "end" }}></text>
				</svg>
			</div>
		);
	}
}

export default ContourLoss;
