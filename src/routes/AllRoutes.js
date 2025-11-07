import { Route, Routes } from "react-router-dom";
import { AboutUs, ContactUs, Filter, Home, Login, OnSale, PageNotFound, ProductDetail, Register, Wedding, TermsCondition, PrivacyPolicy, ReturnPolicy, OrderPolicy, ShippingPolicy, Testimonial, Career, Profile, CancelOrder, OrderHistory, ChangePassword, Wishlist, Cart, Blog, BlogDetails, Invoice, Checkout, Chat, TrackOrder, FAQ, ThankYou, OrderDetails} from "../pages";
import ProtectedRoute from "../components/ProtectedRoute ";

export const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={ <Home /> } />

      <Route path="about-us" element={ <AboutUs /> } />
      <Route path="contact-us" element={ <ContactUs /> } />
      <Route path="on-sale" element={ <OnSale /> } />
      <Route path="wedding" element={ <Wedding /> } />
      <Route path="all-products" element={ <Filter /> } />
      <Route path="/:category" element={ <Filter /> } />
      <Route path="/:category/:subcategory" element={ <Filter /> } />

      {/* <Route path="new-in" element={ <NewIn /> } /> */}
      {/* <Route path="ready-to-ship" element={ <ReadyToShip /> } />
      <Route path="festive-shop" element={ <FestiveShop /> } /> */}

      <Route path="products/:slug" element={ <ProductDetail /> } />
      <Route path="register" element={ <Register /> } />
      <Route path="login" element={ <Login /> } />
      <Route path="terms-&-condition" element={ <TermsCondition /> } />
      <Route path="privacy-policy" element={ <PrivacyPolicy /> } />
      <Route path="return-policy" element={ <ReturnPolicy /> } />
      <Route path="order-policy" element={ <OrderPolicy /> } />
      <Route path="shipping-policy" element={ <ShippingPolicy /> } />
      <Route path="testimonial" element={ <Testimonial /> } />
      <Route path="career" element={ <Career /> } />
      <Route path="faq" element={ <FAQ /> } />
      


      <Route path="blog" element={ <Blog /> } />
      <Route path="blog/:slug" element={ <BlogDetails /> } />

      <Route element={<ProtectedRoute />}>
          <Route path="profile" element={ <Profile /> } />
          <Route path="change-password" element={ <ChangePassword /> } />
          <Route path="cancelled-order" element={ <CancelOrder/> } />
          <Route path="order-history" element={ <OrderHistory/> } />
          <Route path="order-details/:id" element={ <OrderDetails /> } />
          <Route path="wishlist" element={ <Wishlist/> } />
          <Route path="cart" element={ <Cart/> } />
          <Route path="checkout" element={ <Checkout/> } />
          <Route path="thank-you" element={ <ThankYou /> } />
          <Route path="chat" element={ <Chat/> } />

          <Route path="invoice" element={ <Invoice /> } />
          <Route path="track-order" element={ <TrackOrder /> } />
      </Route>
      
      <Route path="*" element={ <PageNotFound /> } />
    </Routes>
  )
}