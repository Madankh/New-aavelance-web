import React from 'react'
import Navbar from '../../component/Navbar'
import Contact from '../../FeedUserComponent/Contact/Contact'
import "../Chat/chat.css"
export default function Chat() {
  return (
    <div>
          <Navbar/>
          <div className='ChatContainer' >
             <Contact/>
          </div>
    </div>
  )
}
