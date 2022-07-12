import React from "react";
import {
  Container,
  Row,
  Col,
  Image,
  Card,
  Button,
  Alert,
  Table,
} from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";

import { KioskLayout } from "components/layouts";
import { ProductCategoriesService } from "lib/services";

const productCategoriesService = new ProductCategoriesService();

const KioskPage = () => {
  const [categories, setCategories] = React.useState([])
  const [foodCart, setFoodCart] = React.useState([]);

  const getProductsByCategory = async (category) => {
    await productCategoriesService.getAll('').then(response => {
      setCategories(response.data)
    })
  };

  React.useEffect(() => {
    getProductsByCategory();
  }, []);


  const getTotalAmount = () => {
    let totalAmount = foodCart.reduce(function (acc, obj) {
      return parseInt(acc) + parseInt(obj.totalCost);
    }, 0);

    return totalAmount;
  };

  const handleAddToCart = (item) => {
    if (foodCart.length === 0) {
      setFoodCart([
        ...foodCart,
        {
          ...item,
          price: parseInt(item.price),
          totalCost: parseInt(item.price),
          quantity: 1,
        },
      ]);

      getTotalAmount();

      return;
    }

    for (let i = 0; i < foodCart.length; i++) {
      if (foodCart[i].name === item.name) {
        let oldCart = [...foodCart];

        oldCart[i].quantity = oldCart[i].quantity + 1;
        oldCart[i].totalCost =
          parseInt(oldCart[i].price) * parseInt(oldCart[i].quantity);

        setFoodCart(oldCart);

        getTotalAmount();
      } else {
        setFoodCart([
          ...foodCart,
          {
            ...item,
            price: parseInt(item.price),
            totalCost: parseInt(item.price),
            quantity: 1,
          },
        ]);

        getTotalAmount();
      }
    }
  };

  const renderProductItems = (items) => {
    if (!items || !items.length) {
      return (
        <Alert variant="warning">
          <small>No items available for selection</small>
        </Alert>
      );
    }

    if (items || items.length) {
      return items.map((item) => (
        <Col
          md={4}
          className="product-item text-center"
          key={`${item.id}${item.name}`}
        >
          <div className="product-item-content">
            <div className="mb-3">
              <Image
                fluid
                src={item.image_url ?? "/assets/images/img-placeholder.jpg"}
                alt="Brgy.pitogo logo"
                style={{height: "150px", width: "200px"}}
              />
            </div>
  
            <p className="mb-0">
              <small>{item.name}</small>
            </p>
            <p className="mb-0">
              <small>₱ {item.price}</small>
            </p>
            <Button variant="danger" onClick={() => handleAddToCart(item)}>
              +
            </Button>
          </div>
        </Col>
      ));
    }
  };

  const handleUpdateCartItemQty = (idx, method) => {
    let oldCart = [...foodCart];

    if (method === "-") {
      oldCart[idx].quantity = oldCart[idx].quantity - 1;
      oldCart[idx].totalCost =
        parseInt(oldCart[idx].quantity) * parseInt(oldCart[idx].price);
      setFoodCart(oldCart);
      return;
    }

    if (method === "+") {
      oldCart[idx].quantity = oldCart[idx].quantity + 1;
      oldCart[idx].totalCost =
        parseInt(oldCart[idx].quantity) * parseInt(oldCart[idx].price);
      setFoodCart(oldCart);

      return;
    }
  };

  const handleRemoveItemFromCart = (idx) => {
    let oldCart = [...foodCart];

    oldCart.splice(idx, 1);

    setFoodCart(oldCart);
    getTotalAmount();
  };

  const handleCheckout = async () => {
    const devURL = "http://localhost:8000/api/v1";
    const prodURL  = "https://sisig-barn-app.pwnp-ws.com/public/api/v1";

    const axiosBaseURL = prodURL;
    await axios
      .post(`${axiosBaseURL}/orders`, {
        table: 1,
        order_cart: foodCart,
        total_amount: getTotalAmount(),
        payment_method: "CASH",
      })
      .then((response) => {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Your order has been successfully submitted!",
          confirmButtonText: "Okay",
        });

        setFoodCart([]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const renderCartItems = (items) => {
    if (!items.length) {
      return (
        <tr>
          <td colSpan="12">
            <Alert variant="warning">
              <small>Your cart is empty</small>
            </Alert>
          </td>
        </tr>
      );
    }

    return items.map((item, idx) => (
      <tr key={`${idx}${item.name}${item.price}`}>
        <td>
          <button className="btn btn-danger btn-sm text-white" onClick={() => handleRemoveItemFromCart(idx)}><small>&times;</small></button>
        </td>
        <td>{item.name}</td>
        <td>
          {item.quantity}
          <div className="btn-group">
            <button
              onClick={() => handleUpdateCartItemQty(idx, "-")}
              disabled={Boolean(foodCart[idx].quantity === 1)}
            >
              -
            </button>
            <button onClick={() => handleUpdateCartItemQty(idx, "+")}>+</button>
          </div>
        </td>
        <td>₱ {parseInt(item.price) * parseInt(item.quantity)}</td>
      </tr>
    ));
  };

  const renderMenu = () => {
    if (!categories.length) {
      return <p>No products available</p>
    }

    return categories.map(c => <Card className="menu-card" key={`menu-category-${c.name}`}>
    <Card.Header>
      <h6>{c.name}</h6>
    </Card.Header>
    <Card.Body>
      <Container fluid className="product-scroll-container">
        <Row className="row">{renderProductItems(c.products)}</Row>
      </Container>
    </Card.Body>
  </Card>)
  }

  return (
    <KioskLayout>
      {/* <p>Loading ...</p> */}
      <Container className="d-block">
        <Row>
          <Col md={7}>
            <div className="text-center">
              <Image
                fluid
                src="/assets/images/sisig-barn-logo.png"
                alt="Brgy.pitogo logo"
                height={130}
                width={130}
              />
            </div>
            
            {renderMenu()}
          </Col>

          <Col md={5}>
            <Card className="order-card">
              <Card.Header>
                <h6>Your Cart</h6>
              </Card.Header>
              <Card.Body>
                <div className="cart-container">
                  <Table>
                    <thead>
                      <tr>
                        <td>&mdash;</td>
                        <td>Product</td>
                        <td>Quantity</td>
                        <td>Price</td>
                      </tr>
                    </thead>

                    <tbody>{renderCartItems(foodCart)}</tbody>
                  </Table>
                </div>

                <div className="d-flex justify-content-between align-items-baseline">
                  <Button
                    className="mt-4"
                    onClick={handleCheckout}
                    disabled={Boolean(!foodCart.length)}
                  >
                    CHECKOUT
                  </Button>

                  <p className="mb-0">TOTAL: ₱ {getTotalAmount()}</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </KioskLayout>
  );
};

export default KioskPage;
