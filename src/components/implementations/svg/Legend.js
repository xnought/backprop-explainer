import React from "react";
import "../d3.css";

function Legend() {
	const height = 10;
	const width = 100;
	return (
		<div>
			<svg width={width} height={height} class="grad" overflow="visible">
				<text
					fill="grey"
					fontFamily="sans-serif"
					fontSize="10px"
					x={0}
					y={-13}
				>
					Color and stroke
				</text>

				<text
					fill="grey"
					fontFamily="sans-serif"
					fontSize="10px"
					x={0}
					y={-4}
				>
					indicate weight
				</text>

				<text fontSize="12px" fill="grey" x={-0.5} y={18}>
					|
				</text>
				<text fontSize="13px" fill="grey" x={-2.5} y={28}>
					–
				</text>

				<text fontSize="12px" fill="grey" x={width / 2 - 2} y={18}>
					|
				</text>
				<text fontSize="13px" fill="grey" x={width / 2 - 4.5} y={30}>
					0
				</text>

				<text fontSize="12px" fill="grey" x={width - 2} y={18}>
					|
				</text>
				<text fontSize="13px" fill="grey" x={width - 3 - 1.5} y={28}>
					+
				</text>
			</svg>
		</div>
	);
}

export default Legend;
