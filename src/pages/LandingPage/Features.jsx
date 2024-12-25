import React from "react";
import "./Features.css";
import InterviewPic1 from "../../assets/img/interview-pic1.png";
import InterviewPic2 from "../../assets/img/interview-pic2.png";
import Interview from "../Interview/Interview";

const Features = ({ id }) => {
  return (
    <div className="Features">
      {/* <div className="quote-section">
        <p>We are</p>
        <p>what we</p>
        <p>repeatedly</p>
        <p>do.</p>
        <p>Excellence</p>
        <p>then,</p>
        <p>is not an</p>
        <p>act,</p>
        <p>but a</p>
        <p>habit.</p>
      </div> */}
      <div className="Features-Container" id="Features">
        <div className="Quotes-Section">
          We are what we repeatedly do. Excellence then, is not an act, but a
          habit.
        </div>
        <div className="Features1">
          <img src={InterviewPic1} className="Features1-Left"></img>
          <div className="Features1-Right">
            <p className="Title">Get a best personalized interview questions</p>
            <p>
              with our best AI model, we help you get a best experiences you
              have ever had
            </p>
          </div>
        </div>
        <div className="Features1-Right-Float">
          <p>
            Understand yourself thoroughly by the questions Give the best
            impression by having best practice
          </p>
        </div>
        <div className="Features1">
          <img src={InterviewPic2} className="Features1-Left"></img>
          <div className="Features1-Right">
            <p className="Title">
              Clueless your blind spot? We are here to help
            </p>
            <p>
              with data insight you will get after finishing the interview, it
              helps you understand where are you in industrial
            </p>
          </div>
        </div>
        <div className="Features1-Right-Float"></div>

        <div className="Features-Start"></div>
      </div>
    </div>
  );
};
export default Features;
