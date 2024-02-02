import { useState } from "react";
import Header from "./Header";

export default function Landing() {
  
  const [meetingId,setMeetingId] = useState<string>("");

  return (
    <div>
        <Header></Header>
        <div className="grid grid-cols-10">
          <div className="col-span-5 mx-12">
            <div>Premium Video Calls</div>
            <div>Some Random text</div>
            <div className="mt-8 flex">
              <button className="bg-blue-500 text-white p-2 rounded mr-4">New Meeting</button>
              <div className="mr-4">
                <input type="text" placeholder="Enter a Meeting Id" onChange={(event) => setMeetingId(event.target.value)} className="p-2 border border-black rounded "/>
              </div>
              <button disabled={meetingId === ""} className={(meetingId === "") ? ("text-stone-300 rounded p-2") : ("text-blue-600 rounded p-2 hover:bg-blue-50")}>Join</button>
            </div>

          </div>
          <div className="col-span-5"> 
            Image

          </div>
        </div>
    </div>
  )
}
