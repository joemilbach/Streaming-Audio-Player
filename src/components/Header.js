import React, { useRef, useState, useEffect } from "react";

const Header = props => {
  const [searchActive, setSearchActive] = useState(JSON.parse(localStorage.getItem("searchInput")) !== null && JSON.parse(localStorage.getItem("searchInput"))[0].query !== "" ? true : false);
  const searchInput = useRef();
  const searchValue = val => props.query(val.target.value);

  const searchSubmit = e => {
    e.preventDefault();
    props.submit();
    searchInput.current.blur();
    setSearchActive(true);
  }

  const searchClear = () => {
    searchInput.current.value = "";
    searchInput.current.focus();
    props.query("");
    setSearchActive(false);
  }

  useEffect(() => {
    props.reset === "" ? searchInput.current.focus() : searchInput.current.blur();
  }, [props.reset]);

  return (
    <header className={searchActive ? "active" : ""}>
      <h1><span>[</span><small>JM</small><span>]</span></h1>
      <form className="form" onSubmit={(e) => searchSubmit(e)}>
        <div className="input-group">
          <input ref={searchInput} type="text" className="form-control" value={props.search[0].query} placeholder="Band Name?" onChange={(val) => searchValue(val)} />
          <button className="btn" type="submit">Search</button>
        </div>
        <button className={props.reset !== "" ? "btn btn-icn icn-x" : "hidden"} type="button" onClick={searchClear}></button>
      </form>
    </header> 
  );
}

export default Header;