import React, { useState, useEffect } from "react";

import Navigation from "./components/Navigation/Navigation.js";
import ImageForm from "./components/ImageForm/ImageForm.js";
import Signin from "./components/Signin/Signin.js";
import Register from "./components/Register/Register.js";
import Rank from "./components/Rank/Rank.js";
import FindFace from "./components/FindFace/FindFace.js";
import Background from "./components/Background/Background.js";

import "./App.css";

const initialUserState = {
  id: 0,
  name: "",
  email: "",
  age: 0,
  entries: 0,
  joined: "",
};

const App = () => {
  const [input, setInput] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [route, setRoute] = useState("signin");
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState(initialUserState);

  useEffect(() => {
    const token = window.sessionStorage.getItem("token");
    if (token) {
      fetch("https://findface.vercel.app/signin", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      })
        .then((resp) => resp.json())
        .then((data) => {
          if (data && data.id) {
            fetch(`https://findface.vercel.app/profile/${data.id}`, {
              method: "get",
              headers: {
                "Content-Type": "application/json",
                Authorization: token,
              },
            })
              .then((resp) => resp.json())
              .then((user) => {
                if (user && user.email) {
                  loadUser(user);
                  onRouteChange("home");
                }
              });
          }
        })
        .catch(console.log);
    }
  }, []);

  const loadUser = (userProfile) => {
    setImageUrl("");
    setUser({
      id: userProfile.id,
      name: userProfile.name,
      age: userProfile.age,
      email: userProfile.email,
      entries: userProfile.entries,
      joined: userProfile.joined,
    });
  };

  const onInputChange = (e) => {
    setInput(e.target.value);
  };

  const onImageSubmit = (e) => {
    e.preventDefault();
    setImageUrl(input);
  };

  const onRouteChange = (route) => {
    if (route === "signout") {
      setIsSignedIn(false);
      setUser(initialUserState);
      window.sessionStorage.removeItem("token");
    } else if (route === "home") {
      setIsSignedIn(true);
    }
    setRoute(route);
  };

  const showHomeOrForm = () => {
    if (route === "home") {
      return (
        <div className="text-center">
          <Rank userName={user.name} userEntries={user.entries} />
          <ImageForm
            onInputChange={onInputChange}
            onImageSubmit={onImageSubmit}
          />
          {imageUrl !== "" ? (
            <FindFace
              imageUrl={imageUrl}
              onUserDataChange={(userData) => setUser(userData)}
              user={user}
            />
          ) : null}
        </div>
      );
    } else if (route === "signin" || route === "signout") {
      return <Signin loadUser={loadUser} onRouteChange={onRouteChange} />;
    } else {
      return <Register loadUser={loadUser} onRouteChange={onRouteChange} />;
    }
  };

  return (
    <div className="App">
      <Background />
      <Navigation
        isSignedIn={isSignedIn}
        onRouteChange={onRouteChange}
        user={user}
        loadUser={loadUser}
      />
      {showHomeOrForm()}
    </div>
  );
};

export default App;
