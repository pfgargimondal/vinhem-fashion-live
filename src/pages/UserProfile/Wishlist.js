import { Link } from "react-router-dom";

import { UserProfileNavMenu } from "../../components";
import { useAuth } from "../../context/AuthContext";
import http from "../../http";
import styles from "./Css/Wishlist.module.css";
import { useEffect, useState } from "react";


export const Wishlist = () => {

  const { token } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    if (!token) return;

    const fetchWishlist = async () => {
      try {
        const res = await http.get("/user/get-wishlist", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlistItems(res.data || []);
      } catch (error) {
        console.error("Failed to fetch wishlist", error);
      }
    };

    fetchWishlist();
  }, [token]);

  

    return (
        <div className={styles.ffhfdf}>
            <div className="ansjidnkuiweer">
                <div className={styles.fbghdfg}>
                    <div className="row">
                        <div className="col-lg-3">
                            <UserProfileNavMenu />
                        </div>

                        <div className="col-lg-9">
                            <div className={`${styles.fgcbdfgdf} pt-3 pb-5`}>
                                <div className={`${styles.dfjhdsbfsdf} mb-4`}>
                                    <h4 className="mb-0">Your Wishlist({wishlistItems?.data?.length ?? 0})</h4>

                                    <div className="dowehrkjwerwer d-flex align-items-center">
                                        <p className="ndiwhermweoewrr mb-0 me-3">
                                            <Link to="/"><i className="fa-solid me-1 fa-arrow-left"></i> Back To Home <i className="fa-solid ms-1 fa-house"></i></Link>
                                        </p>
                                        
                                        {/* <button className="btn btn-main">Add To Cart <i class="fa-solid ms-1 fa-cart-arrow-down"></i></button> */}
                                    </div>
                                </div>

                                <div className={styles.fbgdfhgdfgdg}>
                                    <div className="row">
                                        {wishlistItems?.data?.map((wishlistProduct) => (
                                        <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-4">
                                            <div className={styles.dfgjhbdfg}>
                                                <div className={styles.images}>
                                                    {(wishlistProduct?.new_arrival === '1' || wishlistProduct?.new_arrival === true) && (
                                                        <div className={`${styles.nwArrvl} px-0`}>
                                                            <span className="price"><i>NEW IN</i></span>
                                                        </div>
                                                    )}
                                                    <div className={`${styles.image} position-relative`}>
                                                        <Link to={`/products/${wishlistProduct.slug}`}>
                                                            <img src={wishlistProduct.encoded_image_url_1} alt="not found" />

                                                            {/* <img className={styles.first} src={wishlistProduct.encoded_image_url_2} alt="not found" /> */}
                                                        </Link>

                                                        {/* <div className={styles.dbgdfhgv}>
                                                            <button>QUICK ADD</button>
                                                        </div> */}

                                                        <div className={`fdbdfgdfgdf`}>
                                                            <h6><i class="bi me-1 bi-truck"></i> Ships in {wishlistProduct.shipping_time}</h6>

                                                            {wishlistProduct?.rts_quantity > 0 && (
                                                                <h6><i class="bi me-1 bi-rocket-takeoff"></i> Ready to ship</h6>
                                                            )}  
                                                            

                                                            {(wishlistProduct?.best_seller === '1' || wishlistProduct?.best_seller === true) && (
                                                                <h6><i class="bi bi-lightning-charge"></i> Best Seller</h6>
                                                            )}                             

                                                            <h4>{wishlistProduct.product_name}</h4>

                                                            <div className="d-flex flex-wrap align-items-center">
                                                                <h5 className="mb-0">
                                                                {new Intl.NumberFormat("en-IN", {
                                                                    style: "currency",
                                                                    currency: "INR",
                                                                    maximumFractionDigits: 0,
                                                                }).format(wishlistProduct.selling_price)}
                                                                </h5>

                                                                <span class="gdfg55 d-flex align-items-center ms-2"><i class="bi bi-currency-rupee"></i> {wishlistProduct.mrp_price}</span>

                                                                <span class="fghfgg114 d-flex align-items-center ms-2">{wishlistProduct?.discount}%OFF</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}