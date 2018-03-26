import React, { Component } from "react";
import { PENCIL, SQUARE } from "./tools";
import "./toolbar.css";

export default class Toolbar extends Component {
    render() {
        return (
            <div className="toolbar">
                <i
                    onClick={() => this.props.updateSelection(PENCIL)}
                    className={`fas fa-pencil-alt fa-lg tool ${this.props.selected === PENCIL && "selected"}`}
                />
                <i
                    onClick={() => this.props.updateSelection(SQUARE)}
                    className={`far fa-square fa-lg tool ${this.props.selected === SQUARE && "selected"}`}
                />
            </div>
        );
    }
}
