/* 
	Donny Bertucci: @xnought
		Summary:
			This file generates the header contour svg
*/

//import React, { Component } from "react";
//import * as d3 from "d3";
//import { Typography } from "@material-ui/core";

//class Header extends Component {
//constructor(props) {
//super(props);
//this.state = { width: 2000, height: 1000 };
//}

//async componentDidMount() {
//let w = document.body.clientWidth;
//this.setState({ width: w, height: 500 });
//const { width, height } = await this.state;
//const svg = d3.select("#contourBackground").select("#contour");
//const darkness = -8;

//const data = {
//X: [0, 1, 2, 3, 4],
//y: [4, 3, 3, 1, 0],
//};
//let n = width,
//m = height,
//values = new Array(n * m);

//for (let j = 0.5, k = 0; j < m; ++j) {
//for (let i = 0.5; i < n; ++i, ++k) {
//values[k] = loss((i / n) * 10 - 5, (j / m) * 20);
//}
//}

//function loss(m, b) {
//let x = data.X,
//y = data.y;
//let summed = 0;
//for (let i = 0; i < data.X.length; i++) {
//summed += Math.pow(m * x[i] + b - y[i], 2);
//}
//return summed / (2 * x.length);
//}
//let thresholds = d3.range(darkness, 20, 1).map((i) => Math.pow(2, i));
//let color = d3.scaleSequentialLog(
//d3.extent(thresholds),
//d3.interpolateCool
//);
//const contours = d3.contours().size([n, m]).thresholds(thresholds)(
//values
//);
//svg.append("g")
//.attr("fill", "none")
//.selectAll("path")
//.data(contours)
//.join("path")
//.attr("fill", (d) => color(d.value))
//.attr("d", d3.geoPath());
//}
//render() {
//const { width, height } = this.state;
//return (
//<div id="contourBackground">
//<svg style={{ width, height }} id="contour"></svg>
//<Typography
//style={{
//position: "relative",
//bottom: 200,
//left: 100,
//color: "white",
//}}
//variant="h2"
//>
//<b>How Neural Networks Learn </b>
//</Typography>
//<Typography
//style={{
//position: "relative",
//bottom: 200,
//left: 100,
//color: "white",
//}}
//variant="h6"
//>
//Learn backpropogation and optimization with interactive
//tools
//</Typography>
//</div>
//);
//}
//}

import headerTitleSVG from "./assets/headerTitle.svg";

/* to reduce computation we will keep header fixed, might change this to the above code in the future */
const Header = () => (
	<div>
		<img src={headerTitleSVG} alt={"header with title"} width="100%" />
	</div>
);
export default Header;
