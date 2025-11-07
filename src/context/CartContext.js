import { createContext, useCallback, useContext, useEffect, useState } from "react";
import http from "../http";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";
import { useCurrency } from "./CurrencyContext";
const CartContext = createContext();

export function CartProvider({ children }) {
  const { token } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const { selectedCurrency } = useCurrency();

  // ✅ Fetch cart count from API
  const fetchCartCount = useCallback(async () => {
    if (!token) {
      setCartCount(0); // clear if not logged in
      return;
    }

    try {
      const res = await http.post(
        "/user/get-cart-user",
        {
          country: selectedCurrency.country_name, // ✅ safe now
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCartCount(res.data.data.length || 0);
    } catch (err) {
      console.error("Error fetching cart count", err);
      setCartCount(0);
    }
  }, [token, selectedCurrency]); // ✅ added token as dependency

  useEffect(() => {
    fetchCartCount();
  }, [fetchCartCount]); // ✅ added fetchCartCount


  const addToCart = async (productData) => {
    if (!token) {
      toast.error("Please login to add to cart");
      return;
    }

    try {
      const res = await http.post(
        "/user/user-add-cart",
        productData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Product added to cart");
        fetchCartCount(); // refresh count
      } else {
        toast.info(res.data.message || "Product already exists in cart");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while adding to cart");
    }
  };

  // ✅ When login/logout happens
  useEffect(() => {
    if (token) {
      fetchCartCount();
    } else {
      setCartCount(0);
    }
  }, [token, fetchCartCount]); // ✅ added fetchCartCount also

  return (
    <CartContext.Provider value={{ cartCount, addToCart, fetchCartCount, setCartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
