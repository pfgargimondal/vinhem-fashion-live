import "./Css/Career.css";
import { FooterTopComponent } from "../../components/Others/FooterTopComponent";
import http from "../../http";
import { useEffect, useState } from "react";
import { CareerForm } from "./FormComponent/CareerForm";

export const Career = () => {
  const [CareerDetails, setCareerDetails] = useState({});
  const [jobOpenings, setJobOpenings] = useState([]);
  const [jobAccordion, setJobAccordion] = useState("");


  useEffect(() => {
    const fetchCareer = async () => {
      try {
        const getresponse = await http.get("/get-career-content");
        setCareerDetails(getresponse.data);
      } catch (error) {
        console.error("Error fetching career content:", error);
      }
    };
    fetchCareer();
  }, []);


  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const getresponse = await http.get("/get-opening-jobs");
        setJobOpenings(getresponse.data.data);
      } catch (error) {
        console.error("Error fetching career content:", error);
      }
    };
    fetchJobs();
  }, []);


  const toggleAccordion = (id) => {
    setJobAccordion(prev => (prev === id ? "" : id));
  }


  return (
    <div>
      <div
        className="aboutusbannr"
        style={{
          backgroundImage:
            CareerDetails?.image_url && CareerDetails?.data?.banner_image
              ? `url(${CareerDetails.image_url}/${CareerDetails.data.banner_image})`
              : "url(./image/fashion-caeer.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container-fluid">
          <div className="dfgnhdfjhgdf">
            <div className="row">
              <div className="col-lg-7"></div>
              <div className="col-lg-5">
                <div className="dfbhdf">
                  <h2>{CareerDetails.data?.banner_title || "Career"}</h2>
                  <p>
                    {CareerDetails.data?.banner_description ||
                      "Celebrating style with every stitch – where trends meet timeless elegance."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fbhjjdfjk554">
        <div className="wrapper">
          <div className="dfghdfgd">
            <div className="container">
              <h4>
                {CareerDetails.data?.second_section_title_one ||
                  "CURRENT OPENING"}
              </h4>
              <p>
                {CareerDetails.data?.second_section_description_one ||
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
              </p>
            </div>
          </div>

          <div className="container">
            {jobOpenings.map(jobOpening => (
              <div className="saoidjieor" key={jobOpening?.id}>
                <div className="question" onClick={() => toggleAccordion(jobOpening.id)}>{jobOpening?.title} <i className={`fa-solid ${jobAccordion === jobOpening.id ? "open fa-minus" : "fa-plus"}`}></i></div>

                <div className={`answercont ${jobAccordion === jobOpening.id ? "open" : ""}`}>
                  <div className="answer">
                    <div className="bgdf55ff">
                      <p>{jobOpening?.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>      
        </div>
      </div>

      <div className="sdfbjhfsdf">
        <div className="container">
          <div className="fnb788f">
            <h2>{CareerDetails.data?.form_title || "Join Our Team"}</h2>

            <div
              dangerouslySetInnerHTML={{
                __html:
                  CareerDetails.data?.form_description ||
                  "Be a part of Vinham Fashion’s inspiring creative journey and help us shape the future of global style. Explore exciting career opportunities and grow with our passionate team.",
              }}
            />
          </div>

          <CareerForm />
        </div>
      </div>

      <div className="dfhfjhdfdf">
        <hr />
        <FooterTopComponent />
      </div>
    </div>
  );
};
