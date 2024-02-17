import DeleteIcon from "./DeleteIcon";
import PlusIcon from "./PlusIcon";
import UserIcon from "./UserIcon";

interface OptionsProps {
    handleClick: () => void;
    username: string;
    handleUsernameChange : (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleCreateNewMeeting: () => void;
  }


export default function Options({ handleClick, username , handleUsernameChange , handleCreateNewMeeting}: OptionsProps) {

    
    
    return (
        <div className="absolute z-10   border w-64 h-auto  flex flex-col bg-white shadow-2xl rounded-md ">
            <div className="grid grid-cols-8">
                <div className="col-span-1 p-2 text-slate-500 border-y border-l border-black"><UserIcon/></div>
                <input type="text" placeholder="Enter your username" value={username}
          onChange={(event) => handleUsernameChange(event)} className="full-width py-2 pl-6 col-span-7 placeholder-slate-500 text-slate-500 border-y border-black border-r focus:outline-none"></input>
                <div className="col-span-1 p-2 bg-blue-500 text-white"><PlusIcon/></div>
                <button className="col-span-7 p-2  bg-blue-500 text-white" onClick={handleCreateNewMeeting}>Create New meeting</button>
                <div className="col-span-1 p-2 bg-red-600 text-white"><DeleteIcon/></div>
                <button onClick={handleClick} className="col-span-7 p-2  bg-red-600 text-white">Cancel</button>
            </div>
        </div>
    )
    // bg-red-600
}
