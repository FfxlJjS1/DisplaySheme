import React, { Component } from "react"
import { Navbar, Nav, Container, DropdownButton } from 'react-bootstrap'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import logo from './logo.png'

import { Home } from "../Pages/Home"
import DropdownItem from "react-bootstrap/esm/DropdownItem"

export default class Header extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={this.props.className} >
                <Navbar collapseOnSelect expand="md" bg="dark" variant="dark" >
                    <Container>
                        <Navbar.Brand hrefs="/">
                            <img
                                src={logo}
                                height="40"
                                width="40"
                                className="d-inline-block align-top"
                                alt="Logo"
                            />
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                        <Navbar.Collapse id="responsive-navbar-nav" >
                            <Nav className="me-auto">
                                <Nav.Link href="/"> Главное меню </Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
                <Router>
                    <Routes>
                        <Route exact path="/" element={<Home />} />
                    </Routes>
                </Router>
            </div>
        );
    }
}