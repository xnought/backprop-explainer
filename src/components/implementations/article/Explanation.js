import React from "react";
import { $, $$ } from "./Typeset";
import LinearFunction from "./LinearFunction";
import NestedFunction from "./NestedFunction";
import { Box, Button, Card, CardContent, Typography } from "@material-ui/core";
import nnSVG from "./assets/nn.svg";
import forwardSVG from "./assets/forward.svg";
import backwardSVG from "./assets/backward.svg";
import LinearScatter from "./LinearScatter";
import SubTool from "./SubTool";
const Explanation = () => {
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
	const introduction = (
		<div>
			<Typography variant="h3">Table of Contents</Typography>
			<Button disabled={true} size="small" color="secondary">
				Color Legend:
			</Button>
			<Button size="small" style={{ pointerEvents: "none" }}>
				Section
			</Button>
			<Button
				size="small"
				color="primary"
				style={{ pointerEvents: "none" }}
			>
				Static Text
			</Button>
			<Button
				size="small"
				color="secondary"
				style={{ pointerEvents: "none" }}
			>
				Interactive Tool
			</Button>
			<ol>
				<li>
					<Button size="large">Introduction</Button>
				</li>
				<li>
					<Button size="large">backpropagation on one neuron</Button>
					<ol type="a">
						<li>
							<Button color="secondary" size="small">
								Manual Best Fit
							</Button>
						</li>
						<li>
							<Button color="primary" size="small">
								Explanation
							</Button>
						</li>
						<li>
							<Button color="primary" size="small">
								Math Example
							</Button>
						</li>
						<li>
							<Button color="secondary" size="small">
								Training Best Fit
							</Button>
						</li>
					</ol>
				</li>
				<li>
					<Button size="large">Scaling up</Button>
					<ol type="a">
						<li>
							<Button color="primary" size="small">
								Explanation
							</Button>
						</li>
						<li>
							<Button color="primary" size="small">
								Math Example
							</Button>
						</li>
						<li>
							<Button color="secondary" size="small">
								Full Neural Network Backpropagation Explainer
							</Button>
						</li>
					</ol>
				</li>
			</ol>
		</div>
	);

	const paper = (
		<div>
			<Typography variant="h3">Introduction</Typography>
			<p>
				Most people abstract the idea of backpropagation when learning
				neural networks because it is by far the most notation heavy
				part. The goal of this article is to marry the notation with
				some interactive tools to better understand a very important
				idea.
			</p>

			<p>
				Our goal in a neural network is to lower whatever loss function
				we define. For this article, we will be performing regression
				and using mean squared error loss (MSE).
			</p>
			{$$("\\text{MSE} = \\frac{1}{J}\\sum_{i=0}^{J}(\\hat{y} - y)^2")}

			<Typography variant="h3">Backpropogation on One Neuron</Typography>
			<p>
				Before hitting the calculus, try to lower loss the best you can
				by adjusting the weight and bias on this one neuron network.
				When you feel like you&rsquo;ve lowered the loss enough (or need
				some help), reveal the graph.
			</p>
			<br />
			<LinearScatter />
			<br />
			<p>
				The intuition from this one scenario essentially explains all of
				backpropagation and optimization. It is really that simple!
			</p>
			<p>
				When you start to change the weight, you observe where the loss
				moves, if it moves up, you probably move the weight the other
				direction to lower the loss. This, without the math, is the main
				principle behind optimizing a nerual network.
			</p>
			<p>
				The change you observed from the ouput of the loss function is
				the rate of change. For a more accurate instantaneous rate of
				change we essentially do the slope formula but have the change
				the second point approach 0. For Example,
				{$$(
					"\\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h} = \\frac{df}{dx}"
				)}
			</p>
			<p>
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
			</p>
			<p>
				Where {$("\\frac{\\partial \\text{MSE}}{\\partial w_0}")} is the
				partial derivative of {$("\\text{MSE}")} with respect to{" "}
				{$("w_0")} or in plain english: how the output of{" "}
				{$("\\text{MSE}")} is affected by the variable {$("w_0")}.
			</p>
			<p>
				Where {$("\\frac{\\partial \\text{MSE}}{\\partial b}")} is the
				partial derivative of {$("\\text{MSE}")} with respect to{" "}
				{$("b")} or in plain english: how the output of{" "}
				{$("\\text{MSE}")} is affected by the variable {$("b")}.
			</p>

			<p>
				Now we have a way to compute how each parameter affects the
				output loss {$("\\text{MSE}")}. Which is also called the
				gradient of {$("\\text{MSE}")}.And can use the intuiton we
				gained from the interactive exercise before, and use the partial
				derivatives of loss with respect to each parameter to tune those
				paramters into lowering the loss.
			</p>
			<p>
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
			</p>
			<p>
				Where how {$("\\frac{\\partial \\text{MSE}}{\\partial w_0}")}{" "}
				(how {$("w_0")} affects loss) is broken up into how the input of
				loss (the output of the neuron) affects loss compounded with how
				the weight affects the output of the neuron. Essnetially we are
				chaining rates of change due to the nested nature of the
				function.
			</p>

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
			<p>
				To see this in action over many epochs try out playing the next
				component which computes forward, backward and update per epoch.
				Automatically.
			</p>
			<SubTool />

			<h1>Scaling up to larger networks</h1>
			<p>
				When scaling up to more neurons with more layers, the principles
				stay the same. The only difference now is we are going further
				back with chain rule to calculate more derivatives.
			</p>
			<p>
				And to spice things up, we&rsquo;ll add the activation function
				ReLU to neurons on the hidden layers so we can fit some
				non-linear data as opposed to boring linear data.
			</p>
			<ul>
				<li>
					First feed the values through the network. Forward
					Propagation.
				</li>
				<li>
					Calculate the derivative of loss with respect to each
					variable (going backwards using the chain rule)
				</li>
				<li>update the parameters with gradient descent</li>
			</ul>
			<p>
				Now that you see the underlying logic, Use the explainer tool
				below. Start by pressing play to train the network and click
				EPOCH when you want to see the whole process (forward, backward,
				update) at that particular epoch. If you need help or are
				confused press on the associated question mark.
			</p>
			<p>
				In explainer mode, make sure to color each neuron, this
				represents the activation (output of the neuron), and in the
				backwards propagation the orange arrow which represents the
				computed derivative of loss with respect to the activation.
			</p>
		</div>
	);

	return (
		<Box justifyContent="center" display="flex">
			<Box maxWidth="65%">
				{introduction}
				{paper}
			</Box>
		</Box>
	);
};
export default Explanation;
