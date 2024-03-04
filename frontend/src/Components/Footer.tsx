
interface FooterProps {
  handleVideo: () => void;
  video: boolean;
  audio: boolean;
  conn: boolean;
  handleAudio: () => void;
}


export default function Footer({ video, audio, handleVideo, conn, handleAudio }: FooterProps) {
  return (
    <div className="fixed bottom-0 inset-x-1/2 mb-4 flex  gap-2">
      {
        video ? <div><button className="bg-blue-600  min-w-16 h-10  rounded text-white col-span-1" onClick={handleVideo}>Video</button></div> :
          <div>
            <button className="bg-red-600 min-w-16 h-10  rounded text-white col-span-1" onClick={handleVideo}>Video</button>
          </div>

      }
      {
        audio ? <button className="bg-blue-600 min-w-16 h-10  rounded text-white col-span-1" onClick={handleAudio}>Mute</button> :
        <button className="bg-red-600 min-w-16 h-10  rounded text-white col-span-1" onClick={handleAudio}>UnMute</button>
      }
      {
        !conn ? <button className="bg-blue-600 min-w-16 h-10  rounded text-white col-span-1" >Start</button> :
          <button className="bg-red-600 min-w-16 h-10  rounded text-white col-span-1" >End</button>
      }
    </div>
  )
}
