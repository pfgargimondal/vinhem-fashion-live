import { useEffect, useState } from "react";
import http from "../../http";
import "./Css/Testimonial.css";
import { FooterTopComponent } from "../../components/Others/FooterTopComponent";

export const Testimonial = () => {

    const [TestimonialDetails, setTestimonialDetails] = useState({});

    useEffect(() => {
        const fetchTestimonial = async () => {
            // setLoading(true);
            try {
                const getresponse = await http.get("/get-testimonial-content");
                setTestimonialDetails(getresponse.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally{
                // setLoading(false);
            }
        };

        fetchTestimonial();
    }, []);

  return (
    <div>
       <div class="aboutusbannr" 
            style={{
            backgroundImage: TestimonialDetails?.image_url && TestimonialDetails?.data?.banner_image
                ? `url(${TestimonialDetails.image_url}/${TestimonialDetails.data.banner_image})`
                : "none",
            }}
        >
        <div class="container-fluid">
            <div class="dfgnhdfjhgdf">
                <div class="row">
                    <div class="col-lg-7"></div>
                    <div class="col-lg-5">
                        <div class="dfbhdf">
                            <h2>{TestimonialDetails.data?.banner_title && TestimonialDetails.data.banner_title}</h2>
                            <p>{TestimonialDetails.data?.banner_description && TestimonialDetails.data.banner_description}</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>



    <div class="xfnhvjhdfbvgdfg">
        <div class="container">
            <div class="sdfhdfgdf">
                <div class="row">
                    <div class="col-lg-4">
                        <div class="fghdfgdf">
                            <div class="dfgdf">
                                {TestimonialDetails.data?.second_section_image_one && (
                                <img
                                    src={`${TestimonialDetails.image_url}/${TestimonialDetails.data.second_section_image_one}`}
                                    alt=""
                                />
                                )}
                            </div>
                            <div class="fbgdfg">
                                <h4>{TestimonialDetails.data?.second_section_title_one && TestimonialDetails.data.second_section_title_one}</h4>
                                <p>{TestimonialDetails.data?.second_section_description_one && TestimonialDetails.data.second_section_description_one}</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4">
                         <div class="fghdfgdf">
                            <div class="dfgdf">
                                {TestimonialDetails.data?.second_section_image_two && (
                                <img
                                    src={`${TestimonialDetails.image_url}/${TestimonialDetails.data.second_section_image_two}`}
                                    alt=""
                                />
                                )}
                            </div>
                            <div class="fbgdfg">
                                <h4>{TestimonialDetails.data?.second_section_title_two && TestimonialDetails.data.second_section_title_two}</h4>
                                <p>{TestimonialDetails.data?.second_section_description_two && TestimonialDetails.data.second_section_description_two}</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4">
                         <div class="fghdfgdf">
                            <div class="dfgdf">
                                {TestimonialDetails.data?.second_section_image_three && (
                                <img
                                    src={`${TestimonialDetails.image_url}/${TestimonialDetails.data.second_section_image_three}`}
                                    alt=""
                                />
                                )}
                            </div>
                            <div class="fbgdfg">
                                <h4>{TestimonialDetails.data?.second_section_title_three && TestimonialDetails.data.second_section_title_three}</h4>
                                <p>{TestimonialDetails.data?.second_section_description_three && TestimonialDetails.data.second_section_description_three}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="dfvbsdffsd">
        <div class="container-fluid">
            <div class="dfjhdfdfgd">
                <div class="cbffffdfd2">
                    <div class="cfgdf"><img src="./images/testiphoto (1).png" alt="" /></div>
                    <div class="cfgdf"><img src="./images/testiphoto (2).png" alt="" /></div>
                </div>
                <div class="cbffffdfd3">
                    <div class="cfgdf"><img src="./images/testiphoto (3).png" alt=""/></div>
                    <div class="cfgdf"><img src="./images/testiphoto (4).png" alt=""/></div>

                </div>
                <div class="cbffffdfd"><img src="./images/testiphoto (5).png" alt=""/></div>

                <div class="cbffffdfd4"><img src="./images/testiphoto (6).png" alt=""/></div>
                <div class="cbffffdfd"><img src="./images/testiphoto (7).png" alt=""/></div>
                <div class="cbffffdfd4"><img src="./images/testiphoto (8).png" alt=""/></div>

                <div class="cbffffdfd"><img src="./images/testiphoto (9).png" alt=""/></div>

                <div class="cbffffdfd3">
                    <div class="cfgdf"><img src="./images/testi2 (1).png" alt=""/></div>
                      <div class="cfgdf"><img src="./images/testi2 (2).png" alt=""/></div>
                </div>
                <div class="cbffffdfd2">
                      <div class="cfgdf"><img src="./images/testi2 (3).png" alt=""/></div>
                   <div class="cfgdf"><img src="./images/testi2 (4).png" alt=""/></div>
                </div>



            </div>


        </div>

    </div>



    <div class="dfbjhsddfgdf">
        <div class="container-fluid">
            <div class="sdhfsdfsdf">
                <div class="jndfdf">
                    <button>Testimonial</button>
                </div>
                <div class="dfgdfgdfg">
                    {/* <h2>Trusted by leaders <br /> <span>from various industries</span></h2> */}
                    <h2>
                    {TestimonialDetails.data?.third_section_title && (() => {
                        const words = TestimonialDetails.data.third_section_title.split(' ');
                        const firstPart = words.slice(0, 3).join(' ');
                        const secondPart = words.slice(3).join(' ');

                        return (
                            <h2>
                            {firstPart}
                            <br />
                            <span>{secondPart}</span>
                            </h2>
                        );
                        })()}
                    </h2>
                    <div
                        dangerouslySetInnerHTML={{
                        __html:
                            TestimonialDetails.data?.third_section_description &&
                            TestimonialDetails.data.third_section_description,
                        }} 
                    />
                    
                </div>



                <div class="fgdfvbdf">
                    <div class="row">
                        <div class="col-lg-3">
                            <div class="jhdffdfdz">
                                <div class="dfbngjhdf">
                                    <div class="dfhdfg55">
                                        <i class="fa-solid fa-star"></i>
                                        <i class="fa-solid fa-star"></i>
                                        <i class="fa-solid fa-star"></i>
                                        <i class="fa-solid fa-star"></i>
                                        <i class="fa-solid fa-star"></i>
                                    </div>
                                    <div class="vfh55">
                                        <p>21.25.2025</p>
                                    </div>


                                    <div class="dgd5fg"></div>

                                    <div class="djhdfbsdf">
                                        <p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.</p>

                                    </div>
                                    <div class="dgd5fg"></div>

                                    <div class="dfbgjhdfgdf">
                                        <div class="row">
                                            <div class="col-lg-3">
                                                <div class="dfjhdf">
                                                    <img src="./images/testiphoto (2).png" alt="" />
                                                </div>
                                            </div>
                                            <div class="col-lg-9">
                                                <div class="shdfsdf">
                                                    <h6>Braidan Carcs</h6>
                                                    <p>CEO,Aladin</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>




                                    
                                </div>

                                <div class="dfbngjhdf5">
                                    <div class="dfhdfg55">
                                        <i class="fa-solid fa-star"></i>
                                        <i class="fa-solid fa-star"></i>
                                        <i class="fa-solid fa-star"></i>
                                        <i class="fa-solid fa-star"></i>
                                        <i class="fa-solid fa-star"></i>
                                    </div>
                                    <div class="vfh55">
                                        <p>21.25.2025</p>
                                    </div>


                                    <div class="dgd5fg2"></div>

                                    <div class="djhdfbsdf">
                                        <p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.</p>

                                    </div>
                                    <div class="dgd5fg2"></div>

                                    <div class="dfbgjhdfgdf">
                                        <div class="row">
                                            <div class="col-lg-3">
                                                <div class="dfjhdf">
                                                    <img src="./images/testiphoto (1).png" alt="" />
                                                </div>
                                            </div>
                                            <div class="col-lg-9">
                                                <div class="shdfsdf">
                                                    <h6>Braidan Carcs</h6>
                                                    <p>CEO,Aladin</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>




                                    
                                </div>
                            </div>
                        </div>

                        <div class="col-lg-3">
                            <div class="jhdffdfdz">
                                <div class="dfbngjhdf3">
                                    <div class="dfhdfg55">
                                        <i class="fa-solid fa-star"></i>
                                        <i class="fa-solid fa-star"></i>
                                        <i class="fa-solid fa-star"></i>
                                        <i class="fa-solid fa-star"></i>
                                        <i class="fa-solid fa-star"></i>
                                    </div>
                                    <div class="vfh55">
                                        <p>21.25.2025</p>
                                    </div>


                                    <div class="dgd5fg3"></div>

                                    <div class="djhdfbsdf">
                                        <p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable but the majority have suffered alteration in some form, by injected humour but the majority have suffered alteration in some form, by injected humour but the majority have suffered alteration in some form, by injected humour,.</p>

                                    </div>
                                    <div class="dgd5fg3"></div>

                                    <div class="dfbgjhdfgdf">
                                        <div class="row">
                                            <div class="col-lg-3">
                                                <div class="dfjhdf">
                                                    <img src="./images/testiphoto (3).png" alt="" />
                                                </div>
                                            </div>
                                            <div class="col-lg-9">
                                                <div class="shdfsdf">
                                                    <h6>Braidan Carcs</h6>
                                                    <p>CEO,Aladin</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>




                                    
                                </div>

                                <div class="dfbngjhdf">
                                    <div class="dfhdfg55">
                                        <i class="fa-solid fa-star"></i>
                                        <i class="fa-solid fa-star"></i>
                                        <i class="fa-solid fa-star"></i>
                                        <i class="fa-solid fa-star"></i>
                                        <i class="fa-solid fa-star"></i>
                                    </div>
                                    <div class="vfh55">
                                        <p>21.25.2025</p>
                                    </div>


                                    <div class="dgd5fg"></div>

                                    <div class="djhdfbsdf">
                                        <p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.</p>

                                    </div>
                                    <div class="dgd5fg"></div>

                                    <div class="dfbgjhdfgdf">
                                        <div class="row">
                                            <div class="col-lg-3">
                                                <div class="dfjhdf">
                                                    <img src="./images/testiphoto (4).png" alt="" />
                                                </div>
                                            </div>
                                            <div class="col-lg-9">
                                                <div class="shdfsdf">
                                                    <h6>Braidan Carcs</h6>
                                                    <p>CEO,Aladin</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>




                                    
                                </div>
                            </div>
                        </div>


                        <div class="col-lg-3">
                            <div class="jhdffdfdz">
                                <div class="dfbngjhdf4">
                                    <div class="dfhdfg55">
                                        <i class="fa-solid fa-star"></i>
                                        <i class="fa-solid fa-star"></i>
                                        <i class="fa-solid fa-star"></i>
                                        <i class="fa-solid fa-star"></i>
                                        <i class="fa-solid fa-star"></i>
                                    </div>
                                    <div class="vfh55">
                                        <p>21.25.2025</p>
                                    </div>


                                    <div class="dgd5fg4"></div>

                                    <div class="djhdfbsdf">
                                        <p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration.</p>

                                    </div>
                                    <div class="dgd5fg4"></div>

                                    <div class="dfbgjhdfgdf">
                                        <div class="row">
                                            <div class="col-lg-3">
                                                <div class="dfjhdf">
                                                    <img src="./images/testiphoto (5).png" alt="" />
                                                </div>
                                            </div>
                                            <div class="col-lg-9">
                                                <div class="shdfsdf">
                                                    <h6>Braidan Carcs</h6>
                                                    <p>CEO,Aladin</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>




                                    
                                </div>

                                <div class="dfbngjhdf6">
                                    <div class="dfhdfg55">
                                        <i class="fa-solid fa-star"></i>
                                        <i class="fa-solid fa-star"></i>
                                        <i class="fa-solid fa-star"></i>
                                        <i class="fa-solid fa-star"></i>
                                        <i class="fa-solid fa-star"></i>
                                    </div>
                                    <div class="vfh55">
                                        <p>21.25.2025</p>
                                    </div>


                                    <div class="dgd5fg6"></div>

                                    <div class="djhdfbsdf">
                                        <p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.</p>

                                    </div>
                                    <div class="dgd5fg6"></div>

                                    <div class="dfbgjhdfgdf">
                                        <div class="row">
                                            <div class="col-lg-3">
                                                <div class="dfjhdf">
                                                    <img src="./images/testiphoto (6).png" alt="" />
                                                </div>
                                            </div>
                                            <div class="col-lg-9">
                                                <div class="shdfsdf">
                                                    <h6>Braidan Carcs</h6>
                                                    <p>CEO,Aladin</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>




                                    
                                </div>
                            </div>
                        </div>

                        <div class="col-lg-3">
                            <div class="jhdffdfdz">
                                <div class="dfbngjhdf">
                                    <div class="dfhdfg55">
                                        <i class="fa-solid fa-star"></i>
                                        <i class="fa-solid fa-star"></i>
                                        <i class="fa-solid fa-star"></i>
                                        <i class="fa-solid fa-star"></i>
                                        <i class="fa-solid fa-star"></i>
                                    </div>
                                    <div class="vfh55">
                                        <p>21.25.2025</p>
                                    </div>


                                    <div class="dgd5fg"></div>

                                    <div class="djhdfbsdf">
                                        <p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.</p>

                                    </div>
                                    <div class="dgd5fg"></div>

                                    <div class="dfbgjhdfgdf">
                                        <div class="row">
                                            <div class="col-lg-3">
                                                <div class="dfjhdf">
                                                    <img src="./images/testiphoto (7).png" alt="" />
                                                </div>
                                            </div>
                                            <div class="col-lg-9">
                                                <div class="shdfsdf">
                                                    <h6>Braidan Carcs</h6>
                                                    <p>CEO,Aladin</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>




                                    
                                </div>

                                <div class="dfbngjhdf7">
                                    <div class="dfhdfg55">
                                        <i class="fa-solid fa-star"></i>
                                        <i class="fa-solid fa-star"></i>
                                        <i class="fa-solid fa-star"></i>
                                        <i class="fa-solid fa-star"></i>
                                        <i class="fa-solid fa-star"></i>
                                    </div>
                                    <div class="vfh55">
                                        <p>21.25.2025</p>
                                    </div>


                                    <div class="dgd5fg7"></div>

                                    <div class="djhdfbsdf">
                                        <p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable but the majority have suffered alteration in some form, by injected humour but the majority have suffered alteration in some form, by injected humour but the majority have suffered alteration in some form, by injected humour,.</p>

                                    </div>
                                    <div class="dgd5fg7"></div>

                                    <div class="dfbgjhdfgdf">
                                        <div class="row">
                                            <div class="col-lg-3">
                                                <div class="dfjhdf">
                                                    <img src="./images/testiphoto (8).png" alt="" />
                                                </div>
                                            </div>
                                            <div class="col-lg-9">
                                                <div class="shdfsdf">
                                                    <h6>Braidan Carcs</h6>
                                                    <p>CEO,Aladin</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>




                                    
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    </div>

    <hr />
    <FooterTopComponent />
    </div>
  )
}
