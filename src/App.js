/* 
	Donny Bertucci: @xnought
	Summary: 
		File that brings everything together
*/

import React, { Component } from "react";
import ReactGa from "react-ga";
import { EPOCHTool, Article, Acknowledge, Header } from "./components/exports";
import { Element } from "react-scroll";

class App extends Component {
	componentDidMount() {
		/* Counting pageviews, probobaly shouldve just made my own API */
		ReactGa.initialize(`${process.env.REACT_APP_GAID}`);
		ReactGa.pageview("/");
	}
	render() {
		return (
			<div>
				<Header />
				<Article />
				<Element name="mainTool">
					<EPOCHTool />
				</Element>
				<Element name="acknowledgements">
					<Acknowledge />
				</Element>
				<br />
			</div>
		);
	}
}

export default App;
