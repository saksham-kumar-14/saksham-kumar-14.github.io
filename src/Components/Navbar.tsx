import React from 'react';
import { IconButton } from "@mui/material";
import { LightModeOutlined, DarkModeOutlined } from "@mui/icons-material";
import { useNav } from '../Context/navigationContext'
import { useNavigate } from "react-router-dom";

import '../styles/navbar.css'

const NavBar : React.FC = () => {
    
    const navigate = useNavigate();

    const {
        darkMode,
        changeDarkMode,
    } = useNav();

    return(
        <div className='nav-container'>
            <div className='navlist-container'>
                <div>
                    <a onClick={() => {
                        navigate('/');
                    }}>Home</a>
                </div>
                <div>
                    <a onClick={() => {
                        navigate('/about');
                    }}>About</a>
                </div>
                <div>
                    <a onClick={() => {
                        navigate('/projects');
                    }}>Projects</a>
                </div>
                <div>
                    <a onClick={() => {
                        navigate('/blog');
                    }}>Blog</a>
                </div>
                <div>
                    <a onClick={() => {
                        navigate('/contact');
                    }}>Contact</a>
                </div>
            </div>

            <div className='mode-container'>
                <IconButton className='dark-mode-btn' onClick={() => changeDarkMode(!darkMode)} color="inherit">
                    {darkMode ? <DarkModeOutlined /> : <LightModeOutlined />}
                </IconButton>
            </div>
        </div>
    )
}

export default NavBar