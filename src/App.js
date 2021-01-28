import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import AlbumCovers from "./components/AlbumCovers";
import axios from "axios";

const App = () => {
  const [searchInput, setSearchInput] = useState([{query: ""}]);
  const [auth, setAuth] = useState({token: ""});
  const [search, setSearch] = useState({searchValue: "", searchResultsList: []});
  const [albums, setAlbums] = useState([]);
  const [player, setPlayer] = useState({artist: "", album: "", uri: ""});

  useEffect(() => {
    axios("https://accounts.spotify.com/api/token", {
      headers: {
        "Content-Type" : "application/x-www-form-urlencoded",
        "Authorization" : "Basic " + btoa(process.env.REACT_APP_Client_ID + ":" + REACT_APP_Client_Secret)      
      },
      data: "grant_type=client_credentials",
      method: "POST"
    })
    .then(tokenResponse => {
      setAuth(prevState => ({
        ...prevState,
        token: tokenResponse.data.access_token
      }));
    })
    .catch(err => {
      if (err.response) {
        console.log(err.response);
      } else if (err.request) {
        console.log(err.request)
      }
    });

    if(localStorage.getItem("searchInput") !== null && localStorage.getItem("search") !== null) {
      setSearchInput(JSON.parse(localStorage.getItem("searchInput")));
      setSearch(JSON.parse(localStorage.getItem("search")));
    }
  }, []);
  
  const reset = () => {
    setSearch({searchValue: "", searchResultsList: []});
    setAlbums([]);
    setPlayer({artist: "", album: "", uri: ""});
    localStorage.setItem("searchInput", JSON.stringify([{query: ""}]));
    localStorage.setItem("search", JSON.stringify({searchValue: "", searchResultsList: []}));
  }

  const searchQuery = val => {
    setSearchInput([{query: val}]);
    reset();
  }

  const searchClear = () => {
    setSearchInput([{query: ""}]);
    reset();
  }

  const searchGet = (type = "artist", limit = 12, market = "US") => {
    const query = searchInput[0].query;

    setSearch(prevState => ({
      ...prevState,
      searchValue: query
    }));

    axios(`https://api.spotify.com/v1/search?q=${encodeURI(query)}&type=${type}&market=${market}&limit=${limit}`, {
      method: "GET",
      headers: {
        "Content-Type" : "application/json",
        "Authorization" : "Bearer " + auth.token
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

      localStorage.setItem("searchInput", JSON.stringify(searchInput));
      localStorage.setItem("search", JSON.stringify(search));
  
      axios(`https://api.spotify.com/v1/artists/${artistID}/albums`, {
        method: "GET",
        headers: {
          "Content-Type" : "application/json",
          "Authorization" : "Bearer " + auth.token
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
  }, [search.searchResultsList, search, searchInput, auth]);

  return (
    <>
      <Header search={searchInput} submit={searchGet} query={searchQuery} results={albums} reset={search.searchValue} />
      <AlbumCovers covers={albums} artist={search.searchResultsList[0]} clear={searchClear} selected={setPlayer} src={player} />
    </>
  );
}

export default App;