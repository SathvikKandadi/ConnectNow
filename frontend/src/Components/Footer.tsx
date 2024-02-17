
interface FooterProps {
    handleVideo: () => void;
    video: boolean;
    conn : boolean;
    handleClick: () => void;
  }


export default function Footer({video , handleVideo , conn , handleClick} : FooterProps) {
  return (
    <div className="fixed bottom-0 inset-x-1/2 mb-4 flex  gap-2">
        {
          video ? <div><button className="bg-blue-600  min-w-16 h-10  rounded text-white col-span-1" onClick={handleVideo}>Video</button></div> :
          <div>
            <button className="bg-red-600 min-w-16 h-10  rounded text-white col-span-1 line-through" onClick={handleVideo}>Video</button>
            </div>
            
        }
        
        {
          !conn ? <button className="bg-blue-600 min-w-16 h-10  rounded text-white col-span-1" onClick={handleClick}>Start</button> :
            <button className="bg-red-600 min-w-16 h-10  rounded text-white col-span-1" onClick={handleClick}>End</button>
        }
    </div>
  )
}
