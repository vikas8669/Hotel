import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

// var GEMINI_API_KEY = "AIzaSyARRi2vD6EvHpZPYGZyhlbV0aIG-RmaRME"
const ChatBot = () => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!prompt.trim()) return;

    const userMessage = { role: "user", text: prompt };
    setMessages((prev) => [...prev, userMessage]);
    setPrompt("");
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyARRi2vD6EvHpZPYGZyhlbV0aIG-RmaRME`,
        
        {
            contents: [{ role: "user", parts: [{ text: prompt }] }],
        }
        
    );
    // console.log(import.meta.env.VITE_GEMINI_API_KEY)

      const botReply = res.data.candidates[0].content.parts[0].text;
      const botMessage = { role: "model", text: botReply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setError("Error calling Gemini API. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-gray-50 to-blue-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md py-4 px-6 text-center text-3xl font-bold text-blue-700 sticky top-0 z-10">
        Gemini AI Chatbot
      </header>

      {/* Chat Area */}
      <main className="flex-grow overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md shadow">
              {error}
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs md:max-w-md p-3 rounded-lg shadow text-white ${
                  msg.role === "user" ? "bg-blue-600" : "bg-green-600"
                }`}
              >
                <p>{msg.text}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="text-center text-gray-500">Gemini is typing...</div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Box */}
      <footer className="bg-white shadow-inner py-4 px-6 sticky bottom-0">
        <div className="flex gap-4 max-w-4xl mx-auto">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask something..."
            className="flex-grow p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ChatBot;
