import React, { useState } from "react";

const AlbumCovers = props => {
  const [playerURI, setPlayerURI] = useState("");
  const selectedAlbum = albumID => setPlayerURI("https://open.spotify.com/embed/album/"+albumID.currentTarget.id);
  const clearSearch = () => {
    setPlayerURI("");
    props.clear();
  }

  const clearPlayer = () => {
    setPlayerURI("");
  }

  return props.covers.length > 0 ? (
    <section className="">
      <div className="display-heading">
        <button className="btn btn-icn icn-chevron-left" type="button" onClick={clearSearch}></button>
        <h2><em>"{props.artist.name}"</em> Albums</h2>
        {playerURI ? <button className="btn btn-icn icn-x" type="button" onClick={clearPlayer}></button>: ''}
      </div>
      <div class={playerURI ? 'player-active': 'player-hidden'}>
        <iframe title="audio-player" id="audio-player" src={playerURI} frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
        <div className="grid">
        {
          props.covers.map((album,idx) => {
            return album.album_type !== "single" ?
              <div className="grid-item" id={album.id} key={idx} onClick={selectedAlbum}>
                <h3>{album.name}</h3>
                <img className="img-fluid" src={album.images[0].url} alt={album.name+' - Album Cover'} />
              </div>
              : <></>
          })
        }
        </div>
      </div>
    </section>
  ) : ''
}

export default AlbumCovers;