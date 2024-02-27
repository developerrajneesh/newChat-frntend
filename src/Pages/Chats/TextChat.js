import React, { useEffect, useRef, useState } from "react";
import "./textchat.css";
import { Grid } from "@mui/material";
import { CgProfile } from "react-icons/cg";
import { BsSendFill } from "react-icons/bs";
import axios from "axios";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import toast, { Toaster } from "react-hot-toast";
import { serverAddress } from "../../envdata";
function TextChat() {
  const messageRef = useRef(null);
  const [myData, setmyData] = useState({});
  const [chatSwitch, setChatSwitch] = useState("Chat");
  const [typingUser, settypingUser] = useState([]);
  const myid = myData?._id;

  const mycoversationIds = myData.conversations;

  const [message, setmessage] = useState("");
  const [showmessage, setShowmessage] = useState([]);
  const [allUsers, setallUsers] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);

  const [chatUser, setChatUser] = useState(null);
  const [socket, setSocket] = useState(null);

  function findMatchingConversation(chatUser, mycoversationIds) {
    if (chatUser?.conversations) {
      for (const conversationId of chatUser?.conversations) {
        if (mycoversationIds?.includes(conversationId)) {
          return conversationId; // Match found, return the conversation ID
        }
      }
      return null; // No matching conversation ID found
    } else {
      return null;
    }
  }

  const sendData = () => {
    if (message.trim() !== "") {
      const cUserData = JSON.parse(localStorage.getItem("ChatUserData"));
      const forData = {
        conversationId:
          findMatchingConversation(cUserData, mycoversationIds) || uuidv4(),
        userSenderId: myid,
        userReceiverId: cUserData?._id,
        msg: message,
      };
      if (findMatchingConversation(cUserData, mycoversationIds) == null) {
        forData.new = true;
      } else {
        forData.new = false;
      }
      socket?.emit("message", forData);
      setmessage("");
    }
  };

  useEffect(() => {
    const converSatioId = findMatchingConversation(chatUser, mycoversationIds);

    axios
      .get(
        serverAddress+"/api/v1/message/getsingle-byChatId/" +
          converSatioId
      )
      .then((response) => setShowmessage(response.data))
      .catch((err) => console.log(err));
  }, [chatUser]);

  function convertToIndianTime(utcTimestamp) {
    const date = new Date(utcTimestamp);
    const options = {
      timeZone: "Asia/Kolkata",
      hour12: true,
      hour: "numeric",
      minute: "2-digit",
    };
    return date.toLocaleString("en-IN", options);
  }

  useEffect(() => {
    setSocket(io(serverAddress));
  }, []);

  useEffect(() => {}, [chatUser]);

  function setShowmessageFun(message, receiverId, senderId) {
   
    const cUserData = JSON.parse(localStorage.getItem("ChatUserData"));
    if (receiverId == cUserData?._id || senderId == cUserData?._id) {
      setShowmessage(message);
    } else {
      console.log("message =>", message);
if (!message) {
  return 
}
      const senderdata = allUsers?.find(  (user) => user?._id == message[message?.length - 1]?.userSenderId);
      console.log('senderdata =>', senderdata);
      const myData = JSON.parse(localStorage.getItem("UserData"));
      if (message[message?.length - 1]?.userReceiverId == myData?._id) {
        toast(
          <div>
            <div className="sendername-toast">{senderdata?.userName} </div>
            <div className="message-toast">
              {message[message.length - 1]?.msg}
            </div>
          </div>
        );
      }
    }
  }

  useEffect(() => {
    // setting message
    socket?.on("getmessage", (messages) => {
      console.log('kkkkk =>',message);
      setShowmessageFun(
        messages.messages,
        messages.receiverId,
        messages.senderId
      );
    });
    const myData = JSON.parse(localStorage.getItem("UserData"));

    socket?.on("GetTypingUsers", (user) => {
      console.log("TypingUsers =>", user);
      settypingUser(user);
    });

    socket?.emit("senderdata", myData._id);

    socket?.on("ActiveUsers", (user) => {
      setActiveUsers(user);
      console.log('useroo',user);
    });

    socket?.on("getsenderdata", (user) => {
      setmyData(user);
      localStorage.setItem("UserData", JSON.stringify(user));
    });

    socket?.on("getllUser", (allUser) => {
      setAllUser();
    });
    setAllUser();
    return () => {
      socket?.emit("Userdisconnect", myData._id);
    };
  }, [socket]);

  useEffect(() => {
    messageRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [showmessage]);

  const myData1 = JSON.parse(localStorage.getItem("UserData"));
  const NeaAllUser = allUsers?.filter((user) => user?._id !== myData1?._id);

  const setAllUser = () => {
    axios
      .get(serverAddress+"/api/v1/user/get-all")
      .then((response) => {
        setallUsers(response.data);
        const cUserData = JSON.parse(localStorage.getItem("ChatUserData"));
        if (cUserData) {
          // alert(JSON.stringify(cUserData));
          const updCdata = response.data.find(
            (user) => user._id === cUserData._id
          );
          setChatUser(updCdata);
          localStorage.setItem("ChatUserData", JSON.stringify(updCdata));
        }
      })
      .catch((err) => console.log(err));
  };

  const [typingTimer, setTypingTimer] = useState(null);
  function handleMessageInput(e) {
    const cUserData = JSON.parse(localStorage.getItem("ChatUserData"));
    socket?.emit("typingUser", {
      senderId: myData._id,
      receiverId: cUserData._id,
    });
    const { value } = e.target;

    clearTimeout(typingTimer);

    // Set a new typingTimer to log when typing stops
    setTypingTimer(
      setTimeout(() => {
        socket?.emit("typingUserStop", {
          senderId: myData._id,
          receiverId: cUserData._id,
        });
        console.log("You stopped typing:", value);
      }, 1000)
    );
    setmessage(value);
  }
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendData(chatUser);
    }
  };

  function getUserIds(arr) {
    return arr.map(({ userId }) => userId);
  }
  function filterUsers(allKeys, users) {
    return users.filter((user) => allKeys.includes(user._id));
  }

  // getUserIds
  console.log("conversations", myData1.conversations);

  function filterUsersByConversationKeys(users, keys) {
    return users.filter((user) => {
      // Filtering conversations of current user which include any of the keys in keys
      const matchingConversations = user.conversations.filter((conv) =>
        keys.includes(conv)
      );

      // Returning true if there are matching conversations for the current user
      return matchingConversations.length > 0;
    });
  }

  // Example usage:
  const OnlineUser = filterUsers(getUserIds(activeUsers), NeaAllUser);
  let conUser;
  if (chatSwitch == "Online") {
    conUser = filterUsers(getUserIds(activeUsers), NeaAllUser);
  }
  if (chatSwitch == "Chat") {
    conUser = filterUsersByConversationKeys(NeaAllUser, myData1.conversations);
  }
  if (chatSwitch == "All") {
    conUser = NeaAllUser;
  }
console.log('conUser =>',conUser,NeaAllUser);
  // const conUser = ? ,NeaAllUser)   : NeaAllUser
  // console.log(activeUsers);
  // function getUserIds(arr) {
  //   return arr.map(({ userId }) => userId);
  // }
  function getIndianTime(timestamp) {
    // Create a Date object using the provided timestamp
    var date = new Date(timestamp);

    // Convert to Indian Standard Time (IST)
    var indianDate = new Date(
      date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );

    // Format the time string with AM/PM
    var timeString = indianDate.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    });

    return timeString;
  }
  function getIndianDate(dateStamp) {
    // Get current date in UTC
    var utcDate = new Date(dateStamp);

    // Convert to Indian Standard Time (IST)
    var indianDate = new Date(
      utcDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );

    // Format the date string
    var dateString = indianDate.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return dateString;
  }
  function getIndianDateToday() {
    // Get current date in UTC
    var utcDate = new Date();

    // Convert to Indian Standard Time (IST)
    var indianDate = new Date(
      utcDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );

    // Format the date string
    var dateString = indianDate.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return dateString;
  }
  function checkUserOnline(id) {
    // Use Array.some() to check if the _id exists in the array
    return OnlineUser.some((user) => user._id === id);
  }
  function checkSenderId(messages, senderIdToCheck) {
    for (let i = 0; i < messages.length; i++) {
      if (messages[i].senderId === senderIdToCheck) {
        return true; // Sender ID found
      }
    }
    return false; // Sender ID not found
  }

  return (
    <Grid container gap={5}>
      <Grid item xs={3}>
        <div className="userName ">
          <div className="search-input-container">
            <div className="input-container ">
              <input
                type="text"
                placeholder="Search..."
                className="input-box-search"
              />
            </div>
            <div className="chat-btn-switch">
              <div
                onClick={() => {
                  setChatSwitch("Online");
                }}
                className={`${
                  chatSwitch == "Online" && "chat-switch-btn"
                } chat-switch-btn1 cursor`}
              >
                Online
              </div>
              <div
                onClick={() => setChatSwitch("Chat")}
                className={`${
                  chatSwitch == "Chat" && "chat-switch-btn "
                } chat-switch-btn1 cursor`}
              >
                Chat
              </div>
              <div
                onClick={() => setChatSwitch("All")}
                className={`${
                  chatSwitch == "All" && "chat-switch-btn"
                } chat-switch-btn1 cursor`}
              >
                All User
              </div>
            </div>
          </div>

          {conUser.map((user, ind) => (
            <>
              <div
                className="user-container-main "
                key={ind}
                onClick={() => {
                  localStorage.setItem("ChatUserData", JSON.stringify(user));
                  setChatUser(user);
                }}
              >
                <div className="user-container">
                  <img
                    style={{
                      height: "35px",
                      width: "35px",
                      borderRadius: "50%",
                    }}
                    src={serverAddress+"/" + user.userImg}
                    alt=""
                  />
                  {/* <CgProfile color="#969799" size={25} /> */}
                  <div>
                    <h5 className="user-name">{user.userName}</h5>
                    <p className="user-status">
                      {" "}
                      {checkSenderId(typingUser, user._id)
                        ? "Typing..."
                        : checkUserOnline(user._id)
                        ? "Online"
                        : getIndianDateToday() == getIndianDate(+user?.lastSeen)
                        ? getIndianTime(+user?.lastSeen)
                        : `${getIndianDate(+user?.lastSeen)} ${getIndianTime(
                            +user?.lastSeen
                          )}`}
                    </p>
                  </div>
                </div>
                <div className="message-count">1</div>
              </div>
              <hr className="user-line" />
            </>
          ))}
        </div>
      </Grid>

      <Grid item xs={8}>
        {chatUser && (
          <div className="userName-chat">
            <div className="search-input-container chat-header">
              <div className="user-container-header">
                <img
                  style={{ height: "35px", width: "35px", borderRadius: "50%" }}
                  src={ serverAddress+"/" + chatUser.userImg}
                  alt=""
                />
                {/* <CgProfile color="#969799" size={25} /> */}
                <div>
                  <h5 className="user-name">{chatUser?.userName}</h5>
                  <p className="user-status">
                    {/* {checkSenderId(typingUser, chatUser._id)}  */}
                    {checkSenderId(typingUser, chatUser._id)
                      ? "Typing..."
                      : checkUserOnline(chatUser._id)
                      ? "Online"
                      : getIndianDateToday() ==
                        getIndianDate(+chatUser?.lastSeen)
                      ? getIndianTime(+chatUser?.lastSeen)
                      : `${getIndianDate(+chatUser?.lastSeen)} ${getIndianTime(
                          +chatUser?.lastSeen
                        )}`}
                  </p>
                </div>
              </div>
            </div>
            <div className="message-cntainer">
              <div className="chat-date-container">
                <p className="chat-date">Today</p>
              </div>

              {showmessage.length > 0
                ? showmessage.map((message) => {
                    return (
                      <>
                        {myid == message?.userSenderId ? (
                          <div className="user-right ">
                            <div className="user-right-main-chat">
                              <p className="chat-time">
                                {convertToIndianTime(message.messageDate)}
                              </p>
                              <div className="user-right-chat">
                                {message.msg}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="user-left">
                            <div className="user-left-main-chat">
                              <div className="user-left-chat">
                                {message.msg}
                              </div>
                              <p className="chat-time">
                                {convertToIndianTime(message.messageDate)}
                              </p>
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })
                : null}
              <div ref={messageRef}></div>
            </div>

            <div className="chat-input-container">
              <input
                type="text"
                value={message}
                placeholder="Type message here..."
                onChange={(e) => handleMessageInput(e)}
                onKeyDown={handleKeyDown}
                className="chat-input"
              />
              <div className="chat-send-btn">
                <BsSendFill
                  color="#32a852"
                  className="cursor"
                  onClick={() => sendData(chatUser)}
                  size={25}
                />
              </div>
            </div>
          </div>
        )}
      </Grid>
    </Grid>
  );
}

export default TextChat;
