import React, {Component} from "react";

export default class Popup extends Component {
    render() {
        return (
            <div className="modal">
                <div className="modal_content">
                    <p>I'm A Pop Up!!!</p>
                    <button onClick={this.props.closePopup}>close me</button>
                </div>
            </div>
        );
    }
}