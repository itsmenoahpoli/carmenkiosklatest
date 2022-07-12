import React from "react";
import {
  Container,
  Button,
  Form,
  Card,
  Modal,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import TimeAgo from "javascript-time-ago";
import ReactTimeAgo from "react-time-ago";
import en from "javascript-time-ago/locale/en.json";
import ReactToPrint from "react-to-print";

import { DashboardLayout } from "components/layouts";
import { TableBuilder } from "components/tables";
import { OrdersService } from "lib/services";

TimeAgo.addDefaultLocale(en);
const ordersService = new OrdersService();

const OrdersPage = () => {
  const [search, setSearch] = React.useState("");
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [orderModal, setOrderModal] = React.useState({
    show: false,
    data: null,
  });

  const receiptRef = React.useRef(null);

  const getOrders = async (search) => {
    setLoading(true);
    const { data } = await ordersService.getAll(search);

    setData(data);
    setLoading(false);
  };

  const handleSearch = (search) => {
    setSearch(search);
  };

  const handleOrderModal = (show, data) => {
    setOrderModal({ show: show, data: data });
  };

  const handleMarkOrderAsServed = async () => {
    await ordersService.updateOrderById(orderModal.data.id, {
      status: "SERVED",
    });
    await getOrders("");

    handleOrderModal(false, null);
  };

  const formatOrderItems = (orderItems) => {
    if (orderItems) {
      let items = JSON.parse(orderItems);

      return (
        <ul>
          {items.map((item, idx) => (
            <li key={`${item.name}${idx}`}>
              &mdash; {item.name} x{item.quantity}
            </li>
          ))}
        </ul>
      );
    }
  };

  const tableColumns = React.useMemo(
    () => [
      {
        name: "Order Time",
        selected: (row) => row.created_at,
        sortable: true,
        cell: (row) => (
          <ReactTimeAgo date={new Date(row.created_at)} locale="en-US" />
        ),
      },
      {
        name: "Total Amount",
        selector: (row) => row.total_amount,
        sortable: true,
      },
      {
        name: "Payment Method",
        selector: (row) => row.payment_method,
        sortable: true,
      },
      {
        name: "Status",
        selector: (row) => row.status,
        sortable: true,
      },
      {
        name: "Actions",
        selector: (row) => row.id,
        sortable: true,
        right: true,
        cell: (row) => (
          <>
            <Button
              variant="link"
              className="mx-1"
              onClick={() => handleOrderModal(true, row)}
            >
              View
            </Button>
          </>
        ),
      },
    ],
    []
  );

  React.useEffect(() => {
    getOrders(search);
  }, []);

  React.useEffect(() => {
    if (search !== "") {
      getOrders(search);
    }
  }, [search]);
  return (
    <DashboardLayout title="Orders">
      <Container fluid className="datatable-header">
        <div></div>

        <div className="col-sm-6 col-md-4 d-flex">
          <Form.Control
            type="text"
            placeholder="Search"
            className="shadow-sm"
            onChange={(e) => handleSearch(e.target.value)}
            autoFocus
          />
        </div>
      </Container>

      <Card className="card-datatable">
        <Card.Body>
          <TableBuilder columns={tableColumns} data={data} loading={loading} />
        </Card.Body>
      </Card>

      {/* MODAL */}
      <Modal
        size="lg"
        show={orderModal.show}
        onHide={() => handleOrderModal(false, null)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div
            ref={receiptRef}
            style={{ width: "70%", padding: "40px", margin: "0 auto" }}
          >
            <Row>
              <Col>
                <div className="mb-2">
                  <p className="fw-bold mb-0">Total Amount</p>
                  <small>₱ {orderModal.data?.total_amount}</small>
                </div>

                <div className="mb-2">
                  <p className="fw-bold mb-0">Payment Method</p>
                  <small>{orderModal.data?.payment_method}</small>
                </div>

                <div className="mb-2">
                  <p className="fw-bold mb-0">Status</p>
                  <small>{orderModal.data?.status}</small>
                </div>
              </Col>

              <Col>
                <div className="mb-2">
                  <p className="fw-bold mb-0">Voided</p>
                  <small>
                    {orderModal.data?.is_voided ? "VOIDED" : "NOT VOIDED"}
                  </small>
                </div>

                <div className="mb-2">
                  <p className="fw-bold mb-0">Order Items</p>
                  <small>{formatOrderItems(orderModal.data?.order_cart)}</small>
                  {console.log(orderModal.data)}
                </div>
              </Col>
            </Row>
          </div>

          <Container>
            <ReactToPrint
              trigger={() => (
                <Button variant="primary" className="mb-2">
                  Print Receipt
                </Button>
              )}
              content={() => receiptRef.current}
            />
          </Container>

          <br />

          <Container>
            {Boolean(orderModal.data?.status === "SERVED") && (
              <Alert variant="success">
                <small>ORDER SERVED</small>
              </Alert>
            )}

            {Boolean(orderModal.data?.status === "PENDING") && (
              <Button onClick={() => handleMarkOrderAsServed()}>
                MARK AS SERVED
              </Button>
            )}
          </Container>
        </Modal.Body>
      </Modal>
    </DashboardLayout>
  );
};

export default OrdersPage;
