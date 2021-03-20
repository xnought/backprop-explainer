/* Imports from other files */
import React from "react";
import { $, $$ } from "./Typeset";
import {
	Box,
	Button,
	Typography,
	Fab,
	Tooltip,
	Card,
	CardContent,
} from "@material-ui/core";
import { Help, PlayArrow } from "@material-ui/icons";
import { Nav } from "./Nav";
import { Element } from "react-scroll";
import SubTool from "./SubTool";
import LinearScatter from "./LinearScatter";
import NestedFunction from "./NestedFunction";
/* Asset imports */
import nnPNG from "./assets/nn.png";
import scaledGIF from "./assets/scaled.gif";
import forwardSVG from "./assets/forward.svg";
import backwardSVG from "./assets/backward.svg";

/* Functional Component */
const Explanation = () => {
	const orange = "#FFA500";
	const blue = "#56A8C7";
	/* Link Component that can be reused */
	const link = (href, content) => (
		<Button
			size="small"
			style={{ color: orange }}
			href={href}
			target="_blank"
			rel="noopener noreferrer"
		>
			{content}
		</Button>
	);

	const definiton = (word, desc) => (
		<Tooltip
			style={{
				backgroundColor: "#ed3d78",
				color: "black",
			}}
			title={
				<Card>
					<CardContent>{desc}</CardContent>
				</Card>
			}
			placement="top"
			arrow
		>
			{word}
		</Tooltip>
	);

	/* Topic formatted component */
	const topic = (title) => (
		<Typography variant="h3">
			<b>{title}</b>
		</Typography>
	);
	/* SubTopic formatted component */
	const subtopic = (title) => <Typography variant="h4">{title}</Typography>;

	/* Explanation paper */
	const paper = (
		<div>
			<br />
			{topic("Jump to a check point")}
			<Typography variant="h6">
				If you want to skip ahead, click on a checkpoint. Otherwise,
				click <b>Article</b> or scroll to the start of the article.
			</Typography>
			<Nav />
			<Element name="article">{topic("Introduction")}</Element>
			<Typography variant="h6">
				Most people abstract the idea of backpropagation when learning
				neural networks because it is by far the most notation heavy
				part. The goal of this article is to build an intuition for
				backpropagation in the context of how neural networks "learn."
				By marrying explanation, notation, and interactive tools, the
				aim is to get a understanding of the foundations.
			</Typography>
			<br />
			{topic("Backpropagation on One Neuron")}
			{subtopic("Getting Started")}
			<Typography variant="h6">
				The goal in a neural network, or any optimization problem for
				that matter, is to lower and minimize whatever{" "}
				{definiton(
					<span>loss</span>,
					<Typography variant="body1">
						Error between predicted values {$("\\hat{y}")} and true
						values {$("y")}
					</Typography>
				)}{" "}
				function we define. For this article, we will be performing
				regression and using mean squared error loss{" "}
				{definiton(
					<span>MSE</span>,
					<Box>
						<Typography variant="h6">
							{$$(
								"\\text{MSE} = \\frac{1}{J}\\sum_{i = 1}^{J}(\\hat{y_i} - y_i)^2"
							)}
						</Typography>
						<Typography variant="body1">
							<b>Input Variables</b>
							<br />
							length of data {$("J")}
							<br />
							index {$("i")}
							<br />
							predicted values {$("\\hat{y}")}
							<br />
							true values {$("y")}
						</Typography>
					</Box>
				)}
				.
			</Typography>
			<Typography variant="h6">
				Before hitting the calculus, tune the{" "}
				{definiton(
					<span>weight and bias on one neuron</span>,
					<Box>
						<Typography variant="h6">
							{$$("\\text{neuron}(x) = w_0x + b ")}
						</Typography>
						<Typography variant="body1">
							<b>Neuron as a Function</b>
							<br />
							input {$("x")}
							<br />
							output {$("\\text{neuron}(x)")}
							<br />
							<b>Tunable Parameters</b>
							<br />
							weight {$("w_0")}
							<br />
							bias {$("b")}
						</Typography>
					</Box>
				)}{" "}
				by sliding the sliders under <b>Manual Best Fit</b>. By
				observing changes in the <em style={{ color: "red" }}>loss</em>,
				try to make it reach 0. When you feel like you've lowered the{" "}
				<em style={{ color: "red" }}>loss</em> enough (or need some
				help), press the{" "}
				<Button
					disabled={true}
					size="small"
					variant="contained"
					style={{
						backgroundColor: "#155676",
						color: "white",
					}}
				>
					Click to reveal the graph
				</Button>{" "}
				button below.
			</Typography>
			<br />
			<Element name="structMan">
				<LinearScatter />
			</Element>
			<br />
			{subtopic("Reflection")}
			<Typography variant="h6">
				<b>
					The intuiton and logic from the exercise above, is the
					foundation for what backpropagation and optimization is and
					aims to achieve.
				</b>
			</Typography>
			<Typography variant="h6">
				&emsp;&emsp;&emsp;&emsp;When you start to change the weight, you
				observe where the loss moves, if it moves up, you move the
				weight the other direction to lower the loss. This, without the
				math, is the main principle behind guaging the rate of change
				and optimizing a nerual network.{" "}
				<b>Let's apply this method of thinking!</b>
			</Typography>
			<br />
			{subtopic("Defining Backpropagation")}
			<Typography variant="h6">
				First to get the{" "}
				{definiton(
					<span>instantaneous rate of change</span>,
					<Box>
						<Typography style={{ color: blue }} variant="h6">
							{$$("\\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}")}
						</Typography>
						<Typography variant="h6" style={{ color: orange }}>
							{$$("\\frac{df}{dx}")}
						</Typography>

						<Typography style={{ color: blue }} variant="body1">
							Limit definition of derivative of {$("f(x)")} with
							respect to {$("x")}
						</Typography>
						<Typography style={{ color: orange }} variant="body1">
							Notation for derivative of {$("f(x)")} with respect
							to {$("x")}
						</Typography>
					</Box>
				)}
				(derivative), we get our point of interest and another point
				that is infinitely close and calculate slope, this can be
				visualized as a tangent line at the point of interest for a
				function with one variable like {$("f(x)")}.
			</Typography>
			<Typography variant="h6">
				&emsp;&emsp;&emsp;&emsp;In the context of our one neuron neural
				network, we can compose the whole network as a nested function
				{$$("\\text{loss}(\\text{neuron}(x,w,b),y)")}
			</Typography>
			<Typography variant="h6">
				Since want to tune the parameters weight {$("w")} and bias{" "}
				{$("b")}, we want to know how each parameters will affect the
				loss, or in other words, the{" "}
				{definiton(
					<span>partial derivative</span>,
					<Box>
						<Typography style={{ color: blue }} variant="h6">
							{$$(
								"\\lim_{h \\to 0} \\frac{f(x + h, y) - f(x,y)}{h}"
							)}
						</Typography>
						<Typography variant="h6" style={{ color: orange }}>
							{$$("\\frac{\\partial f}{\\partial x}")}
						</Typography>
						<Typography style={{ color: blue }} variant="body1">
							Limit definition of partial derivative of{" "}
							{$("f(x,y)")} with respect to {$("x")}
						</Typography>
						<Typography style={{ color: orange }} variant="body1">
							Notation for partial derivative of {$("f(x,y)")}{" "}
							with respect to {$("x")}
						</Typography>

						<Typography style={{ color: blue }} variant="h6">
							{$$(
								"\\lim_{h \\to 0} \\frac{f(x, y + h) - f(x,y)}{h}"
							)}
						</Typography>

						<Typography variant="h6" style={{ color: orange }}>
							{$$("\\frac{\\partial f}{\\partial y}")}
						</Typography>

						<Typography style={{ color: blue }} variant="body1">
							Limit definition of partial Derivative of{" "}
							{$("f(x,y)")} with respect to {$("y")}
						</Typography>
						<Typography style={{ color: orange }} variant="body1">
							Notation for partial derivative of {$("f(x,y)")}{" "}
							with respect to {$("y")}
						</Typography>
					</Box>
				)}
				. of loss with respect to each parameter, also called the{" "}
				{definiton(
					<span>gradient</span>,
					<Box>
						<Typography variant="h6">
							{$$(
								"\\nabla f(x,y) = \\begin{bmatrix} \\frac{\\partial f}{\\partial x} \\\\[4pt] \\frac{\\partial f}{\\partial y} \\\\ \\end{bmatrix}"
							)}
						</Typography>
					</Box>
				)}
				. After we compute the gradient from getting all the derivatives
				backwards, we will have the direction of steepest{" "}
				<em>ascent</em> on the loss function. But we want to lower loss,
				therefore we use the opposite direction to get the direction of
				steepest descent, to perform{" "}
				{definiton(
					<span>gradient descent</span>,
					<Box>
						<Typography variant="body2">
							{$(
								"\\text{param} := \\text{param} -lr \\cdot \\frac{\\partial \\text{loss}}{\\partial \\text{param}}"
							)}
						</Typography>
						<Typography variant="caption">
							Since the gradient of the loss will be the direction
							of steepest <em>ascent</em>, by going the opposite
							direction, we go in the direction of steepest{" "}
							<em>descent</em>. Learning rate lr then decides how
							large of a step in the direction of steepest descent
							would like.
						</Typography>
					</Box>
				)}
				.
			</Typography>
			<Typography variant="h4">
				{$$(
					"\\nabla \\text{loss} = \\begin{bmatrix} \\frac{ \\partial \\text{loss}}{\\partial w} \\\\[4pt] \\frac{ \\partial \\text{loss}}{\\partial b} \\\\ \\end{bmatrix}"
				)}
			</Typography>

			<Typography variant="h6">
				In order to calculate these derivatives we must use the chain
				rule due to the nested nature of neural networks.
			</Typography>
			<Typography variant="h6">
				<b>Below is a color coded example of the chain rule.</b>
			</Typography>
			<Typography variant="h6">
				Start by sliding the slider and notice how the output is the
				input to the next function and so forth.{" "}
				<b>Then read the explanation below</b>.
			</Typography>
			<Box display="flex" justifyContent="center">
				<Box>
					<NestedFunction />
				</Box>
			</Box>
			<br />
			<Typography variant="h6">
				Suppose we wanted to see how the{" "}
				<em style={{ color: "#F50257" }}>pink</em> affects the{" "}
				<em style={{ color: blue }}>blue</em>. We should start at{" "}
				<em style={{ color: blue }}>blue</em>, then
				<ol>
					<li>
						observe how <em style={{ color: orange }}>orange</em>{" "}
						affects <em style={{ color: blue }}>blue</em>{" "}
					</li>
					<li>
						observe how <em style={{ color: "#8db600" }}>green</em>{" "}
						affects <em style={{ color: orange }}>orange</em>
					</li>
					<li>
						observe how <em style={{ color: "#F50257" }}>pink</em>{" "}
						affects <em style={{ color: "#8db600" }}>green</em>
					</li>
				</ol>
				By chaining those values together, we get how the{" "}
				<em style={{ color: "#F50257" }}>pink</em> affects the{" "}
				<em style={{ color: blue }}>blue</em>.
			</Typography>
			<br />
			<Typography variant="h6">
				This logic applied to our one neuron neural network looks like
			</Typography>
			<Typography variant="h6">
				{$$(
					"\\frac{ \\partial \\text{loss}}{\\partial w} = \\frac{ \\partial \\text{loss}}{\\partial \\text{neuron}} \\frac{ \\partial \\text{neuron}}{\\partial w} "
				)}
				{$$(
					"\\frac{ \\partial \\text{loss}}{\\partial b} = \\frac{ \\partial \\text{loss}}{\\partial \\text{neuron}} \\frac{ \\partial \\text{neuron}}{\\partial b} "
				)}
			</Typography>
			<Typography variant="h6">
				These chains can be broken up into more intermediate derivatives
				all the way down to their primatives (basis of
				{link(
					"https://en.wikipedia.org/wiki/Automatic_differentiation",
					"automatic differentiation"
				)}
				). <b>The main takeaway</b> is that we first observe how the
				neuron output affected the loss output{" "}
				{$(
					" \\frac{ \\partial \\text{loss}}{\\partial \\text{neuron}}"
				)}
				, but then we need to explain how the neuron output was affected
				by the parameter{" "}
				{$(
					" \\frac{ \\partial \\text{neuron}}{\\partial \\text{parameter}}"
				)}{" "}
				and can combine these to observe how the paramter affected the
				loss{" "}
				{$(
					" \\frac{ \\partial \\text{loss}}{\\partial \\text{parameter}}"
				)}
				. And notice how we compute these derivatives going backward,
				which has the added benefit of reusing values computed in the
				forward propagation.
			</Typography>
			<br />
			{subtopic("Concrete Example")}
			<Typography variant="h6">
				Let's go through a concrete example of a forward and backward
				pass. We will define the input as {$("x_0 = 2.1")}, the weight
				as {$("w_0 = 1")}, and the bias as {$("b = 0")}. This is just
				one training example.
			</Typography>
			<img width="100%" src={forwardSVG} />
			<Typography variant="h6">
				Now we can go backwards and compute partial derivatives with the
				chain rule to get the gradient {$("\\nabla \\text{loss}")}
			</Typography>
			<img width="100%" src={backwardSVG} />
			<Typography variant="h6">
				{$$("\\frac{\\partial \\text{loss}}{\\partial w_0} = -7.98")}
				{$$("\\frac{\\partial \\text{loss}}{\\partial b} = -3.8")}
			</Typography>
			<Typography variant="h6">
				Then, we update the parameters to opposite gradient to descend
				loss ( ), in this case learning rate is {$("\\text{lr} = 0.01")}
				{$$(
					"w_0 := w_0 - \\text{lr} \\cdot \\frac{\\partial \\text{loss}}{\\partial w_0} = (1) - (0.01) \\cdot (-7.98) = 1.0798"
				)}
				{$$(
					"b := b - \\text{lr} \\cdot \\frac{\\partial \\text{loss}}{\\partial b} = (0) - (0.01) \\cdot (-3.8) = 0.038 "
				)}
				Re calculate forward pass with new weight and bias
				{$$("\\text{loss} = ((1.0798)(2.1) + 0.038) - 4)^2 = 2.87")}
			</Typography>
			<Typography variant="h6">
				Total loss savings of {$("3.61 - 2.87 = 0.74")}
			</Typography>
			<br />
			{subtopic("See it in Action")}
			<Typography variant="h6">
				To see the what we just did (forward, backward, update) on more
				data and on the entire batch as opposed to a single training
				example, press{" "}
				<Fab
					style={{
						background: "#175676",
						color: "white",
					}}
					size="small"
				>
					{<PlayArrow />}
				</Fab>{" "}
				to start the training process under <b>Auto Best Fit</b>. Watch
				how as the line gets better fit, the red dot descends the loss
				contour.
			</Typography>
			<Element name="structLin">
				<SubTool />
			</Element>
			<br />
			{topic("Scaling up Neurons and Layers")}
			{subtopic("The Changes")}
			<Typography variant="h6">
				To fit more interesting data that is not linear, we need to add
				complexity to vary output, but still maintain differentiability
				so we can tune the parameters. We can do this by adding
				activation functions to each neuron, and by adding more neurons
				in a specific way.
			</Typography>

			<Typography variant="h6">
				Here is an example of a neural network with one inputs, 2 hidden
				layers (each neuron has ReLU activation in these layers), and
				one output neuron.
			</Typography>
			<Box display="flex" justifyContent="center">
				<Box>
					<img src={nnPNG} />
				</Box>
			</Box>
			<Typography variant="h6">
				the output of each neuron is fed into the neurons of the next
				layer and so forth. This produces a very nested function with
				many more weights and biases for us to tune.
			</Typography>

			<br />
			{subtopic("The Process")}
			<Typography variant="h6">
				<ol>
					<li>Forward propagation resulting in an output and loss</li>
					<li>
						Backward propagation using the chain rule to compute the
						gradient
					</li>
					<li>Descend the loss by performing gradient descent</li>
				</ol>
			</Typography>
			<Typography variant="h6">
				The process doesn't change from the single neuron example! Since
				the network is deeper, we have to calculate more derivatives
				going backwards and have to tune more parameters with gradient
				descent, but the logic stays the same.
			</Typography>

			<Typography variant="h6">
				A great way to visualize backpropagation in a large network is
				with vertial arrows representing the{" "}
				{$(
					"-\\frac{\\partial \\text{loss}}{\\partial \\text{activation} }"
				)}
				: which direction we need to nudge the neuron output in order to
				lower loss. In the example, we use the original definiton of
				stochastic gradient descent and only use one training example.
			</Typography>

			<img width="100%" src={scaledGIF} />
			<Typography variant="h4">Now you try!</Typography>
			<br />
			<Typography variant="h4">
				<b>Backprop Tool</b> Quick Start
			</Typography>
			<Typography variant="h6">
				<ol>
					<li>
						Press{" "}
						<Fab
							style={{
								background: "#175676",
								color: "white",
							}}
							size="small"
						>
							<PlayArrow />
						</Fab>{" "}
						to start training
					</li>
					<li>
						Then press{" "}
						<Button variant="contained" size="small">
							EPOCH
						</Button>{" "}
						to see backpropagation animation
					</li>
					<li>
						To go back to fitting mode click{" "}
						<Button variant="contained" size="small">
							EPOCH
						</Button>{" "}
						again
					</li>
				</ol>
			</Typography>
			<Typography variant="h6">
				<b>If you need help, click on a </b>
				<Help style={{ color: "#FFA500" }} />{" "}
				<b>to reveal extra descriptions</b>
			</Typography>
			<br />
		</div>
	);

	return (
		<Box justifyContent="center" display="flex">
			<Box maxWidth="60%">{paper}</Box>
		</Box>
	);
};
export default Explanation;
