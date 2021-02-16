/* 
	Donny Bertucci: @xnought
	Date Created: 02/15/2021
	Summary: 
		Functional Component for PlayButton
	@Props: playing: false or true
*/
import { Fab } from "@material-ui/core";
import { PlayArrow, Stop } from "@material-ui/icons";

const PlayButton = ({ playing }) => (
	<Fab
		style={{
			background: playing ? "#f44336" : "#4caf50",
			color: "#FFFFFF",
		}}
	>
		{playing ? <Stop /> : <PlayArrow />}
	</Fab>
);

export default PlayButton;
