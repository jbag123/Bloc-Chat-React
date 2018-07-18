import React, { Component } from 'react';

class MessageList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      content: "",
      sentAt: "",
      roomId: "",
      allMessages: [],
      displayedMessages: []
    }

    this.messageRef = this.props.firebase.database().ref('messages');
    this.handleChange = this.handleChange.bind(this);
    this.createMessage = this.createMessage.bind(this);
  }

  componentDidMount() {
    this.messageRef.on('child_added', snapshot => {
      const message = snapshot.val();
      message.key = snapshot.key;
      this.setState({ allMessages: this.state.allMessages.concat( message ) });
    });
  }

  componentDidUpdate(prevProps) {
    this.setState({ displayedMessages: this.state.allMessages.filter(m => m.roomId === prevProps.activeRoom.key ) });
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  createMessage(e) {
    e.preventDefault();
    const item = {
      username: this.props.user.displayName,
      content: this.state.content,
      sentAt: this.props.firebase.database.ServerValue.TIMESTAMP,
      roomId: this.props.activeRoom.key
    }
    this.messageRef.push(item)
    this.setState({
      username: "",
      content: "",
      sentAt: "",
      roomId: ""
    });
  }


  render() {
    return(
      <div>
        <form>
          <input type="text" name="content" placeholder="Enter message" value={this.state.content} onChange={this.handleChange} />
          {this.props.activeRoom ?
          <input type="submit" onClick={(e) => this.createMessage(e)} />
          :
          <p>There is no active room, please select</p>
          }
        </form>
        {this.state.displayedMessages.map( (m,index) => <div key={index}><p>Message: {m.content} - Room name: {this.props.activeRoom.roomName} - User name: {this.props.user.displayName}</p><p></p></div> )}
      </div>
    );
  }
}
export default MessageList;
