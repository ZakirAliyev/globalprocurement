import './index.scss'
import {useTranslation} from "react-i18next";
import {CATEGORY_IMAGES} from "../../../contants/index.js";
import {navigateToCategoryPage} from "../../../utils/index.js";

function CategoryCard({item}) {

    const {t} = useTranslation();

    return (
        <section id={"categoryCard"} onClick={()=> navigateToCategoryPage(item?.id)}>
            <img src={CATEGORY_IMAGES + item?.categoryImage} alt={"Image"} draggable={false}/>
            <span>{item?.name}</span>
        </section>
    );
}

export default CategoryCard;