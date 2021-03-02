import React from "react";
import "./d3.css";

function Legend() {
	const height = 20;
	const width = 150;
	return (
		<div>
			<svg width={width} height={height} class="grad" overflow="visible">
				<text
					fill="black"
					fontFamily="sans-serif"
					fontSize="12px"
					x={0}
					y={-4}
				>
					Color Indicates Weight
				</text>
				<text fill="grey" x={0} y={30}>
					|
				</text>
				<text fill="grey" x={-3} y={45}>
					–
				</text>

				<text fill="grey" x={width / 2 - 2} y={30}>
					|
				</text>
				<text fontSize="13px" fill="grey" x={width / 2 - 3} y={45}>
					0
				</text>

				<text fill="grey" x={width - 3} y={30}>
					|
				</text>
				<text fill="grey" x={width - 3 - 3} y={45}>
					+
				</text>
			</svg>
		</div>
	);
}

export default Legend;
