  // eslint-disable-next-line
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import { SwiperSlide } from 'swiper/react';
import { useAuth } from "../../../context/AuthContext";
import { DropdownLoggedIn } from "../../Elements/Dropdown/DropdownLoggedIn";
import http from "../../../http";
import Logo from "../../../assets/images/logo.png";

import "./Css/Header.css";
import "./Css/HeaderResponsive.css";
import 'swiper/css';
import { useCart } from "../../../context/CartContext";
import { useWishlist } from "../../../context/WishlistContext";
import { useCurrency } from "../../../context/CurrencyContext";

export const Header = ({ shouldHideHeader, shouldHideFullHeaderFooterRoutes }) => {
  const [resMenu, setResMenu] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [searchBarToggle, setSearchBarToggle] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { selectedCurrency, setSelectedCurrency } = useCurrency();
  const pathName = useLocation().pathname;
  const navigate = useNavigate();
  const searchRef = useRef(null);

  /*search*/

  const handleSearch = (e) => {
    e.preventDefault();
    const searchValue = searchRef.current?.value?.trim();

    searchValue && navigate(`/all-products?search=${encodeURIComponent(searchValue)}`);
    
    searchRef.current.value = "";
  }

  useEffect(() => {
    const body = document.querySelector("html");

    if (resMenu) {
      body.classList.add("overflow-hidden");
    } else {
      body.classList.remove("overflow-hidden");
    }
  }, [resMenu]);

  const { user } = useAuth();

  const [mainCategory, SetmainCategory] = useState([]);
  const [currency, Setcurrency] = useState([]);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

  useEffect(() => {
      const fetchMainCategory = async () => {
          try {
              const getresponse = await http.get("/product-category");
              const allresponse = getresponse.data;
              SetmainCategory(allresponse.data); 
          } catch (error) {
              console.error("Error fetching main category:", error);
          }
      };

      fetchMainCategory();
  }, []);

  useEffect(() => {
    const fetchCurrency = async () => {
        try {
            const getresponse = await http.get("/get-currency-content");
            const allresponse = getresponse.data;
            Setcurrency(allresponse.data || []); 

            const defaultCurrency = allresponse.data?.find(c => c.choice === 1);
            if (defaultCurrency) {
              setSelectedCurrency(defaultCurrency);
            }

        } catch (error) {
            console.error("Error fetching currency:", error);
        }
    };
    fetchCurrency();
  }, [setSelectedCurrency]);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  useEffect(() => {
    setUserDropdown(false);
  }, [pathName]);


  const getCountryCode = (currencyCode) => {
    if (!currencyCode) return "un"; // fallback if null/undefined

    const mapping = {
      USD: "us", // United States 🇺🇸
      EUR: "eu", // European Union 🇪🇺
      GBP: "gb", // United Kingdom 🇬🇧
      CAD: "ca", // Canada 🇨🇦
      AFN: "af", // Afghanistan 🇦🇫
      INR: "in", // India 🇮🇳
      AUD: "au", // Australia 🇦🇺
      AED: "ae", // United Arab Emirates 🇦🇪
      SGD: "sg", // Singapore 🇸🇬
      JPY: "jp", // Japan 🇯🇵
      CNY: "cn", // China 🇨🇳
      NZD: "nz", // New Zealand 🇳🇿
      CHF: "ch", // Switzerland 🇨🇭
      ZAR: "za", // South Africa 🇿🇦
      SEK: "se", // Sweden 🇸🇪
      NOK: "no", // Norway 🇳🇴
      DKK: "dk", // Denmark 🇩🇰
      HKD: "hk", // Hong Kong 🇭🇰
      MYR: "my", // Malaysia 🇲🇾
      THB: "th", // Thailand 🇹🇭
      PKR: "pk", // Pakistan 🇵🇰
      BDT: "bd", // Bangladesh 🇧🇩
      LKR: "lk", // Sri Lanka 🇱🇰
    };

    // Normalize input and return mapped country code, default to UN flag
    return mapping[currencyCode.toUpperCase()] || "un";
  };


  return (
    <>
      { !shouldHideFullHeaderFooterRoutes && (
        <header>
          <div className="advertisement-slider position-relative" style={{background: "url('/images/csadad.jpg') no-repeat", backgroundPosition: "top", backgroundSize: "cover"}}>
          <div className="marquee-container">
            <div className="marquee-track marquee-left">
              <div className="scroll-card">
                <p className="mb-0"><a href="/">SUMMER SALE: UP TO 70% OFF SELECTED ITEMS</a></p>
              </div>

              <div className="scroll-card">
                <p className="mb-0"><a href="/">SUMMER SALE: UP TO 70% OFF SELECTED ITEMS</a></p>
              </div>

              <div className="scroll-card">
                <p className="mb-0"><a href="/">SUMMER SALE: UP TO 70% OFF SELECTED ITEMS</a></p>
              </div>

              <div className="scroll-card">
                <p className="mb-0"><a href="/">SUMMER SALE: UP TO 70% OFF SELECTED ITEMS</a></p>
              </div>

              <div className="scroll-card">
                <p className="mb-0"><a href="/">SUMMER SALE: UP TO 70% OFF SELECTED ITEMS</a></p>
              </div>

              <div className="scroll-card">
                <p className="mb-0"><a href="/">SUMMER SALE: UP TO 70% OFF SELECTED ITEMS</a></p>
              </div>

              <div className="scroll-card">
                <p className="mb-0"><a href="/">SUMMER SALE: UP TO 70% OFF SELECTED ITEMS</a></p>
              </div>

              <div className="scroll-card">
                <p className="mb-0"><a href="/">SUMMER SALE: UP TO 70% OFF SELECTED ITEMS</a></p>
              </div>
            </div>
          </div>
          </div>

          <div className={`header-sticky-wrapper ${isSticky ? "is-fixed-top" : ""} ${shouldHideHeader ? "d-none" : ""}`}>
            <div className="doiemwokjrmwewer w-100">
              { !shouldHideHeader && (
              <div className="header-top py-1">
                <div className="container-fluid">
                  <div className="row align-items-center">
                    <div className="col-lg-2">
                      <div className="doeiwhrkwdeor">
                        <Link to="/"><img src={Logo} className="img-fluid" alt="" /></Link>

                        <div className="dwerkwenrwer d-none">
                          <i class="bi me-2 bi-search" onClick={() => setSearchBarToggle(!searchBarToggle)}></i>

                          <Form.Select className="me-2" aria-label="Default select example">
                            {currency.map(allCurrency => (
                              <option
                                key={allCurrency.id}
                                value={allCurrency.id}
                                selected={allCurrency.choice === 1}
                              >
                                {allCurrency.currency_type} ({allCurrency.currency_code})
                              </option>
                            ))}
                          </Form.Select>

                          <i class="fa-solid fa-bars" id="res-toggle-btn" onClick={() => setResMenu(true)}></i>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="doiwehrwehirnwerwer aosndkjnjhasekwewt row align-items-center">
                        <div className="col-lg-2">
                          {/* <Form.Select
                            className="me-2"
                            aria-label="Select currency"
                            value={selectedCurrency?.id || currency.find(c => c.choice === 1)?.id || ""}
                            onChange={(e) => {
                              const selectedObj = currency.find(c => c.id === parseInt(e.target.value));
                              setSelectedCurrency(selectedObj);
                            }}
                          >
                            {currency.map((allCurrency) => (
                              <option
                                key={allCurrency.id}
                                value={allCurrency.id}
                                selected={allCurrency.choice === 1}
                              >
                                {allCurrency.currency_type} ({allCurrency.currency_code})
                              </option>
                            ))}
                          </Form.Select> */}

                          <div className="custom-currency-dropdown position-relative">
                            <button
                              className="currency-toggle-btn d-flex align-items-center"
                              onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                            >
                              <span className="me-2">
                                <img
                                  src={`https://flagcdn.com/24x18/${getCountryCode(selectedCurrency?.currency_code || "INR")}.png`}
                                  alt={selectedCurrency?.currency_code || "INR"}
                                  className="me-0"
                                  width="24"
                                  height="18"
                                />
                              </span>
                              <span>{selectedCurrency?.currency_code || "INR"}</span>
                              <i
                                className={`fa-solid ms-2 ${
                                  showCurrencyDropdown ? "fa-chevron-up" : "fa-chevron-down"
                                }`}
                              ></i>
                            </button>

                            {showCurrencyDropdown && (
                              <ul className="currency-menu position-absolute bg-white shadow rounded-3 mt-2 mb-0 p-2">
                                {currency.map((cur) => (
                                  <li
                                    key={cur.id}
                                    className="currency-item d-flex align-items-center py-1 px-2"
                                    onClick={() => {
                                      setSelectedCurrency(cur);
                                      setShowCurrencyDropdown(false);
                                    }}
                                  >
                                    <span className="me-2">
                                      <img
                                        src={`https://flagcdn.com/24x18/${getCountryCode(cur.currency_code)}.png`}
                                        alt={cur.currency_code}
                                        className="me-2"
                                        width="24"
                                        height="18"
                                      />
                                    </span>
                                    <span>
                                      {cur.currency_type} ({cur.currency_code})
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>

                        <div className="col-lg-10">
                          <form onSubmit={handleSearch}>
                            <div className={`search-field ${searchBarToggle ? "" : "search-field-hide"} position-relative`}>
                              <input ref={searchRef} type="text" className="form-control rounded-pill ps-3" placeholder="Search for Pre-stitched saree" />

                              <i class="bi position-absolute bi-search"></i>
                            </div>
                          </form>
                        </div>               
                      </div>
                    </div>

                    <div className="col-lg-4">
                      {resMenu && (<div className="res-menu-backdrop position-fixed w-100 h-100" onClick={() => setResMenu(false)}></div>)}

                      <div className={`doewhruiwerwer_right ${resMenu ? "" : "doewhruiwerwer_right-hide"}`}>
                        <Link to="/"><img src={Logo} className="img-fluid d-none" alt="" /></Link>

                        <ul className="mb-0 ps-0 d-flex justify-content-between align-items-center">
                          <Link to={`/contact-us`}><li><i class="bi bi-headset"></i> Help</li></Link>

                          <li className="infrm-menu-divider">|</li>
                          {/* {user ? (
                            <> */}
                              <Link to={`/wishlist`}><li><i class="bi bi-heart"></i> &nbsp;Wishlist <span>{wishlistCount}</span></li></Link>
                              <li className="infrm-menu-divider">|</li>
                              <Link to={`/cart`}><li><i class="bi bi-handbag"></i> Cart <span>{cartCount}</span></li></Link>
                            {/* </>
                          ):(
                            <>
                              <Link to={`/login`}><li><i class="bi bi-heart"></i> &nbsp;Wishlist <span>0</span></li></Link>
                              <li className="infrm-menu-divider">|</li>
                              <Link to={`/login`}><li><i class="bi bi-handbag"></i> Bag <span>0</span></li></Link>
                            </>
                          )} */}

                          <li className="infrm-menu-divider">|</li>

                            <li className="position-relative">
                            {user ? (
                              <>
                                <div className="gbdfgtrfyhrytgrr d-flex align-items-center" onClick={() => setUserDropdown(!userDropdown)}>
                                  <i className="bi bi-person"></i>
                                  
                                  <div className="mjeimojwjikrrr">{user.name}</div>

                                  <i class={`fa-solid sdfrrweewr_icon ${userDropdown ? "fa-caret-up" : "fa-caret-down"}`}></i>
                                </div>

                                {userDropdown && <DropdownLoggedIn />}
                              </>
                            ) : (
                              <Link to="/register">
                                <i className="bi bi-person"></i> Account
                              </Link>
                            )}
                          </li>     
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              ) }

              { !shouldHideHeader && (
              <div className="header-main bg-white py-1 position-relative">       
                <div className="header-main-wrapper">
                    {mainCategory?.map((category) => (
                    <SwiperSlide key={category.id}>
                      <NavLink to={`/${category.mainCategory_slug}`} end>
                        {category.mainCategory_name}
                      </NavLink>

                      <div className="header-mega-menu position-absolute w-100">
                        <div className="h-m-m-inner bg-white py-2 mt-3">
                          <div className="container-fluid">
                            <div className="row">
                              <div className="col-lg-7">
                                <div className="ojkmiweee_left py-3">
                                  <div className="row">

                                    {category.head_categories?.map((headCat) => (
                                      <div className="col-lg-4" key={headCat.id}>
                                        <div className="oieniuiewr_inner">
                                          <h5>{headCat.headCategories_name}</h5>
                                          <ul className="mb-0 ps-0">
                                            {headCat.sub_categories?.slice(0, 8).map((subCat) => (
                                              <li key={subCat.id}>
                                                <Link to={`/${category.mainCategory_slug}/${subCat.subCategories_slug}`}>
                                                  {subCat.subCategories_name.replace(/\s*\(Boys\)|\s*\(Girls\)/gi, "")}
                                                </Link>
                                              </li> 
                                              
                                            ))}

                                            {/* Show "View All" if more than 8 */}
                                            {headCat.sub_categories?.length > 8 && (
                                              <li>
                                                <Link to={`/${category.mainCategory_slug}`}>
                                                  View All →
                                                </Link>
                                              </li>
                                            )}
                                          </ul>
                                        </div>
                                      </div>
                                    ))}

                                    {/* <div className="col-lg-3">
                                      <div className="oieniuiewr_inner">
                                        <h5>Designers</h5>

                                        <ul className="mb-0 ps-0">
                                          <li>
                                            <Link>Vishwa By Pinki Sinha</Link>
                                          </li>

                                          <li>
                                            <Link>Ekaya Banaras</Link>
                                          </li>

                                          <li>
                                            <Link>Rishi and Vibhuti</Link>
                                          </li>

                                          <li>
                                            <Link>Anamika Khanna</Link>
                                          </li>

                                          <li>
                                            <Link>Preeti S Kapoor</Link>
                                          </li>

                                          <li>
                                            <Link>Chandrima</Link>
                                          </li>

                                          <li>
                                            <Link>Gulabo Jaipur</Link>
                                          </li>

                                          <li>
                                            <Link>DiyaRajv vi</Link>
                                          </li>

                                          <li>
                                            <Link>Ajiesh Oberoi</Link>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>

                                    <div className="col-lg-3">
                                      <div className="oieniuiewr_inner">
                                        <h5>Trending</h5>

                                        <ul className="mb-0 ps-0">
                                          <li>
                                            <Link>Buzworthy Styles</Link>
                                          </li>

                                          <li>
                                            <Link>Resort Ready</Link>
                                          </li>

                                          <li>
                                            <Link>The Bridesmaid Edit</Link>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>

                                    <div className="col-lg-3">
                                      <div className="oieniuiewr_inner">
                                        <h5>Trending</h5>

                                        <ul className="mb-0 ps-0">
                                          <li>
                                            <Link>Buzworthy Styles</Link>
                                          </li>

                                          <li>
                                            <Link>Resort Ready</Link>
                                          </li>

                                          <li>
                                            <Link>The Bridesmaid Edit</Link>
                                          </li>
                                        </ul>
                                      </div>
                                    </div> */}
                                  </div>
                                </div>
                              </div>

                              <div className="col-lg-5">
                                <div className="ojkmiweee_right">
                                  <div className="row flex-nowrap">
                                    {category.mainCategory_banner?.map((CategoryBanner) => (
                                      <div className="col-4" key={CategoryBanner.id}>
                                        <div className="pkopkerrwer text-center">
                                          <Link to={`${CategoryBanner.category_bannerURL}`}>
                                            <img style={{height: "295px", objectFit: "cover"}} src={`${CategoryBanner.category_bannerImage_url}/${CategoryBanner.category_bannerImage}`} className="w-100" alt="" />
                                          </Link>
                                          
                                          <div className="dkewbjnrkwejrwer mt-2">
                                            {/* <h5>{CategoryBanner.category_bannerTitle}</h5> */}
                                            {/* <a href={`${CategoryBanner.category_bannerURL}`}>SHOW NOW</a> */}
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
                    </SwiperSlide>
                  ))}  
                </div>    
              </div>
              ) }
            </div>
          </div>
        </header>
      ) }
    </>
  )
}