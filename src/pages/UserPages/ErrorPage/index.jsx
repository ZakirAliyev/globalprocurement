import './index.scss'
import {useTranslation} from "react-i18next";
import image1 from "/public/assets/error.png"

function ErrorPage() {

    const {t} = useTranslation();

    return (
        <section id={"errorPage"}>
            <div className={"container"}>
                <nav>
                    <img src={image1} alt={"Image"}/>
                    <button>Geri qayıt</button>
                </nav>
            </div>
        </section>
    );
}

export default ErrorPage;