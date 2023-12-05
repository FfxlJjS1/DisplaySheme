import React from 'react';

import './App.css';

import { Home } from './Pages/Home';
import Fotter from "./Components/Footer";

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <>
            <div className="content-container" >
                <Home />
            </div>
            
            <Fotter className="footer"/>
        </>
    );
}

export default App;