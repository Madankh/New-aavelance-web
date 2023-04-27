import React, { useEffect } from 'react';
import "./contact.css"
import Modal from 'react-modal';
import defaultimage from "../../Assest/2957069.jpg"
import { useSelector } from 'react-redux';
import { useState } from 'react';
import axios from 'axios';
import grouplogo from "../../Assest/download.jfif"
import Message from "../../FeedUserPages/Message/Message"
export default function Contact() {
  const userDetails = useSelector((state)=>state.user);
  const accesstoken = userDetails.currentUser.accessToken;

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupMembers, setGroupMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading , setLoading] = useState(false);
  const [MyGroupChat , setMyGroupChat] = useState([])
  const [Copy , setCopy] = useState([])
  const [CurrentChat , setCurrentChat] = useState('');
  const handleCreateGroup = () => {
    console.log(groupName, groupMembers);
    setModalIsOpen(false);
  }

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          token: `${accesstoken}`,
        },
      };
      const { data } = await axios.get(`http://api.aavelance.com/api/auth/get/search/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
     
    }
  };

  const currentChatGroup =(item)=>{
    setCurrentChat(item)
  }



  useEffect(() => {
    const getGroup = async () => {
      const config = {
        headers: {
          token: `${accesstoken}`,
        },
      };
      const { data } = await axios.get(`http://api.aavelance.com/api/chat/groups`, config);
      setCopy(data);
      setMyGroupChat(data)
    }
    getGroup();
  },[])


  const handleAddUser = (item) => {
    if (groupMembers.some((member) => member?._id === item?._id)) {
      alert("User already added in group");
    } else {
      setGroupMembers([...groupMembers, item]);
      setSearchResult([]);
    }
  }

  const handleDelete = (item)=>{
    setGroupMembers(groupMembers.filter((sel) => sel._id !== item?._id));
  }

  const handlesubmit = async () => {
    if (!groupName || groupMembers?.length <= 1) {
      console.log("sorry error occured");
    } else {
      try {
        await fetch("http://api.aavelance.com/api/chat/create/group", {
          method: "POST",
          headers: { "Content-Type": "application/json", token: accesstoken },
          body: JSON.stringify({
            Chatname: groupName,
            users: JSON.stringify(groupMembers.map((u) => u._id)),
          }),
        }).then((response) => {
          response.json().then((data) => {
            window.location.reload();
          });
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
   <div className='mainContactContainer'>
      <div className='leftsidebar'>
        <div>
          <div style={{marginTop:"30px"}}>
            <button 
              className='userContainer'
              onClick={() => setModalIsOpen(true)}>
              Create New Group
            </button>
          </div>
        </div>
        <div className='usersDetailContainer'>
          <div>
            {MyGroupChat?.groups?.length >= 0 ?
            MyGroupChat?.groups?.map((item)=>(
            <div className='userContainer' onClick={() => currentChatGroup(item)}>
              <img src={grouplogo} className="Chatuserimage" alt="" />
              <div style={{marginLeft:"10px"}}>
                <p style={{color:"black" , textAlign:"start" , marginTop:"15px" ,fontSize:"15px"}}>{item?.Chatname}</p>
              </div>
            </div>
            )):
            <p style={{padding:"10px" , fontSize:"49px" , color:"white"}}>Create a Group and Start to Chat</p>}
          </div>
        </div>
      </div>
      <div className='rightsidebar' style={{marginLeft:"0px" , marginTop:"10px"}}>
        {!CurrentChat == '' ? 
        <Message CurrentChat={CurrentChat} />
        :<p style={{color:"white" , backgroundColor:"#ffffff3d" ,borderRadius:"10px", padding:"10px" , fontSize:"90px" , marginLeft:"80px" , marginTop:"35px"}}>Start a conversation with your group and friends</p>
        }
        
      </div>

      <Modal
       isOpen={modalIsOpen}
       onRequestClose={() => setModalIsOpen(false)}
       contentLabel="Create New Group"
       style={{
        content: {
        width: "40%",
        height: "50%",
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "10px",
        padding: "20px",
        border: "none",
        backgroundColor: "#fff",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
         },
         overlay: {
           backgroundColor: "rgba(0, 0, 0, 0.5)",
         },
       }}
   >
    <h2 style={{ textAlign: "center" }}>Create New Group</h2>
    <form onSubmit={handleCreateGroup} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <label style={{ textAlign: "start" }}>
        Group Name:
        <input type="text" placeholder='Write a Group Name' value={groupName} onChange={(e) => setGroupName(e.target.value)} style={{ borderRadius: "10px", textAlign: "center", margin: "10px 0", padding: "10px", width: "100%" }} />
      </label>
      <label style={{ textAlign: "start" }}>
      Group Members:
      <input type="text" placeholder='Add Users' onChange={(e) => handleSearch(e.target.value.split())} style={{ borderRadius: "10px", textAlign: "center", margin: "10px 0", padding: "10px", width: "100%" }} />
      {groupMembers.map((item)=>(
        <div style={{display:"flex" , alignItems:"center" , margin:"3px" , backgroundColor:"gray", width:"50%" , padding:"2px" , borderRadius:"10px"}}>
          <img src={item?.profile} style={{width:"30px" , height:"30px", marginBottom:"0px" , borderRadius:"50%" , marginRight:"7px" }} alt="" />
          <p style={{color:"white"}}>{item.username}</p>
          <p style={{marginLeft:"30px" , color:"red"}} onClick={() => handleDelete(item)}>X</p>
        </div>
      ))}
     </label>
     {loading === true ? <p>Loading...........</p> : 
     searchResult?.slice(0,5).map((item) => (
      <div style={{display:"flex" , alignItems:"center" , cursor:"pointer"}} >
        <img src={item?.profile} style={{width:"40px" , height:"40px", marginBottom:"26px" , borderRadius:"50%"}} alt="" />
        <div style={{alignItems:"start" , marginLeft:"10px"}}>
          <p style={{marginTop:"10px" , textAlign:"start"}}>{item?.username}</p>
          <p style={{marginTop:"-17px" , textAlign:"start"}}>{item?.email}</p>
          <button style={{backgroundColor:"gray" , color:"white", paddingLeft:"40px", borderRadius:"10px" , border:"none" , paddingTop:'5px' , paddingBottom:"5px" , marginLeft:"-5px" , marginBottom:"-5px" , paddingRight:"40px"}} type="button" onClick={() => handleAddUser(item)}>Add</button>
        </div>
     </div>
    ))
    }

    <div style={{ display: "flex", justifyContent: "center" }}>
      <button type="submit" style={{ borderRadius: "10px", padding: "10px", margin: "10px", backgroundColor: "#008CBA", color: "#fff", border: "none" }} onClick={handlesubmit}>Create Group</button>
      <button type="button" onClick={() => setModalIsOpen(false)} style={{ borderRadius: "10px", padding: "10px", margin: "10px", backgroundColor: "#ccc", color: "#fff", border: "none" }}>Cancel</button>
    </div>
  </form>
</Modal>

    </div>
  )
}
