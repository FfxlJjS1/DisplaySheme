import { useCallback, useState } from 'react';
import {
    Handle, Position, NodeToolbar,
    getOutgoers, getConnectedEdges, useNodes, useEdges//сал
} from 'reactflow';

import './customizable.css';

export const NodeWidth = 150;

export function CustomizableNode({ data }) {
    const onChange = useCallback((evt) => {
        console.log(evt.target.value);
    }, []);

    //const nodes = useNodes(); //сал
    //const edges = useEdges(); //сал

    const customizeProp = data.customize;
    const nodeWidth = data.width;
    const nodeHeight = data.height;
    //Салават
    let _logo = "";
    switch (data.tip_npo_id) {
        case 1:
            _logo = require('./image/ic_well.png');
            break;
        case 7:
        case 12:
            _logo = require('./image/ic_measure.png');
            break;
        case 5:
        case 6:
            _logo = require('./image/ic_pump.png');
            break;
        case 10:
            _logo = require('./image/ic_tank.png');
            break;
        default:
            break;
    }

    /*
    // Setting react flow scheme
    const [nodes, setNodes] = useNodes();
    const [edges, setEdges] = useEdges();
    //салават
    const [hidden, setHidden] = useState(true);
    const hide = (hidden, childEdgeID, childNodeID) => (nodeOrEdge) => {
        if (
            childEdgeID.includes(nodeOrEdge.id) ||
            childNodeID.includes(nodeOrEdge.id)
        )
            nodeOrEdge.hidden = hidden;
        return nodeOrEdge;
    };

    const checkTarget = (edge, id) => {
        let edges = edge.filter((ed) => {
            return ed.target !== id;
        });
        return edges;
    };

    let outgoers = [];
    let connectedEdges = [];
    let stack = [];

    const nodeClick = (some, node) => {
        let currentNodeID = node.id;
        stack.push(node);
        while (stack.length > 0) {
            let lastNOde = stack.pop();
            let childnode = getOutgoers(lastNOde, nodes, edges);
            let childedge = checkTarget(
                getConnectedEdges([lastNOde], edges),
                currentNodeID
            );
            childnode.map((goer, key) => {
                stack.push(goer);
                outgoers.push(goer);
            });
            childedge.map((edge, key) => {
                connectedEdges.push(edge);
            });
        }

        let childNodeID = outgoers.map((node) => {
            return node.id;
        });
        let childEdgeID = connectedEdges.map((edge) => {
            return edge.id;
        });

        setNodes((node) => node.map(hide(hidden, childEdgeID, childNodeID)));
        setEdges((edge) => edge.map(hide(hidden, childEdgeID, childNodeID)));
        setHidden(!hidden);
    };*/

    //Кнопки +/-
    const [buttonText, setButtonText] = useState('-');
    const handleToolbarClick = () => {
        if (buttonText == "+")
            setButtonText('-');
        else if (buttonText == "-")
            setButtonText('+');
        //const node = nodes.find(n => n.id === data.nodeId)
        //nodeClick(node);
    };



    //салават
    const logo = _logo;
    return (
        <>
          <NodeToolbar isVisible={true} position={Position.Left}>
                <button
                    onClick={handleToolbarClick}
                >{buttonText}</button>
            </NodeToolbar>

            <div className="customizable-node" style={{width: nodeWidth, height: nodeHeight}}>
                {customizeProp[0] ? <Handle type="target" position={Position.Right} /> : null}
                {customizeProp[1] ? <Handle type="target" position={Position.Bottom} /> : null}
                <div style={{ display: 'flex'}} >
                    <img src={logo} alt="" width="30" height="30" />
                    <label htmlFor="text" style={{ marginLeft: 10, marginTop: 4 }} >{data.label}</label>
                </div>
                {customizeProp[2] ? <Handle type="source" position={Position.Left} /> : null}
                {customizeProp[3] ? <Handle type="source" position={Position.Top} /> : null}
                </div>
        </>
    );
}
