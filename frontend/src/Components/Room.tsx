
import { useCallback, useEffect, useState } from "react";
import ReactPlayer from "react-player";
import io  from "socket.io-client";
import Footer from "./Footer";
import { useNavigate, useParams } from "react-router-dom";




export default function Room() {

  // const [pc, setPC] = useState<RTCPeerConnection | null>(null);
  const pc = new RTCPeerConnection();
  const [video, setVideo] = useState<boolean>(true);
  const [audio, setAudio] = useState<boolean>(true);
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

    // pc.ontrack = (event) => {
    //   console.log("Remote track received" , ++count);
    //   setRemoteStream(event.streams[0]);
    // };

    // socket.on('handle-join', async () => {
    //   console.log("Fetching User's Video");
    //   await handleVideo();
    // })

    socket.on('handle-join', getMedia)

    socket.on('start', async (roomId: string) => {
      console.log("Communication started");
      console.log(socket);
      const offer = await pc.createOffer();
      pc.setLocalDescription(offer);
      socket.emit("offer", offer, roomId);
    })

    socket.on('offer', async (offer, roomId) => {
      console.log("Offer");
      pc.onicecandidate = (event) => {
        if (event.candidate !== null) {
          socket.emit("add-ice-candidate", event.candidate, roomId);
        } else {
          /* there are no more candidates coming during this negotiation */
        }
      };

      pc.onnegotiationneeded = async () => {
        console.log("on negotiation neeeded, sending offer");
        const offer = await pc.createOffer();
        pc.setLocalDescription(offer)
        socket.emit("offer", offer, roomId);
      }


      pc.ontrack = (event) => {
        console.log("Remote track received");
        console.log(event.streams);
        console.log(event.streams[0]);
        setRemoteStream(event.streams[0]);
      };

      pc.setRemoteDescription(offer);
      const answer = await pc.createAnswer();
      pc.setLocalDescription(answer);
      socket.emit("answer", answer, roomId);
      setConn(true);
    });

    socket.on('answer', async (answer, roomId) => {
      pc.setRemoteDescription(answer);
      console.log(`Connection is successfully established in room ${roomId}`);
    });


    socket.on('add-ice-candidate', handleIceCandidate);

    socket.on('room-full', () => {
      alert("room is full");
      navigate('/');
    })

    return () => {
      socket.off('handle-join');
      socket.off('offer');
      socket.off('answer');
      socket.off('add-ice-candidate', handleIceCandidate);
      socket.close();
    };
  }, []);

  const getMedia = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({video:true,audio:true});
    stream.getTracks().forEach(track => {
      pc.addTrack(track, stream);
    })
    setMyStream(stream);
  }, []);

  async function handleVideo() {
    // console.log(myStream?.getTracks());
    if (video && myStream) {
      myStream.getVideoTracks().forEach(track => {
        console.log("Track  before disabling:", track);
        track.enabled = false; // Stop the vedio track
          const sender = pc.getSenders().find(sender => sender.track === track);
          if (sender) {
            pc.removeTrack(sender); // Remove video track sender from peer connection
          }
          track.stop(); // Stop the video track
          console.log("Track after disabling:", track);
        
      });
      setMyStream(myStream);
      console.log(myStream.getTracks());
    }
    else if(myStream){
      myStream.getVideoTracks().forEach(track => {
        console.log("Track before enabling:", track);
        track.enabled = true;
        console.log("Track after enabling:", track);
      })
      setMyStream(myStream);
      console.log(myStream?.getTracks());
      // const stream = await navigator.mediaDevices.getUserMedia({
      //   video: true,
      //   audio: true,
      // });
      // setMyStream(stream);
      // stream.getTracks().forEach(track => {
      //   pc.addTrack(track, stream);
      // })
      // console.log(stream);
      // console.log(stream.getTracks());
    }
    setVideo(!video);
  }


  async function handleAudio() {
    if (myStream && audio) {
      myStream.getAudioTracks().forEach(track => {
        track.enabled = false; // Stop the audio track
        const sender = pc.getSenders().find(sender => sender.track === track);
        if (sender) {
          pc.removeTrack(sender); // Remove audio track sender from peer connection
        }
        track.stop(); // Stop the audio track
      });
      setAudio(!audio);
    }
    else {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })
      setMyStream(stream);
      stream.getAudioTracks().forEach(track => {
        track.enabled = true;
        pc.addTrack(track, stream);
      })
      setAudio(!audio);
    }
  }

  async function handleIceCandidate(candidate: any) {
    console.log("New Ice candidates")
    console.log(candidate);
    await pc.addIceCandidate(candidate);
  }

  return (
    <div className="bg-neutral-800 fixed top-0 right-0 bottom-0 left-0">
      <div className="grid grid-cols-10  h-full shadow-xl ">
        <div className="col-span-5 h-5/6 mt-8 mx-4">
          {
            myStream ? <ReactPlayer width="100%"
              height="100%" url={myStream} playing={true} muted={true}/> : <div className="text-3xl text-white border border-white w-full h-full flex justify-center items-center"> User 1</div>
          }
        </div>
        <div className="col-span-5 h-5/6 mt-8 mx-4">
          {
            remoteStream ? <ReactPlayer width="100%"
              height="100%" url={remoteStream} playing={true} /> : <div className="text-3xl text-white border border-white w-full h-full flex justify-center items-center"> User 2</div>
          }
        </div>
        <Footer video={video} audio={audio} conn={conn} handleVideo={handleVideo} handleAudio={handleAudio}></Footer>
      </div>
    </div>
  );
}
