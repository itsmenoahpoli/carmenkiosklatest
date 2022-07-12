import React from "react";
import Head from "next/head";
import Link from "next/link";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import { Container } from "react-bootstrap";

import {
  DashboardSidebarNavigation,
  DashboardNavbarNavigation,
} from "components/navigations";
import { BreadcrumbBuilder } from "components/general";

const toastOptions = {
  style: {
    fontSize: "12px",
    color: "#252525",
  },
};

export const DashboardLayout = (props) => {
  const router = useRouter();
  const { title, children } = props;

  const handleNavigate = (url) => {
    router.push(url);
  };

  const getCurrentYear = () => {
    return new Date().getFullYear();
  };

  React.useEffect(() => {
    if (
      localStorage.getItem("user") === null &&
      localStorage.getItem("accessToken") === null
    ) {
      router.push("/");
    }
  }, []);

  return (
    <>
      <Head>
        <title>Carmen Resto &mdash; {title || "Dashboard"}</title>
      </Head>

      <Container fluid className="dashboard-layout">
        <Toaster toastOptions={toastOptions} />

        <DashboardSidebarNavigation handleNavigate={handleNavigate} />

        <Container fluid className="dashboard-content">
          <DashboardNavbarNavigation />

          <Container fluid className="dashboard-page-content">
            <Container className="dashboard-page-content-body">
              <Container fluid className="mb-4">
                <BreadcrumbBuilder />
                <h3 className="dashboard-page-title">{title || "Dashboard"}</h3>
              </Container>

              {children}
            </Container>
          </Container>

          <div className="copyright-container shadow-lg">
            &#169; &nbsp;
            <small>CARMEN&apos;S RESTO {getCurrentYear()}</small>
          </div>
        </Container>
      </Container>
    </>
  );
};
