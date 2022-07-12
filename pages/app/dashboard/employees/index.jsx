import React from "react";
import { Container, Button, Form, Card, Modal, Badge } from "react-bootstrap";

import { DashboardLayout } from "components/layouts";
import { TableBuilder } from "components/tables";
import { EmployeeForm } from "components/forms/by-modules";
import { EmployeeService } from "lib/services";

const employeesService = new EmployeeService();

const EmployeesPage = () => {
  const [search, setSearch] = React.useState("");
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [employeeModal, setEmployeeModal] = React.useState({
    show: false,
    data: null,
  });

  const getEmployees = async (search) => {
    setLoading(true);
    const { data } = await employeesService.getAll(search);

    setData(data);
    setLoading(false);
  };

  const handleFormSubmit = async (formData) => {
    if (employeeModal.data) {
      await employeesService.updateEmployeeById(
        employeeModal.data.id,
        formData
      );
      await getEmployees("");
      handleEmployeeModal(false, null);

      return;
    }

    await employeesService.createEmployee(formData);
    await getEmployees("");

    handleEmployeeModal(false, null);
  };

  const handleEditProduct = (data) => {
    handleEmployeeModal(true, data);
  };

  const handleDeleteProduct = async (employeeId) => {
    if (confirm("Do you confirm to delete this employee record?")) {
      await employeesService.deleteEmployeeById(employeeId);
      await getEmployees("");
    }
  };

  const handleSearch = (search) => {
    setSearch(search);
  };

  const handleEmployeeModal = (show, data) => {
    setEmployeeModal({ show: show, data: data });
  };

  const formatEmployeeContacts = (contacts) => {
    return contacts;
  };

  const tableColumns = React.useMemo(
    () => [
      {
        name: "Employee No.",
        selector: (row) => row.emp_no,
        sortable: true,
      },
      {
        name: "Status",
        selector: (row) => row.is_enabled,
        sortable: true,
        cell: row => {
          return row.status ? <Badge bg="success">Enabled</Badge> : <Badge bg="danger">Disabled</Badge>
        }
      },
      {
        name: "Name",
        selector: (row) => row.name,
        sortable: true,
      },
      {
        name: "Email",
        selector: (row) => row.email,
        sortable: true,
      },
      {
        name: "Contacts",
        selector: (row) => row.contacts,
        sortable: true,
        cell: (row) => formatEmployeeContacts(row.contacts),
      },
      {
        name: "Address",
        selector: (row) => row.address,
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
            {/* <Button
              variant="link"
              className="mx-1"
              onClick={() => handleDeleteProduct(row.id)}
            >
              Delete
            </Button> */}
          </>
        ),
      },
    ],
    []
  );

  React.useEffect(() => {
    getEmployees(search);
  }, []);

  React.useEffect(() => {
    if (search !== "") {
      getEmployees(search);
    }
  }, [search]);
  return (
    <DashboardLayout title="Employees">
      <Container fluid className="datatable-header">
        <div>
          <Button
            variant="primary"
            onClick={() => handleEmployeeModal(true, null)}
          >
            Add New Employee
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
        show={employeeModal.show}
        onHide={() => handleEmployeeModal(false, null)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Employee Form</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <EmployeeForm
            values={employeeModal.data}
            formFns={{ formSubmitFn: handleFormSubmit }}
          />
        </Modal.Body>
      </Modal>
    </DashboardLayout>
  );
};

export default EmployeesPage;
