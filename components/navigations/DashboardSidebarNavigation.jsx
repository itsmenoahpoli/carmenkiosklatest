import React from "react";
import { Container, Image, Button } from "react-bootstrap";
import {
  FiShoppingBag,
  FiShoppingCart,
  FiList,
  FiUsers,
  FiArchive,
  FiExternalLink
} from "react-icons/fi";
import moment from "moment";

const sidebarLinks = [
  {
    name: "Products",
    url: "/app/dashboard/products/",
    icon: <FiShoppingBag />,
  },
  {
    name: "Product Categories",
    url: "/app/dashboard/product-categories/",
    icon: <FiList />,
  },
  {
    name: "Orders",
    url: "/app/dashboard/orders/",
    icon: <FiShoppingCart />,
  },
  {
    name: "Employees",
    url: "/app/dashboard/employees/",
    icon: <FiUsers />,
  },
  {
    name: "Employee Payslips",
    url: "/app/dashboard/employee-payslips/",
    icon: <FiArchive />,
  },
  {
    name: "Open KIOSK App",
    url: "/app/kiosk/",
    icon: <FiExternalLink />,
  },
];

export const DashboardSidebarNavigation = (props) => {
  const { handleNavigate } = props;

  const [collapsible, setCollapsible] = React.useState(true);

  const getCurrentDatetime = () => {
    return moment().format("MMMM D, YYYY");
  };

  return (
    <Container
      fluid
      className={`dashboard-sidebar ${
        collapsible ? "dasbboard-sidebar-collapsible" : ""
      }`}
    >
      <Container fluid className="header text-center">
        <div className="d-flex justify-content-center align-items-center">
          <Image
            fluid
            src="/assets/images/brand-logo.jpg"
            alt="Brgy.pitogo logo"
            height={130}
            width={130}
          />
          &nbsp; &nbsp;
        </div>

        <p className="fw-bold mt-3">CARMEN&apos;S BULALO & INIHAW</p>

        <Container fluid className="text-content mt-3">
          {/* <p className="mb-0">
            User Role &mdash; <Badge bg="danger">ADMIN</Badge>
          </p> */}
          <p className="mb-0">Date today &mdash; {getCurrentDatetime()}</p>
        </Container>
      </Container>

      <hr />

      <Container fluid className="body">
        <p className="title text-white">&mdash; Manage</p>

        {sidebarLinks.map((_) => (
          <Button
            key={`${_.name}-btn-link`}
            title={_.name}
            onClick={() => handleNavigate(_.url)}
          >
            <span className="icon">{_.icon}</span>
            <span className="name">{_.name}</span>
          </Button>
        ))}
      </Container>
    </Container>
  );
};
