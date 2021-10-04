/* 
	Donny Bertucci: @xnought
	Summary: 
		This file contains the logic and component for autotool.
		It brings together the control logic, the loss contour and the graph.
*/
import React, { Component } from "react";
import ContourLoss from "./ContourLoss";
import { ScatterPlot } from "../../exports";
import { $ } from "../article/Typeset";
import * as d3 from "d3";
import autoKeySVG from "./assets/autoKey.svg";

import {
	Fab,
	IconButton,
	Box,
	Card,
	CardContent,
	Typography,
} from "@material-ui/core";
import { PlayArrow, Stop, Replay, SlowMotionVideo } from "@material-ui/icons";
import * as tf from "@tensorflow/tfjs";

const orange = "#FFA500";
const blue = "#56A8C7";
class SubTool extends Component {
	constructor(props) {
		super(props);
		this.state = {
			yhat: [],
			darkness: -4,
			playButton: true,
			linreg: {
				meanSquaredError: 0,
				rsquared: null,
				data: {
					X: [],
					y: [],
				},
				hyperparams: {
					learningRate: 0.03,
					epochs: 0,
					loss: null,
					speed: 200,
				},
				tunableparams: {
					m: 0,
					b: 0,
				},
			},
		};
		this.generateData = this.generateData.bind(this);
		this.linearRegression = this.linearRegression.bind(this);
		this.a = this.a.bind(this);
		this.handleSlider = this.handleSlider.bind(this);
		this.reset = this.reset.bind(this);
	}

	reset() {
		this.generateData();
		this.setState({
			...this.state,
			playButton: true,
			linreg: {
				...this.state.linreg,
				rsquared: null,
				hyperparams: {
					...this.state.linreg.hyperparams,
					epochs: 0,
					loss: null,
				},
				tunableparams: {
					m: 0,
					b: 0,
				},
			},
		});
	}
	generateData() {
		tf.tidy(() => {
			/* The data we will use */
			const yhat = [0, 0, 0, 0, 0, 0];
			const X = [0, 1, 2, 3, 4, 5];
			const y = [5, 4, 3, 2, 1, 0];
			const yTensor = tf.tensor(y);

			const mean = tf.mean(yTensor).dataSync()[0];
			const meanSquaredError =
				(1 / (X.length * 2)) *
				tf.sum(tf.pow(tf.sub(mean, yTensor), 2)).dataSync()[0];

			this.setState({
				...this.state,
				yhat,
				linreg: {
					...this.state.linreg,
					meanSquaredError,
					data: { X, y },
				},
			});
			return undefined;
		});
	}

	linearRegression() {
		tf.tidy(() => {
			/* It really doesnt need to go this far */
			if (this.state.linreg.hyperparams.epochs > 10000) {
				this.setState({ playButton: !this.state.playButton });
				return;
			}
			//hypothesis function
			let { m, b } = this.state.linreg.tunableparams;
			let { learningRate } = this.state.linreg.hyperparams;
			const { X, y } = this.state.linreg.data;
			const XTensor = tf.tensor(X);
			const yTensor = tf.tensor(y);

			let yPred = h(XTensor, m, b);
			let len = XTensor.shape[0];
			function h(X, m, b) {
				return tf.add(tf.mul(X, m), b);
			}
			//Define the loss function
			function loss(y, y_pred) {
				return (
					(1 / (2 * len)) *
					tf.sum(tf.pow(tf.sub(y_pred, y), 2)).dataSync()[0]
				);
			}

			//then compute the gradient
			const dlossdm =
				(1 / len) *
				tf.sum(tf.mul(tf.sub(yPred, yTensor), XTensor)).dataSync()[0];
			const dlossdb =
				(1 / len) * tf.sum(tf.sub(yPred, yTensor)).dataSync()[0];
			const lossValue = loss(yTensor, yPred);

			//gradient descent by updating the m and b
			m += -learningRate * dlossdm;
			b += -learningRate * dlossdb;
			const rsquared = 1 - lossValue / this.state.linreg.meanSquaredError;
			const epochs = this.state.linreg.hyperparams.epochs + 1;
			const yhat = Array.from(yPred.dataSync());
			this.setState({
				...this.state,
				yhat,
				linreg: {
					...this.state.linreg,
					rsquared,
					tunableparams: { m, b },
					hyperparams: {
						...this.state.linreg.hyperparams,
						epochs: epochs,
						loss: lossValue,
					},
				},
			});
			return undefined;
		});
	}
	async a() {
		const timer = (ms) => new Promise((res) => setTimeout(res, ms));
		const upperBounds = 200;
		while (true) {
			const { speed } = this.state.linreg.hyperparams;
			const changeSpeed = upperBounds - speed;
			await this.linearRegression();
			//await this.forceUpdate();
			await timer(changeSpeed);
			if (this.state.playButton === true) {
				break;
			}
		}
	}
	handleSlider(event, value) {
		this.setState({
			linreg: {
				...this.state.linreg,
				hyperparams: {
					...this.state.linreg.hyperparams,
					speed: value,
				},
			},
		});
	}

	async componentDidMount() {
		await this.generateData();
	}

	render() {
		const { m, b } = this.state.linreg.tunableparams;
		const { loss, speed, epochs } = this.state.linreg.hyperparams;
		const { data } = this.state.linreg;
		const nullColor = (val) => (val === null ? "#dce0dd" : "black");
		const nullNumber = (num, precision) =>
			num === null ? num : num.toFixed(precision);
		return (
			<div>
				<Box display="flex" justifyContent="center" marginTop={2}>
					<Box marginTop={10} marginRight={10}>
						<ScatterPlot
							width={300}
							height={300}
							padding={0}
							start={0}
							stop={5}
							X={data.X}
							y={data.y}
							yhat={this.state.yhat}
							id={420}
							select={-1}
							duration={0}
						/>
					</Box>
					<Card variant="outlined">
						<CardContent>
							<Typography variant="h4" component="h2">
								EPOCH: {epochs}
							</Typography>
							<Typography variant="h6">
								{$("\\text{neuron}(x) = ")}
								<span
									style={{
										color: blue,
									}}
								>
									{$(`${nullNumber(m, 2)}`)}
								</span>
								{$(` x\\ + \\ `)}
								<span
									style={{
										color: orange,
									}}
								>
									{$(`${nullNumber(b, 2)}`)}
								</span>
							</Typography>
							<div style={{ margin: "20px 10px" }} />

							<IconButton onClick={this.reset}>
								<Replay />
							</IconButton>
							<Fab
								style={{
									background: this.state.playButton
										? "#175676"
										: "#D62839",
									color: "white",
								}}
								onClick={async () => {
									await this.setState({
										playButton: !this.state.playButton,
									});
									await this.a();
								}}
								disableTouchRipple
							>
								{this.state.playButton ? (
									<PlayArrow />
								) : (
									<Stop />
								)}
							</Fab>

							<IconButton
								style={{
									color: speed === 200 ? "grey" : "#FFC006",
								}}
								onClick={() => {
									this.setState({
										linreg: {
											...this.state.linreg,
											hyperparams: {
												...this.state.linreg
													.hyperparams,
												speed:
													speed === 200 ? 120 : 200,
											},
										},
									});
								}}
							>
								<SlowMotionVideo />
							</IconButton>

							<div
								style={{
									height: "1px",
									width: "100%",
									background: "#0001",
									marginTop: "25px",
								}}
							/>

							{/* <img src={autoKeySVG} alt="legend" width="40%" /> */}
							<ContourLoss
								ms={speed}
								data={data}
								m={isFinite(m) ? m : 0}
								b={isFinite(b) ? b : 0}
								loss={loss}
								darkness={this.state.darkness}
								wColor={blue}
								bColor={orange}
							/>
						</CardContent>
					</Card>
				</Box>
			</div>
		);
	}
}

export default SubTool;
