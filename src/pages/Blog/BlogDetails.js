import { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";

import { UseFormattedDate } from "../../hooks/UseFormattedDate";

import http from "../../http";

import "./Css/Blog.css";


export const BlogDetails = () => {
  const { slug } = useParams();
  const [blogs, setBlogs] = useState([]);
  const [popularblogs, setPopularBlogs] = useState([]);
  const [imageBaseUrl, setImageBaseUrl] = useState("");

  const blogDate = UseFormattedDate(blogs.blog_date);


  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const getresponse = await http.get(`/blogs/${slug}`);

        const dataBlogs = getresponse.data;
        setBlogs(dataBlogs.data);
        setPopularBlogs(dataBlogs.popularblog);
        setImageBaseUrl(dataBlogs.image_url);

      } catch (error) {
        console.error("Error fetching blog details:", error);
      } finally {
        // setLoading(false);
      }
    };
    fetchBlogDetails();
  }, [slug]);

  return (
    <div className="doijeslkjoje container my-5">
      <div className="row">
        <main className="col-lg-8">
          <article className="ojwoijuoiue mb-5">
            <div className="lolmdslkjflsdm sdvsdeefeee position-relative d-flex align-items-center">
              <div className="article-number p-2">
                <h4 className="text-light text-center mb-0">{blogDate}</h4>
              </div>

              <div className="csdelkfnisdf col-lg-8 bg-white px-5 py-3">
                <h2 className="article-title mb-0">{blogs?.title}</h2>

                <div className="article-subtitle">
                  by {blogs?.author_name}
                </div>
              </div>
            </div>

            <img
              src={`${imageBaseUrl}/${blogs?.blog_image}`}
              className="img-fluid mb-3 w-100"
              alt="Street Fashion"
            />

            <p dangerouslySetInnerHTML={{
              __html: blogs.blog_description
            }}></p>
          </article>
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
                {Array.isArray(popularblogs) && popularblogs.slice().sort((a, b) => b.id - a.id).slice(0, 3).map((blog) => (
                  <li key={blog.id} className="row py-3">
                    <div className="col-3">
                      <div className="doejwojrwer overflow-hidden rounded-pill">
                        <img
                          src={`${imageBaseUrl}/${blog?.blog_image}`}
                          className="img-fluid"
                          alt={blog?.title}
                        />
                      </div>
                    </div>

                    <div className="col-9 ps-0">
                      <div className="saldmasdsd">
                        <p className="mb-1 lmlmlmlkjlmee">{blog?.title}</p>

                        <Link to={`/blog/${blog?.slug}`} className="text-decoration-none"> VIEW POST</Link>
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
                  </div>   */}
          </div>
        </aside>
      </div>
    </div>
  )
}