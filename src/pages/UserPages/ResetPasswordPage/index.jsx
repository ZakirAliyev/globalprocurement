import './index.scss';
import {useTranslation} from "react-i18next";
import image1 from "/src/assets/kilid.png";
import PageBottom from "../../../components/PageBottom/index.jsx";
import PageTop from "../../../components/PageTop/index.jsx";
import {useFormik} from "formik";
import * as Yup from "yup";
import {usePostResetPasswordMutation} from "../../../services/userApi.jsx";
import {useSearchParams} from "react-router-dom";
import {useNavigate} from "react-router";

function ResetPasswordPage() {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [postResetPassword, {isLoading}] = usePostResetPasswordMutation();

    const email = searchParams.get("email");
    const token = searchParams.get("token");

    // ✅ Validation schema
    const ResetSchema = Yup.object().shape({
        newPassword: Yup.string()
            .min(6, t("reset.validation.min"))
            .required(t("reset.validation.required")),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("newPassword"), null], t("reset.validation.match"))
            .required(t("reset.validation.required")),
    });

    // ✅ Formik setup
    const formik = useFormik({
        initialValues: {
            newPassword: "",
            confirmPassword: "",
        },
        validationSchema: ResetSchema,
        onSubmit: async (values, {resetForm}) => {
            try {
                await postResetPassword({
                    email,
                    token: encodeURIComponent(token),
                    newPassword: values.newPassword,
                }).unwrap();

                alert(t("reset.successAlert"));
                resetForm();
                navigate('/')
            } catch (err) {
                console.error(err);
                alert(t("reset.errorAlert"));
            }
        },
    });

    return (
        <>
            <PageTop/>
            <section id="resetPasswordPage">
                <div className="container">
                    <form onSubmit={formik.handleSubmit}>
                        {/* Header */}
                        <div className="headerBlock">
                            <img src={image1} alt="Image"/>
                            <h2>{t("reset.title")}</h2>
                            <p>{t("reset.description")}</p>
                        </div>

                        {/* Yeni şifrə */}
                        <div className="labelRow">
                            <label htmlFor="newPassword">{t("reset.newPassword")}</label>
                            <span className="star">*</span>
                        </div>
                        <input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            placeholder={t("reset.newPasswordPlaceholder")}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.newPassword}
                            className={
                                formik.errors.newPassword && formik.touched.newPassword
                                    ? "inputError"
                                    : ""
                            }
                        />
                        {formik.errors.newPassword && formik.touched.newPassword && (
                            <div className="errorMsg">{formik.errors.newPassword}</div>
                        )}

                        {/* Şifrə təkrar */}
                        <div className="labelRow" style={{marginTop: "8px"}}>
                            <label htmlFor="confirmPassword">{t("reset.confirmPassword")}</label>
                            <span className="star">*</span>
                        </div>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder={t("reset.confirmPasswordPlaceholder")}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.confirmPassword}
                            className={
                                formik.errors.confirmPassword && formik.touched.confirmPassword
                                    ? "inputError"
                                    : ""
                            }
                        />
                        {formik.errors.confirmPassword && formik.touched.confirmPassword && (
                            <div className="errorMsg">{formik.errors.confirmPassword}</div>
                        )}

                        {/* Submit düyməsi */}
                        <button type="submit" disabled={isLoading}>
                            {isLoading ? t("reset.loading") : t("reset.submit")}
                        </button>
                    </form>
                </div>
            </section>
            <PageBottom/>
        </>
    );
}

export default ResetPasswordPage;
