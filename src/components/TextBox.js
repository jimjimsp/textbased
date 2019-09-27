import React from "react";
import { CSSTransitionGroup } from "react-transition-group";
import InputBox from "./InputBox.js";
import itemsFile from "../res/items.json";
import interactFile from "../res/interactables.json";

class TextBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      log: [],
      status: [],
      curr_room: "testroom",
      inventory: [],
      description: "",
      items: [],
      interactables: []
    };
  }

  render() {
    const logItems = this.state.log.map((logItem, i) => (
      <p className="logitem" key={i}>
        {logItem}
      </p>
    ));

    return (
      <div className="game">
        <div className="textbox">
          <CSSTransitionGroup
            transitionName="example"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300}
          >
            {logItems}
          </CSSTransitionGroup>
          <div
            style={{ float: "left", clear: "both" }}
            ref={el => {
              this.messagesEnd = el;
            }}
          />
        </div>
        <InputBox
          onDescribe={this.onDescribe}
          onInventory={this.onInventory}
          onPickUp={this.onPickUp}
          onUseOn={this.onUseOn}
          onUse={this.onUse}
          onInteract={this.onInteract}
          onInspect={this.onInspect}
          onEnter={this.onEnter}
          onHelp={this.onHelp}
          onError={this.onError}
        />
      </div>
    );
  }

  componentDidMount() {
    this.scrollToBottom();
    var room = require("../res/" + this.state.curr_room + ".json");
    this.setState({
      description: room.description,
      items: room.items,
      interactables: room.interactables,
      log: [...this.state.log, room.enter_message]
    });
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  };

  onDescribe = () => {
    this.setState({
      log: [...this.state.log, this.state.description]
    });
  };

  onInventory = () => {
    this.setState({
      log: [...this.state.log, "Inventory:" + this.state.inventory]
    });
  };

  onPickUp = curr_item => {
    if (curr_item === "") {
      this.onError();
      return;
    }

    if (this.state.items.includes(curr_item)) {
      var item = itemsFile.items.find(item => item.name === curr_item);
      if (
        this.state.status.includes(item.pick_up_criterion) ||
        item.pick_up_criterion === "null"
      ) {
        this.setState({
          inventory: [...this.state.inventory, curr_item],
          log: [...this.state.log, "You picked up " + curr_item]
        });
      } else {
        this.setState({
          log: [...this.state.log, item.pick_up_failed]
        });
      }
    } else {
      this.setState({
        log: [...this.state.log, "You can't find " + curr_item]
      });
    }
  };

  onUseOn = (curr_item, curr_inter) => {
    if (curr_inter === "" || curr_item === "") {
      this.onError();
      return;
    }
    if (this.state.inventory.includes(curr_item)) {
      var item = itemsFile.items.find(item => item.name === curr_item);
      if (this.state.interactables.includes(curr_inter)) {
        if (curr_inter === item.interactable) {
          if (
            this.state.status.includes(item.use_on_criterion) ||
            item.use_on_criterion === "null"
          ) {
            this.setState({
              log: [...this.state.log, item.use_on_message],
              status: [...this.state.status, item.use_on_status]
            });
          } else {
            this.setState({
              log: [...this.state.log, item.use_on_failed]
            });
          }
        } else {
          this.setState({
            log: [
              ...this.state.log,
              "I can't use " + curr_item + " on " + curr_inter
            ]
          });
        }
      } else {
        this.setState({
          log: [...this.state.log, "I can't find " + curr_inter]
        });
      }
    } else {
      this.setState({
        log: [...this.state.log, "I don't have " + curr_item]
      });
    }
  };

  onUse = curr_item => {
    if (curr_item === "") {
      this.onError();
      return;
    }
    if (this.state.inventory.includes(curr_item)) {
      var item = itemsFile.items.find(item => item.name === curr_item);
      console.log("use_status: " + item.use_status);
      if (item.use_status !== "null") {
        console.log("use_criterion: " + item.use_criterion);
        if (
          this.state.status.includes(item.use_criterion) ||
          item.use_criterion === "null"
        ) {
          this.setState({
            log: [...this.state.log, item.use_message],
            status: [...this.state.status, item.use_status]
          });
        } else {
          this.setState({
            log: [...this.state.log, item.use_failed]
          });
        }
      } else {
        this.setState({
          log: [...this.state.log, item.inspect]
        });
      }
    } else {
      this.setState({
        log: [...this.state.log, "I don't have " + curr_item]
      });
    }
  };

  onInteract = curr_inter => {
    if (curr_inter === "") {
      this.onError();
      return;
    }
    if (this.state.interactables.includes(curr_inter)) {
      var inter = interactFile.interactables.find(
        inter => inter.name === curr_inter
      );
      if (this.state.status.includes(inter.interact_status)) {
        this.setState({
          log: [...this.state.log, inter.interact_message_done]
        });
        return;
      }
      if (inter.inter_status !== "null") {
        if (
          this.state.status.includes(inter.interact_criterion) ||
          inter.interact_criterion === "null"
        ) {
          this.setState({
            log: [...this.state.log, inter.interact_message],
            status: [...this.state.status, inter.interact_status]
          });
        } else {
          this.setState({
            log: [...this.state.log, inter.interact_failed]
          });
        }
      } else {
        this.setState({
          log: [...this.state.log, inter.inspect]
        });
      }
    } else {
      this.setState({
        log: [...this.state.log, "Can't find " + curr_inter]
      });
    }
  };

  onInspect = curr_inspect => {
    if (curr_inspect === "") {
      this.onError();
      return;
    }
    if (this.state.inventory.includes(curr_inspect)) {
      var item = itemsFile.items.find(item => item.name === curr_inspect);
      this.setState({
        log: [...this.state.log, item.inspect]
      });
    } else if (this.state.interactables.includes(curr_inspect)) {
      var inter = interactFile.interactables.find(
        inter => inter.name === curr_inspect
      );
      this.setState({
        log: [...this.state.log, inter.inspect]
      });
    } else {
      this.setState({
        log: [...this.state.log, "I can't find " + curr_inspect]
      });
    }
  };

  onEnter = curr_inter => {
    if (curr_inter === "") {
      this.onError();
      return;
    }
    if (this.state.interactables.includes(curr_inter)) {
      var inter = interactFile.interactables.find(
        inter => inter.name === curr_inter
      );
      if (inter.type === "door") {
        if (
          this.state.status.includes(inter.enter_criterion) ||
          inter.enter_criterion === "null"
        ) {
          this.setState({
            curr_room: inter.to_room
          });
          this.changeRoom(inter.to_room);
        } else {
          this.setState({
            log: [...this.state.log, inter.enter_failed]
          });
        }
      } else {
        this.setState({
          log: [...this.state.log, "You can't enter " + curr_inter]
        });
      }
    }
  };

  changeRoom = inter => {
    var room = require("../res/" + inter + ".json");
    this.setState({
      description: room.description,
      items: room.items,
      interactables: room.interactables,
      log: [...this.state.log, room.enter_message]
    });
  };

  onHelp = () => {
    this.setState({
      log: [
        ...this.state.log,
        "Status: " + this.state.status,
        "Room: " + this.state.curr_room
      ]
    });
  };

  onError = () => {
    this.setState({
      log: [...this.state.log, "No valid input."]
    });
  };
}

export default TextBox;
