import React from "react";
import { ChevronLeft } from "react-feather";

const AlbumCovers = props => {
  const selectedAlbum = id => props.play(id.currentTarget.id);
  const clearSearch = () => props.clear();

  return props.covers.length > 0 ? (
    <>
      <div className="display-heading">
        <button className="btn btn-icn" type="button" onClick={clearSearch}><ChevronLeft /></button>
        <h2><em>"{props.artist.name}"</em> Albums</h2>
      </div>
      <div className="grid">
      {
        props.covers.map((album,idx) => {
          return album.album_type !== "single" ?
            <div className="grid-item" id={album.id} key={idx} onClick={selectedAlbum}>
              <h3>{album.name}</h3>
              <img className="img-fluid" src={album.images[0].url} alt={album.name+' - Album Cover'} />
            </div>
            : ''
        })
      }
      </div>
    </>
  ) : ''
}

export default AlbumCovers;