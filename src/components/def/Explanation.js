import React from "react";
import LinearFunction from "./LinearFunction";
import NestedFunction from "./NestedFunction";
import { Box, Card, CardContent, Typography } from "@material-ui/core";
const Explanation = () => (
	<Box justifyContent="center" display="flex" marginTop={5}>
		<Box width={800}>
			<Card style={{ padding: "1em" }}>
				<CardContent>
					<Typography variant="h3" gutterBottom>
						What is <i>Backpropagation</i>?
					</Typography>
					<Typography variant="subtitle1" gutterBottom>
						TLDR; Backpropagation tells us about how the loss is
						affected.
					</Typography>
				</CardContent>
				<CardContent>
					<Typography variant="h4" gutterBottom>
						Overview
					</Typography>

					<Typography variant="h6" gutterBottom>
						&emsp;1. Neural Network Summary
					</Typography>
					<Typography variant="h6" gutterBottom>
						&emsp;2. What is Loss?
					</Typography>
					<Typography variant="h6" gutterBottom>
						&emsp;3. Answering the question: What is{" "}
						<i>Backpropagation</i>?
					</Typography>
					<Typography variant="h6" gutterBottom>
						&emsp;4. What comes next?
					</Typography>
				</CardContent>
				<CardContent>
					<Typography variant="h4" gutterBottom>
						Neural Network Summary
					</Typography>
					<Typography variant="body1" gutterBottom>
						A <em>neural</em> network, as the name suggests, is a
						network of <em>neurons</em>.
					</Typography>
					<Typography variant="body1" gutterBottom>
						Think of a neuron as a function: we put a number in and
						spit a number out. And the easiest function to think
						about is a line. e.g. f(x) = 2x + 1
					</Typography>
					<Box display="flex" justifyContent="center" marginTop={2}>
						<LinearFunction />
					</Box>
					<Box
						display="flex"
						justifyContent="center"
						marginBottom={1}
					>
						<Typography variant="caption">
							Slide to see how the output changes.
						</Typography>
					</Box>
					<Typography variant="body1" gutterBottom>
						The main takeaway here is that by multiplying the input
						and adding a number we are changing the output and{" "}
						<em>adding complexity</em>.
					</Typography>
					<Typography variant="body1" gutterBottom>
						<Typography variant="inline" style={{ color: "gold" }}>
							&emsp;&emsp;&emsp;KEY IDEA
						</Typography>
						: The more complexity we add, the more different ways we
						can change the output of the function.
					</Typography>
					<Typography variant="body1" gutterBottom>
						&emsp;&emsp;&emsp;Each Neuron takes on one of these
						functions. We call the number multiplied by the input
						the weight and the number that is added the bias. Every
						input has its respective weight to add more complexity
						and there is one bias per neuron.
					</Typography>
					<Typography variant="body1" gutterBottom>
						&emsp;&emsp;&emsp; Each neurons output can then be fed
						into another neuron. And we can pass the output to
						multiple neurons if we are feeling spicy. And to add
						even MORE complexity we can introduce activation
						functions which also introduces non-linearity.
					</Typography>

					<Box display="flex" justifyContent="center" marginTop={2}>
						<NestedFunction />
					</Box>
					<Box
						display="flex"
						justifyContent="center"
						marginBottom={1}
					>
						<Typography variant="caption">
							Slide to see how we can add complexity through
							nesting.
						</Typography>
					</Box>

					<Typography variant="body1" gutterBottom>
						As you can see in this three neuron network, we can
						change the output alot by adding complexity to the
						network. This will allow us to have more control of what
						the output can be. But the next big question becomes,
						how do we leverage this and tune the weights and biases
						(the added complexity) in order to get the desired
						result?
					</Typography>
				</CardContent>
				<CardContent>
					<Typography variant="h4" gutterBottom>
						What is Loss?
					</Typography>
				</CardContent>
				<CardContent>
					<Typography variant="h4" gutterBottom>
						What is <i>Backpropagation</i>?
					</Typography>
				</CardContent>
				<CardContent>
					<Typography variant="h4" gutterBottom>
						What is Comes Next?
					</Typography>
				</CardContent>
			</Card>
		</Box>
	</Box>
);
export default Explanation;
