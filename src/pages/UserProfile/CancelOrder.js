import { Link } from "react-router-dom";
import Table from 'react-bootstrap/Table';

import { UserProfileNavMenu } from "../../components";
import styles from "./Css/CancelOrder.module.css";
import http from "../../http";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

export const CancelOrder = () => {

    const { token } = useAuth();
    const [CanceledOrder, setCanceledOrder] = useState([]);

    useEffect(() => {
        if (!token) return;

        const fetchCancelOrder = async () => {
        try {
            const res = await http.get("/user/get-cancel-order", {
            headers: { Authorization: `Bearer ${token}` },
            });
            setCanceledOrder(res.data.data || []);
        } catch (error) {
            console.error("Failed to fetch cancel order", error);
        }
        };

        fetchCancelOrder();
    }, [token]);


    return (
        <div className={styles.ffhfdf}>
            <div className="ansjidnkuiweer">
                <div className={styles.fbghdfg}>
                    <div className="row">
                        <div className="col-lg-3">
                            <UserProfileNavMenu />
                        </div>

                        <div className="col-lg-9">
                            <div className={`${styles.fgcbdfgdf} pt-3 pb-5`}>
                                <div className={`${styles.dfjhdsbfsdf} mb-4`}>
                                    <h4 className="mb-0">Cancelled Orders</h4>

                                    <p className="ndiwhermweoewrr mb-0">
                                        <Link to="/"><i className="fa-solid me-1 fa-arrow-left"></i> Back To Home <i className="fa-solid ms-1 fa-house"></i></Link>
                                    </p>
                                </div>

                                <div className={styles.dfgndfjhbgdfgdf}>
                                    <Table striped bordered hover responsive>
                                        <thead>
                                            <tr>
                                                <th>Order Id</th>
                                                <th>Order Information</th>
                                                <th>Order Date</th>
                                                <th>Cancel Date</th>
                                                <th>Total Amount</th>
                                            </tr>
                                        </thead>
                                        
                                        <tbody>
                                            {CanceledOrder?.map((CanceledOrderVal) => (
                                                <tr>
                                                    <td>{CanceledOrderVal.order_id}</td>

                                                    <td>
                                                        <div className={`${styles.sdfsdf} justify-content-between mb-3`}>
    
                                                            <p className="mb-0">No. of items: {CanceledOrderVal.total_orderProduct}</p> 

                                                            <p className={`${styles.oknknkmer} mb-0`}><i class={`bi ${styles.vew_dtls} bi-eye`}></i> View Details</p>
                                                        </div>

                                                        <div className={`d-flex ${styles.dweknriwehrwer} align-items-center justify-content-between`}>
                                                            <button className={`btn ${styles.cncl_ordr} border-0 px-0`}>
                                                                <i className="bi me-1 bi-folder-x"></i> Cancelled Order
                                                            </button>
                                                        </div>
                                                    </td>

                                                    <td> {CanceledOrderVal.order_date
                                                        ? CanceledOrderVal.order_date.split("-").reverse().join("-")
                                                        : ""}</td>
                                                    <td> {CanceledOrderVal.cancel_date
                                                        ? CanceledOrderVal.cancel_date.split("-").reverse().join("-")
                                                        : ""}</td>

                                                    <td>₹{CanceledOrderVal.total_order_amount}</td>
                                                </tr>
                                            ))}                          
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}