import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth/helper";
import { cartEmpty, loadCart } from "./helper/CartHelper";
import { createOrder } from "./helper/orderHelper";
import { getmeToken, processPayment } from "./helper/paymentBhelper";

import DropIn from "braintree-web-drop-in-react";

const PaymentB = ({
  products,
  setReload = (f) => f,
  reload = undefined,
}) => {
  const [info, setInfo] = useState({
    loading: false,
    success: false,
    clientToken: null,
    error: "",
    instance: {},
  });

  const userId = isAuthenticated() && isAuthenticated().user._id;
  const token = isAuthenticated() && isAuthenticated().token;

  const getToken = (userId, token) => {
    getmeToken(userId, token).then((response) => {
      //   console.log("RESPONSE: ", response);
      if (response.error) {
        setInfo({ ...info, error: response.error });
      } else {
        const clientToken = response.clientToken;
        setInfo({ clientToken });
      }
    });
  };
  const showBrainTreeButton = () => {
    return (
      <div>
        {info.clientToken !== null && products && products.length > 0 ? (
          <div className="text-center">
            <DropIn
              options={{ authorization: info.clientToken }}
              onInstance={(instance) => (info.instance = instance)}
            />
            <button className="btn btn-block btn-success" onClick={onPurchase}>
              Buy Now
            </button>
          </div>
        ) : (
          <p>Add Something In Your Cart</p>
        )}
      </div>
    );
  };

  const getAmount = () => {
    let amount = 0;
    products.map((product) => {
      amount += product.price;
    });
    return amount;
  };

  useEffect(() => {
    getToken(userId, token);
  }, []);

  const onPurchase = () => {
    setInfo({ loading: true });
    let nonce;
    let getNonce = info.instance.requestPaymentMethod().then((data) => {
      nonce = data.nonce;
      const paymentData = {
        paymentMethodNonce: nonce,
        amount: getAmount(),
      };
      processPayment(userId, token, paymentData)
        .then((response) => {
          setInfo({ ...info, success: response.success, loading: false });
          console.log("Payment Success");

          // Todo: Create Order

          cartEmpty(() => {
            console.log("CART EMPTY SUCCESSFULLY");
          });

          setReload(!reload);
        })
        .catch((err) => {
          setInfo({ loading: false, success: false });
          console.log("Payment Failed");
        });
    });
  };

  return (
    <div
      style={{ display: isAuthenticated() ? "" : "none" }}
      className="alert alert-secondary"
    >
      <h3 className="alert-heading">Your Total Amount:  {getAmount()}$ </h3>
     
      <h3 className="alert-heading">Brain Tree: </h3>
      {showBrainTreeButton()}
    </div>
  );
};

export default PaymentB;
