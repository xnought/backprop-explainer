/* Imports from other files */
import React from "react";
import { $, $$ } from "./Typeset";
import { Box, Button, Typography, Fab } from "@material-ui/core";
import { Help, PlayArrow } from "@material-ui/icons";
import { Nav } from "./Nav";
import { Element } from "react-scroll";
import SubTool from "./SubTool";
import LinearScatter from "./LinearScatter";
/* Asset imports */
import scaledGIF from "./assets/scaled.gif";
import forwardSVG from "./assets/forward.svg";
import backwardSVG from "./assets/backward.svg";

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
			{topic("Introduction")}
			<Typography variant="h6">
				Most people abstract the idea of backpropagation when learning
				neural networks because it is by far the most notation heavy
				part. The goal of this article is to build an intuition for
				backpropagation in the context of how neural networks "learn."
				By marrying explanation, notation, and interactive tools, the
				heuristic is to get a deeper understanding of the foundation.
			</Typography>
			<Typography variant="h6">
				<b>
					If you want to skip ahead, click on a checkpoint. Otherwise,
					click the "Article", or scroll to the start of the article.
				</b>
			</Typography>
			<Nav />
			<Element name="article">
				{topic("Backpropagation on one Neuron")}
			</Element>
			<br />
			{subtopic("Getting Started")}
			<Typography variant="h6">
				Our goal in a neural network is to lower whatever loss function
				we define. For this article, we will be performing regression
				and using mean squared error loss (MSE).
			</Typography>
			{$$("\\text{MSE} = \\frac{1}{J}\\sum_{i=0}^{J}(\\hat{y} - y)^2")}
			<Typography variant="h6">
				Before hitting the calculus, try to lower loss the best you can
				by adjusting the weight and bias on this one neuron network.
				When you feel like you&rsquo;ve lowered the loss enough (or need
				some help), reveal the graph.
			</Typography>
			<br />
			<Element name="structMan">
				<LinearScatter />
			</Element>
			<br />
			{subtopic("Explanation")}
			<Typography variant="h6">
				The intuition from this one scenario essentially explains all of
				backpropagation and optimization. It is really that simple!
			</Typography>
			<Typography variant="h6">
				When you start to change the weight, you observe where the loss
				moves, if it moves up, you probably move the weight the other
				direction to lower the loss. This, without the math, is the main
				principle behind optimizing a nerual network.
			</Typography>
			<Typography variant="h6">
				The change you observed from the ouput of the loss function is
				the rate of change. For a more accurate instantaneous rate of
				change we essentially do the slope formula but have the change
				the second point approach 0. For Example,
				{$$(
					"\\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h} = \\frac{df}{dx}"
				)}
			</Typography>
			<Typography variant="h6">
				Where {$("\\frac{df}{dx}")} is the derivative of {$("f")} with
				respect to {$("x")}, or in plain english: how the output of{" "}
				{$("f")} is affected by the variable {$("x")}. In the context of
				our one neuron network, if I represent weight as {$("w_0")} bias
				as {$("b")}, the neuron as {$("n")} and mean squared error loss{" "}
				{$("\\text{MSE}")}
				{$$(
					"\\lim_{h \\to 0} \\frac{\\text{MSE}(n(w_0 + h,b)) - \\text{MSE}(n(w_0,b))}{h} = \\frac{\\partial \\text{MSE}}{\\partial w_0}"
				)}
				{$$(
					"\\lim_{h \\to 0} \\frac{\\text{MSE}(n(w_0,b+h)) - \\text{MSE}(n(w_0,b))}{h} = \\frac{\\partial \\text{MSE}}{\\partial b}"
				)}
			</Typography>
			<Typography variant="h6">
				Where {$("\\frac{\\partial \\text{MSE}}{\\partial w_0}")} is the
				partial derivative of {$("\\text{MSE}")} with respect to{" "}
				{$("w_0")} or in plain english: how the output of{" "}
				{$("\\text{MSE}")} is affected by the variable {$("w_0")}.
			</Typography>
			<Typography variant="h6">
				Where {$("\\frac{\\partial \\text{MSE}}{\\partial b}")} is the
				partial derivative of {$("\\text{MSE}")} with respect to{" "}
				{$("b")} or in plain english: how the output of{" "}
				{$("\\text{MSE}")} is affected by the variable {$("b")}.
			</Typography>
			<Typography variant="h6">
				Now we have a way to compute how each parameter affects the
				output loss {$("\\text{MSE}")}. Which is also called the
				gradient of {$("\\text{MSE}")}.And can use the intuiton we
				gained from the interactive exercise before, and use the partial
				derivatives of loss with respect to each parameter to tune those
				paramters into lowering the loss.
			</Typography>
			<Typography variant="h6">
				Backpropagation is the term we use to describe the calculuating
				of the partial derivatives of with respect to each paramter
				because of the direction we travel to compute the derivatives.
				In essence, we first need to forward propagate: push the input
				through the network, get an output and loss. We then can go
				backwards and compute how each value in the forward pass
				affected the loss using the chain rule in calculus. The chain
				rule is very intutive and essentially takes into account how
				nested function affect each other.
				{$$(
					"\\frac{\\partial \\text{MSE}}{\\partial w_0} = \\frac{\\partial \\text{MSE}}{\\partial n(w_0,b)} \\cdot \\frac{\\partial n(w_0,b)}{\\partial w_0} "
				)}
				{$$(
					"\\frac{\\partial \\text{MSE}}{\\partial b} = \\frac{\\partial \\text{MSE}}{\\partial n(w_0,b)} \\cdot \\frac{\\partial n(w_0,b)}{\\partial b} "
				)}
			</Typography>
			<Typography variant="h6">
				Where how {$("\\frac{\\partial \\text{MSE}}{\\partial w_0}")}{" "}
				(how {$("w_0")} affects loss) is broken up into how the input of
				loss (the output of the neuron) affects loss compounded with how
				the weight affects the output of the neuron. Essnetially we are
				chaining rates of change due to the nested nature of the
				function.
			</Typography>
			<br />
			{subtopic("Concrete Example")}
			<Typography variant="h6">
				Let's go through a concrete example of a forward and backward
				pass. We will define the input as {$("x_0 = 2.1")}, the weight
				as {$("w_0 = 1")}, and the bias as {$("b = 0")}{" "}
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
			<Typography variant="h6">
				To see this in action over many epochs try out playing the next
				component which computes forward, backward and update per epoch.
				Automatically.
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
