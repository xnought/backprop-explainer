import React from "react";
import { scroller } from "react-scroll";
import { Box, Button } from "@material-ui/core";
import structManSVG from "./assets/structMan.svg";
import structArtSVG from "./assets/structArt.svg";
import structNNSVG from "./assets/structNN.svg";
import structLinSVG from "./assets/structLin.svg";

export const Nav = () => (
	<Box display="flex" justifyContent="center">
		<Box>
			<Button
				onClick={() => {
					scroller.scrollTo("article", {
						duration: 1500,
						delay: 100,
						smooth: true,
					});
				}}
				color="secondary"
			>
				{" "}
				<img src={structArtSVG} />
			</Button>

			<Box>
				<Button
					onClick={() => {
						scroller.scrollTo("structMan", {
							duration: 1500,
							delay: 100,
							smooth: true,
							offset: -100,
						});
					}}
					color="secondary"
				>
					<img src={structManSVG} />{" "}
				</Button>
				<Button
					onClick={() => {
						scroller.scrollTo("structLin", {
							duration: 1500,
							delay: 100,
							smooth: true,
							offset: -100,
						});
					}}
					color="secondary"
				>
					{" "}
					<img src={structLinSVG} />
				</Button>
			</Box>
			<Box>
				<Button
					onClick={() => {
						scroller.scrollTo("mainTool", {
							duration: 1500,
							delay: 100,
							smooth: true,
							offset: -100,
						});
					}}
					color="secondary"
				>
					<img src={structNNSVG} />
				</Button>
			</Box>
		</Box>
	</Box>
);
