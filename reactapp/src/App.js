import React from 'react';

import './App.css';

import Header from "./Components/Header";
import Fotter from "./Components/Footer";

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <>
            <Header className="content-container"/>
            <Fotter className="footer"/>
        </>
    );
}

export default App;