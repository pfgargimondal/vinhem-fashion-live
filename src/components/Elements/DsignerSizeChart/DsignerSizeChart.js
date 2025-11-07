import { Tab } from "bootstrap";
import { useState } from "react";
import { Table, Tabs } from "react-bootstrap";

export const DesignerSizeChart = ({ productDetails }) => {
  const [isCms, setIsCms] = useState(false); // false = inches, true = cms

  const handleToggle = () => setIsCms(!isCms);

  const sizeChart = productDetails?.data?.designer_sizeChart || [];
  const firstSizeChart = productDetails?.data?.designer_sizeChart?.[0];

  // console.log(firstSizeChart);

  return (
    <Tabs
      defaultActiveKey="home"
      id="uncontrolled-tab-example"
      className="mb-3 justify-content-center"
    >
      <Tab eventKey="home" title="SIZE GUIDE">
        <div className="diekhjwerwer">
          <div className="djnweuihrwer">
            <div className="opmkojwojoiwere d-flex justify-content-between">
              <div className="dkewhknewhirwer">
                <h5>Size Chart for {productDetails?.data?.product_category}</h5>

                <h6 className="mb-0">
                  BODY MEASUREMENTS [ 3-4 INCHES LOOSENING REQUIRED]
                </h6>
              </div>

              <div className="oidahijeoijer d-flex align-items-center">
                <p className="mb-0">in</p>

                <div className="checkbox-wrapper-2 mx-1">
                  <input
                    type="checkbox"
                    className="sc-gJwTLC ikxBAC"
                    checked={isCms}
                    onChange={handleToggle}
                  />
                </div>

                <p className="mb-0">cms</p>
              </div>
            </div>
            <div className="jnmkjhihewirwer mt-3">
              <Table responsive="xl">
                {productDetails?.data?.product_category?.toLowerCase() === "women" && (
                  <>
                    <thead>
                      <tr>
                        <th>Size</th>
                        <th>UK</th>
                        <th>US</th>
                        <th>Bust ({isCms ? "cm" : "in"})</th>
                        <th>Waist ({isCms ? "cm" : "in"})</th>
                        <th>Hip ({isCms ? "cm" : "in"})</th>

                        {/* Dynamic headers for extra fields */}
                        {firstSizeChart?.extra1 && (
                          <th>
                            {firstSizeChart.extra1} ({isCms ? "cm" : "in"})
                          </th>
                        )}
                        {firstSizeChart?.extra2 && (
                          <th>
                            {firstSizeChart.extra2} ({isCms ? "cm" : "in"})
                          </th>
                        )}
                        {firstSizeChart?.extra3 && (
                          <th>
                            {firstSizeChart.extra3} ({isCms ? "cm" : "in"})
                          </th>
                        )}
                      </tr>
                    </thead>

                    <tbody>
                      {sizeChart.map((item) => (
                        <tr key={item.id}>
                          <td>{item.size_name || "-"}</td>
                          <td>{item.uk || "-"}</td>
                          <td>{item.us || "-"}</td>

                          <td>
                            {isCms ? item.bust_cm || "-" : item.bust_in || "-"}
                          </td>
                          <td>
                            {isCms
                              ? item.waist_cm || "-"
                              : item.waist_in || "-"}
                          </td>
                          <td>
                            {isCms ? item.hip_cm || "-" : item.hip_in || "-"}
                          </td>
                          {/* Dynamic extra fields */}
                          {firstSizeChart?.extra1 && (
                            <td>
                              {isCms
                                ? item.extra1_cm || "-"
                                : item.extra1_in || "-"}
                            </td>
                          )}
                          {firstSizeChart?.extra2 && (
                            <td>
                              {isCms
                                ? item.extra2_cm || "-"
                                : item.extra2_in || "-"}
                            </td>
                          )}
                          {firstSizeChart?.extra3 && (
                            <td>
                              {isCms
                                ? item.extra3_cm || "-"
                                : item.extra3_in || "-"}
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </>
                )}

                {productDetails?.data?.product_category?.toLowerCase() === "men" && (
                  <>
                    <thead>
                      <tr>
                        <th>Size</th>
                        <th>UK</th>
                        <th>US</th>
                        <th>Chest ({isCms ? "cm" : "in"})</th>
                        <th>Waist ({isCms ? "cm" : "in"})</th>
                        <th>Neck ({isCms ? "cm" : "in"})</th>
                        <th>Hip ({isCms ? "cm" : "in"})</th>

                        {/* Dynamic headers for extra fields */}
                        {firstSizeChart?.extra1 && (
                          <th>
                            {firstSizeChart.extra1} ({isCms ? "cm" : "in"})
                          </th>
                        )}
                        {firstSizeChart?.extra2 && (
                          <th>
                            {firstSizeChart.extra2} ({isCms ? "cm" : "in"})
                          </th>
                        )}
                        {firstSizeChart?.extra3 && (
                          <th>
                            {firstSizeChart.extra3} ({isCms ? "cm" : "in"})
                          </th>
                        )}
                      </tr>
                    </thead>

                    <tbody>
                      {sizeChart.map((item) => (
                        <tr key={item.id}>
                          <td>{item.size_name || "-"}</td>
                          <td>{item.uk || "-"}</td>
                          <td>{item.us || "-"}</td>
                          <td>
                            {isCms ? item.chest_cm || "-" : item.chest_in || "-"}
                          </td>
                          <td>
                            {isCms ? item.waist_cm || "-" : item.waist_in || "-"}
                          </td>
                          <td>
                            {isCms
                              ? item.neck_cm || "-"
                              : item.neck_in || "-"}
                          </td>
                          <td>
                            {isCms ? item.hip_cm || "-" : item.hip_in || "-"}
                          </td>
                          {/* Dynamic extra fields */}
                          {firstSizeChart?.extra1 && (
                            <td>
                              {isCms
                                ? item.extra1_cm || "-"
                                : item.extra1_in || "-"}
                            </td>
                          )}
                          {firstSizeChart?.extra2 && (
                            <td>
                              {isCms
                                ? item.extra2_cm || "-"
                                : item.extra2_in || "-"}
                            </td>
                          )}
                          {firstSizeChart?.extra3 && (
                            <td>
                              {isCms
                                ? item.extra3_cm || "-"
                                : item.extra3_in || "-"}
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </>
                )}

                {productDetails?.data?.product_category?.toLowerCase() === "kids wear" && (
                  <>
                    <thead>
                      <tr>
                        <th>Size</th>
                        <th>Age</th>
                        <th>Top Chest ({isCms ? "cm" : "in"})</th>
                        <th>Top Length ({isCms ? "cm" : "in"})</th>
                        <th>Bottom Length ({isCms ? "cm" : "in"})</th>

                        {/* Dynamic headers for extra fields */}
                        {firstSizeChart?.extra1 && (
                          <th>
                            {firstSizeChart.extra1} ({isCms ? "cm" : "in"})
                          </th>
                        )}
                        {firstSizeChart?.extra2 && (
                          <th>
                            {firstSizeChart.extra2} ({isCms ? "cm" : "in"})
                          </th>
                        )}
                        {firstSizeChart?.extra3 && (
                          <th>
                            {firstSizeChart.extra3} ({isCms ? "cm" : "in"})
                          </th>
                        )}
                      </tr>
                    </thead>

                    <tbody>
                      {sizeChart.map((item) => (
                        <tr key={item.id}>
                          <td>{item.size_name || "-"}</td>
                          <td>{item.age || "-"}</td>
                          <td>
                            {isCms ? item.top_chest_cm || "-" : item.top_chest_in || "-"}
                          </td>
                          <td>
                            {isCms ? item.top_length_cm || "-" : item.top_length_in || "-"}
                          </td>
                          <td>
                            {isCms
                              ? item.bottom_length_cm || "-"
                              : item.bottom_length_in || "-"}
                          </td>
                          {/* Dynamic extra fields */}
                          {firstSizeChart?.extra1 && (
                            <td>
                              {isCms
                                ? item.extra1_cm || "-"
                                : item.extra1_in || "-"}
                            </td>
                          )}
                          {firstSizeChart?.extra2 && (
                            <td>
                              {isCms
                                ? item.extra2_cm || "-"
                                : item.extra2_in || "-"}
                            </td>
                          )}
                          {firstSizeChart?.extra3 && (
                            <td>
                              {isCms
                                ? item.extra3_cm || "-"
                                : item.extra3_in || "-"}
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </>
                )}
              </Table>
            </div>
          </div>

          <div className="oijdkejwjewr p-4">
            <h6>
              <i class="fa-brands me-1 fa-whatsapp"></i> Whatsapp Us at{" "}
              <span>+91 84880 70070</span> if you are unsure of your size.
            </h6>

            <p className="mb-0">
              This is a standard size guide for the basic measurements. Length
              will vary according to style. There may also be variations in some
              brands commonly with Indian clothing, so please refer to the
              product measurements displayed on the product page. Alternatively,
              you may contact our customer care for specific queries at
              vinhemfashion.com
            </p>
          </div>
        </div>
      </Tab>

      <Tab eventKey="profile" title="MEASURING GUIDE">
        {productDetails?.data?.product_category?.toLowerCase() === "men" && (
          <img src="/images/sawewe.jpg" className="img-fluid" alt="" />
        )}
        {productDetails?.data?.product_category?.toLowerCase() === "women" && (
          <img src="/images/womenSizeChart.png" className="img-fluid" alt="" />
        )}

        {productDetails?.data?.product_sub_category?.includes("(Boys)") && (
          <img src="/images/boySizeChart.png" className="img-fluid" alt="" />
        )}

        {productDetails?.data?.product_sub_category?.includes("(Girls)") && (
          <img src="/images/girlSizeChart.png" className="img-fluid" alt="" />
        )}
      </Tab>
    </Tabs>
  );
};
