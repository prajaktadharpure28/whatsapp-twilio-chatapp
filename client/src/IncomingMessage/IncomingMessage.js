import React from 'react';
import "./IncomingMessage.css";

function IncomingMessage(props) {
  return (
    <div className='container'>
      <div className='container-received-message'>
        <h6 className='received-message-username'>{props.from}</h6>
        <div className='received-message-body'>{props.text}</div>
      </div>
    </div>
            
  )
}

export default IncomingMessage