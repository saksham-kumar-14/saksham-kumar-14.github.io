import React, { useEffect, useState } from "react";
import '../styles/Home.css'

const Home: React.FC = () => {

    const headingList = [`Web Development & DevOps`, `Low Level`, `DSA`]
    const [heading, setHeading] = useState<number>(0);
    const [headingIdx, setHeadingIdx] = useState<number>(0);
    const [writing, setWriting] = useState<Boolean>(true);

    const subHeading = `Hello, I'm Saksham.`;
    const [subHeadingIdx, setSubHeadingIdx] = useState<number>(0);
    const [subHeadCompleted, setSubHeadCompleted] = useState<Boolean>(false);

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

            if(!subHeadCompleted && subHeadingIdx >= subHeading.length - 1) setSubHeadCompleted(true);
            if(!subHeadCompleted) setSubHeadingIdx(subHeadingIdx + 1);
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
