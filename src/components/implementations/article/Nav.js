/* 
	Donny Bertucci: @xnought
	Summary: 
		This file creates the navigation checkpoint coomponent
*/
import React from "react";
import { scroller } from "react-scroll";
import { Box, Button, Typography } from "@material-ui/core";
import demoGIF from "./assets/demo.gif";

export const Nav = () => {
	const subButton = (title, scrollTitle) => (
		<Button
			style={{ color: "#5B5B5B" }}
			size="small"
			onClick={() => {
				scroller.scrollTo(scrollTitle, {
					duration: 1500,
					delay: 100,
					smooth: true,
				});
			}}
		>
			{title}
		</Button>
	);
	const mainButton = (title, scrollTitle) => (
		<Button
			onClick={() => {
				scroller.scrollTo(scrollTitle, {
					duration: 1500,
					delay: 100,
					smooth: true,
				});
			}}
		>
			{title}
		</Button>
	);
	return (
		<Box display="flex">
			<Box>
				<br />
				<Typography variant="h4">Table Of Contents</Typography>
				<ul style={{ listStyleType: "none" }}>
					<li>{mainButton("Introduction", "article")}</li>
					<li>
						{mainButton(
							"Backprop on a Linear Problem",
							"oneNeuron"
						)}
						<ul style={{ listStyleType: "none" }}>
							<li>{subButton("Getting started", "getting")}</li>
							<li>
								{subButton(
									"defining backpropagation",
									"definition"
								)}
							</li>
							<li>{subButton("concrete example", "concrete")}</li>
							<li>{subButton("see it in action", "see1")}</li>
						</ul>
					</li>
					<li>
						{mainButton(
							"Backprop on a Non-Linear Problem",
							"scaling"
						)}
						<ul style={{ listStyleType: "none" }}>
							<li>{subButton("the changes", "changes")}</li>
							<li>{subButton("training process", "training")}</li>
							<li>{subButton("Backprop Explainer", "see2")}</li>
						</ul>
					</li>
					<li>{mainButton("conclusion", "conclusion")}</li>
					<li>
						{mainButton("acknowledgements", "acknowledgements")}
					</li>
				</ul>
				<br />
			</Box>

			<Box margin={10}>
				<Typography variant="caption" style={{ color: "darkgrey" }}>
					Preview of Backprop Explainer
				</Typography>
				<br />
				<Button
					onClick={() => {
						scroller.scrollTo("see2", {
							duration: 1500,
							delay: 100,
							smooth: true,
						});
					}}
				>
					<img
						src={demoGIF}
						alt="demo"
						width={document.body.clientWidth / 3}
					></img>
				</Button>
			</Box>
		</Box>
	);
};

export default Nav;
