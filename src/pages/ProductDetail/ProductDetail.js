import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, Mousewheel } from "swiper/modules";
// eslint-disable-next-line
import { toast, ToastContainer } from "react-toastify";

import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Modal from 'react-bootstrap/Modal';
// eslint-disable-next-line
import Form from 'react-bootstrap/Form';
import RecentlyViewed from "../../hooks/RecentlyViewed";
import { FeaturedProducts, MeasurementForm } from "../../components";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import "./Css/ProductDetail.css";
import "./Css/ProductDetailResponsive.css";
import "swiper/css";
// eslint-disable-next-line
import { FooterTopComponent } from "../../components/Others/FooterTopComponent";
import http from "../../http";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import { DesignerSizeChart } from "../../components/Elements/DsignerSizeChart/DsignerSizeChart";
import { useCart } from "../../context/CartContext";

export const ProductDetail = () => {

  const { token, user } = useAuth();
  const { addToCart } = useCart();
  // eslint-disable-next-line
  const [show, setShow] = useState(false);
  // eslint-disable-next-line
  const [showMjri, setShowMjri] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  // const [mesremntGuideImgShow, setMesremntGuideImgShow] = useState(false);
  
  const { slug } = useParams();
  const [shareModal, setShareModal] = useState(false);
  const [turbanModal, setTurbanModal] = useState(false);
  const [mojriModal, setMojriModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeKey, setActiveKey] = useState("first");


  const handlePGShowModal = (e, key) => {
    e.preventDefault();

    setActiveKey(key);
    setShowModal(true);    
  };

  useEffect(() => {
    const html = document.querySelector("html");

    showModal ? html.classList.add("overflow-hidden") : html.classList.remove("overflow-hidden");
  }, [showModal]);

  const handlePGClose = () => setShowModal(false);


  useEffect(() => {
    if (slug) {
      const existing = JSON.parse(localStorage.getItem("recentlyViewedSlugs")) || [];

      // Remove if already exists to avoid duplicates
      const filtered = existing.filter((item) => item !== slug);

      // Add new slug at the front
      const updated = [slug, ...filtered].slice(0, 10); // keep max 10 items

      localStorage.setItem("recentlyViewedSlugs", JSON.stringify(updated));
    }
  }, [slug]);


  // eslint-disable-next-line
  const [activeTab, setActiveTab] = useState("tab-1");
  
  const [showSizeModal, setShowSizeModal] = useState(false);

  //featured products

  const swiperConfig = {
    spaceBetween: 20,
    slidesPerView: 5,
    navigation: true,
    pagination: { clickable: true },
    breakpoints: {
      320: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 4 },
      1200: { slidesPerView: 5 },
    },
  };

  const handleShowModal = (e) => {
    e.preventDefault();

    setShowSizeModal(!showSizeModal);
  };

  useEffect(() => {
    const html = document.querySelector("html");

    if (showSizeModal) {
      html.classList.add("overflow-hidden"); 
    } else {
      html.classList.remove("overflow-hidden"); 
    }

    return () => {
      html.classList.remove("overflow-hidden"); 
    }
  }, [showSizeModal]);

  const { wishlistIds, addToWishlist, removeFromWishlist } = useWishlist();

  const toggleWishlist = (productId) => {
    if (wishlistIds.includes(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  const [productDetails, SetproductDetails] = useState({});

  const getEstimatedShippingDate = (shipping_time) => {
    const days = parseInt(shipping_time);
    if (isNaN(days)) return "";

    const date = new Date();
    date.setDate(date.getDate() + days);

    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();

    return `${day}${getDaySuffix(day)} ${month} ${year}`;
  };

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
  
  useEffect(() => {
    const fetchProductDetailsPage = async () => {
      try {
        const getresponse = await http.get(`/fetch-product-details/${slug}`);
        SetproductDetails(getresponse.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    if (slug) {
      fetchProductDetailsPage();
    }
  }, [slug]);

  const productLink = `${window.location.origin}/products/${productDetails?.data?.slug}`;
  const handleWhatsAppShare = () => {
    const message = `Check out this beautiful product: ${productLink}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappURL, "_blank");
  };

  const handleFacebookShare = () => {
    const encodedURL = encodeURIComponent(productLink);
    const facebookURL = `https://www.facebook.com/sharer/sharer.php?u=${encodedURL}`;
    window.open(facebookURL, "_blank", "noopener,noreferrer");
  };

  const handleInstagramShare = () => {
    navigator.clipboard.writeText(productLink);
    window.open("https://www.instagram.com/", "_blank");
    // alert("🔗 Product link copied! Paste it in your Instagram story, DM, or bio.");
  };


  const [selectedSize, setSelectedSize] = useState("");
  const [availableQty, setAvailableQty] = useState(0);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);

  const [selectedStitchOption, setSelectedStitchOption] = useState("");
  const [isTurbanChecked, setIsTurbanChecked] = useState(false);
  const [isMojriChecked, setIsMojriChecked] = useState(false);
  const [isStoleChecked, setIsStoleChecked] = useState(false);

  useEffect(() => {
    if (productDetails?.data?.mto_quantity) {
      setAvailableQty(productDetails.data.mto_quantity);
    }
  }, [productDetails]);

  // ------------------------------
  // Handle size change
  // ------------------------------
  const handleSizeChange = (e) => {
    const newSize = e.target.value;
    setSelectedSize(newSize);

    // Find the selected size row
    const selectedInventory =
      productDetails?.data?.product_allSize?.find(
        (item) =>
          item.filter_size === newSize || item.plus_sizes === newSize
      ) || {};

    const newQty = Number(
      selectedInventory?.mto_quantity || productDetails?.data?.mto_quantity || 0
    );
    setAvailableQty(newQty);

    if (selectedQuantity > newQty) {
      setSelectedQuantity(1);
    }

    // Determine final size price logic
    let finalPrice = 0;

    const sellingPrice = parseFloat(
      selectedInventory?.selling_price ||
        productDetails?.data?.selling_price ||
        0
    );

    const plusCharge = parseFloat(selectedInventory?.plus_sizes_charges || 0);

    // ✅ Logic:
    // - If user selected a plus size and it has a charge > 0 → show only that charge
    // - Else → show normal selling price
    if (selectedInventory?.plus_sizes === newSize && plusCharge > 0) {
      finalPrice = plusCharge;
    } else {
      finalPrice = sellingPrice;
    }

    setSelectedPrice(finalPrice);
  };

  const handleQuantitySelect = (qty) => {
    setSelectedQuantity(qty);

    // Recalculate final price when quantity changes
    const basePrice =
      parseFloat(selectedPrice || productDetails?.data?.selling_price || 0);

    let total = basePrice * qty;

    // Optional addon charges
    const stitchingCharge = parseFloat(
      productDetails?.data?.stiching_charges?.price || 0
    );
    const customFitCharge = parseFloat(
      productDetails?.data?.extra_charges?.price || 0
    );
    const turbanPrice = parseFloat(productDetails?.data?.turban_charges?.price || 0);
    const mojriPrice = parseFloat(productDetails?.data?.mojri_charges?.price || 0);
    const stolePrice = parseFloat(productDetails?.data?.stole_charges?.price || 0);

    // Add optional selections if chosen
    if (selectedStitchOption === "stitch") total += stitchingCharge;
    if (selectedStitchOption === "customFit") total += customFitCharge;
    if (isTurbanChecked) total += turbanPrice;
    if (isMojriChecked) total += mojriPrice;
    if (isStoleChecked) total += stolePrice;

    setFinalPrice(total);
  };

  // ------------------------------
  // Calculate total price dynamically
  // ------------------------------
  useEffect(() => {

    let total =
    parseFloat(selectedPrice || productDetails?.data?.selling_price || 0) *
    selectedQuantity;

    const stitchingCharge = parseFloat(productDetails?.data?.stiching_charges?.price || 0);
    const customFitCharge = parseFloat(productDetails?.data?.extra_charges?.price || 0);
    const turbanPrice = parseFloat(productDetails?.data?.turban_charges?.price || 0);
    const mojriPrice = parseFloat(productDetails?.data?.mojri_charges?.price || 0);
    const stolePrice = parseFloat(productDetails?.data?.stole_charges?.price || 0);

    if (selectedStitchOption === "stitch") total += stitchingCharge;
    if (selectedStitchOption === "customFit") total += customFitCharge;
    if (isTurbanChecked) total += turbanPrice;
    if (isMojriChecked) total += mojriPrice;
    if (isStoleChecked) total += stolePrice;

    setFinalPrice(total);
  }, [
    selectedPrice,
    selectedSize,
    selectedQuantity,
    selectedStitchOption,
    isTurbanChecked,
    isMojriChecked,
    isStoleChecked,
    productDetails,
  ]);

  // ------------------------------
  // Handle stitch option
  // ------------------------------
  const handleStitchOptionChange = (type) => {
    setSelectedStitchOption(type);
  };

 const handleAddToCart = async () => {
  // const hasSizes = productDetails?.data?.product_allSize?.length > 0;

  // // ✅ 1. Validate main size
  // if (hasSizes && !selectedSize) {
  //   alert("Please select a size before adding to cart.");
  //   return;
  // }

  // ✅ 2. Validate accessory sizes (if selected)
  const turbanSize = document.getElementById("product_turbanSize")?.value || "";
  const mojriSize = document.getElementById("product_mojriSize")?.value || "";

  if (isTurbanChecked && !turbanSize) {
    alert("Please select a turban size.");
    return;
  }

  if (isMojriChecked && !mojriSize) {
    alert("Please select a mojri size.");
    return;
  }

  // ✅ 3. Determine correct price logic
  const baseSellingPrice = parseFloat(productDetails?.data?.selling_price || 0);
  const priceToUse = selectedPrice > 0 ? selectedPrice : baseSellingPrice;

  // ✅ 4. Calculate total based on selection
  const stitchingCharge =
    selectedStitchOption === "stitch"
      ? parseFloat(productDetails?.data?.stiching_charges?.price || 0)
      : 0;

  const customFitCharge =
    selectedStitchOption === "customFit"
      ? parseFloat(productDetails?.data?.extra_charges?.price || 0)
      : 0;

  const turbanCharge = isTurbanChecked
    ? parseFloat(productDetails?.data?.turban_charges?.price || 0)
    : 0;

  const mojriCharge = isMojriChecked
    ? parseFloat(productDetails?.data?.mojri_charges?.price || 0)
    : 0;

  const stoleCharge = isStoleChecked
    ? parseFloat(productDetails?.data?.stole_charges?.price || 0)
    : 0;

  // const totalPrice =
  //   (priceToUse +
  //     stitchingCharge +
  //     customFitCharge +
  //     turbanCharge +
  //     mojriCharge +
  //     stoleCharge) *
  //   selectedQuantity;

  // ✅ 5. Prepare cart data
  const productData = {
    product_id: productDetails?.data?.id,
    size: selectedSize || "Default Size",
    quantity: selectedQuantity,
    price_per_unit: priceToUse,
    // total_price: totalPrice.toFixed(2),

    // Stitching & custom fit
    stitch_option: selectedStitchOption,
    stitching_charge: stitchingCharge,
    custom_fit_charge: customFitCharge,

    // Accessories
    turban_selected: isTurbanChecked,
    turban_charge: turbanCharge,
    turban_size: isTurbanChecked ? turbanSize : "",

    mojri_selected: isMojriChecked,
    mojri_charge: mojriCharge,
    mojri_size: isMojriChecked ? mojriSize : "",

    stole_selected: isStoleChecked,
    stole_charge: stoleCharge,
  };

  // console.log("🛒 Adding to Cart:", productData);

  addToCart(productData);

};

  const [mssrmntSbmtConfrm, setMssrmntSbmtConfrm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {

    if (!token) {
      toast.error("Please login to submit measurement data.");
      return;
    }

    const savedData = localStorage.getItem("measurementFormData");
    if (!savedData) {
      toast.error("No measurement data found! Please fill the measurement form first.");
      return;
    }

    // console.log(savedData);
    const formData = JSON.parse(savedData);

      try {
        setLoading(true);

        const res = await http.post(
          "/user/update-measurement-data",
          {
            product_id: productDetails?.data?.id,
            type: productDetails?.data?.custom_feild_selectOption,
            ...formData,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // console.log("Response:", res);

        if (res?.data?.success) {
          toast.success(res.data.message || "Measurement submitted successfully!");
          localStorage.removeItem("measurementFormData");
          setMssrmntSbmtConfrm(false);
          setShowSizeModal(false);

        } else {
          toast.error(res?.data?.message || "Failed to add data");
        }
      } catch (error) {
        console.error("Error submitting measurement:", error);
        toast.error("Error submitting measurement!");
      } finally {
        setLoading(false);
      }
  };


  const [measurementDetails, SetmeasurementDetails] = useState({});
  useEffect(() => {
    if (!token || !productDetails?.data?.id) return;
    const fetchUserMeasurement = async () => {
      try {

        const measurresponse = await http.get(`/user/fetch-measurement-details/${productDetails?.data?.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        SetmeasurementDetails(measurresponse.data);

      } catch (error) {
        console.error("Error fetching measurement details:", error);
      }
    };

    fetchUserMeasurement();

  }, [token, productDetails?.data?.id]);


  const [pincode, setPincode] = useState("");
  const [deliveryMsg, setDeliveryMsg] = useState("");

  const handleChangePincode = async (e) => {
    e.preventDefault();

    if (!pincode) {
      setDeliveryMsg("Please enter a valid pincode!");
      return;
    }

    try {
      const res = await http.post("/check-pincode", {
        product_id: productDetails?.data?.id, 
      });

      if (res.data.success) {
        setDeliveryMsg(`Delivering to this location by, ${res.data.data}`);
        // toast.success("Delivery available!");
      } else {
        setDeliveryMsg(res.data.message);
        // toast.error("Delivery not available!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error checking pincode!");
    }
  };

  return (
    <>
      <div className="fvjhfbdf">
        <div className="derthnjmfghu">
          <div className="fgnbdfgdf">
            <div className="container-fluid">
              <div className="row">
                <div className="col-lg-6">
                  <div className="sticky-top">
                    <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                      <Row>
                        <Col xs={3} className="small-image-tabs pe-0">
                          <Nav variant="pills" className="flex-column">
                            {productDetails?.data?.product_image?.encoded_image_url_1 && (
                              <Nav.Item>
                                <Nav.Link eventKey="first">
                                  <img src={productDetails?.data?.product_image?.encoded_image_url_1} alt="" />
                                </Nav.Link>
                              </Nav.Item>
                            )}                    

                            {productDetails?.data?.product_image?.encoded_image_url_2 && (
                              <Nav.Item>
                                <Nav.Link eventKey="second">
                                  <img src={productDetails?.data?.product_image?.encoded_image_url_2} alt="" />
                                </Nav.Link>
                              </Nav.Item>
                            )}                            

                            {productDetails?.data?.product_image?.encoded_image_url_3 && (
                              <Nav.Item>
                                <Nav.Link eventKey="third">
                                  <img src={productDetails?.data?.product_image?.encoded_image_url_3} alt="" />
                                </Nav.Link>
                              </Nav.Item>
                            )}                            

                            {productDetails?.data?.product_image?.encoded_image_url_4 && (
                              <Nav.Item>
                                <Nav.Link eventKey="fourth">
                                  <img src={productDetails?.data?.product_image?.encoded_image_url_4} alt="" />
                                </Nav.Link>
                              </Nav.Item>
                            )}                            

                            {productDetails?.data?.product_image?.encoded_image_url_5 && (
                              <Nav.Item>
                                <Nav.Link eventKey="fifth">
                                  <img src={productDetails?.data?.product_image?.encoded_image_url_5} alt="" />
                                </Nav.Link>
                              </Nav.Item>
                            )}                            

                            {productDetails?.data?.product_image?.encoded_image_url_6 && (
                              <Nav.Item>
                                <Nav.Link eventKey="sixth">
                                  <img src={productDetails?.data?.product_image?.encoded_image_url_6} alt="" />
                                </Nav.Link>
                              </Nav.Item>
                            )}

                            <Nav.Item className="nijnihninerrr">
                              <Nav.Link eventKey="seventh">
                                <div className="dowenfrkwer position-relative">
                                  <video>
                                    <source src="../../images/sdaw.mp4" type="video/mp4" />
                                    Your browser does not support the video tag.
                                  </video>

                                  <div className="dnweikrwer overflow-hidden rounded-pill position-absolute">
                                    <i class="bi position-absolute bi-play-fill"></i>
                                  </div>
                                </div>
                              </Nav.Link>
                            </Nav.Item>
                          </Nav>
                        </Col>

                        <Col xs={9} className="large-image-tab">
                          <div className="doerfkwerewrewr position-relative">
                            <Tab.Content>
                              {productDetails?.data?.product_image?.encoded_image_url_1 && (
                                <Tab.Pane eventKey="first">
                                  <img
                                    src={productDetails?.data?.product_image?.encoded_image_url_1}
                                    alt=""
                                    onClick={(e) => handlePGShowModal(e, "first")}
                                    style={{ cursor: "zoom-in" }}
                                  />
                                </Tab.Pane>
                              )}
                              {productDetails?.data?.product_image?.encoded_image_url_2 && (
                                <Tab.Pane eventKey="second">
                                  <img
                                    src={productDetails?.data?.product_image?.encoded_image_url_2}
                                    alt=""
                                    onClick={(e) => handlePGShowModal(e, "second")}
                                    style={{ cursor: "zoom-in" }}
                                  />
                                </Tab.Pane>
                              )}
                              {productDetails?.data?.product_image?.encoded_image_url_3 && (
                                <Tab.Pane eventKey="third">
                                  <img
                                    src={productDetails?.data?.product_image?.encoded_image_url_3}
                                    alt=""
                                    onClick={(e) => handlePGShowModal(e, "third")}
                                    style={{ cursor: "zoom-in" }}
                                  />
                                </Tab.Pane>
                              )}
                              {productDetails?.data?.product_image?.encoded_image_url_4 && (
                                <Tab.Pane eventKey="fourth">
                                  <img
                                    src={productDetails?.data?.product_image?.encoded_image_url_4}
                                    alt=""
                                    onClick={(e) => handlePGShowModal(e, "fourth")}
                                    style={{ cursor: "zoom-in" }}
                                  />
                                </Tab.Pane>
                              )}
                              {productDetails?.data?.product_image?.encoded_image_url_5 && (
                                <Tab.Pane eventKey="fifth">
                                  <img
                                    src={productDetails?.data?.product_image?.encoded_image_url_5}
                                    alt=""
                                    onClick={(e) => handlePGShowModal(e, "fifth")}
                                    style={{ cursor: "zoom-in" }}
                                  />
                                </Tab.Pane>
                              )}
                              {productDetails?.data?.product_image?.encoded_image_url_6 && (
                                <Tab.Pane eventKey="sixth">
                                  <img
                                    src={productDetails?.data?.product_image?.encoded_image_url_6}
                                    alt=""
                                    onClick={(e) => handlePGShowModal(e, "sixth")}
                                    style={{ cursor: "zoom-in" }}
                                  />
                                </Tab.Pane>
                              )}
                              <Tab.Pane eventKey="seventh" className="odjeowmkoiwewer">
                                <video controls>
                                  <source src="../../images/sdaw.mp4" type="video/mp4" />
                                  Your browser does not support the video tag.
                                </video>
                              </Tab.Pane>
                            </Tab.Content>

                            {/* <div className="gbsdeeer dscnt-prce px-0">
                              <span className="price">30% OFF</span>
                            </div> */}
                            {(productDetails?.data?.new_arrival === "1" || productDetails?.data?.new_arrival === true) && (
                              <div className="cffdrtrvwet nw-arrvl px-0">
                                  <div className="nw-arrvl px-0">
                                    <span className="price">New Arrival</span>
                                  </div>
                              </div>
                            )}
                          </div>
                        </Col>
                      </Row>
                    </Tab.Container>
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="dfghjdfgdfgf ps-2 pt-2">
                    <div className="dsfbsdghfjs mb-1">
                      <div className="fgnjdfgfd">
                        <h2>
                          {productDetails?.data?.product_name}
                          {/* <i className="fa-solid fa-greater-than" /> */}
                        </h2>
                      </div>

                      <div className="dfhdfhd">
                        <i class="bi me-3 bi-share" onClick={() => setShareModal(!shareModal)}></i>

                        {/* <i className="fa-regular fa-heart" /> */}

                        {user ? (
                        <>
                          <i onClick={() =>
                            toggleWishlist(
                              productDetails?.data?.id
                            )
                          }
                          className={
                            wishlistIds.includes(
                              productDetails?.data?.id
                            )
                              ? "fa-solid fa-heart"
                              : "fa-regular fa-heart"
                          }
                          ></i>
                        </>
                      ) : (
                        <>
                          <Link to="/login">
                              <i class="fa-regular fa-heart"></i>
                              <i class="fa-solid d-none fa-heart"></i>
                          </Link>
                        </>
                      )}

                      </div>
                    </div>

                    <div className="fhdfgh">
                      <p className="d-flex align-items-center flex-wrap">Item ID: {productDetails?.data?.item_id} | Views {productDetails?.data?.views} <i class="bi ms-2 bi-eye"></i></p>
                    </div>

                    <div className="dfjghdfgdff58 mb-4">
                      <h4 className="d-flex mb-1">
                        <span className="discounted-price d-flex align-items-center">
                          <i class="bi bi-currency-rupee"></i> {productDetails?.data?.selling_price}
                        </span>

                        <span className="gdfg55 d-flex align-items-center ms-2">
                          <i class="bi bi-currency-rupee"></i> {productDetails?.data?.mrp_price}
                        </span>

                        <span className="fghfgg114 d-flex align-items-center ms-2">
                          {productDetails?.data?.discount}%OFF
                        </span>
                      </h4>

                      <p className="mb-0">(inclusive of all taxes)</p>
                    </div>

                    <div className="jdfbdfgdf">

                      <div class="diwenjrbwebrwehgrwer">
                        <h4 class="pb-2">Stitching Options</h4>

                        <hr class="mt-0" />
                      </div>

                      <div className="saoijhdekjwirwer row align-items-center mb-3">
                        <div className="col-lg-4 col-md-6 col-sm-6 col-6 dowekrwerwer">
                          <input type="radio" name="so" id="unstdf" className="d-none position-absolute" 
                            checked={selectedStitchOption === "stitch"}
                            onChange={() => handleStitchOptionChange("stitch")}/>
                          <label htmlFor="unstdf" className="p-3">{productDetails?.data?.stitching_option}<br /> 
                          <span>+<i class="bi bi-currency-rupee"></i>{productDetails?.data?.stiching_charges?.price ?? 0.00}
                          </span></label>
                        </div>

                        {productDetails?.data?.stitching_option !== 'Ready To Wear' && (
                            productDetails?.data?.custom_fit?.toLowerCase() === 'yes' && (
                              <div className="col-lg-4 col-md-6 col-sm-6 col-6 dowekrwerwer">
                                <input type="radio" name="so" id="cf" className="d-none position-absolute" 
                                  checked={selectedStitchOption === "customFit"}
                                  onChange={() => handleStitchOptionChange("customFit")}/>
                                <label htmlFor="cf" className="p-3" id="cstm-fit-btn">Custom-Fit <br /> 
                                <span>+<i class="bi bi-currency-rupee"></i>{productDetails?.data?.extra_charges?.price}</span></label>
                              </div>
                            )
                        )}
                      </div>
                      {productDetails?.data?.stitching_option !== 'Ready To Wear' && (
                          productDetails?.data?.custom_fit?.toLowerCase() === 'yes' && (
                            <div className="ikasdnjiknswjirhwer mb-4">
                              <p className="mb-1">Submit Measurement: <span>
                                {measurementDetails?.data ? (
                                  <Link
                                    to=""
                                    onClick={(e) => {
                                      e.preventDefault();
                                      toast.warning("Measurement details already added!");
                                    }}
                                  >
                                    CLICK HERE
                                  </Link>
                                ) : (
                                  <Link
                                    to=""
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleShowModal(e);
                                    }}
                                  >
                                    CLICK HERE
                                  </Link>
                                )}
                                </span> or <span>
                                  <Link to="">Later</Link>
                                  </span>
                                </p>
                              <p className="mb-0">+7 days, for your chosen stitching options.</p>
                            </div>
                          )
                      )}

                      {/* id="custmze-otft-btn"> */}

                      <div className="row sdfasdctgerrrrwe">
                        <div className="col-lg-5 col-md-8 col-sm-8 col-8">
                          <div className="dgndfjgdf">
                            <select
                                name="product_size"
                                id="product_size"
                                className="form-select"
                                onChange={handleSizeChange}
                                value={selectedSize}
                              >
                                <option value="">Select Size</option>
                                {productDetails?.data?.product_allSize?.map((item, index) => (
                                  <React.Fragment key={index}>
                                    <option value={item.filter_size}>{item.filter_size}</option>
                                    {item.plus_sizes && item.plus_sizes !== "0" && (
                                      <option value={item.plus_sizes}>
                                        {item.plus_sizes} 
                                
                                      </option>
                                    )}
                                  </React.Fragment>
                                ))}
                              </select>
                            <p className="mt-2">
                              {productDetails?.data?.mto_quantity <= 5 && (
                                <>Only few left</>
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="col-lg-4 col-md-4 col-sm-4 col-4">
                          <div className="dokewhkjrhuiwerwer skdncfjsdbcfksdnf">
                            <button className="btn btn-main" onClick={() => setShowSizeGuide(!showSizeGuide)}><img src="/images/ruler.png" alt="" /> Size Guide</button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="fvgndfjgf">
                      <label htmlFor="" className="me-1">
                        Qty:
                      </label>
                      <select
                        name="product_quantity"
                        id="product_quantity"
                        value={selectedQuantity}
                        onChange={(e) => handleQuantitySelect(Number(e.target.value))}
                        disabled={!availableQty}
                      >
                        {availableQty > 0 ? (
                          Array.from({ length: availableQty }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}
                            </option>
                          ))
                        ) : (
                          <option value="">Select Size First</option>
                        )}
                      </select>

                    </div>


                    {(productDetails?.data?.matching_turban === "1" || productDetails?.data?.matching_turban === true) && (
                      <div className="sadfvfghbrsd mt-4">
                        <div className="col-lg-12">
                          <div className="kcwenjkkwenkrhwer">
                            <div className="opjdjwerwer mb-3 col-lg-9 row align-items-center justify-content-between">
                              <div className="doweriwejrwer col-lg-6 col-md-8 col-sm-8 col-8">
                                <div class="checkbox-wrapper-33">
                                  <label class="checkbox">
                                    <input class="checkbox__trigger visuallyhidden" type="checkbox" checked={isTurbanChecked}
                                        onChange={(e) => setIsTurbanChecked(e.target.checked)}/>

                                    <span class="checkbox__symbol">
                                      <svg aria-hidden="true" class="icon-checkbox" width="28px" height="28px" viewBox="0 0 28 28" version="1" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4 14l8 7L24 7"></path>
                                      </svg>
                                    </span>

                                    <p class="checkbox__textwrapper">Matching Turban</p>
                                  </label>
                                </div>
                              </div>

                              <p className="chngd-price mb-0 col-lg-4 col-md-4 col-sm-4 col-4">
                                <i class="bi bi-currency-rupee"></i>
                                {productDetails?.data?.turban_charges
                                    ? productDetails?.data?.turban_charges?.price
                                    : "0.00"}
                              </p>
                            </div>

                            <div className="slkdnfkmslkmr row align-items-center">
                              <div className="col-lg-8 col-md-8 col-sm-8 col-8">
                                <select name="product_turbanSize" className="form-select" id="product_turbanSize" disabled={!isTurbanChecked}>
                                  <option selected value="">Select size</option>
                                  <option value="1">1</option>
                                </select>
                              </div>

                              <div className="col-lg-4 col-md-4 col-sm-4 col-4">
                                <p className="chrt-sze mb-0" onClick={() => setTurbanModal(!turbanModal)}><i class="fa-solid fa-maximize"></i> Size Chart</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {(productDetails?.data?.matching_stole === "1" || productDetails?.data?.matching_stole === true) && (
                      <div className="sadfvfghbrsd mt-4">
                        <div className="col-lg-12">
                          <div className="kcwenjkkwenkrhwer">
                            <div className="opjdjwerwer mb-3 row col-lg-9 align-items-center justify-content-between">
                              <div className="doweriwejrwer col-lg-6 col-md-8 col-sm-8 col-8">
                                <div class="checkbox-wrapper-33">
                                  <label class="checkbox">
                                    <input class="checkbox__trigger visuallyhidden" type="checkbox" 
                                        checked={isStoleChecked}
                                        onChange={(e) => setIsStoleChecked(e.target.checked)}/>

                                    <span class="checkbox__symbol">
                                      <svg aria-hidden="true" class="icon-checkbox" width="28px" height="28px" viewBox="0 0 28 28" version="1" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4 14l8 7L24 7"></path>
                                      </svg>
                                    </span>

                                    <p class="checkbox__textwrapper">Matching Stole</p>
                                  </label>
                                </div>
                              </div>

                              <p className="chngd-price mb-0 col-lg-4 col-md-4 col-sm-4 col-4">
                                <i class="bi bi-currency-rupee"></i>
                                {productDetails?.data?.stole_charges
                                    ? productDetails?.data?.stole_charges?.price
                                    : "0.00"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {(productDetails?.data?.matching_mojari === "1" || productDetails?.data?.matching_mojari === true) && (
                      <div className="sadfvfghbrsd mt-4">
                        <div className="col-lg-12">
                          <div className="kcwenjkkwenkrhwer">
                            <div className="opjdjwerwer mb-3 row col-lg-9 align-items-center justify-content-between">
                              <div className="doweriwejrwer col-lg-8 col-md-8 col-sm-8 col-8">
                                <div class="checkbox-wrapper-33">
                                  <label class="checkbox">
                                    <input class="checkbox__trigger visuallyhidden" type="checkbox" checked={isMojriChecked}
                                          onChange={() => setIsMojriChecked(!isMojriChecked)}/>

                                    <span class="checkbox__symbol">
                                      <svg aria-hidden="true" class="icon-checkbox" width="28px" height="28px" viewBox="0 0 28 28" version="1" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4 14l8 7L24 7"></path>
                                      </svg>
                                    </span>

                                    <p class="checkbox__textwrapper">Matching Mojri</p>
                                  </label>
                                </div>
                              </div>

                              <p className="chngd-price mb-0 col-lg-4 col-md-4 col-sm-4 col-4">
                                <i class="bi bi-currency-rupee"></i>
                                {productDetails?.data?.mojri_charges
                                    ? productDetails?.data?.mojri_charges?.price
                                    : "0.00"}
                              </p>

                              
                            </div>

                            <div className="slkdnfkmslkmr row align-items-center">
                              <div className="col-lg-8 col-md-8 col-sm-8 col-8">
                                <select name="product_mojriSize" className="form-select" id="product_mojriSize" disabled={!isMojriChecked}>
                                  <option value="" selected>Select Size</option>
                                    <option value="-- U.S. &amp; Canada ----" disabled="disabled" class="disableDdlItems">-- U.S. &amp; Canada ----</option>
                                    <option value="US Size 7.5">US Size 7.5</option>
                                    <option value="US Size 8.5">US Size 8.5</option>
                                    <option value="US Size 9.5">US Size 9.5</option>
                                    <option value="US Size 10.0">US Size 10.0</option>
                                    <option value="US Size 10.5">US Size 10.5</option>
                                    <option value="US Size 12.0">US Size 12.0</option>
                                    <option value="US Size 13.0">US Size 13.0</option>
                                    <option value="US Size 14.0">US Size 14.0</option>
                                    <option value="-- U.K. ----" disabled="disabled" class="disableDdlItems">-- U.K. ----</option>
                                    <option value="UK Size 5.0">UK Size 5.0</option>
                                    <option value="UK Size 6.0">UK Size 6.0</option>
                                    <option value="UK Size 7.0">UK Size 7.0</option>
                                    <option value="UK Size 7.5">UK Size 7.5</option>
                                    <option value="UK Size 8.0">UK Size 8.0</option>
                                    <option value="UK Size 9.5">UK Size 9.5</option>
                                    <option value="UK Size 10.5">UK Size 10.5</option>
                                    <option value="UK Size 11.5">UK Size 11.5</option>
                                    <option value="-- Europe ----" disabled="disabled" class="disableDdlItems">-- Europe ----</option>
                                    <option value="Euro Size 38">Euro Size 38</option>
                                    <option value="Euro Size 39">Euro Size 39</option>
                                    <option value="Euro Size 41">Euro Size 41</option>
                                    <option value="Euro Size  42">Euro Size  42</option>
                                    <option value="Euro Size  43">Euro Size  43</option>
                                    <option value="Euro Size  43">Euro Size  43</option>
                                    <option value="Euro Size  44">Euro Size  44</option>
                                    <option value="Euro Size  45">Euro Size  45</option>
                                    <option value="Euro Size  46.5">Euro Size  46.5</option>
                                    <option value="-- India ----" disabled="disabled" class="disableDdlItems">-- India ----</option>
                                    <option value="IN Size 5.0">IN Size 5.0</option>
                                    <option value="IN Size 6.0">IN Size 6.0</option>
                                    <option value="IN Size 7.0">IN Size 7.0</option>
                                    <option value="IN Size 7.5">IN Size 7.5</option>
                                    <option value="IN Size 8.0">IN Size 8.0</option>
                                    <option value="IN Size 9.5">IN Size 9.5</option>
                                    <option value="IN Size 10.5">IN Size 10.5</option>
                                    <option value="IN Size 11.5">IN Size 11.5</option>
                                    <option value="-- Australia ----" disabled="disabled" class="disableDdlItems">-- Australia ----</option>
                                    <option value="AU Size 6.0">AU Size 6.0</option>
                                    <option value="AU Size 7.0">AU Size 7.0</option>
                                    <option value="AU Size 8.0">AU Size 8.0</option>
                                    <option value="AU Size 8.5">AU Size 8.5</option>
                                    <option value="AU Size 9.0">AU Size 9.0</option>
                                    <option value="AU Size 10.5">AU Size 10.5</option>
                                    <option value="AU Size 11.5">AU Size 11.5</option>
                                    <option value="AU Size 12.5">AU Size 12.5</option>
                                </select>
                              </div>

                              <div className="col-lg-4 col-md-4 col-sm-4 col-4">
                                <p className="chrt-sze mb-0" onClick={() => setMojriModal(!mojriModal)}><i class="fa-solid fa-maximize"></i> Size Chart</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="dowejkrnwerwer d-flex mt-4">
                      <div className="doenwkjriwerwer">
                        <h4 className="mb-0 me-2">You Pay: <span><i class="fa-solid fa-indian-rupee-sign">
                          </i>{finalPrice.toFixed(2)}</span>
                        </h4>

                        <p class="mt-2 mb-0">(Inclusive of all services)</p>
                      </div>

                      <div className="dfgndfjhgdf">
                        <button className="btn btn-main px-4 me-3" onClick={handleAddToCart}>
                          <i class="bi bi-bag me-1"></i> Add To Cart
                        </button>

                        <button className="btn btn-main btn-transparent px-4">
                          <i class="bi bi-bag me-1"></i> Buy Now
                        </button>
                      </div>
                    </div>

                    <div className="kjidbwejgrwerwer col-lg-12 position-relative mt-5">
                      <i class="bi bi-geo-alt position-absolute"></i>



                      <form onSubmit={handleChangePincode}>
                        <input
                          type="number"
                          name="pincode"
                          className="form-control"
                          placeholder="ex. 700001"
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          style={{ paddingRight: "100px" }}
                        />

                        <button type="submit" className="btn btn-main position-absolute">
                          Change
                        </button>
                      </form>
                    </div>

                    {deliveryMsg && (
                      <div className="doiejnwkhrwer mt-4">
                        <p className="mb-1">
                          {/* Delivering to GURDASPUR by 18th July 2025. Order within
                          11h 49m */}
                          {deliveryMsg}
                        </p>
                      </div>
                    )}
                    

                    <div className="diwenjrbwebrwehgrwer mt-5">
                      <h4 className="pb-2">Customer Info</h4>

                      <hr className="mt-0" />

                      <div className="row">
                        <div className="col-lg-6">
                          <ul className="mb-0 ps-0">
                            <li>
                              {productDetails?.data?.non_returnable !== '' && (
                                <>
                                  <i className="bi me-1 bi-check2-circle"></i>
                                  {productDetails?.data?.non_returnable}
                                </>
                              )}
                            </li>
                          </ul>
                        </div>

                        <div className="col-lg-6">
                          <ul className="mb-0 ps-0">
                            <li>
                              {productDetails?.data?.premium_quality !== '' && (
                                <>
                                  <i className="bi me-1 bi-check2-circle"></i>
                                  {productDetails?.data?.premium_quality}
                                </>
                              )}
                            </li>
                          </ul>
                        </div>

                        <div className="col-lg-6">
                          <ul className="mb-0 ps-0">
                            <li>
                              {productDetails?.data?.free_shipping !== '' && (
                                <>
                                  <i className="bi me-1 bi-check2-circle"></i>
                                  {productDetails?.data?.free_shipping}
                                </>
                              )}
                            </li>
                          </ul>
                        </div>

                        <div className="col-lg-6">
                          <ul className="mb-0 ps-0">
                            <li>
                              {productDetails?.data?.personalized_styling !== '' && (
                                <>
                                  <i className="bi me-1 bi-check2-circle"></i>
                                  {productDetails?.data?.personalized_styling}
                                </>
                              )}
                              
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="diwenjrbwebrwehgrwer mt-5">
                      <h4 className="pb-2 me-2 mb-0">Offers & EMI</h4>

                      <hr className="mt-0" />

                      <div className="injdewrwer d-flex">
                        <h4 className="mb-0 me-2">Coupon Code -</h4>

                        <div className="oijdmkmeiwrew">
                          {productDetails?.data?.coupon_code && (
                            productDetails.data.coupon_code
                              .split(" , ") // Split by comma to get each coupon
                              .map((coupon, index) => { 
                                return (
                                  <div
                                    key={index}
                                    className="copn-cde text-center py-2 px-3 mb-2 me-2 rounded-2"
                                  >
                                    <h5 className="mb-0">
                                      {coupon.trim()}
                                    </h5>
                                  </div>
                                );
                              })
                          )}                         
                        </div>
                      </div>
                    </div>

                    <div className="diwenjrbwebrwehgrwer mt-5">
                      <div className="d-flex align-items-center mb-2">
                        <h4 className="pb-2 me-2 mb-0">Speak To Us</h4>

                        <div className="doiejnwkhrwer">
                          <p className="mb-0">
                            If also need it by a specific date?
                          </p>
                        </div>
                      </div>

                      <hr className="mt-0" />

                      <div className="dopwejoirjhwer row">
                        <div className="col-lg-4">
                          <button className="btn w-100 btn-main">
                            <i class="bi me-1 bi-chat-left-text"></i> Chat Now
                          </button>
                        </div>

                        <div className="col-lg-4">
                          <button className="btn w-100 btn-transparent">
                            <i class="bi me-1 bi-telephone-forward"></i> Call Us
                          </button>
                        </div>

                        <div className="col-lg-4">
                          <button className="btn w-100 btn-main">
                            <i class="bi me-1 bi-envelope"></i> Mail Us
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-9 mt-5">
                  <div className="odnwejihrwerwer mt-5">
                    <div className="dowehjkrhweirwer mb-5">
                      <div className="podmkwejrwer d-flex justify-content-between align-items-center">
                        <h4 className="mb-0">Product Descriptions</h4>

                        <i class="bi bi-chevron-down"></i>
                      </div>

                      <hr />

                      <p className="mb-4">
                        {productDetails?.data?.product_description}
                      </p>

                      <div className="dikewnirhwerjwer">
                        <Tabs
                          defaultActiveKey="specification"
                          id="uncontrolled-tab-example"
                          className="sticky-top mb-3"
                        >
                          <Tab eventKey="specification" title="Specification">
                            <div className="row">
                              <div className="col-lg-6 mb-4">
                                <div className="idnewihrwer_inner">
                                  {productDetails?.data?.no_of_component !== null && 
                                    productDetails?.data?.no_of_component !== "0" && (
                                    <div className="odjjkwehrihwerewr mb-4">
                                      <p>
                                        No of Component <br /> <span>{productDetails?.data?.no_of_component}</span>
                                      </p>
                                    </div>
                                  )}
                                  {productDetails?.data?.type_of_work !== null && 
                                    productDetails?.data?.type_of_work !== "0" && (
                                    <div className="odjjkwehrihwerewr mb-4">
                                      <p>
                                        Type of Work <br /> <span>{productDetails?.data?.type_of_work}</span>
                                      </p>
                                    </div>
                                  )}
                           
                                  {productDetails?.data?.color !== null && 
                                    productDetails?.data?.color !== "0" && (
                                    <div className="odjjkwehrihwerewr mb-4">
                                      <p>
                                        Color <br /> <span>{productDetails?.data?.color}</span>
                                      </p>
                                    </div>
                                  )}

                                  {productDetails?.data?.dupatta_color !== null &&
                                    productDetails?.data?.dupatta_color !== "0" && ( // optional: also check empty string
                                      <div className="odjjkwehrihwerewr mb-4">
                                        <p>
                                          Dupatta Color <br />
                                          <span>{productDetails?.data?.dupatta_color}</span>
                                        </p>
                                      </div>
                                  )}

                                  {productDetails?.data?.jacket_color !== null && 
                                    productDetails?.data?.jacket_color !== "0" && (
                                    <div className="odjjkwehrihwerewr mb-4">
                                      <p>
                                        Jacket Color <br />
                                        <span>
                                          {productDetails?.data?.jacket_color}
                                        </span>
                                      </p>
                                    </div>
                                  )}

                                  {productDetails?.data?.bottom_closure !== null && 
                                    productDetails?.data?.bottom_closure !== "0" && (
                                    <div className="odjjkwehrihwerewr mb-4">
                                      <p>
                                        Bottom Closure <br />
                                        <span>
                                          {productDetails?.data?.bottom_closure}
                                        </span>
                                      </p>
                                    </div>
                                  )}

                                  {productDetails?.data?.inner_lining !== null && 
                                    productDetails?.data?.inner_lining !== "0" && (
                                    <div className="odjjkwehrihwerewr mb-4">
                                      <p>
                                        Inner Lining <br />
                                        <span>
                                          {productDetails?.data?.inner_lining}
                                        </span>
                                      </p>
                                    </div>
                                  )}

                                  {productDetails?.data?.weight !== null && 
                                    productDetails?.data?.weight !== "0" && (
                                    <div className="odjjkwehrihwerewr mb-4">
                                      <p>
                                        Weight Details <br />
                                        <span>
                                          Approximate Product Weight: {productDetails?.data?.weight}
                                        </span>
                                      </p>
                                    </div>
                                  )}

                                  
                                </div>
                              </div>

                              <div className="col-lg-6 mb-4">
                                <div className="idnewihrwer_inner">
                                  {productDetails?.data?.component !== null && 
                                    productDetails?.data?.component !== "0" && (
                                    <div className="odjjkwehrihwerewr mb-4">
                                      <p>
                                        Components <br /> <span>{productDetails?.data?.component}</span>
                                      </p>
                                    </div>
                                  )}

                                  {productDetails?.data?.occasion !== null && 
                                    productDetails?.data?.occasion !== "0" && (
                                    <div className="odjjkwehrihwerewr mb-4">
                                      <p>
                                        Occasions <br /> <span>Suitable for {productDetails?.data?.occasion}</span>
                                      </p>
                                    </div>
                                  )}

                                  {productDetails?.data?.celebrity !== null && 
                                    productDetails?.data?.celebrity !== "0" && (
                                    <div className="odjjkwehrihwerewr mb-4">
                                      <p>
                                        Celebrity <br /> <span>{productDetails?.data?.celebrity}</span>
                                      </p>
                                    </div>
                                  )}

                                  {productDetails?.data?.pattern !== null && 
                                    productDetails?.data?.pattern !== "0" && (
                                    <div className="odjjkwehrihwerewr mb-4">
                                      <p>
                                        Pattern <br /> <span>{productDetails?.data?.pattern}</span>
                                      </p>
                                    </div>
                                  )}

                                  {productDetails?.data?.fabric !== null && 
                                    productDetails?.data?.fabric !== "0" && (
                                    <div className="odjjkwehrihwerewr mb-4">
                                      <p>
                                        Material <br /> <span>{productDetails?.data?.fabric}</span>
                                      </p>
                                    </div>
                                  )}

                                  {productDetails?.data?.fit_type !== null && 
                                   productDetails?.data?.fit_type !== "0" && (
                                    <div className="odjjkwehrihwerewr mb-4">
                                      <p>
                                        Fit <br /> <span>Fit: {productDetails?.data?.fit_type}</span>
                                      </p>
                                    </div>
                                  )}

                                  {productDetails?.data?.care_instruction !== null && 
                                    productDetails?.data?.care_instruction !== "0" && (
                                    <div className="odjjkwehrihwerewr mb-4">
                                      <p>
                                        Care Instruction <br /> <span> {productDetails?.data?.care_instruction}</span>
                                      </p>
                                    </div>
                                  )}

                                </div>
                              </div>

                              <div className="col-lg-12">
                                <div className="idnewihrwer_inner dsclmer p-3">
                                  <div className="odjjkwehrihwerewr">
                                    <p className="mb-0">
                                      Disclaimer <br />{" "}
                                      <span>
                                        Color of the actual product may vary from
                                        the image. These are made to order
                                        designer styles, hence expect a slight
                                        variation from the image displayed.
                                      </span>
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Tab>
                        </Tabs>
                      </div>
                    </div>

                    <div className="dowehjkrhweirwer mlkdfgmlkmlkmlk">
                      <div className="podmkwejrwer d-flex justify-content-between align-items-center">
                        <h4 className="mb-0">Shipping & Returns</h4>

                        <i class="bi bi-chevron-down"></i>
                      </div>

                      <hr className="mb-4" />

                      <h6>Shipping & Returns</h6>

                      <p className="mb-1">
                        Product will be shipped by {getEstimatedShippingDate(
                                      productDetails?.data?.shipping_time
                                    )} 
                      </p>

                      <p className="mb-3">
                        For customizations & early delivery, chat with us on
                        WhatsApp at <a href="/">+91 8291990059</a> or call us at 
                        <a href="/">022-42792123</a>
                      </p>

                      <p className="mb-2">Return Policy</p>

                      <p>
                        This product is non-returnable.
                        <Link to="/return-policy">More Details</Link>
                      </p>
                    </div>

                    <p className="mb-1">Manufactured/Packed & Marketed By-</p>

                    <p className="mb-0"><b>VinHem Fashion Pvt Ltd, Assembled in india</b></p>

                  </div>
                </div>

                <div className="col-lg-3 mt-5">
                  <div className="odnwejihrwerwer sticky-top mt-5">
                    <div className="dowehjkrhweirwer mb-5">
                      <div className="podmkwejrwer">
                        <h4 className="mb-0">Matching Products</h4>
                      </div>

                      <hr />

                      <div className="coisdefisdhifhsdjifjhosd" style={{ height: '100vh' }}>
                        <Swiper
                          modules={[Autoplay, Pagination, Navigation, Mousewheel]}
                          direction="vertical"
                          slidesPerView={4}
                          spaceBetween={30}
                          loop={true}
                          mousewheel={true}
                          pagination={{ clickable: true }}
                          navigation={true}
                          autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                          }}
                          className="mySwiper"
                          style={{ height: "100%" }}
                        >
                          {productDetails?.data?.matching_product.map((matchingProduct) => (
                            <SwiperSlide key={matchingProduct.id}>
                              <div className="dfgjhbdfg sdfvdscsddfgdfg p-2 mb-3">
                                <Link to={`/products/${matchingProduct.slug}`}>
                                <div className="images">
                                  <div className="image d-flex position-relative">
                                    <div className="doiewjkrniuwewer position-relative col-lg-4 overflow-hidden">
                                      <img src={matchingProduct?.encoded_image_url_2} alt={matchingProduct.product_name}/>

                                      <img className="first" src={matchingProduct?.encoded_image_url_1} alt={matchingProduct.product_name} />
                                    </div>

                                    <div className="fdbdfgdfgdf col-lg-8">
                                      <h4>{matchingProduct.product_name}</h4>

                                      <h5>{new Intl.NumberFormat("en-IN", {
                                            style: "currency",
                                            currency: "INR",
                                            maximumFractionDigits: 0,
                                          }).format(matchingProduct.selling_price)}</h5>
                                    </div>
                                  </div>
                                </div>
                                </Link>
                              </div>
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-12">
                  <div className="diweurbhwer_inner mt-4">
                    <div className="dfbgghdfdfgdf">
                      <div className="sdf58sdfs">
                        <h4 className="pb-2">Similar Items</h4>
                      </div>

                      <div className="fgjhdfgdfgdf py-4">
                        <Swiper {...swiperConfig}>
                          {productDetails?.data?.similar_product.map((featuredProduct) => (
                            <SwiperSlide key={featuredProduct.id}>
                              <FeaturedProducts featuredProduct={featuredProduct} />
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-12">
                  <div className="diweurbhwer_inner mt-4">
                    <div className="dfbgghdfdfgdf">
                      <div className="sdf58sdfs">
                        <h4 className="pb-2">Customer Also Viewed</h4>
                      </div>

                      <div className="fgjhdfgdfgdf py-4">
                        <Swiper {...swiperConfig}>
                          {/* {featuredProducts.map((featuredProduct) => (
                            <SwiperSlide key={featuredProduct.id}>
                              <FeaturedProducts
                                featuredProduct={featuredProduct}
                              />
                            </SwiperSlide>
                          ))} */}
                        </Swiper>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-12">
                  <div className="diweurbhwer_inner mt-4">
                    <RecentlyViewed />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr />


      <MeasurementForm mssrmntSbmtConfrm={mssrmntSbmtConfrm} setMssrmntSbmtConfrm={setMssrmntSbmtConfrm} showSizeModal={showSizeModal} setShowSizeModal={setShowSizeModal} productDetails={productDetails} />


      {/* size guide size */}

      <div className={`${showSizeGuide ? "size-guide-modal-backdrop" : "size-guide-modal-backdrop size-guide-modal-backdrop-hide"} w-100 h-100 position-fixed`}></div>

      <div className={`${showSizeGuide ? "size-guide-modal" : "size-guide-modal size-guide-modal-hide"} position-fixed bg-white`}>
        <div className="size-guide-modal-header d-flex align-items-center justify-content-between px-4 py-3">
          <h4 className="mb-1">Size Chart for {productDetails?.data?.product_category}</h4>

          <i class="fa-solid fa-xmark" onClick={() => setShowSizeGuide(false)}></i>
        </div>

        <div className="dkewhrwerwer px-4 py-3">
          <div className="dkjjenwjknkweh">
            <div className="row align-items-center">
              <div className="col-lg-3 mb-3">
                <div className="diewnrjhwerwer">
                  <img src={productDetails?.data?.encoded_image_url_1} alt="" />
                </div>
              </div>

              <div className="col-lg-9">
                <div className="dlowenjkrnwkeh">
                  <ul>
                    <li className="mb-3">If your bare chest size measurement is 40 inches, you should select size 40 only from the product page. The "Top
                      Chest" attribute in the size chart refers to the garment's chest size. It is inclusive of the required 3 to 4 inches
                      loosening, to ensure the right fit.</li>

                    <li>If your bare chest measurement falls between 2 sizes i.e. 37 inches, you should select size 38.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="doenwkhrkwenjkrwer">
            <DesignerSizeChart productDetails={productDetails}/>
          </div>
        </div>
      </div>

      {/* mssrmnt sbmt cnfrmtn */}

      <div className={`${mssrmntSbmtConfrm ? "mssrmnt-sbmt-modal-backdrop" : "mssrmnt-sbmt-modal-backdrop mssrmnt-sbmt-modal-backdrop-hide"} w-100 h-100 position-fixed`}></div>

      <div className={`${mssrmntSbmtConfrm ? "mssrmnt-sbmt-modal" : "mssrmnt-sbmt-modal mssrmnt-sbmt-modal-hide"} position-fixed bg-white`}>
        <div className="size-guide-modal-header d-flex align-items-center justify-content-end px-4 py-2">
          {/* <h4 className="mb-0"></h4> */}

          <i class="fa-solid fa-xmark" onClick={() => setMssrmntSbmtConfrm(false)}></i>
        </div>

        <div className="dkewhrwerwer px-4 py-3">
          <div className="dkjjenwjknkweh text-center">
            <h4>Once submitted then cannot be changed</h4>

            <p>Do you want to proceed?</p>

            <div className="dfsfdtgrefcd row align-items-center justify-content-between">
              <div className="col-lg-5 mb-3">
                <button
                  className="btn btn-main w-100"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Yes, Proceed"}
                </button>
              </div>

              <div className="col-lg-5 mb-3">
                <button onClick={() => setMssrmntSbmtConfrm(false)} className="btn btn-main w-100">Edit</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* share modal */}

      <div className={`${shareModal ? "share-social-modal-backdrop" : "share-social-modal-backdrop share-social-modal-backdrop-hide"} w-100 h-100 position-fixed`}></div>

      <div className={`${shareModal ? "share-social-modal" : "share-social-modal share-social-modal-hide"} position-fixed bg-white`}>
        <div className="s-s-m-header d-flex align-items-center justify-content-between p-3 border-bottom">
          <h4 className="mb-0">Share</h4>

          <i class="bi bi-x-lg" onClick={() => setShareModal(false)}></i>
        </div>

        <div className="s-s-m-options d-flex p-3 align-items-center justify-content-center">
          <div className="dmnewknoirwer me-3 whtsapp-icon position-relative rounded-pill">
            <i class="bi position-absolute fa-2x text-white bi-whatsapp" onClick={handleWhatsAppShare}></i>
          </div>

          <div className="dmnewknoirwer me-3 facebook-icon position-relative rounded-pill">
            <i class="fa-brands position-absolute fa-2x text-white fa-facebook-f" onClick={handleFacebookShare}></i>
          </div>

          <div className="dmnewknoirwer instagram-icon position-relative rounded-pill">
            <i class="bi position-absolute fa-2x text-white bi-instagram" onClick={handleInstagramShare}></i>
          </div>
        </div>
      </div>

      {/* turbon chart size */}

      <div className={`${turbanModal ? "turbon-chart-modal-backdrop" : "turbon-chart-modal-backdrop turbon-chart-modal-backdrop-hide"} w-100 h-100 position-fixed`}></div>

      <div className={`${turbanModal ? "turbon-chart-modal" : "turbon-chart-modal turbon-chart-modal-hide"} position-fixed bg-white`}>
        <div className="s-s-m-header d-flex align-items-center justify-content-between p-3 border-bottom">
          <h4 className="mb-0">Turbon Chart Size</h4>

          <i class="bi bi-x-lg" onClick={() => setTurbanModal(false)}></i>
        </div>

        <div className="s-s-m-options p-3 align-items-center justify-content-center">
          <img src="/images/turban.jpg" className="img-fluid" alt="" />
        </div>
      </div>
      

      {/* mojri chart size */}

      <div className={`${mojriModal ? "mojri-chart-modal-backdrop" : "mojri-chart-modal-backdrop mojri-chart-modal-backdrop-hide"} w-100 h-100 position-fixed`}></div>

      <div className={`${mojriModal ? "mojri-chart-modal" : "mojri-chart-modal mojri-chart-modal-hide"} position-fixed bg-white`}>
        <div className="s-s-m-header d-flex align-items-center justify-content-between p-3 border-bottom">
          <h4 className="mb-0">Mojri Chart Size</h4>

          <i class="bi bi-x-lg" onClick={() => setMojriModal(false)}></i>
        </div>

        <div className="s-s-m-options p-3 align-items-center justify-content-center">
          <img src="/images/mojri.jpg" className="img-fluid" alt="" />
        </div>
      </div>

      
      {/*pd gllery*/}

      {/* --- Modal with Zoom --- */}
      <Modal
          show={showModal}
          onHide={handlePGClose}
          centered
          size="xl"
          className="zoom-gallery-modal overflow-hidden"
        >
        <Modal.Body className="mt-0 p-0 ps-3">
          <Tab.Container activeKey={activeKey} onSelect={setActiveKey}>
            <Row className="sdgdffwesfdf">
              <Col lg={1} className="small-image-tabs pt-1 pe-0">
                <Nav variant="pills" className="flex-column">
                  {productDetails?.data?.product_image?.encoded_image_url_1 && (
                    <Nav.Item>
                      <Nav.Link eventKey="first">
                        <img
                          src={productDetails?.data?.product_image?.encoded_image_url_1}
                          alt=""
                        />
                      </Nav.Link>
                    </Nav.Item>
                  )}
                  {productDetails?.data?.product_image?.encoded_image_url_2 && (
                    <Nav.Item>
                      <Nav.Link eventKey="second">
                        <img
                          src={productDetails?.data?.product_image?.encoded_image_url_2}
                          alt=""
                        />
                      </Nav.Link>
                    </Nav.Item>
                  )}
                  {productDetails?.data?.product_image?.encoded_image_url_3 && (
                    <Nav.Item>
                      <Nav.Link eventKey="third">
                        <img
                          src={productDetails?.data?.product_image?.encoded_image_url_3}
                          alt=""
                        />
                      </Nav.Link>
                    </Nav.Item>
                  )}
                  {productDetails?.data?.product_image?.encoded_image_url_4 && (
                    <Nav.Item>
                      <Nav.Link eventKey="fourth">
                        <img
                          src={productDetails?.data?.product_image?.encoded_image_url_4}
                          alt=""
                        />
                      </Nav.Link>
                    </Nav.Item>
                  )}
                  {productDetails?.data?.product_image?.encoded_image_url_5 && (
                    <Nav.Item>
                      <Nav.Link eventKey="fifth">
                        <img
                          src={productDetails?.data?.product_image?.encoded_image_url_5}
                          alt=""
                        />
                      </Nav.Link>
                    </Nav.Item>
                  )}
                  {productDetails?.data?.product_image?.encoded_image_url_6 && (
                    <Nav.Item>
                      <Nav.Link eventKey="sixth">
                        <img
                          src={productDetails?.data?.product_image?.encoded_image_url_6}
                          alt=""
                        />
                      </Nav.Link>
                    </Nav.Item>
                  )}
                </Nav>
              </Col>

              <Col lg={11} className="large-image-tab">
                <Tab.Content className="ps-2">
                  {productDetails?.data?.product_image?.encoded_image_url_1 && (
                    <Tab.Pane eventKey="first">
                      <Zoom>
                        <img
                          src={productDetails?.data?.product_image?.encoded_image_url_1}
                          alt=""
                          className="zoom-img"
                        />
                      </Zoom>
                    </Tab.Pane>
                  )}
                  {productDetails?.data?.product_image?.encoded_image_url_2 && (
                    <Tab.Pane eventKey="second">
                      <Zoom>
                        <img
                          src={productDetails?.data?.product_image?.encoded_image_url_2}
                          alt=""
                          className="zoom-img"
                        />
                      </Zoom>
                    </Tab.Pane>
                  )}
                  {productDetails?.data?.product_image?.encoded_image_url_3 && (
                    <Tab.Pane eventKey="third">
                      <Zoom>
                        <img
                          src={productDetails?.data?.product_image?.encoded_image_url_3}
                          alt=""
                          className="zoom-img"
                        />
                      </Zoom>
                    </Tab.Pane>
                  )}
                  {productDetails?.data?.product_image?.encoded_image_url_4 && (
                    <Tab.Pane eventKey="fourth">
                      <Zoom>
                        <img
                          src={productDetails?.data?.product_image?.encoded_image_url_4}
                          alt=""
                          className="zoom-img"
                        />
                      </Zoom>
                    </Tab.Pane>
                  )}
                  {productDetails?.data?.product_image?.encoded_image_url_5 && (
                    <Tab.Pane eventKey="fifth">
                      <Zoom>
                        <img
                          src={productDetails?.data?.product_image?.encoded_image_url_5}
                          alt=""
                          className="zoom-img"
                        />
                      </Zoom>
                    </Tab.Pane>
                  )}
                  {productDetails?.data?.product_image?.encoded_image_url_6 && (
                    <Tab.Pane eventKey="sixth">
                      <Zoom>
                        <img
                          src={productDetails?.data?.product_image?.encoded_image_url_6}
                          alt=""
                          className="zoom-img"
                        />
                      </Zoom>
                    </Tab.Pane>
                  )}
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </Modal.Body>

        <button className="close-btn" onClick={handlePGClose}>
          ✕
        </button>
      </Modal>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        style={{ zIndex: 9999999999 }}
      />
    </>
  );
};
