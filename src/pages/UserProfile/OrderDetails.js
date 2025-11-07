import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Css/OrderDetails.css";
import http from "../../http";


export const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrderDetails = useCallback(async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await http.get(`/user/get-order-details/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(response);

    if (response.data.success) {
      setOrderData(response.data.data);
    } else {
      setError(response.data.message);
    }
  } catch (err) {
    console.error(err);
    setError("Failed to fetch order details");
  } finally {
    setLoading(false);
  }
}, [id]); // include dependencies used inside

useEffect(() => {
  fetchOrderDetails();
}, [fetchOrderDetails]);


  // ✅ Utility function to format date/time
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <h4>Loading Order Details...</h4>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-5 text-danger">
        <h5>{error}</h5>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="text-center py-5">
        <h5>No Order Data Found</h5>
      </div>
    );
  }

  const { order, products } = orderData;

  return (
    <section className="order-details py-5">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5>
            Order: <span>#{order?.order_id}</span>
          </h5>
          <div className="buttons">
            <button className="second-button" onClick={() => navigate(-1)}>
              <i className="ri-arrow-left-line" /> Back
            </button>
          </div>
        </div>

        <div className="details mb-4">
          <p>
            <strong>Status:</strong> {order?.order_status || "N/A"}
          </p>
          <p>
            <strong>Payment Method:</strong> {order?.payment_method || "N/A"}
          </p>
          <p>
            <strong>Date:</strong> {formatDate(order?.created_at)}
          </p>
          <p>
            <strong>Updated:</strong> {formatDate(order?.updated_at)}
          </p>
        </div>

        <div className="row mb-4">
          <div className="col-md-6">
            <h6 className="fw-bold">Shipping Address</h6>
            <p>
              <strong>Name:</strong> {order?.billingName} <br />
              <strong>Email:</strong> {order?.billingEmail} <br />
              <strong>Phone:</strong> {order?.billingNumber} <br />
              <strong>Address:</strong> {order?.billingFullAddress} <br />
              <strong>State:</strong> {order?.billingState} <br />
              <strong>City:</strong> {order?.billingCity} <br />
              <strong>Zip:</strong> {order?.billingPinCode}
            </p>
          </div>

          <div className="col-md-6">
            <h6 className="fw-bold">Billing Address</h6>
            <p>
              <strong>Name:</strong> {order?.shippingName} <br />
              <strong>Email:</strong> {order?.shippingEmail} <br />
              <strong>Phone:</strong> {order?.shippingNumber} <br />
              <strong>Address:</strong> {order?.shippingFullAddress} <br />
              <strong>State:</strong> {order?.shippingState} <br />
              <strong>City:</strong> {order?.shippingCity} <br />
              <strong>Zip:</strong> {order?.shippingPinCode}
            </p>
          </div>
        </div>

        <h6 className="fw-bold mb-3">Products</h6>
        <div className="table-responsive">
          <table className="table align-middle">
            <thead className="bg-light">
              <tr>
                <th>Product Details</th>
                <th>Status</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {products?.map((item, index) => (
                <tr key={index}>
                  <td className="d-flex align-items-center gap-3">
                    <img
                      src={item?.product_image || "/images/no-image.png"}
                      className="rounded"
                      alt={item?.product?.product_name}
                      width={70}
                      height={70}
                    />
                    <div>
                      <p className="mb-1 fw-bold text-dark">
                        {item?.product?.product_name}
                      </p>
                      <p className="mb-0">
                        Quantity: {item?.quantity} <br />
                        Price: ₹{item?.total_price}
                      </p>
                    </div>
                  </td>
                  <td>
                    <span className="fw-bold">
                      {order?.order_status || "N/A"}
                    </span>
                  </td>
                  <td>{formatDate(order?.updated_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-end mt-4">
          <p className="fw-bold fs-5">
            Total: <span>₹{order?.total_order_amount}</span>
          </p>
        </div>
      </div>
    </section>
  );
};
