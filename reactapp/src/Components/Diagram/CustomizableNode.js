import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';

import './customizable.css';

export const NodeWidth = 150;

export function CustomizableNode({ data }) {
    const onChange = useCallback((evt) => {
        console.log(evt.target.value);
    }, []);

    const customizeProp = data.customize;
    const nodeWidth = data.width;

    return (
        <div className="customizable-node" style={{width: nodeWidth}}>
            {customizeProp[0] ? <Handle type="target" position={Position.Left} /> : null}
            {customizeProp[1] ? <Handle type="target" position={Position.Bottom} /> : null}
            <div>
                <label htmlFor="text">{ data.label}</label>
            </div>
            {customizeProp[2] ? <Handle type="source" position={Position.Right} /> : null}
            {customizeProp[3] ? <Handle type="source" position={Position.Top} /> : null}
        </div>
    );
}
