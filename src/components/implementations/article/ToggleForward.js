import React, { Component } from "react";
import { Button, Card, CardContent } from "@material-ui/core";

class ToggleForward extends Component {
	constructor(props) {
		super(props);
		this.state = {
			key: false,
		};
	}
	render() {
		const { key } = this.state;
		const { noKeySVG, keySVG, title } = this.props;
		return (
			<div>
				<Card variant="outlined">
					<CardContent>
						{title}
						<img
							width="100%"
							src={key ? keySVG : noKeySVG}
							alt=""
						/>
						<Button
							onClick={() => {
								this.setState({ key: !key });
							}}
							variant="outlined"
							style={{
								borderColor: "#175676",
								color: "#175676",
							}}
						>
							Click here to see descriptions of the diagram above
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}
}

export default ToggleForward;
