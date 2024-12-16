import React, { useState, useRef, useEffect, useCallback } from "react";
import { FiMessageCircle, FiSend } from "react-icons/fi";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputData, setInputData] = useState("");
  const [messages, setMessages] = useState([
    { sender: "AI", text: "Hi, how can I help you today?" },
  ]);
  const chatContainerRef = useRef(null);
  const navigate = useNavigate(); // Initialize navigate

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const ProposalLink = ({ proposal }) => (
    <div style={{ marginBottom: "8px" }}>
      <span style={{ fontWeight: "bold" }}>{proposal.title}</span>
      <button
        style={{
          marginLeft: "10px",
          padding: "5px 10px",
          backgroundColor: "#2C4C98",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
        }}
        onClick={() => navigate(`/proposal/${proposal.proposal_id}`)}
      >
        支持提案
        <span style={{ fontSize: "16px" }}>&#128722;</span>
      </button>
    </div>
  );

  const handleSendMessage = useCallback(async () => {
    if (!inputData.trim()) {
      return;
    }

    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "You", text: inputData },
    ]);

    setInputData("");

    const requestBody = {
      user_query: inputData,
    };

    try {
      const response = await axios.post(
        "https://coco-442901.de.r.appspot.com/api/recommend",
        requestBody
      );
      const { response: aiResponse, proposals } = response.data;

      const proposalLinks = proposals.map((proposal, index) => {
        console.log("提案內容", proposal);
        return <ProposalLink key={index} proposal={proposal} />;
      });

      const combinedMessage = (
        <div>
          <p>{aiResponse}</p>
          <div style={{ marginTop: "10px" }}>{proposalLinks}</div>
        </div>
      );

      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "AI", text: combinedMessage, isHTML: true },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "AI",
          text: "Sorry, something went wrong. Please try again.",
        },
      ]);
    }
  }, [inputData]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div style={{ position: "fixed", bottom: "20px", right: "20px" }}>
      <button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 inline-flex items-center justify-center text-sm font-medium disabled:pointer-events-none disabled:opacity-50 border rounded-full w-16 h-16 bg-black hover:bg-gray-700 m-0 cursor-pointer border-gray-200 bg-none p-0 normal-case leading-5 hover:text-gray-900"
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen ? "true" : "false"}
        data-state={isOpen ? "open" : "closed"}
      >
        <FiMessageCircle className="text-white w-8 h-8" />
      </button>
      {isOpen && (
        <div
          style={{
            boxShadow: "0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0 0 0 / 0.05)",
          }}
          className="fixed bottom-[calc(4rem+1.5rem)] right-0 mr-4 bg-white rounded-lg border border-[#e5e7eb] w-[440px] h-[634px] flex flex-col"
        >
          <div className="flex flex-col space-y-1.5 p-4 border-b border-gray-200">
            <h2 className="font-semibold text-lg tracking-tight">Chatbot</h2>
            <p className="text-sm text-[#6b7280] leading-3">
              Powered by Mendable and Vercel
            </p>
          </div>

          <div
            ref={chatContainerRef}
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "10px",
              maxHeight: "calc(100% - 100px)",
            }}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className="flex gap-3 my-4 text-gray-600 text-sm flex-1"
              >
                <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
                  <div className="rounded-full bg-gray-100 border p-1">
                    <FiMessageCircle
                      className={`w-6 h-6 text-black ${
                        message.sender === "AI" ? "" : "hidden"
                      }`}
                    />
                  </div>
                </span>
                <p className="leading-relaxed">
                  <span className="block font-bold text-gray-700">
                    {message.sender}{" "}
                  </span>
                  {message.isHTML ? <span>{message.text}</span> : message.text}
                </p>
              </div>
            ))}
          </div>

          <div
            style={{
              padding: "10px",
              borderTop: "1px solid #e5e7eb",
              backgroundColor: "#fff",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <textarea
                style={{
                  flex: 1,
                  resize: "none",
                  border: "1px solid #e5e7eb",
                  borderRadius: "4px",
                  padding: "10px",
                  fontSize: "14px",
                }}
                rows={1}
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                placeholder="Type a message..."
              />
              <button
                style={{
                  marginLeft: "10px",
                  padding: "10px 15px",
                  backgroundColor: "#2C4C98",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
                onClick={handleSendMessage}
              >
                <FiSend />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
