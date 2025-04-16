"use client";
import { withAuth } from "../../components/hoc/withAuth";
import ProfileQuiz from "../../components/CommonComponents/Quiz/ProfileQuiz"
const profile = () => {
  return (
    <div>
     <ProfileQuiz/>
    </div>
  );
};

// Pass an array of allowed roles
export default withAuth(profile, ["Student", "Working Professional"]);
