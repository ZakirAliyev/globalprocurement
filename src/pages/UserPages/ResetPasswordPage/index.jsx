import './index.scss';
import {useTranslation} from "react-i18next";
import image1 from "/public/assets/kilid.png";
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
            .min(6, "Şifrə ən azı 6 simvol olmalıdır")
            .required("Bu xana məcburidir"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("newPassword"), null], "Şifrələr uyğun deyil")
            .required("Bu xana məcburidir"),
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

                alert("Şifrəniz uğurla yeniləndi!");
                resetForm();
                navigate('/')
            } catch (err) {
                console.error(err);
                alert("Xəta baş verdi. Yenidən cəhd edin!");
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
                            <h2>Şifrənizi yeniləyin</h2>
                            <p>Hesabınıza giriş üçün yeni bir şifrə yaradın</p>
                        </div>

                        {/* Yeni şifrə */}
                        <div className="labelRow">
                            <label htmlFor="newPassword">Yeni şifrə</label>
                            <span className="star">*</span>
                        </div>
                        <input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            placeholder="Yeni şifrənizi daxil edin"
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
                            <label htmlFor="confirmPassword">Yenidən daxil edin</label>
                            <span className="star">*</span>
                        </div>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="Yeni şifrənizi təkrar daxil edin"
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
                            {isLoading ? "Göndərilir..." : "Təsdiqlə"}
                        </button>
                    </form>
                </div>
            </section>
            <PageBottom/>
        </>
    );
}

export default ResetPasswordPage;
