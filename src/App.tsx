import React from 'react';
import './styles/App.css'

import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { NavProvider } from './Context/navigationContext';
import Home from './Components/Home';
import About from './Components/About';
import Blog from './Components/Blog';
import Projects from './Components/Projects';
import Contact from './Components/Contact';
import NavBar from './Components/Navbar';

const App : React.FC = () => {

  return(
    <>
      <NavProvider>
        <BrowserRouter>
          <NavBar />
          <Routes> 
            <Route path = '/' element = {<Home/>}> </Route>
            <Route path = '/about' element = {<About/>}> </Route>
            <Route path = '/projects' element = {<Projects/>}> </Route>
            <Route path = '/blog' element = {<Blog/>}> </Route>
            <Route path = '/contact' element = {<Contact />} ></Route>
          </Routes>
        </BrowserRouter>
      </NavProvider>
    </>
  )
  
}

export default App
