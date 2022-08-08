import React, { useEffect, useState} from 'react';
import './Home.css';
import axios from 'axios';
import IncomingMessage from '../IncomingMessage/IncomingMessage';
import OutgoingMessage from '../OutgoingMessage/OutgoingMessage';

function Home() {
    const [messages, setMessage] = useState([]);

    const [to, setTo] = useState("");

    const [text, setText] = useState("");

    const [trigger, setTrigger] = useState(true);

    useEffect(() => {
        async function getMessages() {
            const allMessages = await axios.get("/allMessage");
            setMessage(allMessages.data);
        }
        getMessages();
    }, [trigger]);

    async function sendMessage(){
        console.log(to);
        console.log(text);

        await axios.post("/send",{
            to: to,
            text: text
        })
        setTrigger(!trigger);
    }
  return (
    <div className='container'>
        <h1 className='text-center whatsapp mt-2'>Whatsapp Frontend</h1>
        <div className='app_card'>
            {
                messages && messages.map((message, index) => {
                    if(message.direction === "incoming"){
                        return (
                            <IncomingMessage key={index} text={message.text}/>
                        )
                    }
                    else{
                        return (
                            <OutgoingMessage key={index} text={message.text}/>
                        )
                    }
                })
            }
            <form>
                <input type="phone" className="form-control mt-3" placeholder='Enter Mobile Number' value={to}
                onChange={(e)=>(setTo(e.target.value))}/>

                <input type="text" className="form_input mt-3" placeholder="Enter Message" value={text}
                onChange={(e)=> {setText(e.target.value)}}/>

                <button type='button' className='btn btn-primary button mt-1 mb-2' onClick={sendMessage}>Send</button>
            </form>
    </div>
    </div>
  )
}

export default Home

// import React,{useState, useEffect} from 'react';
// // import './Auth.css';
// import IncomingMessage from '../IncomingMessage/IncomingMessage';
// import OutgoingMessage from '../OutgoingMessage/OutgoingMessage';

// import SendMessage from './../SendMessage/SendMessage';
// import ReceivedMessage from './../ReceivedMessage/ReceivedMessage';
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import axios from 'axios';
// import LocalStorage from'./LocalStorage/LocalStorage';


// function Auth() {

    
//     const [data, setData] = useState([]);
  
//     const [currentUser, setCurrentUser] = useState("");
  
//     const [currentMessage, setCurrentMessage] = useState("");
  
//     const [fetchTrigger, setFetchTrigger] = useState(false);

    
//     useEffect(() => {
//         async function fetchData() {
//           const response = await axios.get('/message');
//           setData(response.data);
//         }
//         fetchData();
//       }, [fetchTrigger]);

//     useEffect(()=>{
//          const storedUser = localStorage.getItem("currentUser")
//          setCurrentUser(storedUser);
//     },[])
    
//       function sendMessage() {
//         axios.post('/message', {
//           user: currentUser,
//           messageType: "text",
//           messageBody: currentMessage
//         })
//         setCurrentMessage("");
//         setFetchTrigger(!fetchTrigger);
    
//       }
     
//   return (
//     <div>
//     <div className='container'>
//     <div className='title'>
//     <div className='text-center'>
//       <h2>Chat-Application</h2>
//       </div>
//     </div>
//     </div>
//     <div className='container'>
//     <div className='box'>
    
//     {
//           data.map((item, index) => {
//             if(item.user === currentUser){
//               return <OutgoingMessage key={index} user={item.user} message={item.messageBody} />
              
//             }
//             else{
//               return <IncomingMessage key={index} user={item.user} message={item.messageBody} />
//             }
//           })
//        }


//     </div>
//     <center>
//     <div className='msg'>
        
//     <input type="text" className="form-control mt-3" placeholder="Enter Username..."
//        onChange={(e)=>{setCurrentUser(e.target.value)}} />

//        <input type="text" className="form-control mt-3" placeholder="Enter Message..."
//         value={currentMessage}
//        onChange={(e)=>{setCurrentMessage(e.target.value)}} />
//        </div>
//        <button className="btn btn-primary mt-3"
//        onClick={sendMessage}>Send</button>
//         </center>
   
//        </div>
//        </div>
      
//   )
// }

// export default Auth