import React from "react";
const Legend = ({ source, target }) => (
	<g>
		<defs>
			<marker
				id="head"
				orient="auto"
				markerWidth="3"
				markerHeight="4"
				refX="0.1"
				refY="2"
			>
				<path d="M0,0 V4 L2,2 Z" fill="blue" />
			</marker>
		</defs>
		<path
			id="arrow-line"
			marker-end="url(#head)"
			stroke-width="4"
			fill="none"
			stroke="blue"
			d={`M${source.x},${source.y}, ${target.x}, ${target.y}`}
		/>
	</g>
);
export default Legend;
