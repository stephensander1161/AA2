import logo from "./logo.svg";
import "./App.css";
import { API } from "aws-amplify";
import React, { useState } from "react";

const myAPI = "apie2312971";
const path = "/users";

const App = () => {
  const [input, setInput] = useState("");
  const [users, setUsers] = useState([]);

  //function to fetch from our backend and update user array

  function getUser(e) {
    API.get(myAPI, path + "/" + input)
      .then((response) => {
        console.log("response: ", response);
        let newUsers = [...users];
        newUsers.push(response);
        setUsers(newUsers);
      })
      .catch((err) => {
        console.log("error: ", err);
      });
  }
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div>
          <input
            placeholder="type a name!"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <br />
        <button
          style={{ marginBottom: "10px", padding: "5px" }}
          onClick={() => getUser(input)}
        >
          PRESS THE MAGIC BUTTON
        </button>

        {users.map((response, index) => {
          return (
            <div key={index}>
              <span>
                <b>{response} </b>
              </span>
            </div>
          );
        })}
      </header>
    </div>
  );
};

export default App;
