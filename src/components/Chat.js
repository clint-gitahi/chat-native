import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import Backend from '../Backend';

class Chat extends React.Component {
   state = {
     messages: [],
   }

  componentDidMount() {
    Backend.loadMessages((message) => {
      this.setState((previousState) => {
        return {
          messages: GiftedChat.append(previousState.messages, message)
        };
      });
    });
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={(message) => {
          // send message to the backend.
          Backend.sendMessage(message);
        }}
        user={{
          _id: Backend.getUid(),
          name: this.props.name,
        }}
      />
    );
  }
  
}

Chat.defaultProps = {
  name: 'John',
};

Chat.propTypes = {
  name: React.PropTypes.string,
};

export default Chat;
