import React , {useState} from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Home from '../pages/Home'
import Message from '../components/Message'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import axios from 'axios'
import { useEffect } from 'react'
const App = () => {

  const [data,setData] = useState([])


  useEffect(()=>{
    
  })
  return ( 
    <>
     
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/message' element={<Message/>}/>
         <Route path='/login' element={<Login/>}/>
         <Route path='/signup' element={<Signup/>}/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
