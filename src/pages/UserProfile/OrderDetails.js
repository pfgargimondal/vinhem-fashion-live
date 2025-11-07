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
  const [moreDetails, setMoreDetails] = useState(false);
  const [orderDetailsMessurmntModal, setOrderDetailsMessurmntModal] = useState(false);
  // eslint-disable-next-line
  const [orderMeasurementData, setOrderMeasurementData] = useState({});
  // eslint-disable-next-line
  const [selectedOrderProductId, setSelectedOrderProductId] = useState(null);

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


  const toggleDetails = (index) => {
    setMoreDetails((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };


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

  // ✅ OPEN MODAL (merged logic)
  const handleMessrmntTogle = (item) => {
    const html = document.querySelector("html");
    html.classList.add("overflow-hidden");

    setOrderMeasurementData(item?.measurement_data || {});
    setSelectedOrderProductId(item?.product?.PID || item?.product_id);
    setOrderDetailsMessurmntModal(true);
  };

  // ✅ CLOSE MODAL (merged logic)
  const handleMessrmntClose = () => {
    const html = document.querySelector("html");
    html.classList.remove("overflow-hidden");

    setOrderDetailsMessurmntModal(false);
  };

  return (
    <>
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
              <strong>Order Status:</strong> {order?.order_status?.replace(/_/g, " ").toUpperCase() || "N/A"}
            </p>
            <p>
              <strong>Payment Method:</strong> {order?.payment_method?.replace(/_/g, " ").toUpperCase() || "N/A"}
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
                <strong>Name:</strong> {order?.shippingName} <br />
                <strong>Email:</strong> {order?.shippingEmail} <br />
                <strong>Phone:</strong> {order?.shippingNumber} <br />
                <strong>Address:</strong> {order?.shippingFullAddress} <br />
                <strong>State:</strong> {order?.shippingState} <br />
                <strong>City:</strong> {order?.shippingCity} <br />
                <strong>Zip:</strong> {order?.shippingPinCode}
              </p>
            </div>

            <div className="col-md-6">
              <h6 className="fw-bold">Billing Address</h6>
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
          </div>

          {/* <h6 className="fw-bold mb-3">Products</h6> */}
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
                  <>
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
                            SIze: {item?.product_size} <br />
                            Price: ₹{item?.total_price}

                            <div className="idniehrewrer d-flex align-items-center">
                              <span className="d-block me-3" onClick={() => toggleDetails(index)}>More Details <i class="fa-solid fa-caret-down"></i></span>

                              <span className="mb-0" onClick={() => handleMessrmntTogle(item)}>Meassurement Chart Details</span>
                            </div>
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

                    {moreDetails[index] && (
                      <tr className="dijweoikroiwejrwer">
                        <div className="doiwenmjre d-flex">
                          <div className="col-lg-4">
                            <div><strong>Stitching Options:</strong> {item?.actual_stitch_option}</div>

                            <div><strong>Stitching Charges:</strong>
                              { item?.custom_fit_charge !== '0' 
                                  ? item?.custom_fit_charge 
                                  : item?.stitching_charge 
                              }
                            </div>
                          </div>

                          { item?.mojri_selected === 1 && (
                            <>
                            <div className="col-lg-4">
                              <div><strong>Mojri Price:</strong> {item?.mojri_charge}</div>

                              <div><strong>Mojri Size:</strong> {item?.mojri_size}</div>
                            </div>
                            </>
                          )}

                          { item?.stole_selected === 1 && (
                            <>
                            <div className="col-lg-4">
                              <div><strong>Stole Price:</strong> {item?.stole_charge}</div>
                            </div>
                            </>
                          )}

                          { item?.turban_selected === 1 && (
                            <>
                            <div className="col-lg-4">
                              <div><strong>Turbon Price:</strong> {item?.turban_charge}</div>

                              <div><strong>Turbon Size:</strong> {item?.turban_size}</div>
                            </div>
                            </>
                          )}
        
                        </div>
                      </tr>
                    )}
                  </>
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


      {/*messrmnt modal*/}
      
      <div onClick={handleMessrmntClose} className={`messrmnt-modal-backdrop ${orderDetailsMessurmntModal ? "" : "messrmnt-modal-backdrop-hide"} w-100 h-100 position-fixed`}></div>

      <div className={`messrmnt-modal ${orderDetailsMessurmntModal ? "" : "messrmnt-modal-hide"} bg-white position-fixed`}>
        <div className="messrmnt-modal-header p-4">
          <h5 className="mb-0">Messurement Details for Product ID: </h5>
        </div>

        <div className="djeoijojrer h-100 py-3 px-4">
          <div className="row">
            <div className="col-lg-6 mb-4">
              <div className="diweuhrwer">
                <label className="form-label">la la la la la la la la</label>

                <input type="text" disabled className="form-control" placeholder="2" />
              </div>
            </div>

            <div className="col-lg-6 mb-4">
              <div className="diweuhrwer">
                <label className="form-label">la la la la la la la la</label>

                <input type="text" disabled className="form-control" placeholder="2" />
              </div>
            </div>

            <div className="col-lg-6 mb-4">
              <div className="diweuhrwer">
                <label className="form-label">la la la la la la la la</label>

                <input className="d-block" type="checkbox" checked />
              </div>
            </div>

            <div className="col-lg-6 mb-4">
              <div className="diweuhrwer">
                <label className="form-label">la la la la la la la la</label>

                <input type="text" disabled className="form-control" placeholder="2" />
              </div>
            </div>

            <div className="col-lg-6 mb-4">
              <div className="diweuhrwer">
                <label className="form-label">la la la la la la la la</label>

                <input type="text" disabled className="form-control" placeholder="2" />
              </div>
            </div>

            <div className="col-lg-6 mb-4">
              <div className="diweuhrwer">
                <label className="form-label">la la la la la la la la</label>

                <input type="text" disabled className="form-control" placeholder="2" />
              </div>
            </div>

            <div className="col-lg-6 mb-4">
              <div className="diweuhrwer">
                <label className="form-label">la la la la la la la la</label>

                <input type="text" disabled className="form-control" placeholder="2" />
              </div>
            </div>

            <div className="col-lg-6 mb-4">
              <div className="diweuhrwer">
                <label className="form-label">la la la la la la la la</label>

                <input type="text" disabled className="form-control" placeholder="2" />
              </div>
            </div>

            <div className="col-lg-6 mb-4">
              <div className="diweuhrwer">
                <label className="form-label">la la la la la la la la</label>

                <input type="text" disabled className="form-control" placeholder="2" />
              </div>
            </div>

            <div className="col-lg-6 mb-4">
              <div className="diweuhrwer">
                <label className="form-label">la la la la la la la la</label>

                <input type="text" disabled className="form-control" placeholder="2" />
              </div>
            </div>

            <div className="col-lg-6 mb-4">
              <div className="diweuhrwer">
                <label className="form-label">la la la la la la la la</label>

                <input type="text" disabled className="form-control" placeholder="2" />
              </div>
            </div>

            <div className="col-lg-6 mb-4">
              <div className="diweuhrwer">
                <label className="form-label">la la la la la la la la</label>

                <input type="text" disabled className="form-control" placeholder="2" />
              </div>
            </div>

            <div className="col-lg-6 mb-4">
              <div className="diweuhrwer">
                <label className="form-label">la la la la la la la la</label>

                <input type="text" disabled className="form-control" placeholder="2" />
              </div>
            </div>

            <div className="col-lg-6 mb-4">
              <div className="diweuhrwer">
                <label className="form-label">la la la la la la la la</label>

                <input type="text" disabled className="form-control" placeholder="2" />
              </div>
            </div>

            <div className="col-lg-6 mb-4">
              <div className="diweuhrwer">
                <label className="form-label">la la la la la la la la</label>

                <input type="text" disabled className="form-control" placeholder="2" />
              </div>
            </div>

            <div className="col-lg-6 mb-4">
              <div className="diweuhrwer">
                <label className="form-label">la la la la la la la la</label>

                <input type="text" disabled className="form-control" placeholder="2" />
              </div>
            </div>

            <div className="col-lg-6 mb-4">
              <div className="diweuhrwer">
                <label className="form-label">la la la la la la la la</label>

                <input type="text" disabled className="form-control" placeholder="2" />
              </div>
            </div>

            <div className="col-lg-6 mb-4">
              <div className="diweuhrwer">
                <label className="form-label">la la la la la la la la</label>

                <input type="text" disabled className="form-control" placeholder="2" />
              </div>
            </div>

            <div className="col-lg-6 mb-4">
              <div className="diweuhrwer">
                <label className="form-label">la la la la la la la la</label>

                <input type="text" disabled className="form-control" placeholder="2" />
              </div>
            </div>

            <div className="col-lg-6 mb-4">
              <div className="diweuhrwer">
                <label className="form-label">la la la la la la la la</label>

                <input type="text" disabled className="form-control" placeholder="2" />
              </div>
            </div>

            <div className="col-lg-6 mb-4">
              <div className="diweuhrwer">
                <label className="form-label">la la la la la la la la</label>

                <input type="text" disabled className="form-control" placeholder="2" />
              </div>
            </div>

            <div className="col-lg-6 mb-4">
              <div className="diweuhrwer">
                <label className="form-label">la la la la la la la la</label>

                <input type="text" disabled className="form-control" placeholder="2" />
              </div>
            </div>

            <div className="col-lg-6 mb-4">
              <div className="diweuhrwer">
                <label className="form-label">la la la la la la la la</label>

                <input type="text" disabled className="form-control" placeholder="2" />
              </div>
            </div>

            <div className="col-lg-6 mb-4">
              <div className="diweuhrwer">
                <label className="form-label">la la la la la la la la</label>

                <input type="text" disabled className="form-control" placeholder="2" />
              </div>
            </div>

            <div className="col-lg-6 mb-4">
              <div className="diweuhrwer">
                <label className="form-label">la la la la la la la la</label>

                <input type="text" disabled className="form-control" placeholder="2" />
              </div>
            </div>

            <div className="col-lg-6 mb-4">
              <div className="diweuhrwer">
                <label className="form-label">la la la la la la la la</label>

                <input type="text" disabled className="form-control" placeholder="2" />
              </div>
            </div>

            <div className="col-lg-6 mb-4">
              <div className="diweuhrwer">
                <label className="form-label">la la la la la la la la</label>

                <input type="text" disabled className="form-control" placeholder="2" />
              </div>
            </div>

            <div className="col-lg-6 mb-4">
              <div className="diweuhrwer">
                <label className="form-label">la la la la la la la la</label>

                <input type="text" disabled className="form-control" placeholder="2" />
              </div>
            </div>

            <div className="col-lg-6 mb-4">
              <div className="diweuhrwer">
                <label className="form-label">la la la la la la la la</label>

                <input type="text" disabled className="form-control" placeholder="2" />
              </div>
            </div>

            <div className="col-lg-6 mb-4">
              <div className="diweuhrwer">
                <label className="form-label">la la la la la la la la</label>

                <input type="text" disabled className="form-control" placeholder="2" />
              </div>
            </div>

            <div className="col-lg-6 mb-4">
              <div className="diweuhrwer">
                <label className="form-label">la la la la la la la la</label>

                <input type="text" disabled className="form-control" placeholder="2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
