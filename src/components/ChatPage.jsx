import React,{useState,useEffect} from "react";
import styled from "styled-components";
import {
  fetchChatMessages,
  sendMessageToClassTeacher,
  teacherReplyToStudent,
} from '../api/ClientApi'; 

const ChatContainer = styled.div`
  max-width: 600px;
  margin: 50px auto;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  height: 90vh;
`;

const ChatHeader = styled.div`
  background: linear-gradient(135deg, #4a90e2, #6fcf97);
  padding: 20px;
  color: white;
  font-size: 1.5rem;
  text-align: center;
  font-weight: bold;
`;

const ChatBody = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f7f9fc;
  display: flex;
  flex-direction: column;
`;

const MessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${props => (props.from === "student" ? "flex-end" : "flex-start")};
  margin-bottom: 15px;
`;

const MessageBubble = styled.div`
  background-color: ${props => (props.from === "student" ? "#daf7dc" : "#e1ecf4")};
  color: #333;
  padding: 12px 16px;
  border-radius: 20px;
  max-width: 75%;
  font-size: 0.95rem;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
`;

const Timestamp = styled.div`
  font-size: 0.7rem;
  color: #999;
  margin-top: 5px;
`;

const ChatFooter = styled.div`
  padding: 15px;
  display: flex;
  border-top: 1px solid #eaeaea;
  background: white;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 25px;
  outline: none;
  margin-right: 10px;
`;

const SendButton = styled.button`
  background: #4a90e2;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #357ab8;
  }
`;

const DummyMessages = [
  { from: "teacher", message: "Hello! Please share your doubts." },
  { from: "student", message: "I have a doubt in Physics, chapter 3." },
];

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [role, setRole] = useState('');
  const [admissionNo, setAdmissionNo] = useState('');
  const [empId, setEmpId] = useState('');

  useEffect(() => {
    const storedRole = localStorage.getItem('role'); // e.g., 'student' or 'teacher'
    const admission = localStorage.getItem('unique_id'); // for student
    console.log("Admission No:", admission);
    const emp = localStorage.getItem('emp_id'); // for teacher
   console.log("Employee ID:", emp);
    setRole(storedRole);
    setAdmissionNo(admission || '');
    setEmpId(emp || '');

    if (storedRole === 'student' && admission && emp) {
      fetchChat(admission, emp);
    } else if (storedRole === 'teacher' && admission && emp) {
      fetchChat(admission, emp);
    }
  }, []);

  const fetchChat = async (admission_no, emp_id) => {
    try {
      const res = await fetchChatMessages(admission_no, emp_id);
      setMessages(res.data.chat);
    } catch (err) {
      console.error('Chat fetch error', err);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    try {
      if (role === 'student') {
        await sendMessageToClassTeacher({ admission_no: admissionNo, message: input });
      } else if (role === 'teacher') {
        await teacherReplyToStudent({ emp_id: empId, admission_no: admissionNo, message: input });
      }
      setInput('');
      fetchChat(admissionNo, empId);
    } catch (err) {
      console.error('Send error:', err);
    }
  };

  return (
    <ChatContainer>
      <ChatHeader>Chat with Class Teacher</ChatHeader>
      <ChatBody>
        {messages.map((msg, idx) => (
          <MessageWrapper key={idx} from={msg.from}>
            <MessageBubble from={msg.from}>{msg.message}</MessageBubble>
            <Timestamp>{new Date(msg.timestamp).toLocaleTimeString()}</Timestamp>
          </MessageWrapper>
        ))}
      </ChatBody>
      <ChatFooter>
        <ChatInput
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <SendButton onClick={handleSend}>Send</SendButton>
      </ChatFooter>
    </ChatContainer>
  );
};

export default ChatPage;