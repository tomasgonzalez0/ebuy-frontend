import { Outlet } from "react-router-dom";
import Leftbar from "../../components/Leftbar/Leftbar";
import Styles from "./Supplier.module.css";

export default function Supplier() {
  const role = localStorage.getItem("role");

  return (
    <section className={Styles["supplier"]}>
      <Leftbar rol={role} />
      <div className={Styles["content"]}>
        <Outlet />
      </div>
    </section>
  );
}
