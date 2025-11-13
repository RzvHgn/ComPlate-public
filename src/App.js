import React, { useEffect, useState } from "react";
import "./App.css";

const loadBlurbs = async () => {
  const fileList = ["Standard Communication.json"];
  const allBlurbs = [];

  for (const file of fileList) {
    const filePath = `/blurbs/${file}`;
    try {
      const response = await fetch(filePath);
      const data = await response.json();

      Object.entries(data).forEach(([title, langs]) => {
        const firstLang = Object.values(langs)[0];
        allBlurbs.push({ title, text: firstLang });
      });
    } catch (err) {
      console.error(`Error loading ${filePath}:`, err);
    }
  }

  return allBlurbs;
};

function App() {
  const [blurbs, setBlurbs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadBlurbs().then(setBlurbs);
  }, []);

  const pasteTextInFocusedInput = (text) => {
    window.parent.postMessage(
      {
        type: "PASTE_BLURB",
        payload: {
          text,
        },
      },
      "*"
    );
  };

  return (
    <div className="App" style={{ padding: "1rem", fontFamily: "Arial" }}>
      <h2 style={{ marginBottom: "10px" }}>Com-Plate Blurbs</h2>
      <input
        type="text"
        placeholder="Search blurbs..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          marginBottom: "1rem",
          width: "100%",
          padding: "0.5rem",
          fontSize: "1rem",
        }}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {blurbs
          .filter((b) =>
            b.title.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((blurb, i) => (
            <button
              key={i}
              onClick={() => pasteTextInFocusedInput(blurb.text)}
              style={{
                padding: "10px",
                textAlign: "left",
                backgroundColor: "#f1f1f1",
                borderRadius: "6px",
                border: "1px solid #ccc",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              {blurb.title}
            </button>
          ))}
      </div>
    </div>
  );
}

export default App;
