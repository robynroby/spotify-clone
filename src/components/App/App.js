import React from 'react';
import './App.css';
import Playlist from './Playlist/Playlist'
import SearchBar from '../SearchBar/SearchBar'
import SearchResults from './SeachResults/SeachResults'
import Spotify from '../util/Spotify'

class App extends React.Component{
  constructor(props) {
    super(props)
  
    this.state = {
       SearchResults: [],
       playlistName: 'New Playlist',
       playlistTracks: []
    };

    this.search= this.search.bind(this)
    this.addTrack= this.addTrack.bind(this)
    this.removeTrack= this.removeTrack.bind(this)
    this.updatePlaylistName= this.updatePlaylistName.bind(this)
    this.savePlaylist= this.savePlaylist.bind(this)
    this.removeTrackSearch= this.removeTrackSearch.bind(this)
    this.doThese= this.doThese.bind(this)
  }

  search(term){
    Spotify.search(term).then(SearchResults =>{
              this.setState({SearchResults: SearchResults} )
    });
  }

  addTrack(track){
    let tracks=this.state.playlistTracks
    if(this.removeTrackSearch.find(savedTrack => savedTrack.id === track.id)){
      return;
    }
    tracks.push(track)
    this.setState({playlistTracks: tracks})
  }

  removeTrack(track){
    let tracks = this.state.playlistTracks
    let trackSearch = this.state.SearchResults
    tracks = tracks.filter(currentTrack => currentTrack.id !== track.id)
    trackSearch.unshift(track)
    this.setState({playlistTracks: tracks})
  }

  removeTrackSearch(track){
    let tracks = this.state.SearchResults
    tracks=tracks.filter(currentTrack => currentTrack.id !== track.id)
    this.setState({SearchResults: tracks})
  }

  doThese(track){
    this.addTrack(track)
    this.removeTrackSearch(track)
  }

  updatePlaylistName(name){
    this.setState({updatePlaylistName: name})
  }

  savePlaylist(){
    const trackUris = this.state.playlistTracks.map(track => track.Uri)
    Spotify.savePlaylist(this.state.playlistName,trackUris).then( ()=> {
      this.setState({
        updatePlaylistName: 'New Playlist',
        playlistTracks: []
      })
    })
  }

}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
