import React, { Component } from "react"
import { CommunicationWithServer } from "../FunctionalClasses/CommunicationWithServer"
import { Container, Form } from "react-bootstrap";

import MyDiagram from "../Components/TreeProductParkDiagram";

export class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedTopProductParkId: null,
            topProductParkList: null, loadingTopProductParkList: false,
            productParkTree: null, loadingProductParkTree: false
        };
    }

    componentDidMount() {
        this.loadTopProductParkList();
    }

    async loadTopProductParkList() {
        this.setState({topProductParkList: null, loadingTopProductParkList: true});

        const data = await CommunicationWithServer.GetParentInjectionOutList();
        
        if(data != null) {
            this.setState({topProductParkList: data});
        }

        this.setState({loadingTopProductParkList: false});
    }

    async enterAndLoadProductParkTree(selectedTopProductParkId) {
        this.setState({productParkTree: null, loadingProductParkTree: true});

        const data = await CommunicationWithServer.GetInjectionOutTreeTable(selectedTopProductParkId);

        if (data != null) {
            this.setState({productParkTree: data});
        }

        this.setState({loadingProductParkTree: false});
    }

    renderProductParkDiagramArea() {
        return(
            MyDiagram(this.state.productParkTree)
        );
    }

    render() {
        let topProductParkSelectList = !this.state.loadingTopProductParkList && this.state.topProductParkList != null
            ? this.state.topProductParkList.map(topProductPark => <option value={topProductPark.id}>{topProductPark.tip_npo_name} - {topProductPark.name} ({topProductPark.id})</option>)
            : null;
        let productParkTreeDiagram = !this.state.loadingProductParkTree && this.state.productParkTree != null
            ? this.renderProductParkDiagramArea()
            : null;
        
        return (
            <Container className="mt-2" style={{ width: '1000px'}}>
                <Form>
                    <Form.Group className="mb-3"
                        value={this.state.selectedTopProductParkId}
                        onChange={e => {
                            this.setState({selectedTopProductParkId: e.target.value});
                            this.enterAndLoadProductParkTree(e.target.value);
                        }}>
                            <Form.Label>Верхний продуктовый парк</Form.Label>
                            <Form.Select disabled={this.state.topProductParkList == null || this.state.loadingTopProductParkList}>
                                {topProductParkSelectList}
                            </Form.Select>
                    </Form.Group>
                </Form>

                {productParkTreeDiagram}
            </Container>
        )
    }
}
