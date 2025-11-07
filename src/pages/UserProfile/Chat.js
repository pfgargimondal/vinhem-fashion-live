import { Link } from "react-router-dom";
import { UserProfileNavMenu } from "../../components";

import styles from "./Css/Chat.module.css";
import { useState } from "react";

export const Chat = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const chatMessages = [
        { id: 1, name: "Testing", message: "hi", avatar: "https://i.pravatar.cc/50?img=1" },
        { id: 2, name: "User", message: "yes", avatar: "https://i.pravatar.cc/50?img=2" },
        { id: 3, name: "Biswajit", message: "yeeeeeeeeeeeeeee", avatar: "https://i.pravatar.cc/50?img=3" },
        { id: 4, name: "Souradipta", message: "yeeeeeeeeeeeeeee", avatar: "https://i.pravatar.cc/50?img=3" },
        { id: 5, name: "Ariyan", message: "yeeeeeeeeeeeeeee", avatar: "https://i.pravatar.cc/50?img=3" },
    ];

    const sendMessage = () => {
        if (!input.trim()) return;
        setMessages([...messages, { text: input, sender: "me" }]);
        setInput("");
    };

    return (
        <div className={styles.ffhfdf}>
            <div className="ansjidnkuiweer">
                <div className={styles.fbghdfg}>
                    <div className="row">
                        <div className="col-lg-3">
                            <UserProfileNavMenu />
                        </div>

                        <div className="col-lg-9">
                            <div className={`${styles.fgcbdfgdf}`}>
                                <div className={`${styles.alojdkmlkoljeirr} row border border-start-0 rounded shadow-sm`} style={{ height: "90vh" }}>
                                    {/* Left Users Panel */}
                                    <div className="col-lg-3 border-end p-0">
                                        <div className="p-3 border-bottom fw-bold">Users</div>
                                        
                                        <div className={styles.diewnrnwekhriwejrwejr}>
                                            {chatMessages.map((chatMessage) => (
                                                <div
                                                    key={chatMessage.id}
                                                        className="d-flex align-items-center justify-content-between px-3 py-2 border-bottom user-item"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => {
                                                        setSelectedUser(chatMessage);
                                                        setMessages([]);
                                                    }}
                                                >
                                                    <div className="d-flex align-items-center">
                                                        <img
                                                            src={chatMessage.avatar}
                                                            alt={chatMessage.name}
                                                            className="rounded-circle me-2"
                                                            width="40"
                                                            height="40"
                                                        />

                                                        <div>
                                                            <div className="fw-semibold">{chatMessage.name}</div>

                                                            <small className="text-muted">{chatMessage.message}</small>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}    
                                        </div>                                        
                                    </div>

                                    {/* Right Chat Panel */}
                                    <div className="col-lg-9 d-flex flex-column">
                                        <div className="border-bottom d-flex align-items-center justify-content-between p-3 fw-semibold">
                                            {selectedUser ? `Chat with ${selectedUser.name}` : "Please select a user to start chatting"}

                                            <div className={`dowehrkjwerwer d-flex align-items-center justify-content-end`}>
                                                <p className={`${styles.ndiwhermweoewrr} mb-0 me-3`}>
                                                    <Link to="/"><i className="fa-solid me-1 fa-arrow-left" /> Back To Home <i className="fa-solid ms-1 fa-house" /></Link>
                                                </p>
                                            </div>
                                        </div>

                                        {/* Messages */}
                                        <div className={`${styles.ldknwejknlkkekrrr} flex-grow-1 p-3 bg-light`}>
                                            {messages.length === 0 ? (
                                                <div className="text-muted text-center mt-5">
                                                    {selectedUser ? "Start chatting..." : "Select a user from the user panel"}
                                                </div>
                                            ) : (
                                                messages.map((msg, index) => (
                                                    <div
                                                        key={index}
                                                        className={`mb-2 d-flex ${msg.sender === "me" ? "justify-content-end" : "justify-content-start"
                                                            }`}
                                                    >
                                                        <div
                                                            className={`p-2 rounded ${msg.sender === "me" ? `${styles.bg_pink} text-white` : "bg-secondary text-white"
                                                                }`}
                                                        >
                                                            {msg.text}
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>

                                        {/* Input */}
                                        <div className={`${styles.cdrgbghjjfgrfvrt} d-flex border-top p-2`}>
                                            <input
                                                type="text"
                                                className="form-control me-2"
                                                placeholder="Type a reply..."
                                                value={input}
                                                onChange={(e) => setInput(e.target.value)}
                                                disabled={!selectedUser}
                                            />
                                            <button
                                                className="btn btn-main"
                                                onClick={sendMessage}
                                                disabled={!selectedUser}
                                            >
                                                Send
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}