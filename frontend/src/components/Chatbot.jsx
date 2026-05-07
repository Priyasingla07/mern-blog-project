import { useState } from "react";
import { Link } from "react-router-dom";

function Chatbot({ posts = [] }) {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi 👋 I'm your AI Reading Assistant. Ask: beginner coding, stress relief, motivation, travel ideas, study help..."
    }
  ]);

  const recommendPosts = (query) => {
    const text = query.toLowerCase();

    let keywords = [];

    if (text.includes("beginner") || text.includes("coding")) {
      keywords = ["tech", "react", "javascript", "coding", "web"];
    } else if (text.includes("stress") || text.includes("sad")) {
      keywords = ["health", "motivation", "yoga", "mind"];
    } else if (text.includes("motivation")) {
      keywords = ["motivation", "success", "habit", "life"];
    } else if (text.includes("travel")) {
      keywords = ["travel", "trip", "mountain", "place"];
    } else if (text.includes("study") || text.includes("exam")) {
      keywords = ["education", "study", "college", "guide"];
    } else if (text.includes("career") || text.includes("placement")) {
      keywords = ["career", "job", "placement", "tech"];
    } else {
      keywords = text.split(" ");
    }

    return posts.filter((p) =>
      keywords.some(
        (k) =>
          p.title.toLowerCase().includes(k) ||
          p.content.toLowerCase().includes(k) ||
          (p.category || "").toLowerCase().includes(k)
      )
    );
  };

  const handleSend = () => {
    const query = msg.trim();

    if (!query) return;

    const userMsg = { sender: "user", text: query };

   const results = recommendPosts(query);
    

    let replies = [];

    if (results.length > 0) {
      replies.push({
        sender: "bot",
        text: "Here are some suggestions for you:"
      });

      results.slice(0, 3).forEach((p) => {
        replies.push({
          sender: "bot",
          text: p.title,
          id: p._id
        });
      });
    } else {
      replies.push({
        sender: "bot",
        text: "No perfect match found. Try asking: coding, stress, motivation, study, travel."
      });
    }

    setMessages((prev) => [...prev, userMsg, ...replies]);
    setMsg("");
  };

  return (
    <div className="chatbot">
      <button
        className="chat-toggle"
        onClick={() => setOpen(!open)}
      >
        🤖
      </button>

      {open && (
        <div className="chat-box">
          <h3>AI Reading Assistant</h3>

          <div className="chat-messages">
            {messages.map((m, i) => (
              <div
                key={i}
                className={m.sender === "user" ? "user-msg" : "bot-msg"}
              >
                {m.id ? (
                  <Link to={`/post/${m.id}`}>{m.text}</Link>
                ) : (
                  m.text
                )}
              </div>
            ))}
          </div>

          <div className="chat-input">
            <input
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask for recommendations..."
            />

            <button onClick={handleSend}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chatbot;