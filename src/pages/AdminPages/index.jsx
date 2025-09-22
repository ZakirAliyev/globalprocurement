import './index.scss'
import {Outlet} from "react-router-dom";

function AdminPages() {
    return (
        <section id={"adminPages"}>
            <Outlet/>
        </section>
    );
}

export default AdminPages;