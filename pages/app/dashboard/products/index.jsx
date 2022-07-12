import React from "react";
import { Container, Button, Form, Card, Modal, Image } from "react-bootstrap";

import { DashboardLayout } from "components/layouts";
import { TableBuilder } from "components/tables";
import { ProductForm } from "components/forms/by-modules";
import { ProductsService } from "lib/services";

const productsService = new ProductsService();

const ProductsPage = () => {
  const [search, setSearch] = React.useState("");
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [productModal, setProductModal] = React.useState({
    show: false,
    data: null,
  });

  const getProducts = async (search) => {
    setLoading(true);
    const { data } = await productsService.getAll(search);

    setData(data);
    setLoading(false);
  };

  const handleFormSubmit = async (formData) => {
    if (productModal.data) {
      await productsService.updateProductById(productModal.data.id, formData);
      await getProducts("");
      setProductModal({ show: false, data: null });

      return;
    }

    await productsService.createProduct(formData);
    await getProducts("");

    handleProductModal(false, null);
  };

  const handleEditProduct = (data) => {
    handleProductModal(true, data);
  };

  const handleDeleteProduct = async (productId) => {
    if (confirm("Do you confirm to delete this product?")) {
      await productsService.deleteProductById(productId);
      await getProducts("");
    }
  };

  const handleSearch = (search) => {
    setSearch(search);
  };

  const handleProductModal = (show, data) => {
    setProductModal({ show: show, data: data });
  };

  const tableColumns = React.useMemo(
    () => [
      {
        name: <p>&mdash;</p>,
        selector: (row) => row.image_url,
        sortable: true,
        cell: row => <Container fluid className="fluid">
          <Image src={row.image_url} alt={row.image_url} fluid style={{height: '100px', width: '100px', borderRadius: '10px'}} />
        </Container>
      },
      {
        name: "Product",
        selector: (row) => row.name,
        sortable: true,
      },
      {
        name: "Category",
        selector: (row) => row.product_category.name,
        sortable: true,
      },
      {
        name: "Price",
        selector: (row) => row.price,
        sortable: true,
      },
      {
        name: "Description",
        selector: (row) => row.description,
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
              onClick={() => handleEditProduct(row)}
            >
              Edit
            </Button>
            <Button
              variant="link"
              className="mx-1"
              onClick={() => handleDeleteProduct(row.id)}
            >
              Delete
            </Button>
          </>
        ),
      },
    ],
    []
  );

  

  React.useEffect(() => {
    getProducts(search);
  }, []);

  React.useEffect(() => {
    if (search !== "") {
      getProducts(search);
    }
  }, [search]);
  return (
    <DashboardLayout title="Products">
      <Container fluid className="datatable-header">
        <div>
          <Button
            variant="primary"
            onClick={() => handleProductModal(true, null)}
          >
            Add New Product
          </Button>
        </div>

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
        show={productModal.show}
        onHide={() => handleProductModal(false, null)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Product Form</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <ProductForm
            values={productModal.data}
            formFns={{ formSubmitFn: handleFormSubmit }}
          />
        </Modal.Body>
      </Modal>
    </DashboardLayout>
  );
};

export default ProductsPage;
