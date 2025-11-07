import Table from 'react-bootstrap/Table';
import "./Css/TrackOrder.css";

export const TrackOrder = () => {
  return (
    <div className="track-order-wrapper">
        <div className="lksnkjererr container px-5">
            <div className="fdgfrwtyrt row py-5">
                <div className="col-lg-8 mb-5">
                    <div className="odkioowepow">
                        <h2 className="order-status-title">Track Your Order</h2>
                        <div className="dieihiewjr">
                        <label className="me-2 mb-2">Enter Your Order Id:</label>
                        <div className="dftgyttredd d-flex align-items-center">
                            <div className="col-lg-6">
                            <input
                                className="form-control"
                                placeholder="Enter Your Order Id"
                            />
                            </div>
                            <button className="btn btn-main ms-2 py-2">Track</button>
                        </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-7 mb-4">
                    <div className="dsfghjyrtrew">
                        <h2 className="order-status-title">Your Order Status</h2>
                        
                        <p className="order-number">Order Number: <span>0519cb87e4clf274</span></p>

                        <p className="updated-time">Estimated Delivery: Friday, Sep 08</p>
                        
                        <div className="track-order-container mb-5">
                            <div className="d-flex justify-content-between">
                                <div className="order-tracking completed">
                                <span className="is-complete" />
                                <p>
                                    <b>Ordered</b>
                                    <br />
                                    <span>Mon, June 24</span>
                                </p>
                                </div>
                                <div className="order-tracking completed">
                                <span className="is-complete" />
                                <p>
                                    <b>Shipped</b>
                                    <br />
                                    <span>Tue, June 25</span>
                                </p>
                                </div>
                                <div className="order-tracking">
                                <span className="is-complete" />
                                <p>
                                    <b>Delivered</b>
                                    <br />
                                    <span>Fri, June 28</span>
                                </p>
                                </div>
                            </div>
                        </div>

                        <p className="delivery-status">Your order has been delivered!</p>
                        
                        <hr />
                        
                        <h4 className="past-history-title">Tracking History</h4>
                        
                        <div className="history-item">                        
                            <span className="history-date">27 Sep 23:41</span>Order for <span className="bold-text">ALL YOU NEED IS LESS</span> - LONG SLEEVE placed
                        </div>

                        <div className="history-item">
                            <span className="history-date">29 Sep 03:53</span>The campaign successfully reached its goal!
                        </div>

                        <div className="history-item">
                            <span className="history-date">29 Sep 04:09</span>The campaign has
                            ended and your order is now being printed!
                        </div>
                    </div>
                </div>

                <div className="col-lg-5">
                    <div className="right-box d-none mb-4">
                        <p className="mb-0">Specific details are hidden for privacy reasons, <a href="/" className="log-in-link">Log in</a> to view complete details</p>
                    </div>

                    <div className="dkiejwrnjiowejrwer">
                        <h4 className="mb-3">Order Details</h4>

                        <div className="pkdoewkpoerrr">
                            <Table responsive="lg">
                                
                                <thead>
                                    <tr>
                                        <th>Item</th>

                                        <th>Quantity</th>

                                        <th>Item Cost</th>

                                        <th>Sub Total</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr>
                                        <td className="iknjninoijwerr">Clothing And Accessory Boutiques For Sale</td>

                                        <td>1</td>

                                        <td>$49.99</td>

                                        <td>$49.99</td>
                                    </tr>

                                    <tr>
                                        <td className="iknjninoijwerr">Accessory Boutiques For Sale</td>

                                        <td>2</td>

                                        <td>$20</td>

                                        <td>$40</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}