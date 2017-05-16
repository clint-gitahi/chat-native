# Chat-Native

I decided to try out 

-[React native gifted chat](https://github.com/FaridSafi/react-native-gifted-chat)

-[React native router flux](https://github.com/aksonov/react-native-router-flux)

to build a chat component.

## ScreenShots:

![](https://github.com/clint-gitahi/chat-native/blob/master/img/chat.png)
![](https://github.com/clint-gitahi/chat-native/blob/master/img/chat2.png)


## Backend:
[Backend](https://github.com/clint-gitahi/chat-native/blob/master/src/Backend.js) is built with [firebase](https://firebase.google.com/) 

```js
class Backend {
  uid = '';
  messageRef = null;
  // initialize firebase.
  constructor() {
    firebase.initializeApp({
      apiKey: '',
      authDomain: '',
      databaseURL: '',
      projectId: '',
      storageBucket: '',
    });
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setUid(user.uid);
      } else {
        firebase.auth().signInAnonymously().catch((error) => {
          alert(error.message);
        });
      }
    });
  }

  setUid(value) {
    this.uid = value;
  }
  getUid() {
    return this.uid;
  }

  // retrieving messages from firebase.
  loadMessages(cb) {
    this.messagesRef = firebase.database().ref('messages');
    this.messagesRef.off();
    const onReceive = (data) => {
      const message = data.val();
      cb({
        _id: data.key,
        text: message.text,
        createdAt: new Date(message.createdAt),
        user: {
          _id: message.user._id,
          name: message.user.name,
        },
      });
    };
    this.messagesRef.limitToLast(20).on('child_added', onReceive);
  }

  // send the message to the Backend
  sendMessage(message) {
    for (let i = 0; i < message.length; i++) {
      this.messagesRef.push({
        text: message[i].text,
        user: message[i].user,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
      });
    }
  }

  // diabling the connection to the backend
  closeChat() {
    if (this.messagesRef) {
      this.messagesRef.off();
    }
  }
}
```
