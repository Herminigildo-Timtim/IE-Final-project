import '../AddTopicMostComment.css';
import { useState } from "react";

const AddTopicTags = () => {
    const [footer] = useState(['Home', 'About Us', 'Contact', 'Term & Condition']);
    const [nav] = useState(['Home', 'Top Votes', 'Top Comments']);
    const [tags] = useState(['React', 'HTML', 'CSS', 'JavaScript', 'Axios', 'Router', 'Hooks', 'DOM', 'Async']);
    return(
        <div className="screen">
            <div className="header">
                <svg className="logoIcon"  viewBox="0 0 512 512">
                    <path d="M234.5 5.709C248.4 .7377 263.6 .7377 277.5 5.709L469.5 74.28C494.1 83.38 512 107.5 512 134.6V377.4C512 404.5 494.1 428.6 469.5 437.7L277.5 506.3C263.6 511.3 248.4 511.3 234.5 506.3L42.47 437.7C17 428.6 0 404.5 0 377.4V134.6C0 107.5 17 83.38 42.47 74.28L234.5 5.709zM256 65.98L82.34 128L256 190L429.7 128L256 65.98zM288 434.6L448 377.4V189.4L288 246.6V434.6z"></path>
                </svg>
                <div className="appName">blockNote</div>
                <div className="navLinks">
                    <div style={{width: '30%', display: 'flex', justifyContent: 'space-evenly'}}>
                    {nav.map((topic, index) => (
                        <div key={index} className="topicComments">{topic}</div>
                    ))}
                    </div>
                </div>
                <div>
                    <svg className="logoIcon"  viewBox="0 0 24 24">
                    <path fill="none" d="M0 0h24v24H0z"></path>
                    <path d="M18.39 14.56C16.71 13.7 14.53 13 12 13s-4.71.7-6.39 1.56A2.97 2.97 0 0 0 4 17.22V20h16v-2.78c0-1.12-.61-2.15-1.61-2.66zM9.78 12h4.44c1.21 0 2.14-1.06 1.98-2.26l-.32-2.45C15.57 5.39 13.92 4 12 4S8.43 5.39 8.12 7.29L7.8 9.74c-.16 1.2.77 2.26 1.98 2.26z"></path>
                    </svg>
                </div>
            </div>
            <div className="container">
                <div className='addContainer'>
                    <div style={{marginLeft: '70px', marginTop: '10px'}}><h2>Add Topic Tags</h2></div>
                    <div style={{marginLeft: '70px'}}>
                        <input className='inputTag' placeholder='Add a new tag' />
                        <button className='btnAddTag'>Add</button>
                    </div>
                </div>
                <div className='topicsContainer'>
                    <div style={{marginLeft: '70px', marginTop: '10px'}}><h2>Topic Tags List</h2></div>
                    <div class="tagListContainer">
                        {tags.map((topic, index) => (
                            <div key={index} className="tagsContainer"><span className='text'>{topic}</span></div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="footer">
                <div className="footerText">
                {footer.map((topic, index) => (
                    <div key={index}>{topic}</div>
                ))}
                </div>
            </div>
        </div>
    );
  };
  
  export default AddTopicTags;

  
