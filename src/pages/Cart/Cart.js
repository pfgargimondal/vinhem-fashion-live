import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Table from "react-bootstrap/Table";
import "./Css/Cart.css";
import "swiper/css";
import RecentlyViewed from "../../hooks/RecentlyViewed";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import http from "../../http";
import { useWishlist } from "../../context/WishlistContext";
import TrandingProduct from "../../hooks/TrandingProduct";
import { useCurrency } from "../../context/CurrencyContext";

export const Cart = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [cartItems, setcartItems] = useState([]);
  const [totalPrice, settotalPrice] = useState([]);
    // eslint-disable-next-line
  const [productCoupon, setproductCoupon] = useState([]);
  const [couponItems, setcouponItems] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState("");
  // eslint-disable-next-line
  const [selectedDiscount, setSelectedDiscount] = useState(0);
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  const { selectedCurrency } = useCurrency();

  const fetchCartlist = useCallback(async () => {
    if (!token || !selectedCurrency) return;

    try {
      const res = await http.post(
        "/user/get-cart-user",
        { country: selectedCurrency.country_name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setcartItems(res.data.data || []);
      settotalPrice(res.data.total_cart_price || "");
      setproductCoupon(res.data.all_productCoupon || []);
    } catch (error) {
      console.error("Failed to fetch cart list", error);
    }
  }, [token, selectedCurrency]);

  useEffect(() => {
    fetchCartlist();
  }, [fetchCartlist]);

  useEffect(() => {
    if (!token) return;

    const fetchCoupon = async () => {
      try {
        const res = await http.get("/user/get-all-coupon", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setcouponItems(res.data.data || []);
      } catch (error) {
        console.error("Failed to fetch cart list", error);
      }
    };

    fetchCoupon();
  }, [token]);

  const getEstimatedShippingDate = (shipping_time) => {
    if (!shipping_time) return "";

    const timeStr = shipping_time.toString().toLowerCase().trim();
    const now = new Date();

    let days = 0;
    let hours = 0;

    // Detect if time is in hours or days
    if (timeStr.includes("hour") || timeStr.includes("hr") || timeStr.includes("h")) {
      const hourVal = parseInt(timeStr);
      if (!isNaN(hourVal)) hours = hourVal;
    } else if (timeStr.includes("day") || timeStr.includes("d")) {
      const dayVal = parseInt(timeStr);
      if (!isNaN(dayVal)) days = dayVal;
    } else {
      // Default to days if unit is missing
      const val = parseInt(timeStr);
      if (!isNaN(val)) days = val;
    }

    // Add time
    now.setDate(now.getDate() + days);
    now.setHours(now.getHours() + hours);

    // Format date nicely
    const day = now.getDate();
    const month = now.toLocaleString("en-US", { month: "long" });

    return ` ${day}${getDaySuffix(day)} of ${month}`;
  };

  // Helper for suffix
  const getDaySuffix = (day) => {
    if (day >= 11 && day <= 13) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const ValidityDate = (expiryDate) => {
    const date = new Date(expiryDate);

    const options = { month: "long", year: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", options);

    return `${formattedDate}`;
  };
  const { wishlistIds, addToWishlist, removeFromWishlist } = useWishlist(); // ✅ from context

  const toggleWishlist = (productId) => {
    if (wishlistIds.includes(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    if (!token) return;

    try {
      await http.post(
        "/user/remove-product-from-cart",
        { cart_item_id: cartItemId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Remove locally from state
      setcartItems((prev) => prev.filter((item) => item.id !== cartItemId));
      fetchCartlist();
    } catch (error) {
      console.error("Failed to remove item", error);
    }
  };
    // eslint-disable-next-line
  const handleSizeChange = (cartItemId, newSize) => {
    setcartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === cartItemId ? { ...item, product_size: newSize } : item
      )
    );

    http
      .post("/user/update-cart-product-size", {
        cart_id: cartItemId,
        product_size: newSize,
      })
      .then((res) => {
        if (res.data.success) {
          toast.success(
            res.data.message || "Product Size Updated successfully"
          );
        } else {
          toast.error(res.data.message || "Failed to Update product size");
        }
        fetchCartlist();
      })
      .catch((err) => {
        console.error("Error updating size", err);
      });
  };
  // eslint-disable-next-line
  const handleQuantityChange = (cartItemId, newQuantity) => {
    setcartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === cartItemId ? { ...item, quantity: newQuantity } : item
      )
    );

    http
      .post("/user/update-cart-quantity", {
        cart_id: cartItemId,
        quantity: newQuantity,
      })
      .then((res) => {
        if (res.data.success) {
          toast.success(res.data.message || "Quantity Updated successfully");
        } else {
          toast.error(res.data.message || "Failed to Update quantity");
        }
        fetchCartlist();
      })
      .catch((err) => {
        console.error("Error updating quantity", err);
      });
  };

  const handleCheckout = () => {
    // const missingSize = cartItems.find((item) => !item.product_size);

    // if (missingSize) {
    //   toast.error(
    //     `Please select size for "${missingSize.product_name}" before checkout.`
    //   );
    //   return; 
    // }
    navigate("/checkout");
  };

  return (
    <div>
      <div className="cart-wrapper py-4">
        <div className="container-fluid">
          <div className="row justify-content-between">
            <div className="col-lg-8">
              <div className="diwebjrwert_left">
                <h4 className="mb-4">Your Shopping Cart</h4>

                <div className="odnwejirhwerwer py-2 px-3">
                  <p className="mb-0 d-flex align-items-center">
                    Shop for ₹6,004 more to get additional offers on your order.
                    To know more{" "}
                    <button className="btn ms-2 py-2 btn-main">
                      <i class="bi me-1 bi-whatsapp"></i> Chat With Us
                    </button>
                  </p>
                </div>

                <div className="dowejroihwrt_wrapper mt-4">
                  {cartItems?.length === 0 && <p>No items in cart</p>}
                  {cartItems?.map((cartItemsVal) => (
                    <div className="dfgjhbdfg position-relative p-3 mb-4">
                      <div className="row">
                        <div className="col-lg-2">
                          <div className="donweihrwewer">
                            <Link to={`/products/${cartItemsVal.slug}`}>
                              <img
                                src={cartItemsVal.encoded_image_url_1}
                                alt={cartItemsVal.product_name}
                              />
                            </Link>
                          </div>
                        </div>

                        <div className="col-lg-10">
                          <div className="dowehriwerwer">
                            <div className="dknwekhwe py-2">
                              <div className="d-flex flex-wrap align-items-center justify-content-between">
                                <h4 className="mb-0">
                                  {cartItemsVal.product_name}
                                </h4>

                                <h5 className="mb-0">
                                  {cartItemsVal.plus_sizes_charges === '0' ? (
                                    <>
                                      <span className="old-price">
                                        <i class="bi bi-currency-rupee"></i>
                                        {cartItemsVal.mrp_price}
                                      </span>
                                      <span>
                                        <i class="bi bi-currency-rupee"></i>
                                        {cartItemsVal.selling_price} 
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <span>
                                        <i class="bi bi-currency-rupee"></i>
                                        {cartItemsVal.plus_sizes_charges} 
                                      </span>
                                    </>
                                  )}
                                  
                                </h5>
                              </div>
                              {cartItemsVal.plus_sizes_charges === '0' && (
                                <>
                                  <span className="dscnt-offr text-white position-absolute py-1 px-2">
                                    {cartItemsVal.discount}% OFF
                                  </span>
                                </>
                              )}
                            </div>

                            <div className="dnweghbjewrwer">
                              <p className="mb-1">{cartItemsVal.designer}</p>

                              <span className="copn-cde">
                                CODE: {cartItemsVal.vendor_sku}
                              </span>

                              <div className="doewrwerwer">
                                <div className="row">
                                  <div className="col-lg-3 mt-2 mb-3">
                                    <div className="deiwnriwehrwer">
                                      <label htmlFor="" className="form-label mb-1">Size:</label>

                                      <input type="text" className="form-control" placeholder={cartItemsVal.size} disabled />

                                      {/* <select
                                        name="product_size"
                                        className="form-select py-1"
                                        id={`product_size_${cartItemsVal.id}`}
                                        value={cartItemsVal.product_size || ""}
                                        onChange={(e) =>
                                          handleSizeChange(
                                            cartItemsVal.id,
                                            e.target.value
                                          )
                                        }
                                      >
                                        <option value={""}>Choose Size</option>
                                        {cartItemsVal.size_chart?.map(
                                          (sizeChartVal) => (
                                            <option
                                              value={sizeChartVal.size_name}
                                            >
                                              {sizeChartVal.size_name}
                                            </option>
                                          )
                                        )}
                                      </select> */}
                                    </div>
                                  </div>

                                  <div className="col-lg-3 mt-2 mb-3">
                                    <div className="deiwnriwehrwer">
                                      <label htmlFor="" className="form-label mb-1">Quantity:</label>

                                      <input type="text" className="form-control" placeholder={cartItemsVal.quantity} disabled />

                                      {/* <select
                                        name="quantity"
                                        className="form-select py-1"
                                        id={`quantity_${cartItemsVal.id}`}
                                        value={cartItemsVal.quantity || ""}
                                        onChange={(e) =>
                                          handleQuantityChange(
                                            cartItemsVal.id,
                                            e.target.value
                                          )
                                        }
                                      >
                                        {Array.from(
                                          {
                                            length: Number(
                                              cartItemsVal.rts_quantity
                                            ),
                                          },
                                          (_, i) => (
                                            <option key={i + 1} value={i + 1}>
                                              {i + 1}
                                            </option>
                                          )
                                        )}
                                      </select> */}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="djkwehrwerwer d-flex align-items-center justify-content-between">
                                <h6 className="mb-0">
                                  <i class="bi me-1 bi-calendar-week"></i>
                                  Estimated Shipping Date:
                                  <span>
                                    {getEstimatedShippingDate(
                                      cartItemsVal.shipping_time
                                    )}
                                  </span>
                                </h6>

                                <div className="dewhrowerwer">
                                  <i
                                    onClick={() =>
                                      toggleWishlist(
                                        cartItemsVal.products_table_id
                                      )
                                    }
                                    className={
                                      wishlistIds.includes(
                                        cartItemsVal.products_table_id
                                      )
                                        ? "fa-solid fa-heart"
                                        : "fa-regular fa-heart"
                                    }
                                    style={{ cursor: "pointer" }}
                                  ></i>

                                  <i
                                    class="bi bi-x-lg"
                                    onClick={() =>
                                      handleRemoveItem(cartItemsVal.id)
                                    }
                                  ></i>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="uiwdhiwerwerwer dojweirkwejirwer">
                  <Link to={"/all-produtcs"}>
                    <button className="btn px-5 btn-main">
                      Continue Shopping
                    </button>
                  </Link>
                </div>

                <div className="dweihriwerwerw mt-4">
                  <p className="mb-1">
                    *Once your order has been placed no subsequent changes can be
                    made in it.
                  </p>

                  <p className="mb-1">
                    *Shipping cost may vary depending on the delivery destination.
                  </p>

                  <p className="mb-1">
                    *Please check the final amount on the order summary page
                    before completing the payment.
                  </p>

                  <p className="mb-1">
                    *An item's price may vary according to the size selected.
                  </p>

                  <ul className="mb-0 ps-0">
                    <li>
                      <Link to="/shipping-policy">Shipping Policy</Link>
                    </li>

                    <li>
                      <Link to="/">Help</Link>
                    </li>

                    <li>
                      <Link to="/contact-us">Contact Us</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="diwebjrwert_right sticky-top">
                <h4 className="mb-4">Cart Summary</h4>

                <div className="dweoihrwerwer p-2 mb-4">
                  <Table responsive>
                    <tbody>
                      <tr>
                        <td>Product Total</td>

                        <td>
                          <i class="bi bi-currency-rupee"></i>
                          {totalPrice.total_selling_price}
                        </td>
                      </tr>

                      <tr>
                        <td>Total Discount</td>

                        <td>
                          (-) <i class="bi bi-currency-rupee"></i>
                          {totalPrice.total_discount_price}
                        </td>
                      </tr>
                      <tr>
                        <td>Add On Charges</td>

                        <td>
                          <i class="bi bi-currency-rupee"></i>
                          {totalPrice.total_add_on_charges}
                        </td>
                      </tr>
                      <tr>
                        <td>Shipping</td>

                        <td>
                          <i class="bi bi-currency-rupee"></i>
                          {totalPrice.shipping_charges}
                        </td>
                      </tr>
                      <tr>
                        <td>Cart Total</td>

                        <td>
                          <i class="bi bi-currency-rupee"></i>
                          {Number(totalPrice.cart_totalPrice) + Number(totalPrice.shipping_charges)}
                        </td>
                      </tr>
                    </tbody>
                  </Table>

                  <p className="px-2">
                    Shipping charges to be calculated on Checkout
                  </p>
                </div>

                <div className="dweoihrwerwer aiksndjhugwerwerw d-flex align-items-center justify-content-between p-2">
                  <div className="doewjirwerwer">
                    <input type="checkbox" id="gft" className="m-1" />

                    <label htmlFor="gft">This is a gift item</label>
                  </div>

                  <span>(Know More)</span>
                </div>

                {/* <div className="oiasmdjweijrwerwer mt-4">
                  <h4>Individual Product Coupon Code</h4>

                  {productCoupon.Product_coupon_code?.map((productCouponCode) => (
                    <div className="jidnwenjrwerwer mb-2">
                      <input
                        id={productCouponCode.code}
                        name="coupon"
                        type="radio"
                        className="d-none position-absolute"
                        checked={selectedCoupon === productCouponCode.code}
                        disabled={couponApplied}
                        onChange={() => {
                          setSelectedCoupon(productCouponCode.code);
                          setSelectedDiscount(parseInt(productCouponCode.value));
                          setAppliedDiscount(parseInt(productCouponCode.value));
                        }}
                      />

                      <label
                        htmlFor={productCouponCode.code}
                        className="w-100 position-relative"
                      >
                        <div class="coupon">
                          <div class="left">
                            <div>Coupon</div>
                          </div>

                          <div class="center">
                            <div>
                              <h3>Get Extra</h3>

                              <h2 className="mb-0">
                                <i class="bi bi-currency-rupee"></i>
                                {parseInt(productCouponCode.value)} OFF
                              </h2>

                              <small>
                                Valid until{" "}
                                {ValidityDate(productCouponCode.expiry_date)}
                              </small>
                            </div>
                          </div>

                          <div class="right">
                            <div>{productCouponCode.code}</div>
                          </div>
                        </div>

                        <i class="bi copn-checked-icon position-absolute bi-check-circle-fill"></i>
                      </label>
                    </div>
                  ))}

                  <div className="dewuihrwe position-relative mt-4">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Coupon Code"
                      value={selectedCoupon}
                      onChange={(e) => {
                        setSelectedCoupon(e.target.value);

                        const coupon = couponItems.find(c => c.code === e.target.value);
                        if (coupon) {
                          setSelectedDiscount(parseInt(coupon.value));
                          setAppliedDiscount(parseInt(coupon.value));
                        } else {
                          setSelectedDiscount(0);
                          setAppliedDiscount(0);
                        }
                      }}
                      disabled={couponApplied}
                    />

                    {!couponApplied ? (
                      <button
                        type="button"
                        className="btn position-absolute btn-main"
                        onClick={() => setCouponApplied(true)}
                      >
                        Apply
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn position-absolute btn-main"
                        onClick={() => {
                          setSelectedCoupon("");
                          setSelectedDiscount(0);
                          setAppliedDiscount(0);
                          setCouponApplied(false);
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div> */}

                <div className="oiasmdjweijrwerwer mt-4">
                  <h4>Overall Coupon Code</h4>

                  {couponItems?.map((couponItemsVal) => (
                    <div className="jidnwenjrwerwer mb-2">
                      <input
                        id={couponItemsVal.code}
                        name="coupon"
                        type="radio"
                        className="d-none position-absolute"
                        checked={selectedCoupon === couponItemsVal.code}
                        disabled={couponApplied}
                        onChange={() => {
                          setSelectedCoupon(couponItemsVal.code);
                          setSelectedDiscount(parseInt(couponItemsVal.value));
                          setAppliedDiscount(parseInt(couponItemsVal.value));
                        }}
                      />

                      <label
                        htmlFor={couponItemsVal.code}
                        className="w-100 position-relative"
                      >
                        <div class="coupon">
                          <div class="left">
                            <div>Coupon</div>
                          </div>

                          <div class="center">
                            <div>
                              <h3>Get Extra</h3>

                              <h2 className="mb-0">
                                <i class="bi bi-currency-rupee"></i>
                                {parseInt(couponItemsVal.value)} OFF
                              </h2>

                              <small>
                                Valid until{" "}
                                {ValidityDate(couponItemsVal.expiry_date)}
                              </small>
                            </div>
                          </div>

                          <div class="right">
                            <div>{couponItemsVal.code}</div>
                          </div>
                        </div>

                        <i class="bi copn-checked-icon position-absolute bi-check-circle-fill"></i>
                      </label>
                    </div>
                  ))}

                  <div className="dewuihrwe position-relative mt-4">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Coupon Code"
                      value={selectedCoupon}
                      onChange={(e) => {
                        setSelectedCoupon(e.target.value);

                        const coupon = couponItems.find(c => c.code === e.target.value);
                        if (coupon) {
                          setSelectedDiscount(parseInt(coupon.value));
                          setAppliedDiscount(parseInt(coupon.value));
                        } else {
                          setSelectedDiscount(0);
                          setAppliedDiscount(0);
                        }
                      }}
                      disabled={couponApplied}
                    />

                    {!couponApplied ? (
                      <button
                        type="button"
                        className="btn position-absolute btn-main"
                        onClick={() => setCouponApplied(true)}
                      >
                        Apply
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn position-absolute btn-main"
                        onClick={() => {
                          setSelectedCoupon("");
                          setSelectedDiscount(0);
                          setAppliedDiscount(0);
                          setCouponApplied(false);
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                {appliedDiscount > 0 && (
                  <div className="oiasmdjweijrwerwer d-flex align-items-center justify-content-between zsdvfdesdeadfrer mt-4">
                    <p>Coupon Discount</p>

                    <p>
                      (-) <i class="bi bi-currency-rupee"></i>
                      {appliedDiscount}
                    </p>
                  </div>
                )}

                <div className="oiasmdjweijrwerwer pb-2 mb-4 d-flex align-items-center justify-content-between zsdvfdesdeadfrer mt-4">
                  <h4>Total Payable</h4>

                  <h4>
                    <i class="bi bi-currency-rupee"></i>
                    {(Number(totalPrice.total_selling_price) + Number(totalPrice.total_add_on_charges) + Number(totalPrice.shipping_charges)) - appliedDiscount}
                  </h4>
                  
                </div>

                <div className="uiwdhiwerwerwer">
                  <button
                    className="btn btn-main w-100 mb-3"
                    onClick={handleCheckout}
                  >
                    Proceed To Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-12">
        <div className="diweurbhwer_inner container-fluid mt-4">
          <TrandingProduct />
        </div>
      </div>

      <div className="col-lg-12">
        <div className="diweurbhwer_inner container-fluid mt-4">
          <RecentlyViewed />
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        style={{ zIndex: 9999999999 }}
      />
    </div>
  );
};
