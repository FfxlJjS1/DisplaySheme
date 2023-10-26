import React, { Component } from 'react';

import './App.css';

import Header from "./Components/Header";
import Fotter from "./Components/Fotter";

import 'bootstrap/dist/css/bootstrap.min.css';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <>
                <Header className="content-container" />
                <Fotter className="footer" />
            </>
        );
    }
}
