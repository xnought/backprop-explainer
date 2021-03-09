import { AppBar, Toolbar, Typography } from "@material-ui/core";

const Bar = ({ title }) => (
	<AppBar
		position="fixed"
		variant="outlined"
		style={{
			background: "#175676",
			color: "white",
		}}
	>
		<Toolbar>
			<Typography variant="h6">{title}</Typography>
		</Toolbar>
	</AppBar>
);

export default Bar;
