import React, { useState, useEffect } from "react";
import emailjs from "emailjs-com";
import welcome from "./assets/ChatGPT Image Oct 4, 2025, 10_00_52 PM.png";

const App = () => {
  const [position, setPosition] = useState({ top: "50%", left: "50%" });
  const [click, setClick] = useState(false);

  const [playerName, setPlayerName] = useState("");
  const [playerEmail, setPlayerEmail] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const top = Math.floor(Math.random() * 190) + "%";
      const left = Math.floor(Math.random() * 90) + "%";
      setPosition({ top, left });
    }, 600);

    return () => clearInterval(interval);
  }, []);

  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  const handleClick = (e) => {
    e.preventDefault();
    setClick(!click);
    document.getElementById("cont").style.display = "none";
  };
  useEffect(() => {
    if (click) {
      const interval = setInterval(() => {
        document.body.style.background = getRandomColor();
      }, 500);
      return () => clearInterval(interval);
    }
  }, [click]);

  const sendEmail = () => {
    if (!playerName || !playerEmail) {
      alert("Please enter your name and email first!");
      return;
    }

    emailjs
      .send(
        "service_lymcxzm", // your EmailJS service ID
        "template_x9y9828", // your EmailJS template ID
        {
          from_name: "Anu",
          from_email: playerEmail,
          reply_to: "anushoyode123@gmail.com",
          to_email: playerEmail, // send to player’s email
          name: playerName, // player’s name
          email: "anushoyode123@gmail.com", // reply-to address
          message: `Hey ${playerName}, you caught the button 🎯🔥!`,
        },
        "6Ttttcc58uG6moWnR" // your EmailJS public key
      )
      .then((response) => {
        console.log("SUCCESS!", response.status, response.text);
        alert(`You clicked the button!
              Email sent successfully 🎉 Check your inbox!`);
      })
      .catch((err) => {
        console.error("FAILED...", err);
        alert("Email failed to send 😢");
      });
  };

  return (
    <>
      {/* Input form for player */}
      <form
        className="input-div"
        id="cont"
        style={{ marginBottom: "20px" }}
        onSubmit={handleClick}
      >
        <img className="image" src={welcome} />
        <label>
          Name: &nbsp;
          <input
            className="input"
            type="text"
            required
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
        </label>

        <label>
          E-mail: &nbsp;
          <input
            className="input"
            type="email"
            required
            placeholder="Enter your email"
            value={playerEmail}
            onChange={(e) => setPlayerEmail(e.target.value)}
          />
        </label>
        <button type="submit">Start Game</button>
      </form>

      {click && (
        <div className="under-input">
          <button
            onClick={sendEmail}
            style={{
              position: "absolute",
              top: position.top,
              left: position.left,
              transform: "translate(-50%, -50%)",
              //   transition: "all 0.5s ease",
              padding: "10px 20px",
              borderRadius: "10px",
              cursor: "pointer",
              backgroundColor: "white",
              padding: "3px 4px",
            }}
          >
            Catch Me
          </button>
        </div>
      )}
    </>
  );
};

export default App;
