import React from "react";

import './Playlist.css'

import TrackList from "../TrackList/TrackList";

class Playlist extends React.Component {

    constructor(props) {
      super(props)
    
        this.handleNameChange=this.handleNameChange.bind(this)

    }

    handleNameChange(event){
        this.onNameChange(event.target.value)
    }



    render() {
        return(
            <div className="Playlist">
            <input onNameChange={this.handleNameChange} defaultValue={'New Playlist'} />
            </div>
        )
    }
}