import { Link } from "react-router-dom";
import "./FeaturedProducts.css";
import { useAuth } from "../../../context/AuthContext";
import { useCart } from "../../../context/CartContext";
import { useWishlist } from "../../../context/WishlistContext";

export const FeaturedProducts = ({ featuredProduct }) => {

    const { user } = useAuth();
    const { addToCart } = useCart();

    const { wishlistIds, addToWishlist, removeFromWishlist } = useWishlist(); // ✅ from context
    const isWishlisted = wishlistIds.includes(featuredProduct.id);

    const toggleWishlist = () => {
        if (isWishlisted) {
        removeFromWishlist(featuredProduct.id);
        } else {
        addToWishlist(featuredProduct.id);
        }
    };


    return (
        <div className="dfgjhbdfg">
            <div className="images">
              <div className="image row mx-0 position-relative">
                {/* {featuredProduct?.discount && (
                  <div className="dscnt-prce px-0">
                    <span className="price">{featuredProduct?.discount}% <br/> OFF</span>
                  </div>
                )} */}

                {(featuredProduct?.new_arrival === '1' || featuredProduct?.new_arrival === true) && (
                  <div className="nw-arrvl px-0">
                    <span className="price"><i>NEW IN</i></span>
                  </div>
                )}

                <div className={`doiewjkrniuwewer position-relative overflow-hidden`}>
                  <Link to={`/products/${featuredProduct.slug}`}>
                    <img
                      src={featuredProduct?.encoded_image_url_1}
                      alt={featuredProduct.product_name}
                    />

                    {/* <img
                      className="first"
                      src={product.encoded_image_url_2}
                      alt={product.product_name}
                    /> */}
                  </Link>

                  <div className="doikwenirnwekhrwer d-flex position-relative">
                    {user ? (
                      <>
                        <button
                          className="btn-cart mb-1"
                          type="button"
                          onClick={() => addToCart(featuredProduct.id)}
                        >
                          <i class="fa-solid fa-cart-arrow-down"></i>
                        </button>
                        <button
                          onClick={() => toggleWishlist(featuredProduct.id)}
                        >
                          <i
                            className={
                              wishlistIds.includes(featuredProduct.id)
                                ? "fa-solid fa-heart"
                                : "fa-regular fa-heart"
                            }
                          ></i>
                        </button>
                      </>
                    ) : (
                      <>
                        <Link to="/login">
                          <button
                            className="btn-cart mb-1"
                            type="button"
                          >
                            <i class="fa-solid fa-cart-arrow-down"></i>
                          </button>
                        </Link>
                        <Link to="/login">
                          <button
                            className="btn-wishlist"
                            type="button"
                          >
                            <i class="fa-regular fa-heart"></i>
                            <i class="fa-solid d-none fa-heart"></i>
                          </button>
                        </Link>
                      </>
                    )}
                  </div>

                  <div className="dbgdfhgv">
                    <button className="btn btn-main w-100">
                      QUICK ADD
                    </button>
                  </div>
                </div>

                <div className={`fdbdfgdfgdf`}>
                  <h6><i class="bi me-1 bi-truck"></i> Ships in {featuredProduct.shipping_time}</h6>

                  {featuredProduct.product_category === "READY TO SHIP" && (
                    <h6><i class="bi me-1 bi-rocket-takeoff"></i> Ready to ship</h6>
                  )}

                  {(featuredProduct?.best_seller === '1' || featuredProduct?.best_seller === true) && (
                    <h6><i class="bi bi-lightning-charge"></i> Best Seller</h6>
                  )}                             

                  <h4>{featuredProduct.product_name}</h4>

                  <div className="d-flex flex-wrap align-items-center">
                    <h5 className="mb-0">
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                        maximumFractionDigits: 0,
                      }).format(featuredProduct.selling_price)}
                    </h5>

                    <span class="gdfg55 d-flex align-items-center ms-2"><i class="bi bi-currency-rupee"></i> {featuredProduct.mrp_price}</span>

                    <span class="fghfgg114 d-flex align-items-center ms-2">{featuredProduct?.discount}%OFF</span>
                  </div>

                  <div className="dlksfskjrewrwere d-none d-flex align-items-center justify-content-between mt-5">
                    <div className="doikwenirnwekhrwer position-relative">
                      {user ? (
                        <>
                          <button
                            className="btn-cart mb-1 me-1"
                            type="button"
                            onClick={() => addToCart(featuredProduct.id)}
                          >
                            <i class="fa-solid fa-cart-arrow-down"></i>
                          </button>
                          <button
                            onClick={() =>
                              toggleWishlist(featuredProduct.id)
                            }
                          >
                            <i
                              className={
                                wishlistIds.includes(featuredProduct.id)
                                  ? "fa-solid fa-heart"
                                  : "fa-regular fa-heart"
                              }
                            ></i>
                          </button>
                        </>
                      ) : (
                        <>
                          <Link to="/login">
                            <button
                              className="btn-cart mb-1"
                              type="button"
                            >
                              <i class="fa-solid fa-cart-arrow-down"></i>
                            </button>
                          </Link>
                          <Link to="/login">
                            <button
                              className="btn-wishlist"
                              type="button"
                            >
                              <i class="fa-regular fa-heart"></i>
                              <i class="fa-solid d-none fa-heart"></i>
                            </button>
                          </Link>
                        </>
                      )}
                    </div>

                    <div className="dbgdfhgv">
                      <button className="btn btn-main w-100">
                        QUICK ADD
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
    )
}