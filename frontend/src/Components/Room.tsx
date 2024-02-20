
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import io from "socket.io-client";
import Footer from "./Footer";
import { useNavigate, useParams } from "react-router-dom";




export default function Room() {

  // const [pc, setPC] = useState<RTCPeerConnection | null>(null);
  const pc = new RTCPeerConnection();
  const [video, setVideo] = useState<boolean>(false);
  const [conn, setConn] = useState<boolean>(false);
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const navigate = useNavigate();
  const { roomId } = useParams();


  useEffect(() => {
    const socket = io('http://localhost:3000/');

    socket.on("connect", () => {
      console.log("Connected to server");
      socket.emit("room-joined", roomId, "Sathvik");
    })

    // const peerConnection = new RTCPeerConnection();
    // setPC(peerConnection);

    pc.ontrack = (event) => {
      console.log("Remote track received");
      setRemoteStream(event.streams[0]);
    };

    socket.on('handle-video', async () => {
      console.log("Fetching User's Video");
      await handleVideo();
    })

    socket.on('start', async (roomId: string) => {
      console.log("Communication started");
      console.log(socket);
      const offer = await pc.createOffer();
      pc.setLocalDescription(offer);
      socket.emit("offer", offer, roomId);
    })

    socket.on('offer', async (offer , roomId) => {
      console.log("Offer");
      pc.onicecandidate = (event) => {
        if (event.candidate !== null) {
          socket.emit("add-ice-candidate", event.candidate , roomId);
        } else {
          /* there are no more candidates coming during this negotiation */
        }
      };

      // pc.ontrack = (event) => {
      //   console.log("Remote track received");
      //   setRemoteStream(event.streams[0]);
      // };

      pc.setRemoteDescription(offer);
      const answer = await pc.createAnswer();
      pc.setLocalDescription(answer);
      socket.emit("answer", answer , roomId);
      setConn(true);
    });

    socket.on('answer', async(answer,roomId) => {
      pc.setRemoteDescription(answer);
      // pc.ontrack = (event) => {
      //   console.log("Remote track received");
      //   setRemoteStream(event.streams[0]);
      // };
      console.log(`Connection is successfully established in room ${roomId}`);
    });


    socket.on('add-ice-candidate', handleIceCandidate);

    socket.on('room-full', () => {
      alert("room is full");
      navigate('/');
    })

    return () => {
      socket.off('offer');
      socket.off('answer');
      socket.off('add-ice-candidate', handleIceCandidate);
      socket.close();
    };
  }, []);

  async function handleVideo() {
    console.log(myStream);
    if (myStream) {
      myStream.getTracks().forEach(track => {
        const sender = pc.getSenders().find(sender => sender.track === track);
        if (sender) {
          pc.removeTrack(sender);
        }
        track.stop();
      });
      setVideo(!video);
      setMyStream(null);
    }
    else {
      setVideo(!video);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setMyStream(stream);
      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream);
      })
      console.log(stream);
      console.log(stream.getTracks());
    }
  }


  async function handleClick() {
    console.log("Clicked");

  }

  async function handleIceCandidate(candidate: any) {
    console.log("New Ice candidates")
    console.log(candidate);
    await pc.addIceCandidate(candidate);
  }

  return (
    <div className="bg-neutral-800 fixed top-0 right-0 bottom-0 left-0">
      <div className="grid grid-cols-10 border border-white h-full shadow-xl">
        {/* {myStream && <ReactPlayer url={URL.createObjectURL(myStream)} controls />} */}
        <div className="col-span-5 flex justify-center items-center border border-white h-5/6 mt-8 ml-8">
          <div className="text-3xl text-white ">
            {/* <UserIcon></UserIcon> */}
            Sathvik Kandadi
          </div>

        </div>
        {myStream && <div className="text-3xl text-white font-bold border-2 w-1 h-1 border-blue-400 col-span-5">
          My Track
          <ReactPlayer url={myStream} controls/>
          {/* playing={true} */}
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
