import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage, setupChatListener } from '../../redux/slices/chatSlice';
import { useParams } from 'react-router-dom';

const ChatWindow = () => {
  const { roomId } = useParams();
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const { messages } = useSelector(state => state.chat);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(setupChatListener());
  }, [dispatch]);

  const handleSend = () => {
    if (message.trim()) {
      dispatch(sendMessage({ roomId, message, senderId: user }));
      setMessage('');
    }
  };

  return (
    <div className="chat-window">
      <h2>Chat</h2>
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.senderId === user ? 'You' : 'Other'}: </strong>{msg.message}
          </div>
        ))}
      </div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default ChatWindow;