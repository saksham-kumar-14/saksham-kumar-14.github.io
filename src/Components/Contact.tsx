import React from "react";
import '../styles/contact.css'

const Contact: React.FC = () => {

    return(
        <div>
            <h2 className="contact__heading">Message Me!</h2>

            <form className="msg-form">
                <input type="text" placeholder="Name" />
                <input type="text" placeholder="Email" />
                <textarea placeholder="Message" />
                <button>Submit</button>
            </form>

            <div className="__contact">
                <span>Email : <a target="_blank" href="mailto:example@example.com">sakshamkumar1415@gmail.com</a></span>
                <span>LinkedIn : <a target="_blank" href="https://www.linkedin.com/in/saksham-kumar-683930224/">Saksham Kumar</a></span>
                <span>Github : <a target="_blank" href="https://github.com/saksham-kumar-14">saksham-kumar-14</a></span>
            </div>
        </div>
    )
}

export default Contact;