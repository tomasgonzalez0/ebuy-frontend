import { Outlet } from "react-router-dom";
import Leftbar from "../../components/Leftbar/Leftbar";
import Styles from "./Employee.module.css";

export default function Employee() {
  const role = localStorage.getItem("role");
  return (
    <section className={Styles["employee"]}>
      <Leftbar rol={role} />
      <div className={Styles["content"]}>
        <Outlet />
      </div>
    </section>
  );
}
