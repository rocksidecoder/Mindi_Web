import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./component/login/login";
import Signup from "./component/signup/signup";
import Home from "./component/home/home";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Index from "./component";
import PrivateRouter from "./component/auth/privateRouter";
import SocketProvider from "./context/socketContext";
import Room from "./component/room/room";
import DefaultLayout from "./component/layout/defaultLayout";
import RoomRouter from "./component/auth/roomRouter";

function App() {
  return (
    <div className="App">
      <ToastContainer />
      <SocketProvider>
        <DefaultLayout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/home"
              element={
                <PrivateRouter>
                  <Home />
                </PrivateRouter>
              }
            />
            <Route
              path="/room/:id"
              element={
                <PrivateRouter>
                  <RoomRouter>
                    <Room />
                  </RoomRouter>
                </PrivateRouter>
              }
            />
          </Routes>
        </DefaultLayout>
      </SocketProvider>
    </div>
  );
}

export default App;
