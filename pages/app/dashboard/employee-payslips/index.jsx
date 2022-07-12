import React from "react";
import { Container, Button, Form, Card, Modal } from "react-bootstrap";

import { DashboardLayout } from "components/layouts";
import { TableBuilder } from "components/tables";
import { EmployeePayslipForm } from "components/forms/by-modules";
import { EmployeePayslipsService, EmployeeService } from "lib/services";

const employeePayslipsService = new EmployeePayslipsService();
const employeesService = new EmployeeService();

const EmployeePayslipsPage = () => {
  const [search, setSearch] = React.useState("");
  const [data, setData] = React.useState([]);
  const [employees, setEmployees] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [employeePayslipModal, setEmployeePayslipModal] = React.useState({
    show: false,
    data: null,
  });

  const getEmployeePayslips = async (search) => {
    setLoading(true);
    const { data } = await employeePayslipsService.getAll(search);

    setData(data);
    setLoading(false);
  };

  const getEmployees = async () => {
    const { data } = await employeesService.getAll("");

    setEmployees(data);
  };

  const handleFormSubmit = async (formData) => {
    if (employeePayslipModal.data) {
      await employeePayslipsService.updateEmployeePayslipById(
        employeePayslipModal.data.id,
        formData
      );
      await getEmployeePayslips("");
      handleEmployeePayslipModal(false, null);

      return;
    }

    await employeePayslipsService.createEmployeePayslip(formData);
    await getEmployeePayslips("");

    handleEmployeePayslipModal(false, null);
  };

  const handleEmployeePayslipModalShow = (data) => {
    handleEmployeePayslipModal(true, data);
  };

  const handleSearch = (search) => {
    setSearch(search);
  };

  const handleEmployeePayslipModal = (show, data) => {
    setEmployeePayslipModal({ show: show, data: data });
  };

  const tableColumns = React.useMemo(
    () => [
      {
        name: "Payslip No.",
        selector: (row) => row.payslip_no,
        sortable: true,
      },
      {
        name: "Name",
        selector: (row) => row.employee.name,
        sortable: true,
      },
      {
        name: "Salary Amount",
        selector: (row) => row.salary_amount,
        sortable: true,
        cell: (row) => `₱ ${row.salary_amount}`,
      },
      {
        name: "Deduction Amount",
        selector: (row) => row.deduction_amount,
        sortable: true,
        cell: (row) => `₱ ${row.deduction_amount}`,
      },
      {
        name: "Deduction Reason",
        selector: (row) => row.deduction_reason,
        sortable: true,
      },
      {
        name: "Payroll Month",
        selector: (row) => row.payroll_for_date,
        sortable: true
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
              onClick={() => handleEmployeePayslipModalShow(row)}
            >
              VIEW
            </Button>
          </>
        ),
      },
    ],
    []
  );

  React.useEffect(() => {
    getEmployeePayslips(search);
    getEmployees("");
  }, []);

  React.useEffect(() => {
    if (search !== "") {
      getEmployeePayslips(search);
    }
  }, [search]);
  return (
    <DashboardLayout title="Employee Payslips">
      <Container fluid className="datatable-header">
        <div>
          <Button
            variant="primary"
            onClick={() => handleEmployeePayslipModal(true, null)}
          >
            Add New Employee Payslip
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
        show={employeePayslipModal.show}
        onHide={() => handleEmployeePayslipModal(false, null)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Employee Payslip Details</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <EmployeePayslipForm
            values={employeePayslipModal.data}
            employees={employees}
            formFns={{ formSubmitFn: handleFormSubmit }}
          />
        </Modal.Body>
      </Modal>
    </DashboardLayout>
  );
};

export default EmployeePayslipsPage;
