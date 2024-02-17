
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import io from "socket.io-client";
import UserIcon from "./UserIcon";
import Footer from "./Footer";

export default function Room() {
  const socket = io('http://localhost:3000/');

  const [video, setVideo] = useState<boolean>(false);
  const [conn, setConn] = useState<boolean>(false);
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const pc = new RTCPeerConnection();

  useEffect(() => {
    socket.on("connection", () => {
      console.log("Connected to server");
    })

    socket.on('offer', handleOffer);
    socket.on('answer', handleAnswer);
    socket.on('add-ice-candidate', handleIceCandidate);

    return () => {
      socket.off('offer', handleOffer);
      socket.off('answer', handleAnswer);
      socket.off('add-ice-candidate', handleIceCandidate);
    };
  }, []);

  async function handleVideo() { 
    console.log("called");
    console.log(myStream);
    if(myStream)
    {
      for (const track of myStream.getTracks()) {
        track.stop();
      }
      setVideo(!video);
      setMyStream(null);
      return null;
    }
    else
    {
      setVideo(!video);
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
  }


  async function handleClick() {
    console.log("Clicked");
    const stream = await handleVideo();
    const offer = await pc.createOffer();
    pc.setLocalDescription(offer);
    socket.emit("offer", offer);
  }

  async function handleOffer(offer: any) {

    console.log("Offer");
    pc.onicecandidate = (event) => {
      if (event.candidate !== null) {
        socket.emit("add-ice-candidate", event.candidate);
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
    socket.emit("answer", answer);
    setConn(true);
  }

  function handleAnswer(answer: any) {
    console.log("Answer");
    pc.setRemoteDescription(answer);
    console.log("Connection established");
  }

  async function handleIceCandidate(candidate: any) {
    console.log("New Ice candidates")
    console.log(candidate);
    await pc.addIceCandidate(candidate);
  }

  return (
    <div className="bg-neutral-800 fixed top-0 right-0 bottom-0 left-0">
      <button className="border-2 border-black p-2 m-4" onClick={handleClick}>Click Me!</button>
      <div className="grid grid-cols-10">
        {/* {myStream && <ReactPlayer url={URL.createObjectURL(myStream)} controls />} */}
        <div className="col-span-5 flex justify-center items-center">
          <div className="text-3xl text-white">
          {/* <UserIcon></UserIcon> */}
            Sathvik Kandadi
          </div>
          
        </div>
        {myStream && <div className="text-3xl text-white font-bold border-2 w-1 h-1 border-blue-400 col-span-5">
          My Track
          <ReactPlayer url={myStream} controls />
        </div>}
        
        {/* {
          video ? <button className="bg-blue-600 p-2 rounded text-white col-span-1" onClick={handleVideo}>Video</button> :
            <button className="bg-red-600 p-2 rounded text-white col-span-1" onClick={handleVideo}>Stop Video</button>
        } */}


        {remoteStream && <div className="text-3xl font-bold border-2 m-4 border-black">
          Remote Track
          <ReactPlayer url={remoteStream} controls />
        </div>}
        <Footer video={video} conn={conn} handleVideo={handleVideo} handleClick={handleClick}></Footer>
        {/* {remoteStream && <video src={URL.createObjectURL(remoteStream)} controls autoPlay />} */}
      </div>
    </div>
  );
}
