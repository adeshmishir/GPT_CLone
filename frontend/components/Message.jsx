import React, { useRef, useState } from "react";

const Message = () => {
     const clicks = useRef(0);
  const [, forceRender] = useState(0);
  return (
    <div>
       <button onClick={() => (clicks.current += 1)}>
        Increment ref (UI won’t change)
      </button>
      <button onClick={() => forceRender(x => x + 1)}>
        Force render to show: {clicks.current}
      </button>
    </div>
  )
}

export default Message
