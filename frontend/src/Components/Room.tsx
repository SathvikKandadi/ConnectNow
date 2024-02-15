
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import io from "socket.io-client";

export default function Room() {
  const socket = io('http://localhost:3000/');

  const [conn , setConn] = useState<boolean>(false);
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const pc = new RTCPeerConnection();

  useEffect(() => {
    socket.on("connection" , () => {
      console.log("Connected to server");
    })

    socket.on('offer', handleOffer);
    socket.on('answer' , handleAnswer);
    socket.on('add-ice-candidate' , handleIceCandidate);
 
    return () => {
      socket.off('offer', handleOffer);
      socket.off('answer', handleAnswer);
      socket.off('add-ice-candidate', handleIceCandidate);
    };
  }, []);

  async function handleVideo() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    setMyStream(stream);

    for (const track of stream.getTracks()) {
      pc.addTrack(track, stream);
    }
    console.log(stream);
    console.log(stream.getTracks());
    return stream;
  }

  async function  handleClick() {
    console.log("Clicked");
    const stream = await handleVideo();
    const offer = await pc.createOffer();
    pc.setLocalDescription(offer);
    socket.emit("offer" , offer);
  }

  async function handleOffer(offer:any) {
    
    console.log("Offer");
    pc.onicecandidate = (event) => {
      if (event.candidate !== null) {
        socket.emit("add-ice-candidate" ,event.candidate);
      } else {
        /* there are no more candidates coming during this negotiation */
      }
    };

    pc.ontrack = (event) => {
      console.log("Remote track received");
      setRemoteStream(event.streams[0]);
    };

    pc.setRemoteDescription(offer);
    const answer = await pc.createAnswer();
    pc.setLocalDescription(answer);
    socket.emit("answer" , answer);
    setConn(true);
  }

  function handleAnswer(answer:any) {
    console.log("Answer");
    pc.setRemoteDescription(answer);
    console.log("Connection established");
  }

  async function handleIceCandidate(candidate:any) {
    console.log("New Ice candidates")
    console.log(candidate);
    await pc.addIceCandidate(candidate);
  }

  return (
    <div>
      Room
      <button className="border-2 border-black p-2 m-4" onClick={handleClick}>Click Me!</button>
      <div>
        {/* {myStream && <ReactPlayer url={URL.createObjectURL(myStream)} controls />} */}
        {myStream && <div className="text-3xl font-bold border-2 m-4 border-black">
            My Track
            <ReactPlayer url={myStream} controls />
        </div>}
        
        {remoteStream && <div className="text-3xl font-bold border-2 m-4 border-black">
            Remote Track
            <ReactPlayer url={remoteStream} controls />
        </div>}
        {/* {remoteStream && <video src={URL.createObjectURL(remoteStream)} controls autoPlay />} */}
      </div>
    </div>
  );
}
