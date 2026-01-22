import './index.scss';
import { useTranslation } from "react-i18next";
import image1 from "/public/assets/kilid.png";
import PageBottom from "../../../components/PageBottom/index.jsx";
import PageTop from "../../../components/PageTop/index.jsx";
import { usePostForgotPasswordMutation } from "../../../services/userApi.jsx";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";

function ForgotPasswordPage() {
    const { t } = useTranslation();
    const [postForgotPassword, { isLoading }] = usePostForgotPasswordMutation();
    const [success, setSuccess] = useState(false);

    const SignupSchema = Yup.object().shape({
        email: Yup.string()
            .email(t("forgot.validation.email"))
            .required(t("forgot.validation.required")),
    });

    const formik = useFormik({
        initialValues: { email: '' },
        validationSchema: SignupSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                await postForgotPassword(values).unwrap();
                setSuccess(true);
                resetForm();
            } catch (err) {
                console.error(err);
                alert(t("forgot.error"));
            }
        },
    });

    return (
        <>
            <PageTop />
            <section id="forgotPasswordPage">
                <div className="container">
                    {!success ? (
                        <form onSubmit={formik.handleSubmit} className="formBox">
                            <div className="headerBlock">
                                <img src={image1} alt="Image" />
                                <h2>{t("forgot.title")}</h2>
                                <p>{t("forgot.description")}</p>
                            </div>

                            <div className="labelRow">
                                <label htmlFor="email">{t("forgot.emailLabel")}</label>
                                <span className="star">*</span>
                            </div>

                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder={t("forgot.emailPlaceholder")}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.email}
                                className={formik.errors.email && formik.touched.email ? "inputError" : ""}
                            />
                            {formik.errors.email && formik.touched.email && (
                                <div className="errorMsg">{formik.errors.email}</div>
                            )}

                            <button type="submit" disabled={isLoading}>
                                {isLoading
                                    ? t("forgot.loading")
                                    : t("forgot.submit")}
                            </button>
                        </form>
                    ) : (
                        <form>
                            <div className="successBox">
                                <FaCheckCircle className="successIcon" />
                                <h2>{t("forgot.successTitle")}</h2>
                                <p>
                                    {t("forgot.successText1")}
                                    <br />
                                    <strong>{t("forgot.successText2")}</strong>
                                </p>
                            </div>
                        </form>
                    )}
                </div>
            </section>
            <PageBottom />
        </>
    );
}

export default ForgotPasswordPage;
