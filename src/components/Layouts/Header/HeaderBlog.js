import { Link } from "react-router-dom";

import Logo from "../../../assets/images/logo.png";

import "./Css/HeaderBlog.css";

export const HeaderBlog = () => {
  return (
    <div id="header-blog" className="pt-3 pb-4">
        <div className="container-flud">
            <div className="doiwejuirjweoirwept position-relative">
                <div className="deowjrkjweirew text-center">
                    <Link to="/"><img src={Logo} alt="" /></Link>
                </div>

                <div className="dasfsreer position-absolute">
                    <i className="fa-solid fa-magnifying-glass"></i>
                </div>
            </div>

            <div className="dwejnrkhweijrwer mt-4">
                <ul className="mb-0 ps-0">
                    <li className="mx-3">
                        <Link to="/">HOME</Link>
                    </li>

                    <li className="mx-3">
                        <Link to="/about-us">ABOUT US</Link>
                    </li>

                    <li className="mx-3">
                        <Link to="">STYLE COUNCIL - MAGAZINE</Link>
                    </li>

                    <li className="mx-3">
                        <Link to="">LATEST TRENDZ</Link>
                    </li>

                    <li className="mx-3">
                        <Link to="">SHOP NOW</Link>
                    </li>
                </ul>
            </div>
        </div>
    </div>
  )
}