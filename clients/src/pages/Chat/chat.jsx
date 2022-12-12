import { useEffect, useRef, useState } from 'react';
import socketIO from 'socket.io-client';
import './chat.scss';

const Chat = () => {
    const socket = socketIO.connect('http://localhost:4000');

    const [messages, setMessages] = useState([])
    const [typingStatus, setTypingStatus] = useState("")
    const lastMessageRef = useRef(null);

    useEffect(() => {
        socket.on("messageResponse", data => setMessages([...messages, data]))
    }, [socket, messages]);

    useEffect(() => {
        socket.on("typingResponse", data => setTypingStatus(data))
    }, [socket]);


    useEffect(() => {
        // 👇️ scroll to bottom every time messages change
        lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);



    const handleTyping = () => socket.emit("typing", `${JSON.stringify(localStorage.getItem('userData'))?.name} is typing`)

    return (
        <div className='chat-wrapper'>
            <div className="chatTitle"><span>Chat</span></div>
            <div className='chatSpace'>
                <div className='chatSpaceInner scroll'>

                    <div className='chatItem chatLeft'>
                        <div className='chatProfile'></div>
                        <div className='chatText'>
                            <span className="userName">Alex</span>
                            <div className='chatDescription'>
                                <div className="textInnerbox">
                                    <p>I really like the way you’re presenting!!</p>
                                    <p>It makes just so much fun – love it!</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="chatItem chatRight">
                        <div className="chatProfile"></div>
                        <div className="chatText">
                            <span className="userName">You</span>
                            <div className="chatDescription">
                                <div className="textInnerbox">
                                    <p>Just around 180C :)</p>
                                </div>
                                <span className="chatTime">12:02 pm</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='chatInputspace'>
                <div className="chatInputBox">
                    <div className="textArea">
                        <div className='message__status'>
                            <p>{typingStatus}</p>
                        </div>
                        <div ref={lastMessageRef} />
                        <input type="text" placeholder="Write message here" onKeyDown={handleTyping} />
                    </div>
                </div>
            </div>
        </div>
    );
}


export default Chat;