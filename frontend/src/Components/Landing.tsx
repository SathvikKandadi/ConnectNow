import { useState } from "react";
import Header from "./Header";
import Options from "./Options";
import VideoIcon from "./VideoIcon";
import { useNavigate } from "react-router-dom";

export default function Landing() {

  const [meetingId, setMeetingId] = useState<string>("");
  const [visible , setVisible] = useState<boolean>(false);
  const [username , setUsername] = useState<string>("");
  const navigate = useNavigate();


  function handleClick()
  {
    setVisible(!visible);
  }

  function handleUsernameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setUsername(event.target.value);
  }

  function handleCreateNewMeeting()
  {
    if(username === "")
    {
      alert("Enter a username")
      return;
    }
    
    navigate("/room/123");
    console.log(username);
  }

  function handleJoinMeeting()
  {
    navigate(`/room/${meetingId}`);
  }

  return (
    <div className="border-2 border-black fixed top-0 right-0 bottom-0 left-0">
      <Header></Header>
      <div className="grid grid-cols-10">
        <div className="col-span-5 mx-12">
          <div className="mt-64">
            <div className="text-4xl">Premium Video Calls</div>
            <div className="text-4xl">Free for everyone!</div>
          </div>
          <div className="mt-4 text-gray-500  pr-12">ConnectNow is a video meeting app powered by WebRTC (Web Real-Time Communication). You can start your own room or join an existing one by entering the room ID below. Remember, each room can only host two users at a time.</div>
          <div className="mt-8 flex relative">
            <button className="bg-blue-500 text-white p-2 rounded mr-4 flex gap-2 z-1 relative" onClick={handleClick}>
              <VideoIcon></VideoIcon>
              New Meeting
            </button>
            {visible && <Options  handleClick={handleClick} username={username} handleUsernameChange={handleUsernameChange} handleCreateNewMeeting={handleCreateNewMeeting}></Options>}
            <div className="mr-4 z-1 relative">
              <input type="text" placeholder="Enter a Meeting Id" onChange={(event) => setMeetingId(event.target.value)} className="p-2 border border-black rounded " />
            </div>
            <button disabled={meetingId === ""} className={(meetingId === "") ? ("text-stone-300 rounded p-2 z-0 ") : ("text-blue-600 rounded p-2 hover:bg-blue-50 z-0 ")} onClick={handleJoinMeeting}>Join</button>
          </div>

        </div>
        <div className="col-span-5">
          Image
        </div>
      </div>
    </div>
  )

}
