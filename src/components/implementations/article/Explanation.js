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
/* Asset imports */
import scaledGIF from "./assets/scaled.gif";
import forwardSVG from "./assets/forward.svg";
import backwardSVG from "./assets/backward.svg";
import tanPNG from "./assets/tan.png";

/* Functional Component */
const Explanation = () => {
	/* Link Component that can be reused */
	const link = (href, content) => (
		<Button
			size="small"
			color="primary"
			href={href}
			target="_blank"
			rel="noopener noreferrer"
		>
			{content}
		</Button>
	);
	/* Google colab link button to be reused if I ever add google colab notebooks */
	const colab = (href) => (
		<a href={href}>
			<img
				src="https://colab.research.google.com/assets/colab-badge.svg"
				alt="Open In Colab"
			/>
		</a>
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

	const orange = "#FFA500";
	const blue = "#56A8C7";
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
				visualized as a{" "}
				{definiton(
					<span>tangent line</span>,
					<Box>
						<img src={tanPNG} width="100%" />
					</Box>
				)}{" "}
				at the point of interest.
			</Typography>
			<Typography variant="h6">
				&emsp;&emsp;&emsp;&emsp;In the context of our one neuron neural
				network, we can compose the whole network as a nested function
				(input {$("x")} into {$("\\text{neuron}(x) = wx+b")}; output of
				neuron {$("\\text{neuron}(x)")} is input as {$("\\hat{y}")} into
				loss function{" "}
				{$("\\text{loss}(\\hat{y},y) = \\sum(\\hat{y} - y)^2")}; output
				of loss function is the loss).
				{$$("\\text{loss}(\\text{neuron}(x,w,b),y)")}
			</Typography>
			<Typography variant="h6">
				And since we want to tune the parameters weight {$("w")} and
				bias {$("b")}, we want how they will affect the loss, or in
				other words, the{" "}
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
				)}{" "}
				of loss with respect to each parameter, also called the{" "}
				{definiton(
					<span>gradient</span>,
					<Box>
						<Typography variant="h6">
							{$$(
								"\\nabla f(x,y) = \\begin{bmatrix} \\frac{\\partial f}{\\partial x} \\\\ \\frac{\\partial f}{\\partial y} \\\\ \\end{bmatrix}"
							)}
						</Typography>
					</Box>
				)}
				.
			</Typography>
			<Typography variant="h6">
				{$$("\\frac{ \\partial \\text{loss}}{\\partial w}")}
				{$$("\\frac{ \\partial \\text{loss}}{\\partial b}")}
			</Typography>
			<Typography variant="h6">
				In order to calculate these derivatives we must use the chain
				rule due to the nested nature of neural networks.
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
				Even this chain can be broken up into more primatives (basis of
				{link(
					"https://en.wikipedia.org/wiki/Automatic_differentiation",
					"automatic differentiation"
				)}
				), but as long as you get that we are gauging rate of change,
				where to see how loss was affected by a parameter we first ask
				how the output of neuron affected its value, then go back and
				ask how the parameter affected the neuron output, then you know
				the foundations for what is going on in the chain rule and, in
				this case, backpropagation.
			</Typography>
			<br />
			{subtopic("Concrete Example")}
			<Typography variant="h6">
				Let's go through a concrete example of a forward and backward
				pass. We will define the input as {$("x_0 = 2.1")}, the weight
				as {$("w_0 = 1")}, and the bias as {$("b = 0")}. This is just
				one training example, in reality we would have more data.
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
				Reassign the parameters to opposite gradient to descend loss, in
				this case learning rate is {$("\\text{lr} = 0.01")}
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
				to start the training process under <b>Auto Best Fit</b>.
			</Typography>
			<Element name="structLin">
				<SubTool />
			</Element>
			Now you understand how the logic and intuition of backpropagation
			and how neural networks learn, but what about neural networks with
			more neurons?
			<br />
			{topic("Scaling up Neurons and Layers")}
			{subtopic("The Changes")}
			<Typography variant="h6">
				Scaling up to more neurons and layers. Doing backward
				propagation on one neuron is not difficult and can produce great
				results when fitting linear data. But as we want to process more
				non linear data, we have to increase complexity to vary the
				output and create more parameters that we can tune. We do this
				by adding layers of neurons where all the outputs of one layer
				are the inputs to the next, essentially a very nested function
				where inputs are distributed to all functions. This is the
				simple intuition in scaling up to more neurons and more layers.
				Other than this we also use an activation function, ReLU in our
				case, to introduce non linearity to the linear nature of each
				neuron while also introducing a point of deactivation. This
				point of deactivation is simply 0, which removes the impact of
				that neuron on updating parameters allowing for certain neurons
				to “fire” while others don't change at all depending on input.
			</Typography>
			<br />
			{subtopic("The Process")}
			<Typography variant="h6">
				First we define the network, we push our inputs through the
				model (forward propagation), then we calculate how each
				parameter in the network affects the loss (backward
				propagation), then we update the parameters with gradient
				descent. Notice how this is the same process as the one neuron
				network. THE PROCESS DOESNT CHANGE. We have to do more backward
				calculations, more chain rule, but that process does not change
				either.
			</Typography>
			<img width="100%" src={scaledGIF} />
			<Typography variant="h6">
				Above is an exaple of a forward pass, backward pass and update.
				Notice the orange arrows that represent{" "}
				{$(
					"-\\frac{\\partial \\text{activation}}{\\partial \\text{loss}}"
				)}
				, which tells us which direction the activation of neuron should
				be nudged to lower loss.
			</Typography>
			<Typography variant="body2">
				In this training example we use the original definiton of SGD
				(stochastic gradient descent) and only use one training example
				(batch size 1).
			</Typography>
			<br />
			{topic("Conclusion")}
			<br />
			{subtopic("Closing Statement")}
			<Typography variant="h6">
				By the end, I hope you gained some degree of intution for how
				and why we perform backproagation in neural networks. Now if you
				come into contact with neural networks and things aren't working
				out don't simply throw more data at it like many do, instead
				think back to the logic and intuition or the processes that
				occur and you be able to solve your problems better and faster.
			</Typography>
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
							{<PlayArrow />}
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
		</div>
	);

	return (
		<Box justifyContent="center" display="flex">
			<Box maxWidth="60%">{paper}</Box>
		</Box>
	);
};
export default Explanation;
