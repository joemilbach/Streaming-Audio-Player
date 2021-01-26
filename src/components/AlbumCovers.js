import React from "react";

const AlbumCovers = props => {
  const selectedAlbum = (event, album) => {
    props.selected({
      artist: album.artists[0].name,
      album: album.name,
      uri: "https://open.spotify.com/embed/album/"+event.currentTarget.id
    });
  }

  const clearSearch = () => {
    props.selected({artist: "", album: "", uri: ""});
    props.clear();
  }

  const clearPlayer = () => props.selected({artist: "", album: "", uri: ""});

  if(props.covers.length < 1) return null;

  return (
    <section>
      <div className="display-heading">
        <button className="btn btn-icn icn-chevron-left" type="button" onClick={props.src.album ? clearPlayer : clearSearch}></button>
        <h2><em>{props.artist.name}</em>{props.src.album ? ": "+props.src.album : " Albums"}</h2>
      </div>
      <div className={props.src.uri ? 'player-active': 'player-hidden'}>
        <iframe title="audio-player" id="audio-player" src={props.src.uri} frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>
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