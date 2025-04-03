import React from "react";
import { IconButton } from "@mui/material";
import { LinkedIn, Twitter, GitHub } from "@mui/icons-material";
import myImage from '../assets/myImage.jpg'
import '../styles/about.css'

const About: React.FC = () => {

    return(
        <div className="about-container">
            <div className="about-subcontainer">
                <img src={myImage} alt="My Image" width='500px' />
            </div>


            <div className="about-info">
                <div>
                    I'm Saksham, freshman studying Computer Science at IIT Kharagpur, Junior Executive member at KodeinKGP.
                </div>
                <div>
                    Currently trying to explore the field of Computer Science as much as I can. I am facinated by development and Competitive programming. Trying to learn and improve in the fields of Web devlopment, DevOps, Competitive Programming, AI/ML, Cyber Security etc..
                </div>

                <div className="connect-container">
                    <p>Connect with me :)</p>
                    <IconButton color="primary" component="a" href="https://www.linkedin.com/in/saksham-kumar-683930224/">
                        <LinkedIn className="connect-btns" />
                    </IconButton>

                    <IconButton color="primary" component="a" href="https://x.com/sakshm_kumar">
                        <Twitter className="connect-btns" />
                    </IconButton>

                    <IconButton color="inherit" component="a" href="https://github.com/saksham-kumar-14">
                        <GitHub className="connect-btns" />
                    </IconButton>
                </div>
            </div>
        </div>
    )
}

export default About;