import { useEffect, useState } from "react";
import { Link, useNavigate , useLocation } from "react-router-dom";
import "./Css/Filter.css";
import "./Css/FilterResponsive.css";
import http from "../../http";
import { useAuth } from "../../context/AuthContext";
import { ToastContainer } from "react-toastify";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import FilterSection from "./FilterSection";
import { useFilter } from "../../context/FilterContext";

export const Filter = () => {
  const { user } = useAuth();
  const location = useLocation();
    // eslint-disable-next-line
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products, initialProductList, setSortBy, setNewArrival, setReadyToShip, setCstmFit, setOnSale, resetFilter, onSale, newIn, readyToShip, cstmFit } = useFilter();
  // eslint-disable-next-line
  const [viewType, setViewType] = useState(false);
  const [resFltrMenu, setResFltrMenu] = useState(false);
  // eslint-disable-next-line
  const [allProductdata, SetallProduct] = useState([]);
  const [allFilterMappingdata, SetallFilterMappingdata] = useState([]);
  const [filterCategories, setFilterCategories] = useState([]);

  const search = useLocation().search;
  const searchTerm = new URLSearchParams(search).get("search")?.trim() || "";  
  
  console.log(products);

  const toTitleCase = (s = "") =>
  s
    .toString()
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();

  //Res Filter Page No-scroll
  useEffect(() => {
    const body = document.querySelector("html");

    resFltrMenu
      ? body.classList.add("overflow-hidden")
      : body.classList.remove("overflow-hidden");
  }, [resFltrMenu]);

  // const handleFilterChange = (value) => {
  //   navigate(`/${value}`);
  // };


    const segments = location.pathname.split("/").filter(Boolean);
    let category = null;
    let subcategory = null;

    if (segments.length === 1) {
      category = segments[0];
    } else if (segments.length >= 2) {
      category = segments[0];
      subcategory = segments[1];
    }


  useEffect(() => {
    const fetchAllProduct = async () => {
      try {
        const response = await http.post("/fetch-product", { category, subcategory });

        const allProducts = response.data.data.all_product || [];
        
        const normalizedSearch = searchTerm.toLowerCase();

        const filteredProducts = searchTerm 
          ? allProducts.filter(product => {
            const name = product.product_name?.toLowerCase() || "";

            return normalizedSearch.split(/\s+/).every(term => name.includes(term));
          })
          : allProducts;

        initialProductList(filteredProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchAllProduct();
    // eslint-disable-next-line
  }, [location.pathname, category, subcategory, searchTerm]);

  // console.log(searchTerm)


  const { wishlistIds, addToWishlist, removeFromWishlist } = useWishlist(); // ✅ from context

  const toggleWishlist = (productId) => {
      if (wishlistIds.includes(productId)) {
      removeFromWishlist(productId);
      } else {
      addToWishlist(productId);
      }
  };

  useEffect(() => {
    const fetchFilterMapping = async () => {
      try {
        // Send to API
        const response = await http.post("/fetch-filter-details", {
          category,
          subcategory,
        });

        SetallFilterMappingdata(response.data.data);
        setFilterCategories(response.data.categoryData);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchFilterMapping();
  }, [location.pathname, category, subcategory]);


  return (
    <div className="filter-wrapper pt-2">
      <div className="container-fluid">
        <div className="breadcrumb">
          <ul className="ps-0 mb-0">
            <li>
              <Link to="/">Home</Link>
            </li>
            {category && (
              <>
                <li className="mx-2">/</li>
                <li>
                  <Link to={`/${category}`}>{category}</Link>
                </li>
              </>
            )}
            {subcategory && (
              <>
                <li className="mx-2">/</li>
                <li>
                  <Link to={`/${category}/${subcategory}`}>{subcategory}</Link>
                </li>
              </>
            )}
          </ul>
        </div>

        <div className="alosjdjkhrjfse">
          <h4 className="mb-0">
            {category === "all-produtcs"
            ? "All Products"
            : subcategory
              ? `${toTitleCase(subcategory)} For ${toTitleCase(category)}`
              : `All Products For ${toTitleCase(category)}`}
          <span> - Showing {products?.length ?? 0} Results</span>
          </h4>
        </div>

        <div
          className="advtsmnt-bnnr my-4 overflow-hidden"
          style={{ borderRadius: "1rem" }}
        >
          {allProductdata?.filter_banner
            ? (
                <img
                  src={`${allProductdata?.banner_image_url}/${allProductdata?.filter_banner?.image ?? ""}`}
                  className="img-fluid"
                  alt=""
                />
              )
            : (
                <img
                  src="images/fltrdbnnr.png"
                  className="img-fluid"
                  alt=""
                />
              )}
          {/* <img src="images/fltrdbnnr.png" className="img-fluid" alt="" /> */}
        </div>

        {resFltrMenu && (
          <div
            className="res-fltr-bckdrp position-fixed w-100 h-100"
            onClick={() => setResFltrMenu(false)}
          ></div>
        )}

        <div className="row mt-5">
          <div className="col-lg-3">
            <div className="filter-options">
              <div className="oidenjwihrwer mb-4 d-flex align-items-center justify-content-between">
                <h5
                  className="mb-0"
                  id="res-filtr-btn"
                  onClick={() => setResFltrMenu(true)}
                >
                  <i class="fa-solid me-1 fa-filter"></i> Filter
                </h5>

                <h6 onClick={() => resetFilter()} className="mb-0">Reset Filter</h6>
              </div>

              <div
                className={`saojdkjierwerwer ${
                  resFltrMenu ? "" : "res-filtr-nav-hide"
                }`}
                id="res-filtr-nav"
              >
              <FilterSection allFilterMappingdata={allFilterMappingdata} filterCategories={filterCategories} />
              </div>
            </div>
          </div>

          <div className="col-lg-9">
            <div className="filtered-products">
              <div className="iduhweihriweurwerwer row align-items-center pb-3">
                <div className="col-lg-9">
                  <div className="idasijhdmsiejr d-flex align-items-center">
                    {/* <div className="view-options d-none me-3 align-items-center">
                      <div
                        className={`grid-view me-1 ${!viewType ? "active" : ""}`} onClick={() => setViewType(!viewType)}
                      >
                        <i class="bi bi-grid-3x3-gap"></i>
                      </div>

                      <div
                        className={`list-view ${viewType ? "active" : ""}`}
                        onClick={() => setViewType(!viewType)}
                      >
                        <i class="bi bi-card-list"></i>
                      </div>
                    </div> */}
                    <div className="doewnkrhwer">
                      <input type="checkbox" className="d-none" id="huidweujr" name="djikeiewr" checked={newIn} onChange={(e) => setNewArrival(e.target.checked)} />

                      <label htmlFor="huidweujr" className="btn btn-main me-1">
                        <i className="bi me-1 bi-plus-circle-dotted"></i> New
                      </label>
                    </div>

                    <div className="doewnkrhwer">
                      <input type="checkbox" className="d-none" id="daedfweweer" name="djikeiewr" value="READY TO SHIP" checked={readyToShip} onChange={(e) => setReadyToShip(e.target.checked ? e.target.value : null)}/>

                      <label htmlFor="daedfweweer" className="btn btn-main me-1">
                        <i className="bi me-1 bi-lightning-charge"></i> Ready to Ship
                      </label>
                    </div>

                    <div className="doewnkrhwer">
                      <input type="checkbox" name="djikeiewr" className="d-none" id="gfdewerwr" checked={onSale} onChange={(e) => setOnSale(e.target.checked)}/>
                      
                      <label
                        htmlFor="gfdewerwr"
                        className="btn btn-main me-1"
                      >
                        <i class="bi me-1 bi-receipt"></i> On Sale
                      </label>
                    </div>

                    <div className="doewnkrhwer">
                      <input type="checkbox" name="djikeiewr" className="d-none" id="asddettt" checked={cstmFit} onChange={(e) => setCstmFit(e.target.checked)}/>

                      <label htmlFor="asddettt" className="btn btn-main me-1">
                        <i class="bi me-1 bi-vignette"></i>  Custom-fit
                      </label>
                    </div>                    
                  </div>
                </div>

                <div className="col-lg-3">
                  <div className="podwejorjwierwer">
                    <select name="" className="form-select" id="" onChange={(e) => setSortBy(e.target.value)}>
                      <option value="" selected disabled>
                        Sort By: Recommended
                      </option>
                      
                      {/* <option value="">Popularity</option> */}

                      <option value="NEW_ARRIVALS">New Arrivals</option>

                      <option value="LOW_TO_HIGH">Price Low to High</option>

                      <option value="HIGH_TO_LOW">Price High to Low</option>

                      <option value="DISCOUNT_LOW_TO_HIGH">Discount Low to High</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="products-wrapper filtr-wrppr mt-3">
                <div className="row">
                  {products?.length > 0 ? (
                    products?.map((product) => (
                      <div className={`smdflcsdlpfkselkrpr ${!viewType ? "col-lg-4" : "col-lg-12"} mb-4`}>
                        <div className="dfgjhbdfg">
                          <div className="images">
                            <div className="image row mx-0 position-relative">
                              {onSale && product?.discount && (
                                <div className="dscnt-prce px-0">
                                  <span className="price">{product?.discount}% <br/> OFF</span>
                                </div>
                              )}

                              {newIn && (product?.new_arrival === "1" || product?.new_arrival === true) && (
                                <div className="nw-arrvl px-0">
                                  <span className="price"><i>NEW IN</i></span>
                                </div>
                              )}

                              <div className={`doiewjkrniuwewer position-relative overflow-hidden ${!viewType ? "col-lg-12" : "col-lg-3"}`}>
                                <Link to={`/products/${product.slug}`}>
                                  <img
                                    src={product?.encoded_image_url_1}
                                    alt={product.product_name}
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
                                        onClick={() => addToCart(product.id)}
                                      >
                                        <i class="fa-solid fa-cart-arrow-down"></i>
                                      </button>
                                      <button
                                        onClick={() => toggleWishlist(product.id)}
                                      >
                                        <i
                                          className={
                                            wishlistIds.includes(product.id)
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

                              <div className={`fdbdfgdfgdf ${ !viewType ? "col-lg-12 px-1" : "col-lg-9"}`}>
                                <h6><i class="bi me-1 bi-truck"></i> Ships in {product.shipping_time}</h6>

                                {product.product_category === "READY TO SHIP" && (
                                  <h6><i class="bi me-1 bi-rocket-takeoff"></i> Ready to ship</h6>
                                )}

                                {(product.best_seller === '1' || product.best_seller === true) && (
                                  <h6><i class="bi bi-lightning-charge"></i> Best Seller</h6>
                                )}                             

                                <h4>{product.product_name}</h4>

                                <div className="d-flex flex-wrap align-items-center">
                                  <h5 className="mb-0">
                                    {new Intl.NumberFormat("en-IN", {
                                      style: "currency",
                                      currency: "INR",
                                      maximumFractionDigits: 0,
                                    }).format(product.selling_price)}
                                  </h5>

                                  <span class="gdfg55 d-flex align-items-center ms-2"><i class="bi bi-currency-rupee"></i> {product.mrp_price}</span>

                                  <span class="fghfgg114 d-flex align-items-center ms-2">{product?.discount}%OFF</span>
                                </div>

                                <div className="dlksfskjrewrwere d-flex align-items-center justify-content-between mt-5">
                                  <div className="doikwenirnwekhrwer position-relative">
                                    {user ? (
                                      <>
                                        <button
                                          className="btn-cart mb-1 me-1"
                                          type="button"
                                          onClick={() => addToCart(product.id)}
                                        >
                                          <i class="fa-solid fa-cart-arrow-down"></i>
                                        </button>
                                        <button
                                          onClick={() =>
                                            toggleWishlist(product.id)
                                          }
                                        >
                                          <i
                                            className={
                                              wishlistIds.includes(product.id)
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
                      </div>
                    ))
                  ) : (
                    <div className="col-12 text-center py-5">
                      <h5>No products found for your search.</h5>
                      
                      <p>Try changing your search or browse other categories.</p>
                    </div>
                  ) }
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="idwejrhewres pb-5 mt-5">
          <div
            className="pt-4"
            dangerouslySetInnerHTML={{
              __html: allProductdata?.filter_content?.description && (allProductdata?.filter_content.description),
            }}
          />
        </div>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          style={{ zIndex: 9999999999 }}
        />
      </div>
    </div>
  );
};
