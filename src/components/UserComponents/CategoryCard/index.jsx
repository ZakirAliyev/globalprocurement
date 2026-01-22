import "./index.scss";
import { useTranslation } from "react-i18next";
import { CATEGORY_IMAGES } from "../../../contants/index.js";
import { navigateToCategoryPage } from "../../../utils/index.js";

function CategoryCard({ item }) {
    const { i18n, t } = useTranslation();
    const lang = i18n.language;

    const categoryName =
        lang === "ru"
            ? item?.nameRu
            : lang === "en"
                ? item?.nameEng
                : item?.name;

    return (
        <section
            id="categoryCard"
            onClick={() => navigateToCategoryPage(item?.id)}
        >
            <div className="imageWrapper">
                <img
                    src={CATEGORY_IMAGES + item?.categoryImage}
                    alt={t("categoryCard.imageAlt", {
                        name: categoryName
                    })}
                    draggable={false}
                />
            </div>

            <span>{categoryName}</span>
        </section>
    );
}

export default CategoryCard;
