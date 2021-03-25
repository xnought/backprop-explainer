/* 
	Donny Bertucci: @xnought
	Summary: 
		File that brings everything together
*/

import React, { Component } from "react";
import ReactGa from "react-ga";
import { createMuiTheme, ThemeProvider, Divider, Box } from "@material-ui/core";
import {
	BackpropExplainer,
	Article,
	Acknowledge,
	Header,
	Nav,
} from "./components/exports";
import { Element } from "react-scroll";

const globalWeight = 350;
const theme = createMuiTheme({
	overrides: {
		MuiTypography: {
			h1: {
				fontWeight: globalWeight,
			},
			h2: {
				fontWeight: globalWeight,
			},
			h3: {
				marginTop: 15,
				fontWeight: globalWeight,
			},
			h4: {
				marginTop: 15,
				fontWeight: globalWeight,
			},
			h5: {
				fontWeight: globalWeight,
			},
			h6: {
				fontWeight: globalWeight,
			},
			body1: {
				fontWeight: globalWeight,
			},
			body2: {
				fontWeight: globalWeight,
			},
		},
	},
});

class App extends Component {
	componentDidMount() {
		/* Counting pageviews, probobaly shouldve just made my own API */
		ReactGa.initialize(`${process.env.REACT_APP_GAID}`);
		ReactGa.pageview("/");
	}
	render() {
		return (
			<ThemeProvider theme={theme}>
				<div>
					<Header />
					<Box justifyContent="center" display="flex">
						<Box>
							<Nav />
						</Box>
					</Box>
					<br />
					<Divider />
					<Article />
					<Element name="mainTool">
						<BackpropExplainer />
					</Element>
					<Element name="acknowledgements">
						<Acknowledge />
					</Element>
					<br />
				</div>
			</ThemeProvider>
		);
	}
}

export default App;
