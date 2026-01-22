import './index.scss'
import { IoEyeOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";

function ImagePreview() {
    const { t } = useTranslation();

    return (
        <section id="imagePreview">
            <IoEyeOutline />
            <span>{t("imagePreview.zoom")}</span>
        </section>
    );
}

export default ImagePreview;
