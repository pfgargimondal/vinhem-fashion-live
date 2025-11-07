import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { BlogItem } from "./Components/BlogItem";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import http from "../../http";

import "./Css/Blog.css";


export const Blog = () => {
    const [blogs, setBlogs] = useState([]);
    const [popularblogs, setPopularBlogs] = useState([]);
    const [imageBaseUrl, setImageBaseUrl] = useState("");

    console.log(blogs, popularblogs);


    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const getresponse = await http.get("/blogs");

                const dataBlogs = getresponse.data;
                setBlogs(dataBlogs.data);
                setPopularBlogs(dataBlogs.popularblog);
                setImageBaseUrl(dataBlogs.image_url);

                console.log("API response:", dataBlogs);

            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                // setLoading(false);
            }
        };
        fetchBlogs();
    }, []);


    return (
        <>
            <section className="dsgbtgfewfrrr container mb-4">
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={5}
                    slidesPerView={3}
                    navigation
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 4000, disableOnInteraction: false }}
                    className="featured-swiper"
                >
                    {popularblogs.map(popularblog => (
                        <SwiperSlide key={popularblog?.id}>
                            <div className="lklklkdssdd-slider">
                                <img
                                    src={`${imageBaseUrl}/${popularblog?.blog_image}`}
                                    alt={popularblog?.title}
                                    className="img-fluid w-100"
                                />

                                <div className="dasdesrweedewr position-absolute w-100 p-3 pb-5 d-none d-md-block">
                                    <h3 className="lmlmlmlkjlmee mb-2 text-light">{popularblog?.title}</h3>

                                    <div className="idenjwirwer">
                                        <p dangerouslySetInnerHTML={{
                                            __html: popularblog.blog_description ? popularblog.blog_description.replace(/<[^>]+>/g, "").slice(0, 120) + "..." : ""
                                        }} className="text-light"></p>
                                        
                                        <Link to={`/blog/${popularblog.slug}`} className="text-light">CONTINUE READING</Link>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </section>

            <div className="doijeslkjoje container my-5">
                <div className="row">
                    <main className="col-lg-8">
                        {blogs.map(blog => (
                            <BlogItem blog={blog} imageBaseUrl={imageBaseUrl} key={blog.id} />
                        ))}
                    </main>

                    <aside className="col-lg-4 sidebar ps-lg-5">
                        <div className="sticky-top">
                            <div className="mb-5">
                                <h5 className="section-title">FOLLOW US</h5>

                                <ul className="dgfbfdscswsxddas list-inline">
                                    <li className="list-inline-item me-3">
                                        <a href="/" className="d-flex align-items-center">
                                            <i class="fa-brands me-1 fa-square-facebook"></i> Facebook
                                        </a>
                                    </li>

                                    <li className="list-inline-item">
                                        <a href="/" className="d-flex align-items-center">
                                            <i class="fa-brands me-1 fa-square-instagram"></i> Instagram
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div className="mb-5">
                                <h5 className="section-title">LATEST POSTS</h5>

                                <ul className="asdcdfgwedfseee list-unstyled">
                                    {blogs.sort((a, b) => b.id - a.id).slice(0, 3).map(blog => (
                                        <li className="row py-3">
                                            <div className="col-3">
                                                <div className="doejwojrwer overflow-hidden rounded-pill">
                                                    <img src={`${imageBaseUrl}/${blog?.blog_image}`} className="img-fluid" alt={blog?.title} />
                                                </div>
                                            </div>

                                            <div className="col-9 ps-0">
                                                <div className="saldmasdsd">
                                                    <p className="mb-1 lmlmlmlkjlmee">{blog?.title}</p>

                                                    <Link to={`/blog/${blog.slug}`}>VIEW POST</Link>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* <div className="mb-5">
                                <h5 className="section-title">INSTAGRAM</h5>
                                <div className="row g-1">
                                    <div className="col-4">
                                        <img
                                            src="https://via.placeholder.com/75"
                                            alt="Insta 1"
                                            className="img-fluid"
                                        />
                                    </div>
                                    <div className="col-4">
                                        <img
                                            src="https://via.placeholder.com/75"
                                            alt="Insta 2"
                                            className="img-fluid"
                                        />
                                    </div>
                                    <div className="col-4">
                                        <img
                                            src="https://via.placeholder.com/75"
                                            alt="Insta 3"
                                            className="img-fluid"
                                        />
                                    </div>
                                    <div className="col-4">
                                        <img
                                            src="https://via.placeholder.com/75"
                                            alt="Insta 4"
                                            className="img-fluid"
                                        />
                                    </div>
                                    <div className="col-4">
                                        <img
                                            src="https://via.placeholder.com/75"
                                            alt="Insta 5"
                                            className="img-fluid"
                                        />
                                    </div>
                                    <div className="col-4">
                                        <img
                                            src="https://via.placeholder.com/75"
                                            alt="Insta 6"
                                            className="img-fluid"
                                        />
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    </aside>
                </div>
            </div>
        </>
    )
}