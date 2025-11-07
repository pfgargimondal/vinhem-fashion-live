import http from "../../http";
import { useEffect, useState } from "react";
import { PolicyComponent } from "../PolicyComponent/PolicyComponent";
import { FooterTopComponent } from "../../components/Others/FooterTopComponent";
export const TermsCondition = () => {

    const [TermsConditionDetails, setTermsConditionDetails] = useState({});

    useEffect(() => {
        const fetchTermsConditionData = async () => {
            // setLoading(true);
            try {
                const getresponse = await http.get("/get-terms-condition-content");
                setTermsConditionDetails(getresponse.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally{
                // setLoading(false);
            }
        };

        fetchTermsConditionData();
    }, []);

  return (
    <div>
        <PolicyComponent PolicyDetails={TermsConditionDetails}/>

      <hr />

      <FooterTopComponent />
    </div>
  );
};
