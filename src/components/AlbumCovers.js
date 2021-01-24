import React, { useState } from "react";

const AlbumCovers = props => {
  const [activeAlbum, setActiveAlbum] = useState({artist: "", album: "", uri: ""});

  const selectedAlbum = (event, album) => {
    setActiveAlbum({
      artist: album.artists[0].name,
      album: album.name,
      uri: "https://open.spotify.com/embed/album/"+event.currentTarget.id
    });
  }

  const clearSearch = () => {
    setActiveAlbum("");
    props.clear();
  }

  const clearPlayer = () => setActiveAlbum("");

  if(props.covers.length < 1) return null;

  return (
    <section>
      <div className="display-heading">
        <button className="btn btn-icn icn-chevron-left" type="button" onClick={activeAlbum.album ? clearPlayer : clearSearch}></button>
        <h2><em>{props.artist.name}</em>{activeAlbum.album ? ": "+activeAlbum.album : " Albums"}</h2>
      </div>
      <div className={activeAlbum.uri ? 'player-active': 'player-hidden'}>
        <iframe title="audio-player" id="audio-player" src={activeAlbum.uri} frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
        <div className="grid">
        {
          props.covers.map((album,idx) => {
            if(album.album_type === "single") return null;

            return (
              <div className="grid-item" id={album.id} key={idx} onClick={(e) => selectedAlbum(e, album) }>
                <h3>{album.name}</h3>
                <img className="img-fluid" src={album.images[0].url} alt={album.name+" - Album Cover"} />
              </div>
            )
          })
        }
        </div>
      </div>
    </section>
  );
}

export default AlbumCovers;