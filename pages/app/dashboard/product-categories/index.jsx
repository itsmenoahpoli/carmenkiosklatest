import React from "react";
import { Container, Button, Form, Card, Modal, Badge } from "react-bootstrap";

import { DashboardLayout } from "components/layouts";
import { TableBuilder } from "components/tables";
import { ProductCategoryForm } from "components/forms/by-modules";
import { ProductCategoriesService } from "lib/services";

const productCategoriesService = new ProductCategoriesService();

const EmployeesPage = () => {
  const [search, setSearch] = React.useState("");
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [categoryModal, setCategoryModal] = React.useState({
    show: false,
    data: null,
  });

  const getCategories = async (search) => {
    setLoading(true);
    const { data } = await productCategoriesService.getAll(search);

    setData(data);
    setLoading(false);
  };

  const handleFormSubmit = async (formData) => {
    if (categoryModal.data) {
      await productCategoriesService.updateCategoryById(
        categoryModal.data.id,
        formData
      );
      await getCategories("");
      handleCategoryModal(false, null);

      return;
    }

    await productCategoriesService.createCategory(formData);
    await getCategories("");

    handleCategoryModal(false, null);
  };

  const handleEditProduct = (data) => {
    handleCategoryModal(true, data);
  };

  const handleDeleteCategory = async (categoryId) => {
    if (confirm("Do you confirm to delete this product category?")) {
      await productCategoriesService.deleteCategoryById(categoryId);
      await getCategories("");
    }
  };

  const handleSearch = (search) => {
    setSearch(search);
  };

  const handleCategoryModal = (show, data) => {
    setCategoryModal({ show: show, data: data });
  };

  const tableColumns = React.useMemo(
    () => [
      {
        name: "Name",
        selector: (row) => row.name,
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
              onClick={() => handleDeleteCategory(row.id)}
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
    getCategories(search);
  }, []);

  React.useEffect(() => {
    if (search !== "") {
      getCategories(search);
    }
  }, [search]);
  return (
    <DashboardLayout title="Product Categories">
      <Container fluid className="datatable-header">
        <div>
          <Button
            variant="primary"
            onClick={() => handleCategoryModal(true, null)}
          >
            Add New Category
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
        show={categoryModal.show}
        onHide={() => handleCategoryModal(false, null)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Product Category</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <ProductCategoryForm
            values={categoryModal.data}
            formFns={{ formSubmitFn: handleFormSubmit }}
          />
        </Modal.Body>
      </Modal>
    </DashboardLayout>
  );
};

export default EmployeesPage;
