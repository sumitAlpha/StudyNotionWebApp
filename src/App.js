import "./App.css";
import {Route, Routes, useNavigate} from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/common/Navbar";
import ForgotPassword from "./pages/ForgotPassword";
import OpenRoute from "./components/core/Auth/OpenRoute";
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/VerifyEmail";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import About from "./pages/About"
import Contact from "./pages/Contact"
import Error from "./pages/Error"
import MyProfile from "./components/core/Dashboard/MyProfile"
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import Dashboard from "./pages/Dashboard"
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import { useDispatch, useSelector } from "react-redux";
import { ACCOUNT_TYPE } from "./utlis/constants";
import Cart from "./components/core/Dashboard/Cart";
import Settings from "./components/core/Dashboard/Settings";
import AddCourse from "./components/core/Dashboard/AddCourse"
import { Catalog } from "./pages/Catalog";


function App() {
  const { user } = useSelector((state) => state.profile)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
    <Navbar/>
   <Routes>
        <Route path="/" element={<Home />} />
        <Route path="catalog/:catalogName" element={<Catalog/>} />
        
        <Route path="login" element={<OpenRoute> <Login /></OpenRoute>} />
        
        <Route path="signup" element={<OpenRoute> <Signup /></OpenRoute>} />

        <Route path="forgot-password" element={<OpenRoute> <ForgotPassword /></OpenRoute>} />

        <Route path="update-password/:id" element={<OpenRoute> <UpdatePassword /></OpenRoute>} />

        <Route path="verify-email" element={<OpenRoute> <VerifyEmail /></OpenRoute>} /> 
        
        <Route
          path="about"
          element={
            <OpenRoute>
             <About />
            </OpenRoute>
          }
        />

        <Route path="/contact" element={<Contact />} /> 

        <Route 
      element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      }
    >
      <Route path="dashboard/my-profile" element={<MyProfile />} />
      <Route path="dashboard/Settings" element={<Settings />} />
      

      {
        user?.accountType === ACCOUNT_TYPE.STUDENT && (
          <>
          <Route path="dashboard/cart" element={<Cart />} />
          <Route path="dashboard/enrolled-courses" element={<EnrolledCourses />} />
          </>
        )
      }

      {
        user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
          <>
          <Route path="dashboard/add-course" element={<AddCourse />} />
          
          </>
        )
      }


    </Route>
       
        <Route path ="*" element ={<Error/>}/>
   </Routes>
   </div>
  );
}

export default App;
