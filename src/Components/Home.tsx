import React, { useEffect, useState } from "react";
import '../styles/Home.css'

const Home: React.FC = () => {

    const headingList = [`Web Development & DevOps`, `DSA & CP`, `AI & ML`, `Nerdy Problems & Challenges`]
    const [heading, setHeading] = useState<number>(0);
    const [headingIdx, setHeadingIdx] = useState<number>(0);
    const [writing, setWriting] = useState<Boolean>(true);

    const subHeading = `Hello, I'm Saksham.`;
    const [subHeadingIdx, setSubHeadingIdx] = useState<number>(0);
    const [subHeadingWriting, setSubHeadingWriting] = useState<Boolean>(true);

    useEffect(()=>{
        const displayHeading = () => {
            if (writing && headingIdx >= headingList[heading].length - 1) {
                setWriting(false);
            }
            else if (!writing && headingIdx <= 0) {
                setWriting(true);
                if(heading >= headingList.length - 1) setHeading(0);
                else setHeading(heading + 1);
            }
            else if (writing){
                setHeadingIdx(headingIdx + 1);
            }
            else {
                setHeadingIdx(headingIdx - 1);
            }

            if(subHeadingWriting && subHeadingIdx >= subHeading.length - 1) setSubHeadingWriting(false);
            else if(!subHeadingWriting && subHeadingIdx <= 0) setSubHeadingWriting(true);
            else if(subHeadingWriting) setSubHeadingIdx(subHeadingIdx + 1);
            else setSubHeadingIdx(subHeadingIdx - 1);
        }
        setTimeout(displayHeading, 100);
    })

    return (
        <>

        <div className='heading-container'>
            <h1>{subHeading.slice(0, subHeadingIdx + 1)}</h1>
            <h2>{headingList[heading].slice(0, headingIdx + 1)}</h2>
        </div>
        
    </>
    )

}

export default Home;