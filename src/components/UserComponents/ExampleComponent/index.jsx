import './index.scss'
import {useTranslation} from "react-i18next";

function ExampleComponent() {

    const {t} = useTranslation();

    return (
        <section id={"exampleComponent"}>
            <div className={"container"}>
                <nav>
                    ExampleComponent
                </nav>
            </div>
        </section>
    );
}

export default ExampleComponent;