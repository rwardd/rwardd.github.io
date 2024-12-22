import React, { FC } from "react";
import { COLORS } from "../../../theme";
import AdminDashboard from "../../AdminDashboard";
import Header from "../../Header";

const AdminPage: FC = () => {
  document.body.style.backgroundColor = COLORS.purple;

  return (
    <>
      <Header />
      <AdminDashboard />
    </>
  );
};

export default AdminPage;
