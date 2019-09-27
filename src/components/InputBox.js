import React from "react";
import { CSSTransitionGroup, CSSTransition } from "react-transition-group";

class InputBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: "",
      invalidVisible: "hidden",
      invalidOpacity: 0
    };
  }

  render() {
    const invalidVisible = this.state.invalidVisible;
    const invalidOpacity = this.state.invalidOpacity;
    return (
      <div className="inputbox">
        <form onSubmit={this.submitHandler.bind(this)}>
          <input
            value={this.state.inputValue}
            onChange={evt => this.updateInputValue(evt)}
            spellCheck="false"
          />
        </form>
        <div
          id={"invalidinput"}
          style={{ visibility: invalidVisible, opacity: invalidOpacity }}
        >
          Invalid input.
        </div>
      </div>
    );
  }

  submitHandler(evt) {
    evt.preventDefault();
    let input = this.state.inputValue.replace(/ /g, "").toLowerCase();
    let item = "";
    let inter = "";
    let inspect = "";

    if (input.includes("pickup")) {
      item = input.replace("pickup", "").toLowerCase();
      input = "pick up";
    } else if (input.includes("use")) {
      if (input.includes("on")) {
        input = input.replace("use", "").toLowerCase();
        input = input.split("on");
        item = input[0];
        inter = input[1];
        input = "use on";
      } else {
        item = input.replace("use", "").toLowerCase();
        input = "use";
      }
    } else if (input.includes("interact")) {
      inter = input.replace("interact", "").toLowerCase();
      input = "interact";
    } else if (input.includes("inspect")) {
      inspect = input.replace("inspect", "");
      input = "inspect";
    } else if (input.includes("enter")) {
      inspect = input.replace("enter", "");
      input = "enter";
    }

    switch (input) {
      case "describe":
        this.props.onDescribe();
        break;
      case "inventory":
        this.props.onInventory();
        break;
      case "pick up":
        this.props.onPickUp(item);
        break;
      case "use on":
        this.props.onUseOn(item, inter);
        break;
      case "use":
        this.props.onUse(item);
        break;
      case "interact":
        this.props.onInteract(inter);
        break;
      case "inspect":
        this.props.onInspect(inspect);
        break;
      case "enter":
        this.props.onEnter(inspect);
        break;
      case "help":
        this.props.onHelp();
        break;
      default:
        this.invalidInput();
    }

    this.setState({
      inputValue: ""
    });
  }

  updateInputValue(evt) {
    this.setState({
      inputValue: evt.target.value
    });
  }

  invalidInput = () => {
    this.setState({
      invalidVisible: "visible",
      invalidOpacity: 1
    });
    setTimeout(
      function() {
        this.setState({
          invalidVisible: "hidden",
          invalidOpacity: 0
        });
      }.bind(this),
      250
    );
  };
}

export default InputBox;
