import React from "react";
import "./Features.css";
// import InterviewPic1 from "../assets/img/interview-pic1.png";
// import InterviewPic2 from "../assets/img/interview-pic2.png";

const Features = ({ id }) => {
  return (
    <div className="Features">
      <div className="Features-Container" id="Features">
        <div className="Quotes-Section"></div>
        <div className="Features1">
          <div className="Features1-Left"></div>
          <div className="Features1-Right">
            <p>Get a best personalized interview questions</p>
            <p>
              with our best AI model, we help you get a best experiences you
              have ever had
            </p>
          </div>
        </div>
        <div className="Features1-Right-Float"></div>
        <div className="Features1">
          <div className="Features1-Left"></div>
          <div className="Features1-Right">
            <p>Get a best personalized interview questions</p>
            <p>
              with our best AI model, we help you get a best experiences you
              have ever had
            </p>
          </div>
        </div>
        <div className="Features1-Right-Float"></div>

        <div className="Features-Start"></div>
      </div>
    </div>
  );
};
// <div className="features" id={id}>
//   <div className="quote-section">
//     <p>We are</p>
//     <p>what we</p>
//     <p>repeatedly</p>
//     <p>do.</p>
//     <p>Excellence</p>
//     <p>then,</p>
//     <p>is not an</p>
//     <p>act,</p>
//     <p>but a</p>
//     <p>habit.</p>
//   </div>

//   <div className="feature-content-wrapper">
//     <div className="feature-container">
//       <div className="feature-left">
//         <img
//           src={InterviewPic1}
//           alt="Interview preparation"
//           className="feature-image"
//         />
//       </div>

//       <div className="feature-right">
//         <div className="purple-box">
//           <h3>Understand yourself thoroughly by the questions</h3>
//         </div>
//         <div className="purple-box">
//           <h3>Give the best impression by having best practice</h3>
//         </div>
//         <div className="feature-text">
//           <h4>Get a best personalized interview questions</h4>
//           <p>
//             with our best AI model, we help you get best experiences you
//             have ever had
//           </p>
//         </div>
//       </div>
//     </div>

//     <div className="feature-container">
//       <div className="feature-left">
//         <img
//           src={InterviewPic2}
//           alt="Data insights"
//           className="feature-image"
//         />
//       </div>

//       <div className="feature-right">
//         <div className="purple-box">
//           <h3>Clueless your blind spot? We are here to help</h3>
//         </div>
//         <p>
//           with data insight you will get after finishing the interview, it
//           helps you understand where are you in industrial
//         </p>
//       </div>
//     </div>
//   </div>
// </div>

export default Features;
