/* 
	Donny Bertucci: @xnought
	Summary: 
		This component displays all the acknowledgements
*/

import React from "react";
import {
	Typography,
	Button,
	Box,
	IconButton,
	Divider,
} from "@material-ui/core";
import { Element } from "react-scroll";
import { GitHub } from "@material-ui/icons";
import { $ } from "./Typeset";

const link = (href, content, isPerson) => (
	<Button
		style={{ color: isPerson ? "#FFA500" : "#155676" }}
		href={href}
		target="_blank"
		rel="noopener noreferrer"
	>
		{content}
	</Button>
);

const Acknowledge = () => (
	<Box display="flex" justifyContent="center">
		<Box width="60%">
			<div style={{ marginTop: "50px" }} />
			<Element name="conclusion">
				<Typography variant="h3">Conclusion</Typography>
			</Element>
			<Divider />
			<div style={{ marginTop: "20px" }} />
			<Typography variant="h6">
				By building up knowledge starting from{" "}
				<b>one neuron (linear example)</b>, to{" "}
				<b>
					multiple neurons with activation functions (non-linear
					example)
				</b>
				, it becomes apparent that backpropagation is just our way to
				decide what parameters need to be updated. Unsurprisingly, this
				is salient when we want to tune the parameters to lower loss.
				<br />
				<br />
				Thankfully, Backpropagation is not just limited to these small
				examples, as far as neural networks reach, backpropagation will
				follow. Nowadays, no matter the problem, if there is data to
				learn from, someone will apply a neural network to it (for
				better or for worse). Incredibly, through a simple
				backpropagation algorithm, <i>learning</i> becomes possible.
			</Typography>

			<Typography variant="h3">Acknowledgements</Typography>
			<Divider />
			<br />
			<Typography variant="body1">
				{link(
					"https://playground.tensorflow.org/",
					"TensorFlow Playground",
					false
				)}
				by
				{link("https://smilkov.com/", "Daniel Smilkov", true)}
				{link("http://shancarter.com/", "Shan Carter", true)}
				<ul>
					<li>
						Inspiration for the representation of the neural network
					</li>
					<li>
						Adapted d3 code for the loss graph’s and best fit graphs
						axis scaling
					</li>
					<li>Adapted css code for the links keyframe animation</li>
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
				{link("https://www.3blue1brown.com/", "3Blue1Brown", true)}
				<ul>
					<li>
						Inspiration to use arrows to represent where to nudge
						outputs to lower loss
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
				{link("https://www.cc.gatech.edu/~dchau/", "Polo Chau", true)}
				<ul>
					<li>Model for what good animation look like</li>
					<li>Inspiration for the article format with components</li>
					<li>Inspiration for the name backprop explainer</li>
				</ul>
			</Typography>
			<br />
			<Typography variant="body1">
				{link(
					"https://distill.pub/2020/communicating-with-interactive-articles/",
					"Communicating with Interactive Articles",
					false
				)}
				{link("https://fredhohman.com/", "Fred Hohman", true)}
				{link("https://mathisonian.com/", "Matthew Conlen", true)}
				{link(
					"https://homes.cs.washington.edu/~jheer/",
					"Jeffrey Heer",
					true
				)}
				{link("https://www.cc.gatech.edu/~dchau/", "Polo Chau", true)}
				<ul>
					<li>Used colored labeling to toggle labels for notation</li>
				</ul>
			</Typography>
			<br />
			<Typography variant="h4">Who made this?</Typography>
			<Typography variant="body1">
				Created by
				{link("http://donnybertucci.com/", "Donald Bertucci", true)} and
				{link("http://minsuk.com/", "Minsuk Kahng", true)}.
			</Typography>
			<Typography variant="body1">
				{link("http://donnybertucci.com/", "Donald Bertucci", true)}is a
				freshman at Oregon State University. This work was done as part
				of the
				{link(
					"https://undergraduate.oregonstate.edu/research/programs/ursa-engage",
					"URSA Engage Program",
					false
				)}
				, an undergraduate research program for first and second year
				students, with the advice of Prof.
				{link("http://minsuk.com/", "Minsuk Kahng", true)}.
			</Typography>
			<Typography variant="h4">How was this made?</Typography>
			<Typography variant="body1">
				Made with{link("https://d3js.org/", "d3.js", false)}
				and
				{link("https://reactjs.org/", "react.js", false)}for interactive
				visualization components,
				{link("https://www.tensorflow.org/js", "tensorflow.js", false)}
				for neural network training and fast math operations, and
				{link("https://katex.org/", $("\\KaTeX"), false)}
				to render {$("\\LaTeX")} math equations.
			</Typography>
			<Typography variant="h4">Found any errors?</Typography>
			<Typography variant="body1">
				Please create an issue on
				<IconButton href="https://github.com/xnought/backprop-explainer">
					<GitHub />
				</IconButton>
				if you found an issue in the article, any of the components, or
				in the Backprop Explainer.
			</Typography>
			<br />
		</Box>
	</Box>
);

export default Acknowledge;
