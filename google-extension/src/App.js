    /*global chrome*/
import './App.css';
import React, {useState, useEffect} from "react";
import { Header, Table} from 'semantic-ui-react'; // header
import { Input} from 'semantic-ui-react'; // input


function App() {
  const [searchInput, setSearchInput] = useState();
  const [search, setSearch] = useState([]);

  // not work, need to use chrome environment
  var selection = window.getSelection().toString();

  const SearchPaper = () => {
    
  }
  return (
    <div className="App">
    <Header as='h0'>Search for Paper Suggestions for CS410</Header>
      <div className="form">
        <Input type="text" placehoder="Search" onChange = {(event) => {
          setSearchInput(event.target.value);
        }}/>
      </div>
      <button onClick = {SearchPaper}> Search </button>
    </div>
  );
}

export default App;
