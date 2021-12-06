import React, { useState, useEffect } from "react";
import "../styles.css";
import { API } from "../backend";
import Base from "./Base";
import Card from "./Card";
import { loadCart } from "./helper/CartHelper";
import PaymentB from "./PaymentB";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth/helper";

const Cart = () => {
  const [products, setProducts] = useState([]);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    setProducts(loadCart());
  }, [reload]);

  const loadAllProducts = (products) => {
    return (
      <div>
        <h2>This section is to load products</h2>
        {products.map((product, index) => (
          <Card
            key={index}
            product={product}
            removeFromCart={true}
            addtoCart={false}
            setReload={setReload}
            reload={reload}
          />
        ))}
      </div>
    );
  };

  const loadCheckout = () => {
    return (
      <div>
        <h2>This section for checkout</h2>
      </div>
    );
  };

  return (
    <Base
      title="Cart Page"
      description="Buy the T-Shirt as soon as offer goes off"
    >
      <div className="row text-center">
        <div className="col-6">
          {products && products.length > 0 ? (
            loadAllProducts(products)
          ) : (
            <h3>No Products</h3>
          )}
        </div>
        <div className="col-6">
          <PaymentB products={products} setReload={setReload} />

          {isAuthenticated() ? (
            <div></div>
          ) : (
            <Link to="/signin">
              <button className="btn btn-block rounded btn-outline-success">
                SignIn
              </button>
            </Link>
          )}
        </div>
      </div>
    </Base>
  );
};

export default Cart;
