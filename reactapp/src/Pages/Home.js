import React, { Component } from "react"
import { Container, Form, Button, Col, Row } from "react-bootstrap";

import { CommunicationWithServer } from "../FunctionalClasses/CommunicationWithServer"

import MyDiagram, { Orientation, SideForStart } from "../Components/MyDiagram";
import { CheckboxTreeWidget } from "../Components/CheckboxTree";

export class Home extends Component {
    constructor(props) {
        super(props);

        this._child = React.createRef();

        this.state = {
            checkboxTreeNodes: [],
            selectedTopProductParkId: -1,
            topProductParkList: null, loadingTopProductParkList: false,
            searchingByObjectNameArea: null, searchByObjectsFilters: [],
            productParkTree: null, loadingProductParkTree: false,
            productParkTreeDiagram: null,
        };
    }

    componentDidMount() {
        this.loadTopProductParkList();
        this.loadClassification();
    }

    async loadTopProductParkList() {
        this.setState({ topProductParkList: null, loadingTopProductParkList: true });

        const data = await CommunicationWithServer.GetParentInjectionOutList();

        if (data != null) {
            this.setState({ topProductParkList: data, selectedTopProductParkId: data[0].id });
        }

        this.setState({ loadingTopProductParkList: false });
    }

    async loadClassification() {
        this.setState({ checkboxTreeNodes: [] });
        let nodes = [];
        let dirtyId = 0;

        const data = await CommunicationWithServer.GetInjectionInOutClassification();

        if (data != null) {
            for (const topKey in data) {
                const topNode = data[topKey];
                let topChildren = [];

                for (const middleKey in topNode) {
                    const middleNode = topNode[middleKey];
                    let middleChildren = [];

                    for (const downElementId in middleNode) {
                        const downElement = middleNode[downElementId];

                        middleChildren.push({
                            value: downElement.id,
                            label: downElement.name2
                        });
                    }

                    topChildren.push({
                        value: dirtyId--,
                        label: middleKey,
                        children: middleChildren
                    });
                }

                nodes.push({
                    value: dirtyId--,
                    label: topKey,
                    children: topChildren
                });
            }
        }

        this.setState({ checkboxTreeNodes: nodes });
    }

    async enterAndLoadProductParkTree() {
        this.setState({ productParkTree: null, loadingProductParkTree: true });

        const data = await CommunicationWithServer.GetInjectionOutTreeTable(this.state.selectedTopProductParkId, this._child.current.getCheckedArray());

        if (data != null) {
            this.state.productParkTree = data;

            {
                let searchByObjectsFilters = {};

                for (let key in data) {
                    searchByObjectsFilters[key] = "";
                }

                this.state.searchByObjectsFilters = searchByObjectsFilters;
            }

            this.renderSearchByNameArea();
            this.renderProductParkDiagramArea();
        }

        this.setState({ loadingProductParkTree: false });
    }

    renderSearchByNameArea() {
        let searchParametrsArea = [];
        let searchParametrs = [];

        for (let key in this.state.productParkTree) {
            searchParametrs.push(key);
        }

        const handleOnInput = (e, key) => {
            const value = e.target.value;

            let searchByObjectsFilters = this.state.searchByObjectsFilters;

            searchByObjectsFilters[key] = value;

            this.setState({ searchByObjectsFilters: searchByObjectsFilters })
        };

        searchParametrsArea =
            (<Row className="mt-2 mb-2">
                {searchParametrs.map(key =>
                    <Col>
                        <Form.Group className="mb3">
                            <Form.Control type="text" placeholder={key}
                                value={this.state.searchByObjectsFilters[key]}
                                onInput={e => handleOnInput(e, key)}
                            />
                        </Form.Group>
                    </Col>
                )}

                <Col xs="auto">
                    <Button className="mb-3" variant="primary" type="button">
                        Поиск
                    </Button>
                </Col>
            </Row>);

        this.setState({ searchingByObjectNameArea: searchParametrsArea });
    }

    renderProductParkDiagramArea() {
        this.setState({
            productParkTreeDiagram:
                <MyDiagram table={this.state.productParkTree} orientation={Orientation.Horizontal} sideForStart={SideForStart.Begin} searchByObjectsFilters={this.state.searchByObjectsFilters} />
        });
    }

    render() {
        let topProductParkSelectList = !this.state.loadingTopProductParkList && this.state.topProductParkList != null
            ? this.state.topProductParkList.map(topProductPark => <option value={topProductPark.id}>{topProductPark.name} ({topProductPark.id})</option>)
            : null;
        let searchingByObjectNameArea = !this.state.loadingProductParkTree && this.state.productParkTreeDiagram != null
            ? this.state.searchingByObjectNameArea
            : null;
        let productParkTreeDiagram = !this.state.loadingProductParkTree && this.state.productParkTreeDiagram != null
            ? this.state.productParkTreeDiagram
            : null;

        const handleClickLoad = () => this.enterAndLoadProductParkTree();

        return (
            <Container fluid>
                <Row>
                    <Col>
                        <Form>
                            <Form.Group className="mb-3"
                                value={this.state.selectedTopProductParkId}
                                onChange={e => this.setState({ selectedTopProductParkId: e.target.value })}>
                                <Form.Label>Верхний продуктовый парк</Form.Label>
                                <Form.Select disabled={this.state.topProductParkList == null || this.state.loadingTopProductParkList || this.state.loadingProductParkTree}>
                                    {topProductParkSelectList}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group>
                                {<CheckboxTreeWidget ref={this._child} nodes={this.state.checkboxTreeNodes} />}
                            </Form.Group>

                            <Button className="mt-3 mb-3" variant="primary" type="button"
                                disabled={this.state.loadingProductParkTree || this.state.selectedTopProductParkId <= 0}
                                onClick={handleClickLoad}>
                                {!this.state.loadingProductParkTree ? "Отобразить" : "Загружается"}
                            </Button>
                        </Form>
                    </Col>

                    <Col xs="auto">
                        <Row>
                            {searchingByObjectNameArea}
                        </Row>
                        <Row>
                            {productParkTreeDiagram}
                        </Row>
                    </Col>
                </Row>
            </Container>
        )
    }
}
