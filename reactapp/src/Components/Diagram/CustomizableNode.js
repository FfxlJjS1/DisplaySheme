import { useState } from 'react';
import { Handle, Position, NodeToolbar } from 'reactflow';

import './customizable.css';

export function CustomizableNode({ data }) {
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

    //Кнопки +/-
    const [buttonText, setButtonText] = useState('-');
    const handleToolbarClick = (e) => {
        if (buttonText == "+")
            setButtonText('-');
        else if (buttonText == "-")
            setButtonText('+');
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
