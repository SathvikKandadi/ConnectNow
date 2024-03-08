import MicrophoneIcon from "../Icons/MicrophoneIcon";
import PhoneIcon from "../Icons/PhoneIcon";
import VideoIcon from "../Icons/VideoIcon";

interface FooterProps {
  handleVideo: () => void;
  handleAudio: () => void;
  handleEnd:() => void;
  video: boolean;
  audio: boolean;


  
}



export default function Footer({ video, audio, handleVideo, handleAudio , handleEnd }: FooterProps) {


  

  return (
    <div className="fixed bottom-0 inset-x-1/2 mb-6 flex justify-center gap-2">
      {
        video ? <button className="bg-blue-600  min-w-10 min-h-10  rounded-3xl p-2 text-white col-span-1" onClick={handleVideo}><VideoIcon width={6} height={6} /></button> :
          <button className="bg-red-600 min-w-10 min-h-10  rounded-3xl p-2 text-white col-span-1 " onClick={handleVideo}><VideoIcon width={6} height={6} /></button>
      }
      {
        audio ? <button className="bg-blue-600 min-w-10 min-h-10  rounded-3xl p-2 text-white col-span-1" onClick={handleAudio}><MicrophoneIcon width={6} height={6} /></button> :
          <button className="bg-red-600 min-w-10 min-h-10  rounded-3xl p-2 text-white col-span-1" onClick={handleAudio}><MicrophoneIcon width={6} height={6} /></button>
      }
      {
        <button className="bg-red-600 min-w-10 min-h-10  rounded-3xl p-2 text-white col-span-1" onClick={handleEnd}><PhoneIcon width={6} height={6} /></button>
      }
    </div>
  )
}
