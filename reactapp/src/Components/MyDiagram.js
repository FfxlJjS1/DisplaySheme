import { useState, useCallback } from 'react';
import ReactFlow, {
    MiniMap,
    Controls,
    MarkerType,
    applyNodeChanges, applyEdgeChanges,
    Background,
} from 'reactflow';

import 'reactflow/dist/style.css';

export const Orientation = {
    Horizontal: 0,
    Vertical: 1
}

export const SideForStart = {
    Begin: 0,
    End: 1
}

function MyDiagram(props) {
    const table = props.table;
    const orientation = props.orientation;
    const sideForStart = props.sideForStart;
    const searchByObjectsFilters = props.searchByObjectsFilters;

    // Filtering
    // ...

    // Setting groups, nodes and edges parametrs
    let initialNodes = [];
    let initialEdges = [];

    let keys = [];

    for (let key in table) {
        keys.push(key);
    }

    var positionForParentObjectmap = new Map();

    const nodeXMove = 200, nodeYMove = 100; // For default presentation parametrs
    const groupBetweenVoidWidth = 50,
        groupVoidSideWidth = 20,
        groupWidth = 150 + groupVoidSideWidth * 2;
    let groupHeight = 0,
        groupXPos = 0;
    const groupYPos = 0;

    const nodeXPos = groupVoidSideWidth;

    for (let keyIndex = 0; keyIndex < keys.length; keyIndex++) {
        const localKey = sideForStart == SideForStart.Begin
            ? keys[keyIndex]
            : keys[keys.lenght - keyIndex - 1];
        const objects = table[
            localKey
        ];

        groupHeight = nodeYMove * (objects.length - 1) + 40 + groupVoidSideWidth * 2;

        // Add group node
        initialNodes.push({
            id: localKey,
            data: { label: localKey },
            position: orientation == Orientation.Horizontal
                ? { x: groupXPos, y: groupYPos }
                : { x: groupYPos, y: groupXPos },
            style: Object.assign({},
                { backgroundColor: 'rgba(255, 0, 0, 0.2)', },
                orientation == Orientation.Horizontal ? { width: groupWidth, height: groupHeight } : { width: groupHeight, height: groupWidth })
        });

        groupXPos += (sideForStart == SideForStart.Begin ? 1 : -1) * (nodeXMove + groupBetweenVoidWidth);

        // Add nodes to group node and add edges
        let nodeYPos = groupVoidSideWidth;

        for (let objectId in objects) {
            const object = objects[objectId];

            if (!positionForParentObjectmap.has(object.parent_id)) {
                positionForParentObjectmap.set(object.parent_id, { y: nodeYPos });
            }

            const findDefinedPosition = positionForParentObjectmap.get(object.id);

            if (findDefinedPosition != undefined) {
                nodeYPos = findDefinedPosition.y;
            }

            initialNodes.push({
                id: '\"' + object.id + '\"',
                data: { label: object.tip_npo_name + ' - ' + object.name },
                parentNode: localKey,
                extent: 'parent',
                position: orientation == Orientation.Horizontal
                    ? { x: nodeXPos, y: nodeYPos }
                    : { x: nodeYPos, y: nodeXPos }
            });

            initialEdges.push({
                id: 'e' + object.parent_id + '-' + object.id,
                target: '\"' + object.parent_id + '\"',
                source: '\"' + object.id + '\"',
                type: 'step',
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                },
            });

            nodeYPos += nodeYMove;
        }
    }

    // Setting react flow scheme
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);

    const onNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [],
    );
    const onEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [],
    );

    const rfStyle = {
        backgroundColor: '#D0C0F7',
    };

    return (
        <div style={{ height: 700, width: 1200 }}>
            <ReactFlow
                nodes={nodes}
                onNodesChange={onNodesChange}
                edges={edges}
                onEdgesChange={onEdgesChange}
                style={rfStyle}
            >
                <Background color="#ccc" variant="dots" />
                <Controls />
                <MiniMap
                    nodeColor={nodeColor}
                    pannable zoomable />
            </ReactFlow>
        </div>
    );
}

function nodeColor(node) {
    switch (node.type) {
        case 'input':
            return '#6ede87';
        case 'output':
            return '#6865A5';
        default:
            return '#ff0072';
    }
}

export default MyDiagram;
