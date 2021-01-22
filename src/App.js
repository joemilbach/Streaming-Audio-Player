import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import AlbumCovers from "./components/AlbumCovers";
import { Credentials } from "./Credentials";
import axios from "axios";

//import SpotifyPlayer from 'react-spotify-web-playback';

const App = () => {
  const spotify = Credentials(); 

  const [searchInput, setSearchInput] = useState([{query: ''}]);
  const [auth, setAuth] = useState({code: '', state: '', token: ''});
  const [search, setSearch] = useState({searchValue: '', searchResultsList: []});
  const [albums, setAlbums] = useState([]);
  const [tracks, setTracks,] = useState({trackResults: [], trackList: []});
  const [test, setTest] = useState(false);

  useEffect(() => {
    const spotifyQueryString = window.location.search;
    if(spotifyQueryString) {
      const urlParams = new URLSearchParams(spotifyQueryString);
      setAuth(prevState => ({
        ...prevState,
        code: urlParams.get("code"),
        state: urlParams.get("state")
      }));
    }
  }, []);

  useEffect(() => {
    if(auth.code && !auth.token) {
      axios('https://accounts.spotify.com/api/token', {
        headers: {
          'Content-Type' : 'application/x-www-form-urlencoded',
          'Authorization' : 'Basic ' + btoa(spotify.ClientId + ':' + spotify.ClientSecret)      
        },
        data: 'grant_type=authorization_code&code='+auth.code+'&redirect_uri='+encodeURIComponent(spotify.RedirectURI),
        method: 'POST'
      })
      .then(tokenResponse => {
        setAuth(prevState => ({
          ...prevState,
          token: tokenResponse.data.access_token
        }));
      });
    }
  }, [auth, spotify.ClientId, spotify.ClientSecret, spotify.RedirectURI]);

  const randomString = (length, chars) => {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }
  
  const authenticate = () => {
    const authEndpoint = "https://accounts.spotify.com/authorize";
    const scopes = "streaming user-read-private user-read-email user-read-playback-state user-modify-playback-state user-library-read user-library-modify";
    const state = randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');

    window.open(authEndpoint+"?response_type=code&client_id="+spotify.ClientId+"&scope="+encodeURIComponent(scopes)+"&redirect_uri="+encodeURIComponent(spotify.RedirectURI)+"&state="+state,"_self");
  }
  
  const reset = () => {
    setSearch({searchValue: '', searchResultsList: []});
    setAlbums([]);
    setTracks({trackResults: [], trackList: []});
  }

  const searchQuery = val => {
    setSearchInput([{query: val}]);
    reset();
  }

  const searchClear = () => {
    setSearchInput([{ query: '' }]);
    reset();
  }

  const searchGet = () => {
    const type = 'artist';
    const limit = 12;
    const market = 'US';
    const query = searchInput[0].query;

    setSearch(prevState => ({
      ...prevState,
      searchValue: query
    }));

   axios(`https://api.spotify.com/v1/search?q=${encodeURI(query)}&type=${type}&market=${market}&limit=${limit}`, {
    method: 'GET',
    headers: {
      'Content-Type' : 'application/json',
      'Authorization' : 'Bearer ' + auth.token
    } 
    })
    .then(searchResponse => {
      setSearch(prevState => ({
        ...prevState,
        searchResultsList: searchResponse.data.artists.items
      }));
    })
    .catch(err => {
      if (err.response) {
        console.log(err.response);
      } else if (err.request) {
        console.log(err.request)
      }
    });
  }

  useEffect(() => {
    if(search.searchResultsList.length > 0) {
      const artistID = search.searchResultsList[0].id;
  
      axios(`https://api.spotify.com/v1/artists/${artistID}/albums`, {
        method: 'GET',
        headers: {
          'Content-Type' : 'application/json',
          'Authorization' : 'Bearer ' + auth.token
        }
      })
      .then(albumResponse => setAlbums(albumResponse.data.items))
      .catch(err => {
        if (err.response) {
          console.log(err.response);
        } else if (err.request) {
          console.log(err.request)
        }
      });
    }
  }, [search.searchResultsList, auth]);

  const getTracks = id => {
    axios(`https://api.spotify.com/v1/albums/${id}/tracks`, {
      method: 'GET',
      headers: {
        'Content-Type' : 'application/json',
        'Authorization' : 'Bearer ' + auth.token
      }
    })
    .then(trackResponse => {
      var tracks = [];
      trackResponse.data.items.forEach(item => tracks.push(item.uri));

      setTracks({
        trackResults: trackResponse.data.items,
        trackList: tracks
      });
    })
    .catch(err => {
      if (err.response) {
        console.log(err.response);
      } else if (err.request) {
        console.log(err.request)
      }
    });
  }

  useEffect(() => {
    tracks.trackList.length > 0 ? setTest(true) : setTest(false);
  }, [tracks.trackList]);

  return (
    <>
      <Header isAuth={auth} auth={authenticate} search={searchInput} submit={searchGet} query={searchQuery} results={albums} reset={search.searchValue} />
      <AlbumCovers covers={albums} artist={search.searchResultsList[0]} play={getTracks} clear={searchClear} />
      
      {/*
        test ? <SpotifyPlayer token={token} uris={tracks.trackList} initialVolume=".5" /> : ''
      */}
      
    </>
  );
}

export default App;