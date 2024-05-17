import React, { Component } from 'react';

import './CustomInputDropdown.css'

export default class CustomInputDropdown extends Component {
    constructor(props) {
        super(props);

        this._child = React.createRef();

        this.state = {objectsToDropdown: props.objectsToDropdown};
    }

    render() {
        let value = "";
        let objectsToDropdown = this.objectsToDropdown

        const onFocus = (e) => {
            finterFunction(e);
        };

        const onBlur = (e) => {
            for (let i = 0; i < this.state.objectsToDropdown.length; i++) {
                this.state.objectsToDropdown[i][2] = false
            }
        };

        const finterFunction = (e) => {
            for (let i = 0; i < this.state.objectsToDropdown.length; i++) {
                this.state.objectsToDropdown[i][2] = this.state.objectsToDropdown[i][1].includes(value)
            }
        }

        const selectedDropdownElement = (e) => {
            value = "22"
        }

        return (
            <div class="dropdown">
                <div id="myDropdown" class="dropdown-content show">
                    <input type="text" placeholder="Поиск.." id="myInput" onKeyUp={finterFunction} onBlur={onBlur} onFocus={onFocus} />
                    {this.state.objectsToDropdown.map((objectToDropdown) =>
                        <a value={objectToDropdown[0]} onClick={selectedDropdownElement} style={{ display: objectToDropdown[2] ? '' : 'none' }}>{objectToDropdown[1]}</a>
                    )}
                </div>
            </div>
        );
    }
}
