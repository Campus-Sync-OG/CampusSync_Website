import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import {
  sendMessageToClassTeacher,
  teacherReplyToStudent,
  fetchChatMessages,
  fetchTeacherInbox,
  fetchStudentMessages,
} from "../api/ClientApi";

const ChatContainer = styled.div`
  display: flex;
  height: 90vh;
  max-width: 1000px;
  margin: 40px auto;
  border: 1px solid #ccc;
  border-radius: 15px;
  overflow: hidden;
`;

const Sidebar = styled.div`
  width: 250px;
  background: #f4f6f8;
  border-right: 1px solid #ddd;
  overflow-y: auto;
`;

const SidebarHeader = styled.div`
  padding: 15px;
  background: #002087;
  color: white;
  font-weight: bold;
  text-align: center;
`;

const InboxItem = styled.div`
  padding: 15px;
  cursor: pointer;
  background: ${(props) => (props.active ? "#dcefff" : "transparent")};
  border-bottom: 1px solid #ddd;
  font-weight: ${(props) => (props.active ? "bold" : "normal")};

  &:hover {
    background: #e0eefa;
  }
`;

const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;

  @media (max-width: 420px) {
    width: 72%;
  }
`;

const ChatHeader = styled.div`
  padding: 15px;
  background: #df0043;
  color: white;
  font-size: 1.2rem;
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
  align-items: ${(props) => (props.isCurrentUser ? "flex-end" : "flex-start")};
  margin-bottom: 15px;
`;

const MessageBubble = styled.div`
  background-color: ${(props) => (props.isCurrentUser ? "#daf7dc" : "#e1ecf4")};
  color: #333;
  padding: 12px 16px;
  border-radius: 20px;
  max-width: 75%;
  font-size: 0.95rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
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

const ChatInput = styled.textarea`
  flex: 1;
  padding: 12px 16px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 20px;
  resize: none;
  height: 50px;
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

  &:hover {
    background: #357ab8;
  }

  &:disabled {
    background: #b0c4de;
    cursor: not-allowed;
  }
`;

const ChatPage = () => {
  const [role, setRole] = useState("");
  const [empId, setEmpId] = useState("");
  const [admissionNo, setAdmissionNo] = useState("");
  const [inboxList, setInboxList] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatRef = useRef(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData) {
      alert("Unauthorized. Please login.");
      return;
    }

    setRole(userData.role);

    if (userData.role === "teacher") {
      setEmpId(userData.unique_id);
      fetchTeacherInbox(userData.unique_id)
        .then((res) => {
          const list = res.data.students || res.data;
          setInboxList(
            list.map((adm) => ({
              admission_no: adm,
              name: `Student ${adm}`,
            }))
          );
        })
        .catch((err) => console.error("Failed to fetch inbox", err));
    } else if (userData.role === "student") {
      setAdmissionNo(userData.unique_id);
      fetchStudentMessages(userData.unique_id)
        .then((res) => setMessages(res.data.chat))
        .catch((err) => console.error("Failed to load chat", err));
    }
  }, []);

  useEffect(() => {
    if (selectedStudent && role === "teacher") {
      fetchChatMessages(selectedStudent.admission_no, empId)
        .then((res) => setMessages(res.data.chat))
        .catch((err) => console.error("Failed to load chat", err));
    }
  }, [selectedStudent, empId, role]);

  // 🔁 Auto-refresh chat every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (role === "teacher" && selectedStudent) {
        fetchChatMessages(selectedStudent.admission_no, empId)
          .then((res) => setMessages(res.data.chat))
          .catch((err) => console.error("Auto-refresh failed", err));
      } else if (role === "student" && admissionNo) {
        fetchStudentMessages(admissionNo)
          .then((res) => setMessages(res.data.chat))
          .catch((err) => console.error("Auto-refresh failed", err));
      }
    }, 3000); // Every 3 seconds

    return () => clearInterval(interval);
  }, [role, selectedStudent, empId, admissionNo]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    try {
      if (role === "teacher" && selectedStudent) {
        await teacherReplyToStudent({
          emp_id: empId,
          admission_no: selectedStudent.admission_no,
          message: input,
        });
        const res = await fetchChatMessages(
          selectedStudent.admission_no,
          empId
        );
        setMessages(res.data.chat);
      } else if (role === "student") {
        await sendMessageToClassTeacher({
          admission_no: admissionNo,
          message: input,
        });
        const res = await fetchStudentMessages(admissionNo);
        setMessages(res.data.chat);
      }

      setInput("");
    } catch (err) {
      console.error("Send error", err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!role) return <div>Loading...</div>;

  return (
    <ChatContainer>
      {role === "teacher" && (
        <Sidebar>
          <SidebarHeader>Inbox</SidebarHeader>
          {Array.isArray(inboxList) && inboxList.length > 0 ? (
            inboxList.map((student, idx) => (
              <InboxItem
                key={idx}
                onClick={() => setSelectedStudent(student)}
                active={selectedStudent?.admission_no === student.admission_no}
              >
                {student.name}
              </InboxItem>
            ))
          ) : (
            <div style={{ padding: "1rem", color: "#999" }}>No messages</div>
          )}
        </Sidebar>
      )}

      <ChatArea>
        <ChatHeader>
          {role === "teacher"
            ? selectedStudent
              ? `Chat with ${selectedStudent.name}`
              : "Select a student"
            : "Chat with Class Teacher"}
        </ChatHeader>

        <ChatBody ref={chatRef}>
          {messages.map((msg, idx) => {
            const isMe =
              role === "teacher"
                ? msg.from === "teacher"
                : msg.from === "student";
            return (
              <MessageWrapper key={idx} isCurrentUser={isMe}>
                <MessageBubble isCurrentUser={isMe}>
                  {msg.message}
                </MessageBubble>
                <Timestamp>
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Timestamp>
              </MessageWrapper>
            );
          })}
        </ChatBody>

        <ChatFooter>
          <ChatInput
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <SendButton
            onClick={handleSend}
            disabled={!input.trim() || (role === "teacher" && !selectedStudent)}
          >
            Send
          </SendButton>
        </ChatFooter>
      </ChatArea>
    </ChatContainer>
  );
};

export default ChatPage;
