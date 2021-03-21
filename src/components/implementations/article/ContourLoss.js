import React, { Component } from "react";
import * as d3 from "d3";
class ContourLoss extends Component {
	constructor(props) {
		super(props);
		this.state = {
			width: 400,
			height: 400,
		};
	}
	async componentDidMount() {
		const { width, height } = await this.state;
		const svg = d3.select("#divContour").select("#contour");
		const { data, darkness } = await this.props;
		let n = width,
			m = height,
			values = new Array(n * m);

		for (let j = 0.5, k = 0; j < m; ++j) {
			for (let i = 0.5; i < n; ++i, ++k) {
				values[k] = loss((i / n) * 10 - 5, (j / m) * 20);
			}
		}

		function loss(m, b) {
			let x = data.X,
				y = data.y;
			let summed = 0;
			for (let i = 0; i < data.X.length; i++) {
				summed += Math.pow(m * x[i] + b - y[i], 2);
			}
			return summed / (2 * x.length);
		}
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
		svg.append("g")
			.attr("fill", "none")
			.selectAll("path")
			.data(contours)
			.join("path")
			.attr("fill", (d) => color(d.value))
			.attr("d", d3.geoPath());

		svg.append("circle")
			.attr("cx", width / 2)
			.attr("cy", 0)
			.attr("r", 5)
			.style("fill", "none")
			.style("stoke", "none");
	}
	componentDidUpdate() {
		const { width, height } = this.state;
		const { loss, ms, m, b } = this.props;
		const svg = d3.select("#divContour").select("#contour");
		if (loss == null) {
			svg.select("circle")
				.attr("cx", width / 2)
				.attr("cy", 0)
				.attr("r", 5)
				.style("fill", "none")
				.style("stroke", "none");
			return;
		}
		if (loss < 1000) {
			svg.select("circle")
				.transition()
				.duration(200 - ms)
				.attr("cx", width / 2 + (m / 10) * width)
				.attr("cy", (b / 20) * height)
				.attr("r", loss * 2 + 5)
				.style("fill", "red")
				.style("opacity", "0.5");
		}
	}
	render() {
		const { width, height } = this.state;
		return (
			<div id="divContour">
				<svg style={{ width, height }} id="contour"></svg>
			</div>
		);
	}
}

export default ContourLoss;
