/* 
	Donny Bertucci: @xnought
	Summary: 
		This file bringing everything together into the article
*/
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
	Divider,
} from "@material-ui/core";
import { Help, PlayArrow, ArrowBackIos } from "@material-ui/icons";

import { Element } from "react-scroll";
import AutoTool from "./AutoTool";
import ManualTool from "./ManualTool";
import NestedFunction from "./NestedFunction";
import ToggleForward from "./ToggleForward";
/* Assets imports */
import summarySVG from "./assets/summary.svg";
import forwardKeySVG from "./assets/diagramSVG/forward-key.svg";
import forwardNoKeySVG from "./assets/diagramSVG/forward.svg";
import forwardComputationSVG from "./assets/diagramSVG/forwardComputation.svg";
import backwardKeySVG from "./assets/diagramSVG/backward-key.svg";
import backwardNoKeySVG from "./assets/diagramSVG/backward.svg";
import backwardComputationSVG from "./assets/diagramSVG/backwardComputation.svg";
import contourExplain from "./assets/contour-explain.svg";
import gdExplain from "./assets/gd-explain.svg";

/* Functional Component */
const Explanation = () => {
	const orange = "#FFA500";
	const blue = "#56A8C7";

	const orangeEM = <em style={{ color: orange }}>orange</em>;
	const blueEM = <em style={{ color: blue }}>blue</em>;
	const greenEM = <em style={{ color: "#8db600" }}>green</em>;
	const pinkEM = <em style={{ color: "#F50257" }}>pink</em>;
	/* Link Component that can be reused */
	const link = (href, content) => (
		<Button
			size="small"
			style={{ color: "#155676" }}
			href={href}
			target="_blank"
			rel="noopener noreferrer"
		>
			{content}
		</Button>
	);

	const definition = (word, desc) => (
		<Tooltip
			style={{
				backgroundColor: "#56A8C7",
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
	const topic = (title) => <Typography variant="h3">{title}</Typography>;
	/* SubTopic formatted component */
	const subtopic = (title) => <Typography variant="h4">{title}</Typography>;

	/* Explanation paper */
	const paper = (
		<Box>
			<br />
			<Element name="article">{topic("Introduction")}</Element>
			<Divider />
			<br />
			<Typography variant="h6">
				<b>Backprop</b>agation is one of the most important concepts in
				neural networks, however, it is challenging for learners to
				understand its concept because it is the most notation heavy
				part. The goal of this article is to build an intuition for why
				and how we perform backpropagation. By marrying explanation,
				notation, and interactive tools, the aim is to get a
				understanding of the foundations. Note that throughout the
				article there will be{" "}
				{definition(
					<span>highlighted</span>,
					<Typography variant="h6">Example explanation</Typography>
				)}{" "}
				words that will give extra explanation on mouse over.
			</Typography>
			<br />
			<Element name="oneNeuron">
				{topic("Backprop on a Linear Problem")}
			</Element>

			<Divider />
			<Element name="getting">{subtopic("Getting Started")}</Element>
			<Typography variant="h6">
				The goal in a neural network, or any optimization problem for
				that matter, is to lower and minimize whatever{" "}
				{definition(
					<span>loss</span>,
					<Typography variant="body1">
						Error between predicted values {$("\\hat{y}")} and true
						values {$("y")}
					</Typography>
				)}{" "}
				function we define. For this article, we will be performing
				regression and using mean squared error loss{" "}
				{definition(
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
				{definition(
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
				by dragging the slider. By observing changes in the{" "}
				<em style={{ color: "red" }}>loss</em>, try to make it reach 0.
				When you feel like you've lowered the{" "}
				<em style={{ color: "red" }}>loss</em> enough (or need some
				help), press the{" "}
				<Button
					disabled={true}
					variant="outlined"
					size="small"
					style={{
						borderColor: "#175676",
						color: "#175676",
					}}
				>
					Click to reveal the graph
				</Button>{" "}
				button below.
			</Typography>
			<br />
			<Element name="structMan">
				<ManualTool />
			</Element>
			<br />
			{subtopic("Reflection")}
			<Typography variant="h6">
				<b>
					The intuition and logic from the exercise above, is the
					foundation for what backpropagation and optimization aims to
					achieve.
				</b>
			</Typography>
			<br />
			<Typography variant="h6">
				When you start to change the weight, you observe where the loss
				moves, if it moves up, you move the weight the other direction
				to lower the loss. This, without the math, is the main principle
				behind gauging the rate of change and optimizing a neural
				network. <b>Let's apply this method of thinking!</b>
			</Typography>
			<br />

			<Element name="definition">
				{subtopic("Defining Backpropagation")}
			</Element>
			<Typography variant="h6">
				First to get the{" "}
				{definition(
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
			<br />
			<Typography variant="h6">
				In the context of our one neuron neural network, we can compose
				the whole network as a nested function
				{$$("\\text{loss}(\\text{neuron}(x,w,b),y)")}
			</Typography>
			<Typography variant="h6">
				Since want to tune the parameters weight {$("w")} and bias{" "}
				{$("b")}, we want to know how each parameters will affect the
				loss, or in other words, the{" "}
				{definition(
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
				)}{" "}
				of loss with respect to each parameter, also called the{" "}
				{definition(
					<span>gradient</span>,
					<Box>
						<Typography variant="h6">
							{$$(
								"\\nabla f(x,y) = \\begin{bmatrix} \\frac{\\partial f}{\\partial x} \\\\[4pt] \\frac{\\partial f}{\\partial y} \\\\ \\end{bmatrix}"
							)}
						</Typography>
					</Box>
				)}
				. By computing the{" "}
				{definition(
					<span>gradient of loss</span>,
					<Typography variant="h6">
						{$$(
							"\\nabla \\text{loss} = \\begin{bmatrix} \\frac{ \\partial \\text{loss}}{\\partial w} \\\\[4pt] \\frac{ \\partial \\text{loss}}{\\partial b} \\\\ \\end{bmatrix}"
						)}
					</Typography>
				)}
				, we effectively have gauged how changing each parameter will
				affect the loss: the direction of steepest ascent. But we want
				to lower loss, therefore we use the opposite direction to get
				the direction of steepest descent, to perform{" "}
				{definition(
					<span>gradient descent</span>,
					<Box>
						<Typography variant="body1">
							{$(
								"\\text{param} := \\text{param} -lr \\cdot \\frac{\\partial \\text{loss}}{\\partial \\text{param}}"
							)}
						</Typography>
						<br />
						<Typography variant="body2">
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

			<br />
			<Typography variant="h6">
				This step is can be visualized by graphing out a loss function.
				Let's graph the Mean Squared error loss function with same data
				that will show up in a couple of paragraphs (stay tuned).{" "}
				<b>Below</b> is the result.
			</Typography>
			<center>
				<img
					src={contourExplain}
					alt="contour-explained"
					width="500px"
				/>
			</center>
			<Typography variant="h6">
				This plot shows us the different losses (shades from green to
				purple) and the corresponding weights (represented by the x
				axis) and biases (represented by the y axis) that create those
				losses. Notice how you can see the most optimal combination that
				would produce a loss of 0; that would be the place we want to
				eventually get to. You could also think of it as a physical hole
				where the colors represent depth. It is at the bottom of the
				hole where we want to reach (in white on the contour plot) in
				order to find the minimum loss.
			</Typography>
			<br />
			<Typography variant="h6">
				The idea of gradient descent for optimization is as follows{" "}
				<b>below</b> starting with <b>1)</b>
			</Typography>
			<br />

			<center>
				<img
					src={gdExplain}
					alt="gradient-descent-explained"
					width="75%"
				/>
			</center>
			<Typography variant="h6">
				And thats all there is to gradient descent! <b>1)</b> Start with
				a point, get the <b>2)</b> steepest ascent, <b>3)</b> flip it to
				reflect the steepest descent, then <b>4)</b> take a step in that
				direction. After doing this enough times, we will reach the
				minimum loss possible.
			</Typography>
			<br />

			<Typography variant="h6">
				The question then becomes, how can we calculate the gradient? To
				answer that, we need a bit of calculus to calculate all the
				derivatives with respect to the loss. Mainly you will need to
				use the <b>chain rule</b> from calculus because of the nature of
				the function we've composed.
			</Typography>
			<br />
			<br />
			<Typography variant="h6">
				{" "}
				Below is a color coded example of the <b>chain rule.</b> Start
				by sliding the slider and notice how the output is the input to
				the next function and so forth.{" "}
				<b>Then read the explanation below</b>.
			</Typography>
			<br />
			<Box display="flex" justifyContent="center">
				<Box>
					<NestedFunction />
				</Box>
			</Box>
			<br />
			<Typography variant="h6">
				<b>
					Suppose we wanted to see how {blueEM} was affected by{" "}
					{pinkEM}.
				</b>
				<br />
				First lets start at {blueEM}, then
				<ol>
					<li>
						observe how {blueEM} was affected by {orangeEM}
					</li>
					<li>
						observe how {orangeEM} was affected by {greenEM}
					</li>
					<li>
						observe how {greenEM} was affected by {pinkEM}
					</li>
				</ol>
				By chaining these observations together, we get how how {blueEM}{" "}
				was affected by {pinkEM}.
			</Typography>
			<br />
			<Typography variant="h6">
				<b>
					This logic applied to our one neuron neural network looks
					like
				</b>
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
				all the way down to their primitives (basis of automatic
				differentiation). <b>The main takeaway</b> is that we first
				observe how the loss output was affected by the neuron output{" "}
				{$(
					" \\frac{ \\partial \\text{loss}}{\\partial \\text{neuron}}"
				)}
				, then we observe how the neuron output was affected by each
				parameter{" "}
				{$(
					" \\frac{ \\partial \\text{neuron}}{\\partial \\text{parameter}}"
				)}{" "}
				and can chain these to observe how the loss was affected by the
				parameter{" "}
				{$(
					" \\frac{ \\partial \\text{loss}}{\\partial \\text{parameter}}"
				)}
				. Notice that we compute these derivatives going <b>backward</b>{" "}
				(where the term <b>back</b>propagation comes from), which has
				the added benefit of reusing values computed in the forward
				propagation (for more on this check out{" "}
				{link(
					"https://rufflewind.com/2016-12-30/reverse-mode-automatic-differentiation",
					"reverse mode automatic differentiation"
				)}
				).
			</Typography>
			<br />

			<Element name="concrete">{subtopic("Concrete Example")}</Element>
			<Typography variant="h6">
				Let's go through a concrete example of forward propagation, then
				an emphasis on backward propagation. The training example will
				be ({$("x = 2.1")}, {$("y = 4")}), the weight will be{" "}
				{$("w = 1")}, and the bias will be {$("b = 0")}. {$("\\hat{y}")}{" "}
				represents the neuron output and predicted value, and{" "}
				{$("\\text{loss}")} represents squared error loss.
			</Typography>
			<br />

			<ToggleForward
				title={<Typography variant="h5">Forward Overview</Typography>}
				noKeySVG={forwardNoKeySVG}
				keySVG={forwardKeySVG}
			/>
			<br />
			<Typography variant="h5">Forward Computation</Typography>
			<img
				src={forwardComputationSVG}
				width="100%"
				alt="forward computation"
			/>
			<br />
			<Typography variant="h6">
				Now we can go backward and compute partial derivatives with the
				chain rule to get the {$("\\nabla \\text{loss}")}
			</Typography>

			<br />

			<ToggleForward
				title={<Typography variant="h5">Backward Overview</Typography>}
				noKeySVG={backwardNoKeySVG}
				keySVG={backwardKeySVG}
			/>
			<br />

			<Typography variant="h5">Backward Computation</Typography>
			<img
				src={backwardComputationSVG}
				width="100%"
				alt="backward computation"
			/>

			<Typography variant="h5">
				{$$("\\frac{\\partial \\text{loss}}{\\partial w} = -7.98")}
				{$$("\\frac{\\partial \\text{loss}}{\\partial b} = -3.8")}
			</Typography>
			<Typography variant="h6">
				Then, we update the parameters with opposite gradient to descend
				loss, in this case learning rate is {$("\\text{lr} = 0.01")}
				{$$(
					"w := w - \\text{lr} \\cdot \\frac{\\partial \\text{loss}}{\\partial w} = (1) - (0.01) \\cdot (-7.98) = 1.0798"
				)}
				{$$(
					"b := b - \\text{lr} \\cdot \\frac{\\partial \\text{loss}}{\\partial b} = (0) - (0.01) \\cdot (-3.8) = 0.038 "
				)}
				<b>
					To see how well our tuned parameters do, let's do one more
					forward pass
				</b>
				{$$("\\text{loss} = ((1.0798)(2.1) + 0.038) - 4)^2 = 2.87")}
			</Typography>
			<Typography variant="h6">
				Total loss decrease of {$("3.61 - 2.87 = 0.74")}. Loss went
				down!
			</Typography>
			<br />
			<Element name="see1">{subtopic("See it in Action")}</Element>
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
					disabled={true}
				>
					{<PlayArrow fontSize="small" />}
				</Fab>{" "}
				to start the training process. Watch how as the line gets better
				fit, the loss decreases.
			</Typography>
			<Element name="structLin">
				<AutoTool />
			</Element>
			<br />
			<Element name="scaling">
				{topic("Backprop on a Non-Linear Problem")}
			</Element>

			<Divider />
			<Element name="changes">{subtopic("The Changes")}</Element>
			<Typography variant="h6">
				To fit more interesting data that is non-linear (e.g. sine wave
				or quadratic), we need to add complexity to vary output to make
				sure we are not constrained to only linear outputs. We can do
				this by adding more neurons per layer, more layers, and adding
				non-linearities (activation functions) to the outputs. If you
				think of our entire neural network as a function, then by adding
				more neurons and more layers we are creating a more nested
				function. Not only does this create more parameters that we can
				tune to vary the output, it also maintains the property of{" "}
				{definition(
					<span>differentiability</span>,
					<Box>
						<Typography variant="h6">
							The derivative exists for all inputs
						</Typography>
					</Box>
				)}
				: important so we can compute the gradient. And by adding
				non-linear activation functions with points of deactivation,
				certain neurons may have no effect on the output while others
				may become more activated, contributing to outputs that don't
				have to follow linear constraints. We will be using the{" "}
				{definition(
					<span>ReLU</span>,
					<Box>
						<Typography variant="h6">
							<b>Re</b>ctified <b>L</b>inear <b>U</b>nit
						</Typography>
						<Typography variant="h6">
							{$(
								" \\text{ReLU}(x) = \\left\\{ \\begin{array}{ll} 0 & x\\leq 0  \\\\ x & x > 0 \\\\ \\end{array} \\right. "
							)}
						</Typography>
					</Box>
				)}{" "}
				activation function in the hidden layers.
			</Typography>

			<Box display="flex" justifyContent="center">
				<Box>
					<img alt="summary" src={summarySVG} width="100%" />
				</Box>
			</Box>
			<Typography variant="h6">
				<b>Above</b> is an example of a neural network with one input,
				three hidden layers with eight neurons each, and one output
				neuron. The output of each neuron is fed into the neurons of the
				next layer and so forth (like a nested function). Each link
				represents a weight and a corresponding input into the
				respective neuron: notice how the more neurons we add, the more
				connections there are and the more parameters we can tune to get
				our desired output.
			</Typography>
			<br />
			<Element name="training">{subtopic("Training Process")}</Element>
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
				<b>
					The process doesn't change from the single neuron example!
				</b>{" "}
				Since the network is deeper, we have to calculate more
				derivatives going backwards and have to tune more parameters
				with gradient descent, but the logic stays the same.
			</Typography>

			<br />
			<Typography variant="h6">
				A great way to visualize backpropagation in a large network is
				with vertical arrows representing which direction we need to
				nudge the neuron output in order to lower loss:{" "}
				{$(
					"-\\frac{\\partial \\text{loss}}{\\partial \\text{activation} }"
				)}
				. In the <b>EPOCH Tool</b> below, you will be able to visualize
				all phases of a single epoch with an emphasis on{" "}
				<b>backpropagation</b>.
			</Typography>

			<br />
			<Element name="see2">
				<Typography variant="h4">
					Backprop Explainer Quick Start
				</Typography>
			</Element>
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
							disabled={true}
						>
							<PlayArrow fontSize="small" />
						</Fab>{" "}
						to start training
					</li>
					<li>
						Then press{" "}
						<Button
							variant="outlined"
							size="small"
							style={{
								borderColor: "#175676",
								color: "#175676",
							}}
							disabled={true}
						>
							Click to animate epoch #
						</Button>{" "}
						to see forward propagation, <b>backward propagation</b>,
						and update animation at the epoch #
					</li>
					<li>
						To go back to fitting mode click{" "}
						<Button
							variant="outlined"
							size="small"
							style={{
								borderColor: "#175676",
								color: "#175676",
							}}
							disabled={true}
						>
							<ArrowBackIos /> Go back to fitting
						</Button>{" "}
					</li>
				</ol>
			</Typography>
			<Typography variant="h6">
				<b> Click on </b>
				<Help variant="small" style={{ color: "#FFA500" }} />{" "}
				<b>to reveal extra descriptions</b>
			</Typography>
			<br />
		</Box>
	);

	return (
		<Box justifyContent="center" display="flex">
			<Box maxWidth="60%">{paper}</Box>
		</Box>
	);
};
export default Explanation;
