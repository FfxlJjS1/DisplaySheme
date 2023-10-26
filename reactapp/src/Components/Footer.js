import React from "react"
import { Container } from "react-bootstrap"

const Fotter = (props) => (
    <Container className={props.className} fluid>
        <Container className="footer-container">
            <p>¬еб-приложение было разработано в ходе практики</p>
        </Container>
    </Container>
)

export default Fotter;