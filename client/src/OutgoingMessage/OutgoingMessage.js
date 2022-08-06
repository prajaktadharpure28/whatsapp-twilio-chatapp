import React from 'react'
import "./OutgoingMessage.css";

function OutgoingMessage(props) {
  return (
    <div className='container'>
      <div className= 'container-send-message'>
        <h6 className= 'send-message-username'>{props.from}</h6>
        <div className='send-message-body'>{props.text}</div>
      </div>
    </div>
  )
}

export default OutgoingMessage;