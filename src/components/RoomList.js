import React, { Component } from 'react';

class RoomList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      roomName: '',
      newRoomName: null,
      rooms: []
    };

    this.roomsRef = this.props.firebase.database().ref('rooms');
    this.handleChange = this.handleChange.bind(this);
    this.createRoom = this.createRoom.bind(this);
  }

  componentDidMount() {
    this.roomsRef.on('child_added', snapshot => {
      const room = snapshot.val();
      room.key = snapshot.key
      this.setState({ rooms: this.state.rooms.concat( room ) });
    });
      this.roomsRef.on('child_removed', snapshot => {
      this.setState({ rooms: this.state.rooms.filter(r => r.key !== snapshot.key )});
    });
  }

  handleChange(e) {
    this.setState({
    [e.target.name]: e.target.value
    });
  }

  createRoom(e) {
    e.preventDefault();
    const item = {
      roomName: this.state.roomName
    }
    this.roomsRef.push(item);
    this.setState({
      roomName: ''
    })
  }

  deleteRoom(item) {
    this.roomsRef.child(item.key).remove();
  }

  renameRoom(room) {
    const item = {
      roomName: this.state.newRoomName
    }
    this.roomsRef.child(room.key).update(item);
  }


  render() {
    return(
      <div>
        <h1>Bloc Chat Delux</h1>
        <form>
          <input type="text" name="roomName" placeholder="Enter room name" value={this.state.roomName} onChange={this.handleChange} />
          <input type="submit"  onClick={(e) => this.createRoom(e)} />
        </form>
        {this.state.rooms.map( (r,index) =>
        <div key={index}>
        <p onClick={() => this.props.setRoom(r)}>{r.roomName}</p>
        <button onClick={() => this.deleteRoom(r)}>Delete Room</button>
        <form>
        <input type="text" name="newRoomName" placeholder="rename room" value={this.state.newRoomName} onChange={this.handleChange} />
        <input type="submit"  onClick={() =>this.renameRoom(r)} />
        </form>
        </div> )}
      </div>
    );
  }
}

export default RoomList;
