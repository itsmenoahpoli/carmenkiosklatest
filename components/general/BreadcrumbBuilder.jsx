import React from "react";
import { useRouter } from "next/router";
import { Breadcrumb } from "react-bootstrap";
import { FiHome } from "react-icons/fi";

export const BreadcrumbBuilder = () => {
  const router = useRouter();

  const renderBreadcrumbLinks = () => {
    let links = router.pathname.split("/");

    return links.map((_, idx) => {
      let linkName = _.replace("-", " ");

      return _ === "" ? null : (
        <Breadcrumb.Item key={idx}>{linkName}</Breadcrumb.Item>
      );
    });
  };

  return (
    <Breadcrumb>
      <Breadcrumb.Item active>
        <FiHome /> <span className="link-label">Dashboard Overview</span>
      </Breadcrumb.Item>
      {renderBreadcrumbLinks()}
    </Breadcrumb>
  );
};
