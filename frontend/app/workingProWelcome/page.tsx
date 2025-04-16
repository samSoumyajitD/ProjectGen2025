"use client";
import { withAuth } from "../../components/hoc/withAuth";
import LogoutButton from "../../components/AuthPageComponents/LogoutButton";

const workerWelcome = () => {
  return (
    <div>
      <h1>Hello worker</h1>
      <LogoutButton />
    </div>
  );
};

export default withAuth(workerWelcome, ["Working Professional"]);