"use client"
import { withAuth } from "../../components/hoc/withAuth";
import {MainPageWelcome} from "../../components/CommonComponents/MainPage";
function MainPage(){
    return <div className=" dark:bg-black bg-white " >
<MainPageWelcome/>



    </div>
}
export default withAuth(MainPage, ["Student", "Working Professional"]);