import React from "react";
import { scroller } from "react-scroll";
import { Box, Button } from "@material-ui/core";
import structManSVG from "./assets/navSVG/structMan.svg";
import structArtSVG from "./assets/navSVG/structArt.svg";
import structNNSVG from "./assets/navSVG/structNN.svg";
import structLinSVG from "./assets/navSVG/structLin.svg";
import structAckSVG from "./assets/navSVG/structAck.svg";

export const Nav = () => {
	const backgroundColor = "primary";
	return (
		<Box display="flex" justifyContent="center">
			<Box>
				<Box>
					<Button
						onClick={() => {
							scroller.scrollTo("article", {
								duration: 1500,
								delay: 100,
								smooth: true,
							});
						}}
						color={backgroundColor}
					>
						{" "}
						<img alt="article" src={structArtSVG} />
					</Button>
				</Box>

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
						color={backgroundColor}
					>
						<img alt="manual" src={structManSVG} />{" "}
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
						color={backgroundColor}
					>
						<img alt="auto" src={structLinSVG} />
					</Button>
				</Box>
				<Box>
					<Button
						onClick={() => {
							scroller.scrollTo("mainTool", {
								duration: 1500,
								delay: 100,
								smooth: true,
								offset: -240,
							});
						}}
						color={backgroundColor}
					>
						<img alt="backprop" src={structNNSVG} />
					</Button>
				</Box>
				<Box>
					<Button
						onClick={() => {
							scroller.scrollTo("acknowledgements", {
								duration: 1500,
								delay: 100,
								smooth: true,
							});
						}}
						color={backgroundColor}
					>
						<img alt="acknowledgements" src={structAckSVG} />
					</Button>
				</Box>
			</Box>
		</Box>
	);
};
