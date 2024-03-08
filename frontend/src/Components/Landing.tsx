import { useState } from "react";
import Header from "./Header";

import { useNavigate } from "react-router-dom";
import homepageImage from "../assets/homepage.png";

export default function Landing() {

  const [meetingId, setMeetingId] = useState<string>("");
  const navigate = useNavigate();

 

  function handleCreateNewMeeting()
  {
    let roomId:string = generateMeetingId();
    navigate(`/room/${roomId}`);
  }

  function handleJoinMeeting()
  {
    navigate(`/room/${meetingId}`);
  }

  function generateMeetingId(): string {
    const chars: string = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result: string = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }


  return (
    <div className=" fixed top-0 right-0 bottom-0 left-0">
      <Header></Header>
      <div className="grid grid-cols-10">
        <div className="col-span-5 mx-12">
          <div className="mt-64">
            <div className="text-4xl">Premium Video Calls</div>
            <div className="text-4xl">Free for everyone!</div>
          </div>
          <div className="mt-4 text-gray-500  pr-12">ConnectNow is a video meeting app powered by WebRTC (Web Real-Time Communication). You can start your own room or join an existing one by entering the room ID below. Remember, each room can only host two users at a time.</div>
          <div className="mt-8 flex relative">
            <button className="bg-blue-500 text-white p-2  rounded mr-4 flex gap-2 z-1 relative" onClick={handleCreateNewMeeting}>
              New Meeting
            </button>    
            <div className="mr-4 z-1 relative">
              <input type="text" placeholder="Enter a Room Id" onChange={(event) => setMeetingId(event.target.value)} className="p-2 border border-black rounded " />
            </div>
            <button disabled={meetingId === ""} className={(meetingId === "") ? ("text-stone-300 rounded p-2 z-0 ") : ("text-blue-600 rounded p-2 hover:bg-blue-50 z-0 ")} onClick={handleJoinMeeting} >Join</button>
          </div>
        </div>
        <div className="col-span-5 ml-4 mr-8 mt-10  pt-16">
          <img src={homepageImage} alt="Homepage" className=""></img>
        </div>
      </div>
    </div>
  )

}
