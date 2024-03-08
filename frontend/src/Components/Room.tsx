
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import io from "socket.io-client";
import Footer from "./Footer";
import { useNavigate, useParams } from "react-router-dom";





export default function Room() {

  // const [pc, setPC] = useState<RTCPeerConnection | null>(null);
 
  const pc = new RTCPeerConnection();
  const [video, setVideo] = useState<boolean>(true);
  const [audio, setAudio] = useState<boolean>(true);
  // const [conn, setConn] = useState<boolean>(false);
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const navigate = useNavigate();
  const { roomId } = useParams();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const socket = useMemo(() => io("http://localhost:3000/"), []);


  useEffect(() => {
    //const socket = io('http://localhost:3000/');


    socket.on("connect", () => {
      console.log("Connected to server");
      socket.emit("room-joined", roomId, "User");
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

    socket.on('offer', async (offer: any, roomId: string): Promise<any> => {
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
      pc.setRemoteDescription(offer);
      const answer = await pc.createAnswer();
      pc.setLocalDescription(answer);
      socket.emit("answer", answer, roomId);
      // setConn(true);
    });

    socket.on('answer', (answer: any, roomId: string) => {
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
      socket.off('add-ice-candidate');
      socket.close();
    };


  }, []);

  const getMedia = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    stream.getTracks().forEach(track => {
      pc.addTrack(track, stream);
    })
    setMyStream(stream);
  }, []);

  async function handleVideo() {
    if (!myStream) {
      console.log("No stream available");
      return;
    }
    const videoTracks = myStream.getVideoTracks();

    if (videoTracks.length === 0) {
      console.log("No video tracks available in the stream");
      return;
    }
    videoTracks.forEach(track => {
      track.enabled = !video;
    })
    setVideo(!video);
  }

  async function handleAudio() {
    if (!myStream) {
      console.log("No stream available");
      return;
    }
    const audioTracks = myStream.getAudioTracks();

    if (audioTracks.length === 0) {
      console.log("No audio tracks available in the stream");
      return;
    }
    audioTracks.forEach(track => {
      track.enabled = !audio;
    })
    setAudio(!audio);
  }

  function handleEnd() {
    if (myStream) {
      myStream.getTracks().forEach(track => track.stop());
    }
    setMyStream(null);
    navigate("/");
    
  }


  async function handleIceCandidate(candidate: any) {
    console.log("New Ice candidates")
    console.log(candidate);
    await pc.addIceCandidate(candidate);
  }

  useEffect(() => {
    if (myStream && localVideoRef.current) {
      localVideoRef.current.srcObject = myStream;
    }
  }, [myStream]);

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);


  pc.ontrack = (event) => {
    console.log("Remote track received");
    console.log(event.streams[0].getTracks());
    setRemoteStream(event.streams[0]);
  }


  return (
    <div className="bg-neutral-800 fixed top-0 right-0 bottom-0 left-0">
      <div className="grid grid-cols-10  h-full shadow-xl ">
        <div className="col-span-5 h-5/6 mt-8 mx-4">
          {myStream  ? (
            <video width="100%" height="100%" autoPlay muted ref={localVideoRef} className="mt-20"></video>
          ) : (
            <div className="text-3xl text-white border border-white w-full h-full flex justify-center items-center">
              User 1
            </div>
          )}
        </div>
        <div className="col-span-5 h-5/6 mt-8 mx-4">
          {remoteStream ? (
            <video width="100%" height="100%" autoPlay ref={remoteVideoRef} className="mt-20"></video>
          ) : (
            <div className="text-3xl text-white  w-full h-full flex flex-col gap-2 justify-center items-center">
              <div>Waiting for other user to join </div> <div className="flex justify-center">{`RoomId: ${roomId}`}</div>
            </div>
          )}
        </div>
        <Footer video={video} audio={audio}  handleVideo={handleVideo} handleAudio={handleAudio} handleEnd={handleEnd}></Footer>
      </div>
    </div>
  );
}
