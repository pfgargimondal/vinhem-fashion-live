import http from "../../http";
import { useEffect, useState } from "react";
import { PolicyComponent } from "../PolicyComponent/PolicyComponent";
import { FooterTopComponent } from "../../components/Others/FooterTopComponent";

export const OrderPolicy = () => {

    const [OrderPolicyDetails, setOrderPolicyDetails] = useState({});
    
    useEffect(() => {
        const fetchOrderPolicyData = async () => {
            // setLoading(true);
            try {
                const getresponse = await http.get("/get-order-policy-content");
                setOrderPolicyDetails(getresponse.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally{
                // setLoading(false);
            }
        };

        fetchOrderPolicyData();
    }, []);
    
  return (
    <div>
      {/* {loading && <Loader />}      */}
        <PolicyComponent PolicyDetails={OrderPolicyDetails}/>
      <hr />

      <FooterTopComponent />
    </div>
  )
}
