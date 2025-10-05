import React, { useState, useEffect } from "react";
import emailjs from "emailjs-com";
import welcome from "./assets/ChatGPT Image Oct 4, 2025, 10_00_52 PM.png";

const App = () => {
  const [position, setPosition] = useState({ top: "50%", left: "50%" });
  const [gameStarted, setGameStarted] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [playerEmail, setPlayerEmail] = useState("");
  const [isSending, setIsSending] = useState(false);

  // ✅ Initialize EmailJS once when the app loads
  useEffect(() => {
    emailjs.init("6Ttttcc58uG6moWnR"); // <-- your public key here
  }, []);

  // Move the button randomly every 2 seconds
  useEffect(() => {
    if (!gameStarted) return;
    const interval = setInterval(() => {
      const top = Math.floor(Math.random() * 190) + "%";
      const left = Math.floor(Math.random() * 190) + "%";
      setPosition({ top, left });
    }, 400);
    return () => clearInterval(interval);
  }, [gameStarted]);

  // Change background color randomly
  useEffect(() => {
    if (!gameStarted) return;
    const interval = setInterval(() => {
      document.body.style.background = getRandomColor();
    }, 300);
    return () => clearInterval(interval);
  }, [gameStarted]);

  // Random color generator
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Start game
  const handleStart = (e) => {
    e.preventDefault();
    if (!playerName || !playerEmail) {
      alert("Please enter your name and email first!");
      return;
    }
    // 🚫 Check if this email has already played before
    const alreadyPlayed = localStorage.getItem(`played_${playerEmail}`);
    if (alreadyPlayed) {
      alert(
        "🚫 This email has already played the game once. You cannot play again."
      );
      return;
    }
    setGameStarted(true);
    document.getElementById("cont").style.display = "none";
  };

  // ✅ Send email instantly and reliably
  const sendEmail = async () => {
    if (isSending) return; // prevent double clicks

    setIsSending(true);

    const randomNumber = Math.floor(Math.random() * 51) + 250;

    try {
      const response = await emailjs.send(
        "service_lymcxzm", // your service ID
        "template_x9y9828", // your template ID
        {
          to_email: playerEmail,
          name: playerName,
          email: "anushoyode123@gmail.com",
          message: `Hey ${playerName}, you caught the button 🎯🔥! You just won ${randomNumber}!`,
        }
      );
      // ✅ Mark this email as used
      localStorage.setItem(`played_${playerEmail}`, "true");

      alert(`🎉 You caught the button! Check your email inbox.`);
      console.log("SUCCESS!", response.status, response.text);
      alert(`🎉 You caught the button! Check your email inbox.`);

      // 🎮 Second alert — game over
      setTimeout(() => {
        alert("🎮 Game over! Thanks for playing!");
        setGameStarted(false); // optional: stop background & motion
        document.body.style.background = "white"; // reset background
      }, 1000); // small delay for a smooth effect
    } catch (err) {
      console.error("FAILED...", err);
      alert("Email failed to send 😢. Try again!");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* Input form */}
      <form
        className="input-div"
        id="cont"
        style={{ marginBottom: "20px" }}
        onSubmit={handleStart}
      >
        <img className="image" src={welcome} alt="Welcome" />
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

      {/* Game button */}
      {gameStarted && (
        <button
          onClick={sendEmail}
          disabled={isSending}
          style={{
            position: "absolute",
            top: position.top,
            left: position.left,
            transform: "translate(-50%, -50%)",
            padding: "5px 5px",
            borderRadius: "12px",
            cursor: "pointer",
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
