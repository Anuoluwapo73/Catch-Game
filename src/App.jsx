import React, { useState, useEffect } from "react";
import emailjs from "emailjs-com";
import welcome from "./assets/ChatGPT Image Oct 4, 2025, 10_00_52 PM.png";

const App = () => {
  const [position, setPosition] = useState({ top: "50%", left: "50%" });
  const [gameStarted, setGameStarted] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [playerEmail, setPlayerEmail] = useState("");
  const [isSending, setIsSending] = useState(false);

  // ✅ Initialize EmailJS once
  useEffect(() => {
    emailjs.init("6Ttttcc58uG6moWnR"); // Your public key
  }, []);

  // ✅ Check if user already started a game (helps mobile refresh issue)
  useEffect(() => {
    const savedEmail = localStorage.getItem("current_player_email");
    const alreadyPlayed = savedEmail && localStorage.getItem(`played_${savedEmail}`);
    if (alreadyPlayed) {
      // if user has already played
      alert("🚫 You’ve already played this game with this email.");
      resetGame();
    } else if (savedEmail) {
      // if user was in-game before refresh
      setPlayerEmail(savedEmail);
      setGameStarted(true);
      document.getElementById("cont").style.display = "none";
    }
  }, []);

  // 🎯 Move button randomly
  useEffect(() => {
    if (!gameStarted) return;
    const interval = setInterval(() => {
      const top = Math.floor(Math.random() * 190) + "%";
      const left = Math.floor(Math.random() * 110) + "%";
      setPosition({ top, left });
    }, 500);
    return () => clearInterval(interval);
  }, [gameStarted]);

  // 🌈 Random background color
  useEffect(() => {
    if (!gameStarted) return;
    const interval = setInterval(() => {
      document.body.style.background = getRandomColor();
    }, 300);
    return () => clearInterval(interval);
  }, [gameStarted]);

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];
    return color;
  };

  const handleStart = (e) => {
    e.preventDefault();

    if (!playerName || !playerEmail) {
      alert("Please enter your name and email first!");
      return;
    }

    const alreadyPlayed = localStorage.getItem(`played_${playerEmail}`);
    if (alreadyPlayed) {
      alert("🚫 This email has already played the game once. You cannot play again.");
      return;
    }

    // ✅ Save player email for session recovery
    localStorage.setItem("current_player_email", playerEmail);
    setGameStarted(true);
    document.getElementById("cont").style.display = "none";
  };

  const sendEmail = async () => {
    if (isSending) return;

    setIsSending(true);

    const randomNumber = Math.floor(Math.random() * 51) + 250; // 50–100 range

    try {
      const response = await emailjs.send(
        "service_lymcxzm",
        "template_x9y9828",
        {
          to_email: playerEmail,
          name: playerName,
          email: "anushoyode123@gmail.com",
          message: `Hey ${playerName}, you caught the button 🎯🔥! You just won ${randomNumber}!`,
        }
      );

      console.log("SUCCESS!", response.status, response.text);

      // ✅ Mark email as used
      localStorage.setItem(`played_${playerEmail}`, "true");
      alert("🎉 You caught the button! Check your email inbox.");

      // 🎮 Second alert — Game Over
      setTimeout(() => {
        alert("🎮 Game over! Thanks for playing!");
        resetGame();
      }, 1000);
    } catch (err) {
      console.error("FAILED...", err);
      alert("Email failed to send 😢. Try again!");
    } finally {
      setIsSending(false);
    }
  };

  // ✅ Reset everything cleanly (works well on mobile)
  const resetGame = () => {
    setGameStarted(false);
    setIsSending(false);
    setPlayerEmail("");
    setPlayerName("");
    document.body.style.background = "white";
    localStorage.removeItem("current_player_email");
    const cont = document.getElementById("cont");
    if (cont) cont.style.display = "block";
  };

  return (
    <>
      {/* Input Form */}
      <form className="input-div" id="cont" onSubmit={handleStart}>
        <img className="image" src={welcome} alt="Welcome" />
        <label>
          Name:&nbsp;
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
          E-mail:&nbsp;
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

      {/* Game Button */}
      {gameStarted && (
        <button
          onClick={sendEmail}
          disabled={isSending}
          style={{
            position: "absolute",
            top: position.top,
            left: position.left,
            transform: "translate(-50%, -50%)",
            padding: "8px 10px",
            borderRadius: "12px",
            cursor: isSending ? "not-allowed" : "pointer",
            backgroundColor: isSending ? "#ccc" : "white",
            fontWeight: "bold",
            border: "none",
          }}
        >
          {isSending ? "Sending..." : "Catch Me"}
        </button>
      )}
    </>
  );
};

export default App;
