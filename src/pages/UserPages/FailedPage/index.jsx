import './index.scss'
import {useTranslation} from "react-i18next";
import image1 from "/public/assets/failed.png"

function FailedPage() {

    const {t} = useTranslation();

    return (
        <section id={"failedPage"}>
            <div className={"container"}>
                <nav>
                    <img src={image1} alt={"Image"}/>
                    <h2>Uğursuz!</h2>
                    <p>Köçürmə prosesi qeydə alınmadı</p>
                </nav>
            </div>
        </section>
    );
}

export default FailedPage;