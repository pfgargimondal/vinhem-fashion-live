import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Table from "react-bootstrap/Table";
import "./Css/Cart.css";
import "swiper/css";
import RecentlyViewed from "../../hooks/RecentlyViewed";
  // eslint-disable-next-line
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import http from "../../http";
import { useWishlist } from "../../context/WishlistContext";
import TrandingProduct from "../../hooks/TrandingProduct";
import { useCurrency } from "../../context/CurrencyContext";

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { ShippingAddress } from "./Components/ShippingAddress";
import { BillingAddress } from "./Components/BillingAddress";

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
  const [key, setKey] = useState('cart');
  const [couponModal, setCouponModal] = useState(false);
  const [addressModal, setAddressModal] = useState(false);
    // eslint-disable-next-line
  const [billingAddressModal, setBillingAddressModal] = useState(false);

  const { formatPrice } = useCurrency();

  const fetchCartlist = useCallback(async () => {
    if (!token) return;

    try {
      const res = await http.post(
        "/user/get-cart-user",
        // { country: selectedCurrency.country_name },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setcartItems(res.data.data || []);
      settotalPrice(res.data.total_cart_price || "");
      setproductCoupon(res.data.all_productCoupon || []);
    } catch (error) {
      console.error("Failed to fetch cart list", error);
    }
  }, [token]);

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

  const handleProceed = () => {
    setKey("shipping");
  }

  const handleCart = () => {
    setKey("cart");
  }
  const handleCouponToggle = () => {
    const html = document.querySelector("html");

    html.classList.add("overflow-hidden");
    setCouponModal(!couponModal);
  };
  const handleCouponClose = () => {
    const html = document.querySelector("html");

    html.classList.remove("overflow-hidden");
    setCouponModal(false);
  };
  const handleAddressToggle = () => {
    const html = document.querySelector("html");

    html.classList.add("overflow-hidden");
    setAddressModal(!addressModal);
  };
  const handleAddressClose = () => {
    const html = document.querySelector("html");

    html.classList.remove("overflow-hidden");
    setAddressModal(false);
  };
  const handleBillingAddressToggle = () => {
    const html = document.querySelector("html");

    html.classList.add("overflow-hidden");
    setAddressModal(!addressModal);
  };
  const handleBillingAddressClose = (e) => {
    e.preventDefault();

    const html = document.querySelector("html");

    html.classList.remove("overflow-hidden");
    setAddressModal(false);
  };

  const [previousAddress, setPreviousAddress] = useState(null);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [billingAddress, setBillingAddress] = useState(null);
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [errors, setErrors] = useState({});

  // -------------------------------
  // 1️⃣ SHIPPING DATA STATE
  // -------------------------------
  const [shippingData, setShippingData] = useState({
    shipping_first_name: "",
    shipping_last_name: "",
    shipping_country: "India",
    shipping_pincode: "",
    shipping_aptNo: "",
    shipping_street_address: "",
    shipping_city: "",
    shipping_state: "",
    shipping_mobileCode: "+91",
    shipping_mobile_number: "",
    shipping_email: "",
    shipping_address_as: "",
    shipping_default_addrss: false,
  });

  // -------------------------------
  // 2️⃣ FORMAT DATA (for UI)
  // -------------------------------
  const formatShippingAddress = (data) => ({
    shippingName: `${data.shipping_first_name} ${data.shipping_last_name}`,
    shippingFullAddress: `${data.shipping_aptNo}, ${data.shipping_street_address}`,
    shippingCity: data.shipping_city,
    shippingPinCode: data.shipping_pincode,
    shippingState: data.shipping_state,
    shippingCountry: data.shipping_country,
    shippingNumber: `${data.shipping_mobileCode} ${data.shipping_mobile_number}`,
    shippingEmail: data.shipping_email,
    shippingAddressAs: data.shipping_address_as,
  });

  useEffect(() => {
    if (!token) return;

    const fetchPreviousAddress = async () => {
      try {
        const res = await http.get("/user/get-previous-address", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const apiData = res.data.data;

        if (apiData) {
          const formatted = formatShippingAddress(apiData);
          setPreviousAddress(formatted);
          setShippingAddress(formatted);

          setBillingAddress(formatted); // billing from database
          setSameAsShipping(false);
        }
      } catch (error) {
        console.error("Failed to fetch address", error);
      }
    };

    fetchPreviousAddress();
  }, [token]);


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    let newValue = value;

    if (name === "shipping_mobile_number") {
      newValue = value.replace(/[^0-9]/g, "");
    }

    if (name === "shipping_pincode") {
      newValue = value.replace(/[^0-9]/g, "");
    }

    setShippingData({
      ...shippingData,
      [name]: type === "checkbox" ? checked : newValue,
    });
  };


  const validateForm = () => {
    let newErrors = {};

    if (!shippingData.shipping_first_name.trim())
      newErrors.shipping_first_name = "First name is required";

    if (!shippingData.shipping_last_name.trim())
      newErrors.shipping_last_name = "Last name is required";

    if (!shippingData.shipping_pincode.trim())
      newErrors.shipping_pincode = "Pin code is required";

    if (!shippingData.shipping_aptNo.trim())
      newErrors.shipping_aptNo = "Apt / Building is required";

    if (!shippingData.shipping_street_address.trim())
      newErrors.shipping_street_address = "Street address is required";

    if (!shippingData.shipping_city.trim())
      newErrors.shipping_city = "City is required";

    if (!shippingData.shipping_state.trim())
      newErrors.shipping_state = "State is required";

    if (!shippingData.shipping_address_as)
      newErrors.shipping_address_as = "Select address type";

    if (!shippingData.shipping_mobile_number.trim()) {
      newErrors.shipping_mobile_number = "Mobile number is required";
    } else if (!/^[0-9]{10}$/.test(shippingData.shipping_mobile_number)) {
      newErrors.shipping_mobile_number = "Mobile number must be 10 digits";
    }

    if (!shippingData.shipping_email.trim()) {
      newErrors.shipping_email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingData.shipping_email)) {
      newErrors.shipping_email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // -------------------------------
  // 6️⃣ SAVE SHIPPING ADDRESS
  // -------------------------------
  const handleSaveShipping = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formatted = formatShippingAddress(shippingData);
    localStorage.setItem("shipping_address", JSON.stringify(formatted));
    setShippingAddress(formatted);
    handleAddressClose();
  };

  // -------------------------------
  // 7️⃣ LOAD SAVED ADDRESS FROM LOCALSTORAGE
  // -------------------------------
  useEffect(() => {
    const saved = localStorage.getItem("shipping_address");
    if (saved) {
      setShippingAddress(JSON.parse(saved));
    }
  }, []);

  const handleRemoveAddress = () => {
    localStorage.removeItem("shipping_address");
    setShippingAddress(null);
  };

  const handleEditAddress = () => {
  if (!shippingAddress) return;

  setShippingData({
      shipping_first_name: shippingAddress.shippingName.split(" ")[0] || "",
      shipping_last_name: shippingAddress.shippingName.split(" ")[1] || "",
      shipping_country: shippingAddress.shippingCountry,
      shipping_pincode: shippingAddress.shippingPinCode,
      shipping_aptNo: shippingAddress.shippingFullAddress.split(",")[0] || "",
      shipping_street_address: shippingAddress.shippingFullAddress.split(",")[1] || "",
      shipping_city: shippingAddress.shippingCity,
      shipping_state: shippingAddress.shippingState,
      shipping_mobileCode: shippingAddress.shippingNumber.split(" ")[0],
      shipping_mobile_number: shippingAddress.shippingNumber.split(" ")[1],
      shipping_email: shippingAddress.shippingEmail,
      shipping_address_as: "HOME",
    });

    // Open the modal
    handleAddressToggle();
  };



  return (
    <div>
      <div className="cart-wrapper py-4">
        <div className="container-fluid">
          <Tabs
            id="controlled-tab-example"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="crt-top-tabs justify-content-center mb-3"
          >
            <Tab eventKey="cart" title="CART">
              <div className="row justify-content-between">
                <div className="col-lg-8">
                  <div className="diwebjrwert_left">
                    <h4 className="mb-4">Your Shopping Cart</h4>

                    <div className="odnwejirhwerwer py-2 px-3">
                      <p className="mb-0 d-flex align-items-center">
                        Shop for ₹6,004 more to get additional offers on your order.
                        To know more
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
                                            {/* <i class="bi bi-currency-rupee"></i> */}
                                            {formatPrice(cartItemsVal.mrp_price)}
                                          </span>
                                          <span>
                                            {/* <i class="bi bi-currency-rupee"></i> */}
                                            {formatPrice(cartItemsVal.selling_price)}
                                          </span>
                                        </>
                                      ) : (
                                        <>
                                          <span>
                                            {/* <i class="bi bi-currency-rupee"></i> */}
                                            {formatPrice(cartItemsVal.plus_sizes_charges)}
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
                                  <p className="mb-1">ITEM ID: {cartItemsVal.item_id}</p>
                                  
                                  <p className="mb-1">Colour: {cartItemsVal.color}</p>

                                  <div className="doewrwerwer">
                                    <div className="row">
                                      <div className="col-lg-3 mb-3">
                                        <div className="deiwnriwehrwer">

                                         {cartItemsVal.stitch_option === 'customFit' ? (
                                            <>
                                              <label htmlFor="" className="form-label mb-1">Stitching Option</label>
                                              <input type="text" className="form-control" placeholder="Custom Fit" disabled />
                                            </>
                                          ) : cartItemsVal.size === '' ? (
                                            <>
                                              <label htmlFor="" className="form-label mb-1">Stitching Option</label>
                                              <input
                                                type="text"
                                                className="form-control"
                                                placeholder={cartItemsVal.actual_stitch_option}
                                                disabled
                                              />
                                            </>
                                          ) : (
                                            <>
                                              <label htmlFor="" className="form-label mb-1">Size:</label>
                                              <input
                                                type="text"
                                                className="form-control"
                                                placeholder={cartItemsVal.size}
                                                disabled
                                              />
                                            </>
                                          )}
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

                                      <div className="col-lg-3 mb-3">
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

                                    <div className="dewhrowerwer d-flex align-items-center">
                                      <div className="doijerewr d-flex align-items-center me-4">
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
                                              ? "fa-solid me-1 fa-heart"
                                              : "fa-regular me-1 fa-heart"
                                          }
                                          style={{ cursor: "pointer" }}
                                        ></i>

                                        <p className="mb-0">Move to Wishlist</p>
                                      </div>

                                      <div className="doijerewr d-flex align-items-center">
                                        <i className="bi me-1 bi-trash3" onClick={() => handleRemoveItem(cartItemsVal.id)}></i>

                                        <p className="mb-0">Remove</p>
                                      </div>
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
                    <div className="dbjienwhrer">
                      <button onClick={handleCouponToggle} className="btn btn-main coupn-btn bg-transparent text-dark w-100 mt-5 mb-4">View All Offer & Coupons <i class="bi bi-chevron-right"></i></button>
                    </div>

                    <h4 className="mb-4">Cart Summary</h4>

                    <div className="dweoihrwerwer p-2 mb-3">
                      <Table responsive>
                        <tbody>
                          <tr>
                            <td>Total MRP :</td>

                            <td>
                              {/* <i class="bi bi-currency-rupee"></i> */}
                              {/* {formatPrice(totalPrice.total_selling_price)} */}
                              {formatPrice(totalPrice.total_mrp_price)}
                            </td>
                          </tr>

                          <tr>
                            <td>Total Discount</td>

                            <td>
                              (-) 
                              {/* <i class="bi bi-currency-rupee"></i> */}
                              {formatPrice(totalPrice.total_discount_price)}
                            </td>
                          </tr>
                          <tr>
                            <td>Customization Charges</td>
                            <td>
                              {/* <i class="bi bi-currency-rupee"></i> */}
                              {formatPrice(totalPrice.custom_fit_charges)}
                            </td>
                          </tr>
                          {totalPrice.stiching_charges !== 0 && (
                            <tr>
                              <td>Stiching Charges</td>

                              <td>
                                {/* <i class="bi bi-currency-rupee"></i> */}
                                {formatPrice(totalPrice.stiching_charges)}
                              </td>
                            </tr>
                          )}
                          {totalPrice.total_add_on_charges !== 0 && (
                            <tr>
                              <td>Add On Charges</td>
                              <td>
                                {/* <i class="bi bi-currency-rupee"></i> */}
                                {formatPrice(totalPrice.total_add_on_charges)}
                              </td>
                            </tr>
                          )}
                       
                          <tr>
                            <td>Shipping & Duties</td>

                            <td>
                              {/* <i class="bi bi-currency-rupee"></i> */}
                              {/* {totalPrice.shipping_charges} */}

                              Calculated at Checkout
                            </td>
                          </tr>
                          <tr>
                            <td>Total Payable</td>

                            <td>
                              {/* <i class="bi bi-currency-rupee"></i> */}
                              {formatPrice(Number(totalPrice.cart_totalPrice))}
                            </td>
                          </tr>
                        </tbody>
                      </Table>                      
                    </div>

                    {appliedDiscount > 0 && (
                      <div className="oiasmdjweijrwerwer d-flex align-items-center justify-content-between zsdvfdesdeadfrer mt-4">
                        <p>Coupon Discount</p>

                        <p>
                          (-) 
                          {/* <i class="bi bi-currency-rupee"></i> */}
                          {formatPrice(appliedDiscount)}
                        </p>
                      </div>
                    )}

                    <div className="dweoihrwerwer sfvawxdsddqwdawd aiksndjhugwerwerw d-flex align-items-center justify-content-between p-2 mb-3">
                      <div className="doewjirwerwer dcvsdfggewe">
                        <label>YOUR TOTAL SAVINGS</label>
                      </div>

                      <span>
                        {/* <i class="bi bi-currency-rupee"></i>  */}
                        {formatPrice(Number(totalPrice.total_discount_price) + appliedDiscount)}
                      </span>
                    </div>

                    <div className="dweoihrwerwer aiksndjhugwerwerw d-flex align-items-center justify-content-between p-2">
                      <div className="doewjirwerwer">
                        <input type="checkbox" id="gft" className="m-1" />

                        <label htmlFor="gft">This is a gift item</label>
                      </div>

                      <span>Free Gift Wrap</span>
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

                    

                    <div className="oiasmdjweijrwerwer py-2 mb-4 d-flex align-items-center justify-content-between zsdvfdesdeadfrer mt-3">
                      <h4 className="mb-0">Total Payable</h4>

                      <h4 className="mb-0">
                        {/* <i class="bi bi-currency-rupee"></i> */}
                        {formatPrice((Number(totalPrice.total_selling_price) + Number(totalPrice.total_add_on_charges)) - appliedDiscount)}
                      </h4>
                      
                    </div>

                    <div className="uiwdhiwerwerwer">
                      <button
                        className="btn btn-main w-100 mb-3"
                        onClick={handleProceed}
                      >
                        PROCEED TO CHECKOUT
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Tab>
            
            <Tab eventKey="shipping" title="SHIPPING">
              <div className="dnweirwerwer">
                <div className="row justify-content-between">
                  <div className="col-lg-8">
                    <div className="diwebjrwert_left">
                      <div className="djikewirwerwer">
                        <div className="inmoijjrwerwe mb-4">
                          <div className="jbdjnewnllr d-flex align-items-center justify-content-between">
                            <h4 className="mb-3">SHIPPING AND BILLING ADDRESS</h4>
                          </div>

                          <div className="iudghweewr pt-3">                           
                            <div className="dinwemojerr mb-4">
                              <label className="form-label">Shipping Address</label>

                              <button onClick={handleAddressToggle} className="btn btn-main bg-transparent text-black d-block w-100 mt-2">
                                <i class="bi me-1 bi-plus-square"></i>
                                
                                ADD SHIPPING ADDRESS
                              </button>
                            </div>

                            <div className="doiewjirjwer">
                              <div className="delojowerer py-3 px-4 d-flex align-items-center">
                                <i class="bi me-3 bi-exclamation-triangle-fill"></i>

                                <p className="mb-0">A valid Indian mobile is required for seamless delivery. Before delivery of this order, you will get a one-time passowrd on +91-7003672926 <span className="ms-1">Edit</span></p>
                              </div>
                              {shippingAddress ? (
                                <ShippingAddress address={shippingAddress} onEdit={handleEditAddress} onRemove={handleRemoveAddress}/>
                              ) : previousAddress ? (
                                <ShippingAddress address={previousAddress} onEdit={handleEditAddress} onRemove={handleRemoveAddress}/>
                              ) : null}
                            </div>
                          </div>
                        </div>

                        <div className="inmoijjrwerwe dfghbefestewerr mb-4">
                          <div className="kasndkhasd form-check mb-4">
                            <input
                              className="form-check-input ihdinwehwwwee"
                              type="checkbox"
                              value=""
                              id="flexCheckDefault"
                              checked={sameAsShipping}
                              onChange={(e) => {
                                setSameAsShipping(e.target.checked);
                                if (e.target.checked) {
                                  // Copy shipping → billing
                                  setBillingAddress(shippingAddress);
                                }
                              }}
                            />

                            <label className="form-check-label" htmlFor="flexCheckDefault">
                              <h6 className="mb-0">Billing address same as shipping address</h6>
                            </label>
                          </div>

                          <div className="iudghweewr">       
                            {!sameAsShipping && (
                              <div className="dinwemojerr mb-4">
                                <label className="form-label">Billing Address</label>
                                <button 
                                  onClick={handleBillingAddressToggle} 
                                  className="btn btn-main bg-transparent text-black d-block w-100 mt-2"
                                >
                                  <i className="bi me-1 bi-plus-square"></i>
                                  ADD BILLING ADDRESS
                                </button>
                              </div>
                            )}

                            <div className="doiewjirjwer">
                              {/* <div className="delojowerer py-3 px-4 d-flex align-items-center">
                                <i class="bi me-3 bi-exclamation-triangle-fill"></i>

                                <p className="mb-0">A valid Indian mobile is required for seamless delivery. Before delivery of this order, you will get a one-time passowrd on +91-7003672926 <span className="ms-1">Edit</span></p>
                              </div> */}

                              {/* 1️⃣ If SAME AS SHIPPING → show shipping details */}
                              {sameAsShipping && shippingAddress && (
                                <BillingAddress data={shippingAddress} onEdit={handleBillingAddressToggle}
                                    onRemove={() => setBillingAddress(null)}/>
                              )}

                              {/* 2️⃣ If NOT same-as-shipping AND billing address exists in DB */}
                              {!sameAsShipping && billingAddress && (
                                <BillingAddress data={billingAddress} onEdit={handleBillingAddressToggle}
                                    onRemove={() => setBillingAddress(null)}/>
                              )}

                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="dweihriwerwerw mt-4">
                        <p className="mb-1">*Once your order has been placed no subsequent changes can be made in it.</p>

                        <p className="mb-1">*Shipping cost may vary depending on the delivery destination.</p>

                        <p className="mb-1">*Please check the final amount on the order summary page before completing the payment.</p>

                        <p className="mb-1">*An item's price may vary according to the size selected.</p>

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
                    <div className="diwebjrwert_right sfvswfrwerwr sticky-top">
                      <h4 className="opsjdfohsij mb-0 pb-2">PRICE DETAILS</h4>

                      <div className="dweoihrwerwer sdfvdedwewerr p-1 mb-3">
                        <Table responsive>
                          <tbody>
                            <tr>
                              <td>Cart Total</td>

                              <td>
                                {/* <i class="bi bi-currency-rupee"></i> */}
                                {formatPrice(totalPrice.cart_totalPrice)}
                              </td>
                            </tr>

                            <tr>
                              <td>Shipping & Duties</td>

                              <td>
                                {/* <i class="bi bi-currency-rupee"></i> */}
                                {formatPrice(totalPrice.shipping_charges)}
                              </td>
                            </tr>
                          </tbody>
                        </Table>                      
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

                      <div className="dweoihrwerwer sfvawxdsddqwdawd aiksndjhugwerwerw d-flex align-items-center justify-content-between border-0 mb-3">
                        <div className="doewjirwerwer dcvsdfggewe">
                          <label>YOUR TOTAL SAVINGS</label>
                        </div>

                        <span>
                          {/* <i class="bi bi-currency-rupee"></i>  */}
                          {formatPrice(Number(totalPrice.total_discount_price) + appliedDiscount)}
                        </span>
                      </div> 

                      <div className="dweoihrwerwer aiksndjhugwerwerw d-flex align-items-center justify-content-between border-0 mb-3">
                        <div className="doewjirwerwer">
                          <label><b>TOTAL PAYABLE</b></label>
                        </div>

                        <span>
                          {/* <i class="bi bi-currency-rupee"></i>  */}
                          <b>{formatPrice((Number(totalPrice.total_selling_price) + Number(totalPrice.total_add_on_charges) + Number(totalPrice.shipping_charges)) - appliedDiscount)}</b>
                          </span>
                      </div> 

                      <div className="uiwdhiwerwerwer mt-4">
                        <button
                          className="btn btn-main w-100 mb-4"
                          onClick={handleCheckout}
                        >
                          PROCEED TO CHECKOUT
                        </button>
                      </div>

                      <div className="doiewnirhwerwer diwebjrwert_left">
                        <div className="d-flex align-items-center justify-content-between">
                          <p className="mb-0">Order Details - <span>{cartItems?.length} Item(s)</span></p>

                          <i class="bi bi-chevron-up"></i>
                        </div>

                        <div className="dowejroihwrt_wrapper mt-3">
                          {cartItems?.length === 0 && <p>No items in cart</p>}
                          {cartItems?.map((cartItemsVal) => (
                            <div className="dfgjhbdfg sdfaedaeeewwqwee position-relative p-3 mb-3">
                              <div className="row">
                                <div className="col-lg-3">
                                  <div className="donweihrwewer">
                                    <Link to={`/products/${cartItemsVal.slug}`}>
                                      <img
                                        src={cartItemsVal.encoded_image_url_1}
                                        alt={cartItemsVal.product_name}
                                      />
                                    </Link>
                                  </div>
                                </div>

                                <div className="col-lg-9 ps-1">
                                  <div className="dowehriwerwer sdvwdewrwerwere">
                                    <div className="dknwekhwe">
                                      <div className="dokwejlkpewr d-flex flex-wrap align-items-center justify-content-between">
                                        <div className="d-flex align-items-center justify-content-between w-100 mb-1">
                                          <h6 className="mb-0">{cartItemsVal.designer}</h6>

                                          <div className="diejwijrwer">
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
                                                  ? "bi bi-heart-fill"
                                                  : "bi me-2 bi-heart"
                                              }
                                              style={{ cursor: "pointer" }}
                                            ></i>
                                            <i class="bi bi-trash3" onClick={() => handleRemoveItem(cartItemsVal.id)}></i>
                                          </div>
                                        </div>

                                        <p className="mb-0">
                                          {cartItemsVal.product_name}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="dnweghbjewrwer">                                      
                                      <p className="mb-0">Colour: {cartItemsVal.color} | {cartItemsVal.stitch_option === 'customFit' ? (
                                            <>
                                              Size: Custom Fit
                                            </>
                                          ) : cartItemsVal.size === '' ? (
                                            <>
                                              Stitching Option : {cartItemsVal.actual_stitch_option}
                                            </>
                                          ) : (
                                            <>
                                              {cartItemsVal.size}
                                            </>
                                          )}</p>

                                      <p className="mb-1">Price: 
                                        <span>
                                          {/* <i class="bi bi-currency-rupee"></i> */}
                                          {formatPrice(cartItemsVal.actual_price)}
                                        </span>
                                      </p>

                                      <h6 className="sadcadaededee mb-0"><i class="bi me-1 bi-truck"></i> {cartItemsVal.non_returnable}</h6>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="sadfdgrwedwe d-flex align-items-center justify-content-between aksbdjbererre dojweirkwejirwer">
                        <button className="btn px-3 me-2 btn-main" onClick={handleCart}>
                          <i className="fa-solid me-1 fa-arrow-left"></i> Back To Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Tab>

            <Tab eventKey="payment" title="PAYMENT">
              <div className="scsrgwescsdded">
                <div className="row justify-content-between">
                  <div className="col-lg-8">
                    <div className="diwebjrwert_left">
                      <div className="djikewirwerwer">
                        <div className="inmoijjrwerwe mb-4">
                          <div className="jbdjnewnllr">
                            <h4 className="mb-3">SELECT PAYMENT METHOD</h4>
                          </div>

                          <div className="soidjwoejoirwer">
                            <div className="omweojuirhwerrr">
                              <div className="doiweuijrwerwer">
                                <div className="radio-wrapper-26 mb-3">
                                  <label htmlFor="example-26sda">
                                    <div className="inputAndLeftText d-flex">
                                      <input
                                        id="example-26sda"
                                        type="radio"
                                        name="payment_method"
                                        value="upi"
                                      />
                                      <div className="ms-2">
                                        <span className="title">UPI (Gpay, PhonePe, Paytm etc)</span>
                                      </div>
                                    </div>
                                  </label>
                                </div>

                                <div className="radio-wrapper-26 mb-3">
                                  <label htmlFor="example-26sweda">
                                    <div className="inputAndLeftText d-flex">
                                      <input
                                        id="example-26sweda"
                                        type="radio"
                                        name="payment_method"
                                        value="credit_card"
                                      />

                                      <div className="ms-2">
                                        <span className="title">Credit Card</span>
                                      </div>
                                    </div>
                                  </label>
                                </div>

                                <div className="radio-wrapper-26 mb-3">
                                  <label htmlFor="example-sdsd">
                                    <div className="inputAndLeftText d-flex">
                                      <input
                                        id="example-sdsd"
                                        type="radio"
                                        name="payment_method"
                                        value="debit_card"
                                      />

                                      <div className="ms-2">
                                        <span className="title">Debit Card</span>
                                      </div>
                                    </div>
                                  </label>
                                </div>

                                <div className="radio-wrapper-26 mb-3">
                                  <label htmlFor="example-sddsw">
                                    <div className="inputAndLeftText d-flex">
                                      <input
                                        id="example-sddsw"
                                        type="radio"
                                        name="payment_method"
                                        value="net_banking"
                                      />

                                      <div className="ms-2">
                                        <span className="title">Netbanking</span>
                                      </div>
                                    </div>
                                  </label>
                                </div>

                                <div className="radio-wrapper-26 mb-3">
                                  <label htmlFor="example-sader">
                                    <div className="inputAndLeftText d-flex">
                                      <input
                                        id="example-sader"
                                        type="radio"
                                        name="payment_method"
                                        value="razorpay"
                                      />

                                      <div className="ms-2">
                                        <span className="title">Razor Pay</span>
                                      </div>
                                    </div>
                                  </label>
                                </div>

                                <div className="radio-wrapper-26 mb-3">
                                  <label htmlFor="example-rerr">
                                    <div className="inputAndLeftText d-flex">
                                      <input
                                        id="example-rerr"
                                        type="radio"
                                        name="payment_method"
                                        value="pay_pal"
                                      />

                                      <div className="ms-2">
                                        <span className="title">Pay Pal</span>
                                      </div>
                                    </div>
                                  </label>
                                </div>

                                <div className="radio-wrapper-26 mb-3">
                                  <label htmlFor="example-rerrfdbv">
                                    <div className="inputAndLeftText d-flex">
                                      <input
                                        id="example-rerrfdbv"
                                        type="radio"
                                        name="payment_method"
                                        value="cash_on_delivery"
                                        disabled
                                      />

                                      <div className="ms-2">
                                        <span className="title">Cash On Delivery (COD Not Applicable On This Product)</span>
                                      </div>
                                    </div>
                                  </label>
                                </div>
                              </div>

                              <div className="dfiwehrwerwe mb-5">
                                <div className="form-check">
                                  <input className="form-check-input" type="checkbox" defaultValue="" id="flexCheckDefasadsult" />

                                  <label className="form-check-label" htmlFor="flexCheckDefasadsult">
                                    I agree to the terms and conditions (<Link to="/">read T&C</Link>)
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-4">
                    <div className="diwebjrwert_right sfvswfrwerwr sticky-top">
                      <h4 className="opsjdfohsij mb-0 pb-2">PRICE DETAILS</h4>

                      <div className="dweoihrwerwer sdfvdedwewerr p-1 mb-3">
                        <Table responsive>
                          <tbody>
                            <tr>
                              <td>Cart Total</td>

                              <td>
                                <i class="bi bi-currency-rupee"></i>
                                {totalPrice.total_selling_price}
                              </td>
                            </tr>

                            <tr>
                              <td>Shipping & Duties</td>

                              <td>
                                <i class="bi bi-currency-rupee"></i>
                                {totalPrice.total_discount_price}
                              </td>
                            </tr>
                          </tbody>
                        </Table>                      
                      </div>

                      <div className="dweoihrwerwer aiksndjhugwerwerw d-flex align-items-center justify-content-between border-0 mb-3">
                        <div className="doewjirwerwer">
                          <label><b>TOTAL PAYABLE</b></label>
                        </div>

                        <span><i class="bi bi-currency-rupee"></i> <b>2,265</b></span>
                      </div> 

                      <div className="dweoihrwerwer sfvawxdsddqwdawd aiksndjhugwerwerw d-flex align-items-center justify-content-between border-0 mb-3">
                        <div className="doewjirwerwer dcvsdfggewe">
                          <label>YOUR TOTAL SAVINGS</label>
                        </div>

                        <span><i class="bi bi-currency-rupee"></i> 2,265</span>
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

                      <div className="uiwdhiwerwerwer mt-4">
                        <button
                          className="btn btn-main w-100 mb-4"
                          onClick={handleCheckout}
                        >
                          PLACE ORDER
                        </button>
                      </div>

                      <div className="doiewnirhwerwer diwebjrwert_left">
                        <div className="d-flex align-items-center justify-content-between">
                          <p className="mb-0">Order Details - <span>1 Item(s)</span></p>

                          <i class="bi bi-chevron-up"></i>
                        </div>

                        <div className="dowejroihwrt_wrapper mt-3">
                          {cartItems?.length === 0 && <p>No items in cart</p>}
                          {cartItems?.map((cartItemsVal) => (
                            <div className="dfgjhbdfg sdfaedaeeewwqwee position-relative p-3 mb-3">
                              <div className="row">
                                <div className="col-lg-3">
                                  <div className="donweihrwewer">
                                    <Link to={`/products/${cartItemsVal.slug}`}>
                                      <img
                                        src={cartItemsVal.encoded_image_url_1}
                                        alt={cartItemsVal.product_name}
                                      />
                                    </Link>
                                  </div>
                                </div>

                                <div className="col-lg-9 ps-1">
                                  <div className="dowehriwerwer sdvwdewrwerwere">
                                    <div className="dknwekhwe">
                                      <div className="dokwejlkpewr d-flex flex-wrap align-items-center justify-content-between">
                                        <div className="d-flex align-items-center justify-content-between w-100 mb-1">
                                          <h6 className="mb-0">HKB</h6>

                                          <div className="diejwijrwer">
                                            <i class="bi me-2 bi-heart"></i>

                                            <i class="bi bi-trash3"></i>
                                          </div>
                                        </div>

                                        <p className="mb-0">
                                          {cartItemsVal.product_name}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="dnweghbjewrwer">                                      
                                      <p className="mb-0">Colour: Mauve | Size: </p>

                                      <p className="mb-1">Price: <i class="bi bi-currency-rupee"></i> 3499.00</p>

                                      <h6 className="sadcadaededee mb-0"><i class="bi me-1 bi-truck"></i> Return/exchange available</h6>
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
            </Tab>
          </Tabs>
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

      {/*coupon code modal*/}

      <div onClick={handleCouponClose} className={`${couponModal ? "coupon-modal-backdrop" : "coupon-modal-backdrop coupon-modal-backdrop-hide"} position-fixed w-100 h-100`}></div>

      <div className={`${couponModal ? "coupon-modal" : "coupon-modal coupon-modal-hide"} bg-white position-fixed h-100`}>
        <div className="oiasmdjweijrwerwer h-100">
          <div className="dsfgrrdeaeerr mb-3 d-flex align-items-center justify-content-between p-4 pb-0">
            <p className="mb-0">COUPONS</p>

            <Link onClick={handleCouponClose} to="">Close</Link>
          </div>

          <div className="px-4">
            <div className="dewuihrwe position-relative">
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

          <div className={`doeiwjorjweorwer mt-4 ${(couponItems.length < 3) ? "px-4" : "ps-4"}`}>
            <h5 className="mb-4">Offers Available To Apply</h5>

            <div className="deoiwjrewrwer">
              {couponItems?.map((couponItemsVal) => (
                <div className="jidnwenjrwerwer mb-5">
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

                  <div className="fsdrwedewee mt-4 text-center">
                    <Link
                      to=""
                      onClick={(e) => {
                        e.preventDefault();

                        setSelectedCoupon(couponItemsVal.code);
                        setSelectedDiscount(parseInt(couponItemsVal.value));
                        setAppliedDiscount(parseInt(couponItemsVal.value));
                        setCouponApplied(true);
                      }}
                    >
                      TAP TO APPLY
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>


      {/*shipping address modal*/}

      <div className={`${addressModal ? "address-modal-backdrop" : "address-modal-backdrop address-modal-backdrop-hide"} position-fixed w-100 h-100`}></div>

      <div className={`${addressModal ? "address-modal" : "address-modal address-modal-hide"} bg-white position-fixed`}>
        <div className="oiasmdjweijrwerwer">
          <div className="dsfgrrdeaeerr mb-2 d-flex align-items-center justify-content-between px-4 pt-3 pb-0">
            <p className="mb-0">ADD SHIPPING ADDRESS</p>
            <i onClick={handleAddressClose} class="bi bi-x"></i>
          </div>

          <div className="deiwjiurhweijew px-4 pb-4">
            <form className="asdsefewweee row" onSubmit={handleSaveShipping}>
              <div className="col-lg-6 mb-4">
                <input 
                  type="text" 
                  className="form-control" 
                  name="shipping_first_name"
                  placeholder="First Name*" 
                  value={shippingData.shipping_first_name}
                  onChange={handleInputChange}
                />
                {errors.shipping_first_name && <small className="text-danger">{errors.shipping_first_name}</small>}
              </div>

              <div className="col-lg-6 mb-4">
                <input 
                  type="text" 
                  className="form-control" 
                  name="shipping_last_name"
                  placeholder="Last Name*"
                  value={shippingData.shipping_last_name}
                  onChange={handleInputChange}
                />
                {errors.shipping_last_name && <small className="text-danger">{errors.shipping_last_name}</small>}
              </div>

              <div className="col-lg-12 mb-4">
                <select 
                  name="shipping_country" 
                  className="form-select h-100"
                  value={shippingData.shipping_country}
                  onChange={handleInputChange}
                >
                  <option value="India">India</option>
                </select>
              </div>

              <div className="col-lg-12 mb-4">
                <input 
                  type="text" 
                  className="form-control" 
                  name="shipping_pincode" 
                  placeholder="Zip / Postal Code*"
                  value={shippingData.shipping_pincode}
                  onChange={handleInputChange}
                />
                {errors.shipping_pincode && <small className="text-danger">{errors.shipping_pincode}</small>}
              </div>

              <div className="col-lg-6 mb-4">
                <input 
                  type="text" 
                  className="form-control" 
                  name="shipping_aptNo" 
                  placeholder="Apt. Building Floor*"
                  value={shippingData.shipping_aptNo}
                  onChange={handleInputChange}
                />
                {errors.shipping_aptNo && <small className="text-danger">{errors.shipping_aptNo}</small>}
              </div>

              <div className="col-lg-6 mb-4">
                <input 
                  type="text" 
                  className="form-control" 
                  name="shipping_street_address"
                  placeholder="Street Address*"
                  value={shippingData.shipping_street_address}
                  onChange={handleInputChange}
                />
                {errors.shipping_street_address && <small className="text-danger">{errors.shipping_street_address}</small>}
              </div>

              <div className="col-lg-6 mb-4">
                <input 
                  type="text" 
                  className="form-control" 
                  name="shipping_city"
                  placeholder="City*"
                  value={shippingData.shipping_city}
                  onChange={handleInputChange}
                />
                {errors.shipping_city && <small className="text-danger">{errors.shipping_city}</small>}
              </div>

              <div className="col-lg-6 mb-4">
                <select 
                  name="shipping_state" 
                  className="form-select"
                  value={shippingData.shipping_state}
                  onChange={handleInputChange}
                >
                  <option value="">State</option>
                  <option value="West Bengal">West Bengal</option>
                </select>
                {errors.shipping_state && <small className="text-danger">{errors.shipping_state}</small>}
              </div>

              <div className="col-lg-12 mb-4">
                <div className="row align-items-center">
                  <div className="col-3">
                    <input 
                      type="text" 
                      className="form-control"
                      name="shipping_mobileCode" 
                      value={shippingData.shipping_mobileCode}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-9">
                    <input 
                      type="text" 
                      className="form-control" 
                      name="shipping_mobile_number" 
                      placeholder="Mobile Number of Recipient*"
                      value={shippingData.shipping_mobile_number}
                      onChange={handleInputChange}
                    />
                    {errors.shipping_mobile_number && <small className="text-danger">{errors.shipping_mobile_number}</small>}
                  </div>
                </div>
              </div>

              <div className="col-lg-12 mb-4">
                <input 
                  type="email" 
                  className="form-control" 
                  name="shipping_email"
                  placeholder="Email Id*"
                  value={shippingData.shipping_email}
                  onChange={handleInputChange}
                />
                {errors.shipping_email && <small className="text-danger">{errors.shipping_email}</small>}
              </div>

              <div className="col-lg-12">
                <div className="dsdgsreefrrr d-flex">
                  <label className="form-label">ADDRESS AS:</label>

                  <div className="doweirwerr">
                    <div className="d-flex flex-wrap align-items-center">
                      {["HOME", "OFFICE", "OTHERS"].map((type, index) => (
                        <div className="form-check mx-3" key={index}>
                          <input
                            className="form-check-input"
                            type="radio"
                            name="shipping_address_as"
                            value={type}
                            checked={shippingData.shipping_address_as === type}
                            onChange={handleInputChange}
                          />
                          <label className="form-check-label">{type}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {errors.shipping_address_as && <small className="text-danger">{errors.shipping_address_as}</small>}
              </div>

              <div className="aswdreqwewqe d-flex mt-2 mb-3">
                <div className="form-check">
                  <input 
                    className="form-check-input" 
                    type="checkbox"
                    name="shipping_default_addrss"
                    checked={shippingData.shipping_default_addrss}
                    onChange={handleInputChange}
                  />
                  <label className="form-check-label">Make this as my default shipping address</label>
                </div>
              </div>

              <div className="deiwhrwerwe row align-items-center justify-content-between">
                <div className="col-lg-5">
                  <button type="submit" className="btn btn-main w-100">SAVE</button>
                </div>

                <div className="col-lg-5">
                  <Link onClick={handleAddressClose} className="btn btn-main bg-transparent text-dark w-100">CANCEL</Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>


      {/*billing address modal*/}

      <div className={`${billingAddressModal ? "billing-address-modal-backdrop" : "billing-address-modal-backdrop billing-address-modal-backdrop-hide"} position-fixed w-100 h-100`}></div>

      <div className={`${billingAddressModal ? "billing-address-modal" : "billing-address-modal billing-address-modal-hide"} bg-white position-fixed`}>
        <div className="oiasmdjweijrwerwer">
          <div className="dsfgrrdeaeerr mb-2 d-flex align-items-center justify-content-between px-4 pt-3 pb-0">
            <p className="mb-0">ADD BILLING ADDRESS</p>

            <i onClick={handleBillingAddressClose} class="bi bi-x"></i>
          </div>

          <div className="deiwjiurhweijew px-4 pb-4">
            <form className="asdsefewweee row">
              <div className="col-lg-6 mb-4">
                <input type="text" className="form-control" placeholder="First Name*" />
              </div>

              <div className="col-lg-6 mb-4">
                <input type="text" className="form-control" placeholder="Last Name*" />
              </div>

              <div className="col-lg-12 mb-4">
                <select name="" className="form-select h-100" id="">
                  <option value="">India</option>
                </select>
              </div>

              <div className="col-lg-12 mb-4">
                <input type="text" className="form-control" placeholder="Zip / Postal Code*" />
              </div>

              <div className="col-lg-6 mb-4">
                <input type="text" className="form-control" placeholder="Apt. Building Floor*" />
              </div>

              <div className="col-lg-6 mb-4">
                <input type="text" className="form-control" placeholder="Street Address*" />
              </div>

              <div className="col-lg-6 mb-4">
                <input type="text" className="form-control" placeholder="City*" />
              </div>

              <div className="col-lg-6 mb-4">
                <select name="" className="form-select" id="">
                  <option value="">State</option>
                </select>
              </div>

              <div className="col-lg-12 mb-4">
                <div className="row align-items-center">
                  <div className="col-3">
                    <div className="ojdeijr">
                      <input type="text" className="form-control" placeholder="+91" />
                    </div>                    
                  </div>

                  <div className="col-9">
                    <input type="text" className="form-control" placeholder="Mobile Number of Recipient*" />
                  </div>
                </div>
              </div>
              
              <div className="col-lg-12">
                <div className="dsdgsreefrrr d-flex">
                  <label className="form-label">ADDRESS AS:</label>

                  <div className="doweirwerr">
                    <div className="d-flex flex-wrap align-items-center">
                      <div className="form-check mx-3">
                        <input className="form-check-input" type="radio" name="dihweihr" id="ddasdasw" value="" />
                        
                        <label className="form-check-label" for="ddasdasw">HOME</label>
                      </div>

                      <div className="form-check mx-3">
                        <input className="form-check-input" type="radio" name="dihweihr" id="daeerwqe" value="" />
                        
                        <label className="form-check-label" for="daeerwqe">OFFICE</label>
                      </div>

                      <div className="form-check mx-3">
                        <input className="form-check-input" type="radio" name="dihweihr" id="adeee" value="" />
                        
                        <label className="form-check-label" for="adeee">OTHERS</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="aswdreqwewqe d-flex mt-2 mb-3">
                <div className="doweirwerr">
                  <div className="d-flex align-items-center">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="dweqweqee" value="" />
                      
                      <label className="form-check-label" for="dweqweqee">Make this as my default shipping address</label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="deiwhrwerwe row align-items-center justify-content-between">
                <div className="col-lg-5">
                  <button className="btn btn-main w-100">SAVE</button>
                </div>

                <div className="col-lg-5">
                  <Link onClick={handleBillingAddressClose} className="btn btn-main bg-transparent text-dark w-100">CANCEL</Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
