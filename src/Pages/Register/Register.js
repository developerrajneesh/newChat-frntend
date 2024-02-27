import axios from "axios";
import React, { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { FaPhoneAlt } from "react-icons/fa";
import { FaUserEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { serverAddress } from "../../envdata";
function Register() {
const navigate = useNavigate()
  const[ image,setImage] = useState(null)
  const[ name,setName] = useState('')
  const[ email,setEmail] = useState('')
  const[ password,setPassword] = useState('')
  const[ number,setNumber] = useState('')

  const[ displayimage,setdisplayimage] = useState(null)
  const NavigateFun = (e) => {
    e.preventDefault();
    // setIsLogin(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file)
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setdisplayimage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };



  
  
  function submit() {
    const formData = new FormData();
    formData.append('userName', name);
    formData.append('userEmail', email);
    formData.append('userNumber', number);
    formData.append('userImg', image);
    formData.append('password', password);
   const form = {
    userName: name,
    userEmail: email,
    userNumber: number,
    userImg: image,
    password: password
   }
    axios.post(serverAddress+'/api/v1/user/register', form, {
      headers: {
        Accept: "application/json",
        // 'Content-Type': 'multipart/form-data',
      }
    })
    .then((response) => {
      console.log(response)
      
      navigate('/login')
      setImage(null)
      setName('')
      setEmail('')
      setNumber('')
      setPassword('')
      setdisplayimage(null)
    })
    .catch((error) => {
      console.error(error);
    });
  }
  
  return (
    <>
      <div className="login-main">
        <form onSubmit={NavigateFun} className="form_main-register">
          <p className="heading">Register</p>
          {displayimage ? (
              <img className="upload-img" src={displayimage} alt="Uploaded" style={{ maxWidth: "100px" }} />
            ) : (
              <CgProfile size={70} />
            )}
          <label htmlFor="file">
            <input  id="file" style={{ display: "none" }} onChange={(e)=>handleImageChange(e)} type="file" />
            <div className="cssbuttons-io-button">
              <svg
                viewBox="0 0 640 512"
                fill="white"
                height="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z" />
              </svg>
              <span>Upload</span>
            </div>
          </label>

          <div className="inputContainer">
        <FaUserEdit  className="inputIcon"/>
            <input
              type="text"
              className="inputField"
              id="username"
              onChange={(e)=>setName(e.target.value)}
              placeholder="Enter your name"
            />

          </div>
          <div className="inputContainer">
            <svg
              className="inputIcon"
              xmlns="http://www.w3.org/2000/svg"
              width={16}
              height={16}
              fill="#2e2e2e"
              viewBox="0 0 16 16"
            >
              <path d="M13.106 7.222c0-2.967-2.249-5.032-5.482-5.032-3.35 0-5.646 2.318-5.646 5.702 0 3.493 2.235 5.708 5.762 5.708.862 0 1.689-.123 2.304-.335v-.862c-.43.199-1.354.328-2.29.328-2.926 0-4.813-1.88-4.813-4.798 0-2.844 1.921-4.881 4.594-4.881 2.735 0 4.608 1.688 4.608 4.156 0 1.682-.554 2.769-1.416 2.769-.492 0-.772-.28-.772-.76V5.206H8.923v.834h-.11c-.266-.595-.881-.964-1.6-.964-1.4 0-2.378 1.162-2.378 2.823 0 1.737.957 2.906 2.379 2.906.8 0 1.415-.39 1.709-1.087h.11c.081.67.703 1.148 1.503 1.148 1.572 0 2.57-1.415 2.57-3.643zm-7.177.704c0-1.197.54-1.907 1.456-1.907.93 0 1.524.738 1.524 1.907S8.308 9.84 7.371 9.84c-.895 0-1.442-.725-1.442-1.914z" />
            </svg>
            <input
              type="text"
              className="inputField"
              id="username"
              onChange={(e)=>setEmail(e.target.value)}
              placeholder="Enter yousr email"
            />
          </div>
          <div className="inputContainer">
         <FaPhoneAlt  className="inputIcon"/>
            <input
              type="text"
              className="inputField"
              id="username"
              onChange={(e)=>setNumber(e.target.value)}
              placeholder="Enter your number"
            />
          </div>

          <div className="inputContainer">
            <svg
              className="inputIcon"
              xmlns="http://www.w3.org/2000/svg"
              width={16}
              height={16}
              fill="#2e2e2e"
              viewBox="0 0 16 16"
            >
              <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
            </svg>
            <input
              type="password"
              className="inputField"
              id="password"
              onChange={(e)=>setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          <button id="button" onClick={submit}>Submit</button>
          <a className="forgotLink" href="#">
            Forgot your password?
          </a>
        </form>
      </div>
    </>
  );
}

export default Register;
