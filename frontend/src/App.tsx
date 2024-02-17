import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./Components/Landing";
import Room from "./Components/Room";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />}></Route>
        <Route path="/room/:roomId" element={<Room/>} />
        {/* <Route path="*" element={<NoPage />} /> */}
      </Routes>
    </BrowserRouter>
    
  )
}

export default App
