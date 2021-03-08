import React from "react";
const Legend = ({ source, target, color }) => (
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
				<path d="M0,0 V4 L2,2 Z" fill={color} />
			</marker>
		</defs>
		<path
			id="arrow-line"
			markerEnd="url(#head)"
			strokeWidth="3"
			fill="none"
			stroke={color}
			d={`M${source.x},${source.y}, ${target.x}, ${target.y}`}
		/>
	</g>
);
export default Legend;
