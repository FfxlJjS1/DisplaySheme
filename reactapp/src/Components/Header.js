import React, { Component } from "react"
import { Navbar, Nav, Container, DropdownButton } from 'react-bootstrap'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

//import logo from './logo.png'
//import logo from './logo2.svg'
import logo from './logo3.svg'

import { Home } from "../Pages/Home"
import DropdownItem from "react-bootstrap/esm/DropdownItem"

export default class Header extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Navbar collapseOnSelect expand="md" className="App-header">
                    <Container>
                        <Navbar.Brand hrefs="/">
                            <img className="App-logo"
                                src={logo}
                                height="600"
                                width="120"
                                alt="Logo"
                            />
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                        <Navbar.Collapse id="responsive-navbar-nav"  >
                            <Nav className="me-auto"  >
                                <Nav.Link style={{ color: "#fff", fontWeight: 'bold', fontSize: 15, textAlign: 'left', border: 'solid', borderStyle: 'dotted'}} href="/"> Схема сбора </Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
                <Router >
                    <Routes>
                        <Route exact path="/" element={<Home />} />
                    </Routes>
                </Router>
            </div>
        );
    }
}