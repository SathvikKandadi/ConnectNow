import { useState, useEffect } from "react";
import VideoIcon from "../Icons/VideoIcon";

export default function Header() {
    const [day, setDay] = useState<number>(0);
    const [month , setMonth] = useState<number>(0);
    const [date, setDate] = useState<number>(0);
    const [hours, setHours] = useState<number>(0);
    const [min, setMin] = useState<number>(0);
    const [sec, setSec] = useState<number>(0);

    const Day : { [key : number] : string } = {
        0 : "Sun",
        1 : "Mon",
        2 : "Tue",
        3 : "Wed",
        4 : "Thur",
        5 : "Fri",
        6 : "Sat"
    }

    const Month : { [key : number] : string } = {
        0 : "Jan",
        1 : "Feb",
        2 : "Mar",
        3 : "Apr",
        4 : "May",
        5 : "Jun",
        6 : "Jul",
        7 : "Aug",
        8 : "Sep",
        9 : "Oct",
        10 : "Nov",
        11 : "Dec"
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            const currentDate = new Date();
            setMonth(currentDate.getMonth());
            setDate(currentDate.getDate());
            setDay(currentDate.getDay());
            setHours(currentDate.getHours());
            setMin(currentDate.getMinutes());
            setSec(currentDate.getSeconds());
        }, 1000);

        // Cleanup the interval on component unmount
        return () => clearInterval(intervalId);
    }, []); // Empty dependency array to run the effect only once on mount

    return (
        <div className="flex justify-between m-2">
            <div className="flex flex-row">
                <div className="hidden md:mx-2 md:mt-1 md:text-blue-500 md:block">
                    <VideoIcon height={10} width={10}/>
                </div>
                <div className="md:m-2  md:text-3xl">
                    ConnectNow
                </div>
                
            </div>
            <div>{hours < 10 ? '0' + hours : hours}:{min < 10 ? '0' + min : min}:{sec < 10 ? '0' + sec : sec} <span className="text-3xl text-black">&nbsp;</span> {Day[day]}  , {Month[month]} {date}  </div>
        </div>
    );
}










