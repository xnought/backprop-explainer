import React, { Component } from "react";
import headerTitleSVG from "./headerTitle.svg";
import ReactGa from "react-ga";
import { MainTool, Explanation } from "./components/exports";
import { Typography, Button, Box, IconButton } from "@material-ui/core";
import { GitHub } from "@material-ui/icons";
import { Element } from "react-scroll";
import { Typeset } from "./components/exports";

class App extends Component {
	constructor(props) {
		super(props);
	}
	componentDidMount() {
		ReactGa.initialize("UA-192166007-1");
		ReactGa.pageview("/");
	}
	render() {
		const link = (href, content, isPerson) => (
			<Button
				style={{ color: isPerson ? "#56A8C7" : "#FFA500" }}
				href={href}
				target="_blank"
				rel="noopener noreferrer"
			>
				{content}
			</Button>
		);
		const header = (
			<div>
				<img src={headerTitleSVG} width="100%" />
			</div>
		);
		const acks = (
			<Box display="flex" justifyContent="center">
				<Box width="60%" marginTop={10}>
					<Typography variant="h4">
						<b>Acknowledgements</b>
					</Typography>
					<Typography variant="body1">
						{link(
							"https://playground.tensorflow.org/",
							"TensorFlow Playground",
							false
						)}
						by
						{link("https://smilkov.com/", "Daniel Smilkov", true)}
						{link("http://shancarter.com/", "shan carter", true)}
						<ul>
							<li>
								Inspiration for the representation of the neural
								network
							</li>
							<li>
								Adapted d3 code for the loss graph’s and best
								fit graphs axis scaling
							</li>
							<li>
								Adapted css code for the links keyframe
								animation
							</li>
						</ul>
					</Typography>
					<br />
					<Typography variant="body1">
						{link(
							"https://www.youtube.com/watch?v=Ilg3gGewQ5U",
							"What is backpropagation really doing?",
							false
						)}
						by
						{link(
							"https://www.youtube.com/channel/UCYO_jab_esuFRV4b17AJtAw",
							"3Blue1Brown",
							true
						)}
						<ul>
							<li>
								Inspiration to use arrows to represent where to
								nudge outputs to lower loss
							</li>
							<li>Inspiration for weights color scheme</li>
						</ul>
					</Typography>
					<br />
					<Typography variant="body1">
						{link(
							"https://poloclub.github.io/cnn-explainer/",
							"CNN explainer",
							false
						)}
						by
						{link("https://zijie.wang/", "Jay Wang", true)}
						{link(
							"https://www.linkedin.com/in/robert-turko/",
							"Robert Turko",
							true
						)}
						{link("https://oshaikh.com/", "Omar Shaikh", true)}
						{link("https://haekyu.com/", "Haekyu Park", true)}
						{link("http://nilakshdas.com/", "Nilaksh Das", true)}
						{link("https://fredhohman.com/", "Fred Hohman", true)}
						{link("https://minsuk.com/", "Minsuk Kahng", true)}
						{link(
							"https://www.cc.gatech.edu/~dchau/",
							"Polo Chau",
							true
						)}
						<ul>
							<li>
								Inspiration for the article format with
								components
							</li>
							<li>Inspiration for the name backprop explainer</li>
						</ul>
					</Typography>

					<br />
					<Typography variant="h4">
						<b>How was this made?</b>
					</Typography>
					<Typography variant="body1">
						Made with{link("https://d3js.org/", "d3.js", false)}
						and
						{link("https://reactjs.org/", "react.js", false)}for
						interactive visualization components,
						{link(
							"https://www.tensorflow.org/js",
							"tensorflow.js",
							false
						)}
						for neural network training and fast math operations,
						and
						{link(
							"https://katex.org/",
							Typeset.$("\\KaTeX"),
							false
						)}
						to render {Typeset.$("\\LaTeX")} math equations.
					</Typography>
					<br />
					<Typography variant="h4">
						<b>Found any errors?</b>
					</Typography>
					<Typography variant="body1">
						If you found in error in an explanation, equation, or in
						one of the interactive components please create an issue
						on Github
						<IconButton href="https://github.com/xnought/backprop-explainer">
							<GitHub />
						</IconButton>
					</Typography>
					<br />
					<Typography variant="h4">
						<b>Who made this?</b>
					</Typography>
					<Typography variant="body1">
						Created by
						{link(
							"http://donnybertucci.com/",
							"Donny bertucci",
							true
						)}
					</Typography>
					<Typography variant="body1">
						Project advised by
						{link("http://minsuk.com/", "Minsuk Kahng", true)}
					</Typography>
					<br />
				</Box>
			</Box>
		);
		return (
			<div>
				{header}
				<Explanation />
				<Element name="mainTool">
					<MainTool />
				</Element>
				{acks}
				<br />
			</div>
		);
	}
}

export default App;
