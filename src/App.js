import React, { Component } from "react";
import rough from "roughjs";
import Toolbar from "./Components/Toolbar";
import { PENCIL, SQUARE } from "./Components/Toolbar/tools";

class App extends Component {
    constructor() {
        super();
        this.rc = null;
        this.canvas = null;
        this.canvasPosition = null;

        this.dragStart = false;
        this.dragStartCoordinates = {};

        this.state = {
            selectedTool: "pencil"
        };
    }

    componentDidMount() {
        this.canvas = document.getElementById("canvas");
        this.rc = rough.canvas(this.canvas);
        this.canvasPosition = document.getElementById("canvas").getBoundingClientRect();
    }

    stopEventBubbling = e => {
        e.stopPropagation();
        e.preventDefault();
    };

    onMouseDown = event => {
        this.dragStart = true;
        // console.log("onMouseDown", event, event.clientX, event.clientY);
        this.stopEventBubbling(event);
        this.dragStartCoordinates = {
            x: event.clientX - this.canvasPosition.x,
            y: event.clientY - this.canvasPosition.y
        };

        if (this.state.selectedTool === SQUARE) {
            this.setState({
                previewBox: {
                    startX: event.clientX - this.canvasPosition.x,
                    startY: event.clientY
                }
            });
        }
    };

    onMouseMove = event => {
        if (!this.dragStart) {
            return;
        }
        // console.log("onMouseMove", event);
        this.stopEventBubbling(event);

        if (this.state.selectedTool === PENCIL) {
            this.draw([
                [this.dragStartCoordinates.x, this.dragStartCoordinates.y],
                [event.clientX - this.canvasPosition.x, event.clientY - this.canvasPosition.y]
            ]);
            this.dragStartCoordinates = {
                x: event.clientX - this.canvasPosition.x,
                y: event.clientY - this.canvasPosition.y
            };
        }

        if (this.state.selectedTool === SQUARE) {
            let previewBox = this.state.previewBox;
            previewBox.stopX = event.clientX - this.canvasPosition.x;
            previewBox.stopY = event.clientY;
            this.setState({
                previewBox: previewBox
            });
        }
    };

    onMouseUp = event => {
        this.dragStart = false;
        this.stopEventBubbling(event);
        // console.log("onMouseUp", event);
        if (this.state.selectedTool === SQUARE) {
            this.draw([
                [this.dragStartCoordinates.x, this.dragStartCoordinates.y],
                [event.clientX - this.canvasPosition.x, event.clientY - this.canvasPosition.y]
            ]);
            // this.setState({
            // previewBox: false
            // });
        }
    };

    draw = coordinates => {
        switch (this.state.selectedTool) {
            case PENCIL:
                this.rc.curve(coordinates, {
                    strokeWidth: 2
                });
                break;
            case SQUARE:
                this.rc.rectangle(
                    coordinates[0][0],
                    coordinates[0][1],
                    coordinates[1][0] - coordinates[0][0],
                    coordinates[1][1] - coordinates[0][1]
                );
                break;
            default:
                break;
        }
    };

    export = () => {
        var html = "<p>Right-click on image below and Save-Picture-As</p>";
        html += "<img src='" + this.canvas.toDataURL() + "' alt='from canvas'/>";
        var tab = window.open();
        tab.document.write(html);
    };

    updateCurrentTool = tool => {
        this.setState({
            selectedTool: tool
        });
    };

    render() {
        console.log(this.state.previewBox);
        return (
            <div className="App">
                <h1 className="doodle">Doodle</h1>
                <p className="App-intro" onClick={this.export}>
                    Save Doodle.
                </p>
                <div className="paper">
                    <canvas
                        id="canvas"
                        width="800"
                        height="600"
                        onMouseDown={this.onMouseDown}
                        onMouseMove={this.onMouseMove}
                        onMouseUp={this.onMouseUp}
                    />
                    {this.state.previewBox &&
                        this.state.previewBox.stopX && (
                            <div
                                className="preview-box"
                                style={{
                                    top: this.state.previewBox.startX,
                                    left: this.state.previewBox.startY,
                                    width: this.state.previewBox.stopX - this.state.previewBox.startX,
                                    height: this.state.previewBox.stopY - this.state.previewBox.startY
                                }}
                            />
                        )}
                </div>
                <Toolbar selected={this.state.selectedTool} updateSelection={this.updateCurrentTool} />
            </div>
        );
    }
}

export default App;
