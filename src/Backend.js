import firebase from 'firebase';


class Backend {
  uid = '';
  messageRef = null;
  // initialize firebase.
  constructor() {
    firebase.initializeApp({
      apiKey: 'AIzaSyDJwaW-vFFrOQJxBNdZPo9e-_NiouC4hvQ',
      authDomain: 'chatting-51f0e.firebaseapp.com',
      databaseURL: 'https://chatting-51f0e.firebaseio.com',
      projectId: 'chatting-51f0e',
      storageBucket: 'chatting-51f0e.appspot.com',
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

export default new Backend();
