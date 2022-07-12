import React from "react";
import { useRouter } from "next/router";

import { DashboardLayout } from "components/layouts";

const DashboardHomePage = () => {
  const router = useRouter();

  React.useEffect(() => {
    router.push("/app/dashboard/orders");
  }, []);

  return <DashboardLayout title="Dashboard"></DashboardLayout>;
};

export default DashboardHomePage;
