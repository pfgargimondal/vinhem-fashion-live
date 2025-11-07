import { Link } from "react-router-dom";

import { UseFormattedDate } from "../../../hooks/UseFormattedDate";

export const BlogItem = ({blog, imageBaseUrl}) => {
    const blogDate = UseFormattedDate(blog.blog_date);

  return (
    <article className="fgfrfdrdtreere mb-5 pb-5">
        <div className="lolmdslkjflsdm position-relative d-flex align-items-center">
            <div className="article-number p-2">
                <h4 className="text-light text-center mb-0">{blogDate}</h4>
            </div>

            <div className="oiajdoimewr col-lg-8 bg-white px-5 py-3">
                <h2 className="article-title mb-0">{blog?.title}</h2>
                
                <div className="article-subtitle">
                    by {blog?.author_name}
                </div>
            </div>
        </div>

        <img
            src={`${imageBaseUrl}/${blog?.blog_image}`}
            className="img-fluid mb-3 w-100"
            alt="Street Fashion"
        />

        <p dangerouslySetInnerHTML={{
            __html: blog.blog_description ? blog.blog_description.replace(/<[^>]+>/g, "").slice(0, 500) + "..." : ""
        }}></p>

        <Link to={`/blog/${blog.slug}`} className="btn btn-main">
            CONTINUE READING
        </Link>
    </article>
  )
}