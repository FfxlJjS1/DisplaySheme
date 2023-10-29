import React, { Component } from 'react';
import ReactFlow, {
	MiniMap,
	Controls,
	MarkerType,
	Position
} from 'reactflow';

import 'reactflow/dist/style.css';

export const MyDiagram = (table) =>  {
	let initialNodes = [];
	let initialEdges = [];

	let xPos = 0;

	console.log(table);
	for(let objectsId in table) {
		const objects = table[objectsId];
		let yPos = 0;

		console.log(objects);

		for(let objectId in objects) {
			const object = objects[objectId];

			console.log(object);

			initialNodes.push({
				id: '\"' + object.id + '\"',
				data: {label: object.tip_npo_name + ' - ' + object.name},
				position: {x: xPos, y: yPos},
			});

			initialEdges.push({
				id: 'e' + object.parent_id + '-' + object.id,
				source: '\"' + object.parent_id + '\"',
				target: '\"' + object.id + '\"',
				type: 'step',
				markerEnd: {
					type: MarkerType.ArrowClosed,
				},
			});

			yPos += 100;
		}

		xPos += 200;
	}

	return(
		<div style={{ height: 500, width: 900 }}>
			<ReactFlow
				nodes={initialNodes}
				edges={initialEdges}
			>
				<Controls/>
				<MiniMap/>
			</ReactFlow>
		</div>
	);
}

export default MyDiagram;