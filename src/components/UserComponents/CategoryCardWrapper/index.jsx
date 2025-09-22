import './index.scss'
import {useTranslation} from "react-i18next";
import CategoryCard from "../CategoryCard/index.jsx";

function CategoryCardWrapper({categories}) {

    const {t} = useTranslation();

    return (
        <section id={"categoryCardWrapper"}>
            <div className={"container"}>
                <nav>
                    {categories && categories.map((item, index) => (
                        <CategoryCard key={index} item={categories[index]} />
                    ))}
                </nav>
            </div>
        </section>
    );
}

export default CategoryCardWrapper;