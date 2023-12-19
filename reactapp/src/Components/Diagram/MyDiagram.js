import { useState, useCallback } from 'react';
import ReactFlow, {
    MiniMap,
    Controls,
    MarkerType,
    applyNodeChanges, applyEdgeChanges,
    Background,
} from 'reactflow';
import { CustomizableNode } from './CustomizableNode'

import 'reactflow/dist/style.css';

export const RadioGroup = [
    { label: 'Столбцовый', id: 'radio-group-1', key: 1 },
    { label: 'Столбцовый - двух строковой', id: 'radio-group-2', key: 2 },
];

const nodeTypes = { customizable: CustomizableNode };

function MyDiagram(props) {
    let table = props.table;
    const diagramStructureKey = props.diagramStructureKey;
    const searchByObjectsFilters = props.searchByObjectsFilters;

    // Filtering
    let keys = [];

    for (let key in table) {
        keys.push(key);
    }

    let needToFilter = false;
    for (const filterKey in searchByObjectsFilters) {
        const filter = searchByObjectsFilters[filterKey];

        if (filter !== "") {
            needToFilter = true;

            break;
        }
    }

    if (needToFilter) {
        let filteredTable = [];
        let addedNodeIds = [];
        let acceptedParentNodeIds = [];

        // Filtering from start to end
        for (const filterKey in searchByObjectsFilters) {
            const filter = searchByObjectsFilters[filterKey];
            const subTable = table[filterKey];
            let filteredSubTable = [];

            // Get elements that have name like filter
            if (filter !== "") {
                filteredSubTable = subTable.filter(element => element.name.includes(filter));

                if (filteredSubTable.length > 0) {
                    filteredSubTable.forEach((element) => {
                        addedNodeIds.push(element.id);

                        if(!acceptedParentNodeIds.includes(element.parent_id))
                            acceptedParentNodeIds.push(element.parent_id);
                    });

                    filteredTable[filterKey] = filteredSubTable;
                }
            }

            // Get other elements of the subTable
            if (addedNodeIds.length > 0) {
                let isAdded = true;

                while (isAdded) {
                    isAdded = false;

                    const newAdd = subTable.filter(element => acceptedParentNodeIds.includes(element.id) && !addedNodeIds.includes(element.id));

                    if (newAdd.length > 0) {
                        newAdd.forEach((element) => {
                            filteredSubTable.push(element);
                            addedNodeIds.push(element.id);

                            if (!acceptedParentNodeIds.includes(element.parent_id))
                                acceptedParentNodeIds.push(element.parent_id);
                        });

                        isAdded = true;
                    }
                }
            }

            filteredTable[filterKey] = filteredSubTable;
        }

        // Filtering from end to  start
        const rKeys = keys.reverse();
        
        for (const rKeyIndex in rKeys) {
            const rKey = rKeys[rKeyIndex];
            const filter = searchByObjectsFilters[rKey];
            const subTable = table[rKey];
            let filteredSubTable = filteredTable[rKey];

            if (addedNodeIds.length > 0 && filter == "") {
                let isAdded = true;

                while (isAdded) {
                    isAdded = false;

                    const newAdd = subTable.filter(element => addedNodeIds.includes(element.parent_id) && !addedNodeIds.includes(element.id));

                    if (newAdd.length > 0) {
                        newAdd.forEach((element) => {
                            filteredSubTable.push(element);
                            addedNodeIds.push(element.id);
                        });

                        isAdded = true;
                    }
                }
            }

            filteredTable[rKey] = filteredSubTable;
        }

        keys.reverse();

        table = filteredTable;
    }



    // Setting groups, nodes and edges parametrs
    let initialNodes = [];
    let initialEdges = [];


    var positionForParentObjectmap = new Map();

    const nodeWidth = 160;
    const nodeXMove = nodeWidth + 20 * 2, nodeYMove = 100; // For default presentation parametrs

    const groupBetweenVoidWidth = 50,
        groupVoidSideWidth = 20,
        groupHeaderHeight = 20,
        groupWidth = nodeWidth + groupVoidSideWidth * 2;
    let groupHeight = 0,
        groupXPos = 0;
    const groupYPos = 0;

    const nodeXPos = groupVoidSideWidth;

    for (let keyIndex = 0; keyIndex < keys.length; keyIndex++) {
        const localKey = keys[keyIndex];
        const objects = table[localKey];

        groupHeight = nodeYMove * (objects.length - 1) + 40 + groupVoidSideWidth * 2 + groupHeaderHeight;

        // Add group node
        initialNodes.push({
            id: localKey,
            data: { label: localKey },
            position: { x: groupXPos, y: groupYPos },
            style: { backgroundColor: 'rgba(143, 181, 242, 0.2)', width: groupWidth, height: groupHeight }
        });

        groupXPos += (nodeXMove + groupBetweenVoidWidth);

        // Add nodes to group node and add edges
        let nodeYPos = groupVoidSideWidth + groupHeaderHeight;

        for (let objectId in objects) {
            const object = objects[objectId];
            /*
            if (!positionForParentObjectmap.has(object.parent_id)) {
                positionForParentObjectmap.set(object.parent_id, { y: nodeYPos });
            }

            const findDefinedPosition = positionForParentObjectmap.get(object.id);

            if (findDefinedPosition != undefined) {
               nodeYPos = findDefinedPosition.y;
            }*/

            initialNodes.push({
                id: '\"' + object.id + '\"',
                data: {
                    label: object.tip_npo_name + ' - ' + object.name,
                    customize: [true, true, true, true],
                    width: nodeWidth,
                },
                parentNode: localKey,
                type: 'customizable',
                //extent: 'parent',
                position: { x: nodeXPos, y: nodeYPos }
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
        backgroundColor: '#DCD0D0',
    };

    return (
        <div style={{ height: 700, width: 1200 }}>
            <ReactFlow
                nodes={nodes}
                onNodesChange={onNodesChange}
                edges={edges}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
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
