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
							color="primary"
							variant="outlined"
						>
							Toggle Key
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}
}

export default ToggleForward;
