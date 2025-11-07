import "./Css/Invoice.css";
import "./Css/InvoiceResponsive.css";

export const Invoice = () => {
  return (
    <div id="invoice-content" className="invoice-box my-5">
      {/* Logo & Branding */}

      <table className="header">
        <tbody>
          <tr>
            <td> 
              <span className="logo d-block py-3 text-center">
                <img src="./images/logo.png" alt="" />
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Date & Invoice No */}
      
      <table>
        <tbody>
          <tr>
            <td style={{ borderRight: 0, borderLeft: 0, borderBottom: 0 }}>
              <b>Date : 14/04/2024 - Time : 15.22</b>
            </td>
            <td
              className="right pe-5"
              style={{ borderLeft: 0, borderRight: 0, borderBottom: 0 }}
            >
              <b>INVOICE NO : VF-2526-101</b>
            </td>
          </tr>
        </tbody>
      </table>
      {/* Sold To */}
      <table>
        <tbody>
          <tr>
            <td
              style={{ borderBottom: "2px dashed", borderLeft: 0, borderRight: 0 }}
              className="pb-3"
            >
              <span>Sold To:</span>
              <br />
              <b>Julia Jung</b>
              <br />
              <b>617 BARKSDALE RD</b>
              <br />
              <b>WILMINGTON, NC 28409-3124</b>
              <br />
              <b>United States</b>
            </td>
          </tr>
        </tbody>
      </table>
      {/* Order ID */}
      <table>
        <tbody>
          <tr>
            <td
              style={{
                borderTop: 0,
                borderBottom: "2px dashed",
                borderLeft: 0,
                borderRight: 0
              }}
              className="py-3"
            >
              <b>Order ID: VF-2526-1000000023</b> <br />
              Thank you for buying from VinHem Fashion.
            </td>
          </tr>
        </tbody>
      </table>
      {/* Shipping & Order Details */}
      <table>
        <tbody>
          <tr>
            <td style={{ borderTop: 0, borderLeft: 0 }} className="py-3">
              <b>Shipping Address:</b>
              <br />
              Julia Jung , 617 BARKSDALE RD, WILMINGTON, NC 28409-3124
              <br />
              United States
            </td>
            <td className="py-3" style={{ borderTop: 0, borderRight: 0 }}>
              Order Date : Mon, Mar 18, 2024 <br />
              Buyer Name: Andrew <br />
              Shipping Service: FEDEX
            </td>
          </tr>
        </tbody>
      </table>
      {/* Product Details */}
      <table>
        <tbody>
          <tr>
            <th className="text-center" style={{ borderTop: 0, borderLeft: 0 }}>
              Quantity
            </th>
            <th className="text-center" style={{ borderTop: 0 }}>
              Product Details
            </th>
            <th
              className="text-center"
              style={{ borderTop: 0, borderRight: 0, width: "34.2%" }}
            >
              Amount
            </th>
          </tr>
          <tr>
            <td className="text-center" style={{ borderLeft: 0, borderBottom: 0 }}>
              1
            </td>
            <td className="p-0" style={{ borderBottom: 0 }}>
              <span
                className="p-1"
                style={{ display: "block", borderBottom: "1px solid" }}
              >
                <b>
                  RANAK Purple Resham Embroidery Art Silk <br /> Kurta Pajama
                </b>
              </span>
              <span
                className="p-1"
                style={{ display: "block", borderBottom: "1px solid" }}
              >
                ITEM ID : 000000000
              </span>
              <span
                className="p-1"
                style={{ display: "block", borderBottom: "1px solid" }}
              >
                SIZE : 42
              </span>
              <span className="p-1" style={{ display: "block" }}>
                HSN CODE : (8 Digit Code)
              </span>
            </td>
            <td
              className="text-center px-0 pb-0"
              style={{ borderRight: 0, borderBottom: 0 }}
            >
              <span style={{ fontSize: "1.6rem", lineHeight: 3 }}>4762</span>
              <table className="dowejrower" style={{ marginTop: "2.3rem" }}>
                <tbody>
                  <tr>
                    <th
                      className="p-1"
                      style={{ borderLeft: 0, borderBottom: 0, width: "40%" }}
                    >
                      Shipping
                    </th>
                    <th className="p-1" style={{ borderRight: 0, borderBottom: 0 }}>
                      Free
                    </th>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      {/* TAX COLLECT block with rowspan */}
      <table>
        <tbody>
          <tr>
            <td
              rowSpan={3}
              className="text-center bold"
              style={{
                alignContent: "center",
                borderLeft: 0,
                borderBottom: 0,
                width: "65.8%"
              }}
            >
              TAX COLLECT
            </td>
            <td className="text-center">CGST @ 2.5%</td>
            <td className="text-center" style={{ width: "20.5%", borderRight: 0 }}>
              119
            </td>
          </tr>
          <tr>
            <td className="text-center">SGST @ 2.5%</td>
            <td className="text-center" style={{ width: "20.5%", borderRight: 0 }}>
              119
            </td>
          </tr>
          <tr>
            <td className="text-center" style={{ borderBottom: 0 }}>
              IGST @ 5%
            </td>
            <td
              className="text-center"
              style={{ width: "20.5%", borderBottom: 0, borderRight: 0 }}
            >
              238
            </td>
          </tr>
        </tbody>
      </table>
      {/* Total */}
      <table>
        <tbody>
          <tr>
            <td
              className="text-center"
              style={{
                fontSize: "1.4rem",
                width: "79.5%",
                borderLeft: 0,
                borderBottom: 0
              }}
            >
              TOTAL
            </td>
            <td
              className="text-center"
              style={{ fontSize: "1.4rem", borderRight: 0, borderBottom: 0 }}
            >
              5000
            </td>
          </tr>
        </tbody>
      </table>
      {/* Payment Mode */}
      <table>
        <tbody>
          <tr>
            <td
              className="text-center bold"
              style={{ fontSize: "1.6rem", width: "79.5%", borderLeft: 0 }}
            >
              PAYMENT MODE
            </td>
            <td
              className="text-center"
              style={{ fontSize: "1.2rem", borderRight: 0 }}
            >
              PREPAID / COD
            </td>
          </tr>
        </tbody>
      </table>
      {/* Footer */}
      <table className="no-border">
        <tbody>
          <tr>
            <td className="text-center" style={{border: "0"}}>
              <b>Returning your item:</b>
              <br />
              Go to "Your Account" on Vinhemfashion.com.com, click "Your Orders" and
              then click the "Mark Return" link for this order to get information
              about the return and refund policies that apply.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
