import React, { useState } from 'react'

const ChatPage = () => {
  const [val,setVal] = useState(0);
 const add= ()=>{
    setVal(val+1);
    setVal(val=>val+5);
    setVal(val=>val+5);
    
    // setVal(val+1);
    // setVal(val+2);
 }
 const subtract= ()=>{
    if(val>=1){
        setVal(val-1);
    }
    else{
        console.log('Value is 0 , ');
        
        setVal(0);
    }
 }
  return (
    <div>
        <h1 className='m-8'>{val}</h1>
      <button onClick={add} className='m-8 p-3 bg-blue-500 rounded-3xl'>Increment value</button>
      <button onClick={subtract} className='m-8 p-3 bg-green-600 rounded-3xl'>decrement value</button>
    </div>
  )
}

export default ChatPage
