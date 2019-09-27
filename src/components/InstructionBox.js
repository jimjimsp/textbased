import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";

class InstructionBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      instructionVisible: "hidden"
    };
  }

  render() {
    return (
      <div className="wrapper">
        <FontAwesomeIcon
          icon={faQuestionCircle}
          className="instructionsicon"
          onClick={this.toggleVisible.bind(this)}
        />
        <div
          className="instructionbox"
          style={{ visibility: this.state.instructionVisible }}
        >
          <h3 className="instructiontitle">Commands</h3>
          <p className="instructionitem">➔ Describe</p>
          <p className="instructionitem">➔ Inventory</p>
          <p className="instructionitem">➔ Pick up [item]</p>
          <p className="instructionitem">➔ Use [item]</p>
          <p className="instructionitem">➔ Use [item] on [interactable]</p>
          <p className="instructionitem">➔ Interact [interactable]</p>
          <p className="instructionitem">➔ Inspect [item / interactable]</p>
          <p className="instructionitem">➔ Enter [door]</p>
        </div>
      </div>
    );
  }

  toggleVisible() {
    let diffValue = "";
    if (this.state.instructionVisible === "hidden") {
      diffValue = "visible";
    } else {
      diffValue = "hidden";
    }
    this.setState({
      instructionVisible: diffValue
    });
  }
}

export default InstructionBox;
