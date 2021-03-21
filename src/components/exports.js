/* EXPORTS TO CLEAN UP IMPORT OF COMPONENTS */

import NeuralNetworkComponent from "./implementations/subComponents/NeuralNetworkComponent";
import ScatterPlot from "./implementations/subComponents/ScatterPlot";
import AnimatedScatterPlot from "./implementations/subComponents/AnimatedScatterPlot";
import Loss from "./implementations/subComponents/Loss";
import Explanation from "./implementations/article/Explanation";
import BackpropTool from "./implementations/mainComponent/BackpropTool";
import Header from "./implementations/article/Header";
import SubTool from "./implementations/article/SubTool";
import * as Typeset from "./implementations/article/Typeset";
import Summary from "./implementations/article/assets/summary.svg";

export {
	NeuralNetworkComponent,
	ScatterPlot,
	AnimatedScatterPlot,
	Loss,
	BackpropTool,
	Header,
	SubTool,
	Typeset,
	Explanation,
	Summary,
};
