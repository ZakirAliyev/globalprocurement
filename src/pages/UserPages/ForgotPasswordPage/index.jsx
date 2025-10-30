import './index.scss';
import { useTranslation } from "react-i18next";
import image1 from "/public/assets/kilid.png";
import PageBottom from "../../../components/PageBottom/index.jsx";
import PageTop from "../../../components/PageTop/index.jsx";
import { usePostForgotPasswordMutation } from "../../../services/userApi.jsx";
import { useFormik } from "formik";
import * as Yup from "yup";

function ForgotPasswordPage() {
    const { t } = useTranslation();
    const [postForgotPassword, { isLoading }] = usePostForgotPasswordMutation();

    const SignupSchema = Yup.object().shape({
        email: Yup.string()
            .email('Düzgün e-poçt daxil edin')
            .required('Bu xana məcburidir'),
    });

    const formik = useFormik({
        initialValues: { email: '' },
        validationSchema: SignupSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                await postForgotPassword(values).unwrap();
                alert("E-poçt ünvanınıza təsdiq linki göndərildi!");
                resetForm();
            } catch (err) {
                console.error(err);
                alert("Xəta baş verdi. Yenidən cəhd edin!");
            }
        },
    });

    return (
        <>
            <PageTop />
            <section id="forgotPasswordPage">
                <div className="container">
                    <form onSubmit={formik.handleSubmit}>
                        <div className="headerBlock">
                            <img src={image1} alt="Image" />
                            <h2>Şifrəni unutmusunuz?</h2>
                            <p>
                                E-poçtunuzu daxil edin. Şifrəni sıfırlamaq üçün təsdiq linki sizə
                                e-poçt vasitəsilə göndəriləcək.
                            </p>
                        </div>
                        <div className="labelRow">
                            <label htmlFor="email">E-poçt</label>
                            <span className="star">*</span>
                        </div>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="E-poçtunuzu daxil edin"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                            className={formik.errors.email && formik.touched.email ? "inputError" : ""}
                        />
                        {formik.errors.email && formik.touched.email && (
                            <div className="errorMsg">{formik.errors.email}</div>
                        )}
                        <button type="submit" disabled={isLoading}>
                            {isLoading ? "Göndərilir..." : "Giriş linkini göndər"}
                        </button>
                    </form>
                </div>
            </section>
            <PageBottom />
        </>
    );
}

export default ForgotPasswordPage;
