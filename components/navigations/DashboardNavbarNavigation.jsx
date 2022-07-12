import React from "react";
import { useRouter } from "next/router";
import { Navbar, Nav, Container } from "react-bootstrap";
import Hamburger from "hamburger-react";

export const DashboardNavbarNavigation = (props) => {
  const router = useRouter();
  const [isToggled, setIsToggled] = React.useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");

    router.replace("/");
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container fluid>
        {/* <Navbar.Brand>Barangay Management System</Navbar.Brand> */}
        <Navbar.Toggle>
          <Hamburger toggled={isToggled} toggle={setIsToggled} size="24" />
        </Navbar.Toggle>

        <Navbar.Collapse className="justify-content-end">
          <Nav>
            <Nav.Link href="#" onClick={handleLogout}>
              Logout
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
