'use strict';

const e = React.createElement;
//import { Widget, addResponseMessage, addLinkSnippet, addUserMessage } from 'react-chat-widget';
//import 'react-chat-widget/lib/styles.css';



class LikeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }


  componentDidMount() {
    addResponseMessage("Welcome to this awesome chat!");
  }

  handleNewUserMessage(newMessage){
    console.log(`New message incomig! ${newMessage}`);
    // Now send the message throught the backend API
  }


  render() {
    if (this.state.liked) {
      return 'You liked this.';
    }

    return e(
      <div>
      <Widget
        handleNewUserMessage={this.handleNewUserMessage}
        title="AhmedBot"
        subtitle="cc c Bouhmid"

      />
    </div>
  );
  }
}

const domContainer = document.querySelector('#like_button_container');
ReactDOM.render(e(LikeButton), domContainer);