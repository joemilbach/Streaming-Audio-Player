import React, { useRef, useEffect } from "react";

const Header = props => {
  const searchInput = useRef();
  const searchValue = val => props.query(val.target.value);

  const searchSubmit = e => {
    e.preventDefault();
    props.submit();
    searchInput.current.blur();
    searchInput.current.value = '';
  }

  useEffect(() => {
    props.reset === "" ? searchInput.current.focus() : searchInput.current.blur();
  }, [props.reset]);

  return (
    <header className={props.results.length > 0 ? 'active' : ''}>
      <h1><span>[</span><small>JM</small><span>]</span></h1>
      <form className="form" onSubmit={(e) => searchSubmit(e)}>
      { props.search.map((idx) =>
        <div key={idx} className="input-group">
          <input ref={searchInput} type="text" className="form-control" value={props.search.value} placeholder="What band are you looking for?" onChange={(val) => searchValue(val)} />
          <button className="btn" type="submit">Search</button>
        </div> 
      )}
      </form>
    </header> 
  );
}

export default Header;