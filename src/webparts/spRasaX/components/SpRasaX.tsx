import * as React from "react";
import styles from "./SpRasaX.module.scss";
import { ISpRasaXProps, ISpRasaXState } from "./ISpRasaXProps";
import { Web } from "sp-pnp-js";
import Widget from "rasa-webchat";
import "./SpRasaX.css";

const logo: any = require("../../assets/image/logo-ptt.png");

export default class SpRasaX extends React.Component<ISpRasaXProps, ISpRasaXState> {
  constructor(props: ISpRasaXProps, state: ISpRasaXState) {
    super(props);
    this.state = {
      fullName: "",
      viewImg: false,
      image: ""
    };
  }

  public async componentDidMount() {
    await this.getPermission();
    setTimeout(() => this.addEventToImg(), 500);
  }

  private async getPermission() {
    let webPnP = new Web(`${this.props.webURL}`);
    let user: any = await webPnP.currentUser.get();
    this.setState({
      fullName: user.Title
    });
  }

  private addEventToImg() {
    let elementImg = document.getElementsByClassName("rw-image-frame");
    for (let i = 0; i < elementImg.length; i++) {
      console.log(elementImg[i]);
      elementImg[i].addEventListener("click", e => this.handleViewImg(e));
    }
  }

  private handleViewImg(e) {
    e.preventDefault();
    this.setState({ image: e.target.currentSrc });
    this.setState({ viewImg: true });
  }

  private handleClose(e) {
    e.preventDefault();
    this.setState({ viewImg: false });
  }

  public render(): React.ReactElement<ISpRasaXProps> {
    return (
      <>
        {/* 
        <div>
          Your website
        </div> 
        */}

        {/* widget chat */}
        {this.state.fullName && (
          <Widget
            initPayload={"/greet"}
            socketUrl={"http://localhost:5005"}
            socketPath={"/socket.io/"}
            customData={{ language: "en", fullName: this.state.fullName }} // arbitrary custom data. Stay minimal as this will be added to the socket
            title={"OGC Smart Chatbot"}
            showMessageDate={true}
            onSocketEvent={{
              bot_uttered: e => {
                if (e.attachment) {
                  setTimeout(() => this.addEventToImg(), 1000);
                }
              },
              connect: () => console.log("connection established")
            }}
            //logo profile
            profileAvatar={logo}
            //Input Text Field
            inputTextFieldHint={"What's in your mind?..."}
            tooltipPayload={"/greet"}
            docViewer={true}
            onWidgetEvent={{
              onChatClose: () => setTimeout(() => this.addEventToImg(), 500),
              onChatOpen: () => setTimeout(() => this.addEventToImg(), 500)
            }}
          />
        )}

        {/* Popup image */}
        {this.state.viewImg && (
          <div className="popup-img">
            <div>
              <div>
                <a className="close-img" onClick={e => this.handleClose(e)}>
                  &#10060;
                </a>
              </div>
              <div>
                <img className="popup-inner-img" src={this.state.image}></img>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}