/* EXPORTS TO CLEAN UP IMPORT OF COMPONENTS */
import NeuralNetworkComponent from "./implementations/subComponents/NeuralNetworkComponent";
import ScatterPlot from "./implementations/subComponents/ScatterPlot";
import AnimatedScatterPlot from "./implementations/subComponents/AnimatedScatterPlot";
import Loss from "./implementations/subComponents/Loss";
import Article from "./implementations/article/Article";
import Header from "./implementations/article/Header";
import BackpropExplainer from "./implementations/mainComponent/BackpropExplainer";
import * as Typeset from "./implementations/article/Typeset";
import Summary from "./implementations/article/assets/summary.svg";
import Acknowledge from "./implementations/article/Acknowledge";
import Nav from "./implementations/article/Nav";

export {
	NeuralNetworkComponent,
	ScatterPlot,
	AnimatedScatterPlot,
	Loss,
	BackpropExplainer,
	Typeset,
	Header,
	Article,
	Summary,
	Acknowledge,
	Nav,
};
