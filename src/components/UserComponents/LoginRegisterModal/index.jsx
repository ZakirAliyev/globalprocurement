import { useState, useEffect } from 'react';
import './index.scss';
import { useTranslation } from 'react-i18next';
import { RxCross2 } from 'react-icons/rx';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { PulseLoader } from 'react-spinners';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import ErrorMessageComponent from '../../ErrorMessageComponent/index.jsx';
import {
    usePostUserLoginMutation,
    usePostUserRegisterMutation
} from '../../../services/userApi.jsx';
import { useAuth } from '../../../context/AuthContext/index.jsx';

function LoginRegisterModal({ onClose }) {
    const { t } = useTranslation();
    const { setAuth } = useAuth();
    const [activeTab, setActiveTab] = useState('login');
    const [visible, setVisible] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [authLoading, setAuthLoading] = useState(false);

    const [postUserLogin, { isLoading: loadingUserLogin }] =
        usePostUserLoginMutation();
    const [postUserRegister, { isLoading: loadingUserRegister }] =
        usePostUserRegisterMutation();

    useEffect(() => {
        const id = setTimeout(() => setVisible(true), 10);
        return () => clearTimeout(id);
    }, []);

    useEffect(() => {
        document.body.style.overflow = visible ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [visible]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setShowPassword(false);
    };

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 300);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const loginSchema = Yup.object().shape({
        email: Yup.string().email(t("loginRegisterModal.validation.emailFormat")).required(t("loginRegisterModal.validation.required")),
        password: Yup.string().required(t("loginRegisterModal.validation.required")),
    });

    const registerSchema = Yup.object().shape({
        name: Yup.string().required(t("loginRegisterModal.validation.required")),
        surname: Yup.string().required(t("loginRegisterModal.validation.required")),
        companyName: Yup.string().optional(),
        phoneNumber: Yup.string()
            .matches(/^(994\d{9}|0\d{9})$/, t("loginRegisterModal.validation.phoneFormat"))
            .required(t("loginRegisterModal.validation.required")),
        email: Yup.string().email(t("loginRegisterModal.validation.emailFormat")).required(t("loginRegisterModal.validation.required")),
        password: Yup.string()
            .min(6, t("loginRegisterModal.validation.passwordMin"))
            .matches(/[A-Z]/, t("loginRegisterModal.validation.passwordUpper"))
            .matches(/[a-z]/, t("loginRegisterModal.validation.passwordLower"))
            .matches(/[0-9]/, t("loginRegisterModal.validation.passwordNumber"))
            .matches(/[^A-Za-z0-9]/, t("loginRegisterModal.validation.passwordSpecial"))
            .required(t("loginRegisterModal.validation.required")),
    });

    const handleSubmit = async (values) => {
        const formatted = { ...values };
        if (activeTab === 'register' && values.phoneNumber) {
            formatted.phoneNumber = `+${values.phoneNumber}`;
        }

        setAuthLoading(true);

        if (activeTab === 'login') {
            try {
                const res = await postUserLogin(formatted).unwrap();
                if (res.statusCode === 200) {
                    const authData = {
                        token: res.data.token,
                        expireDate: res.data.expireDate,
                        role: res.data.role,
                    };
                    localStorage.setItem('auth', JSON.stringify(authData));
                    setAuth(authData);

                    alert(t("loginRegisterModal.successLogin"));
                    handleClose();
                }
            } catch {
                console.error('Giriş xətası:', err);
                setErrors({ submit: t("loginRegisterModal.errorLogin") });
            } finally {
                setAuthLoading(false);
            }
        } else {
            // register
            try {
                const reg = await postUserRegister(formatted).unwrap();
                if (reg.statusCode === 201) {
                    // avtomatik login
                    const loginRes = await postUserLogin({
                        email: values.email,
                        password: values.password,
                    }).unwrap();

                    if (loginRes.statusCode === 200) {
                        const authData = {
                            token: loginRes.data.token,
                            expireDate: loginRes.data.expireDate,
                            role: loginRes.data.role,
                        };
                        localStorage.setItem('auth', JSON.stringify(authData));
                        setAuth(authData);

                        alert(t("loginRegisterModal.successRegister"));
                        handleClose();
                    }
                }
            } catch (e) {
                setErrors({
                    submit: err.data?.message || t("loginRegisterModal.errorRegister"),
                });
            } finally {
                setAuthLoading(false);
            }
        }
    };

    return (
        <section id="loginRegisterModal" className={visible ? 'visible' : ''}>
            <div className="overlay" onClick={handleClose} />
            <div className="modal-content">
                <button className="close-button" onClick={handleClose}>
                    <RxCross2 />
                </button>

                <div className="tab">
                    <div className="tab-header">
                        <button
                            className={`tab-button ${activeTab === 'login' ? 'active' : ''}`}
                            onClick={() => handleTabChange('login')}
                        >
                            {t("loginRegisterModal.login")}
                        </button>
                        <button
                            className={`tab-button ${
                                activeTab === 'register' ? 'active' : ''
                            }`}
                            onClick={() => handleTabChange('register')}
                        >
                            {t("loginRegisterModal.register")}

                        </button>
                    </div>
                    <div className="tab-content">
                        {activeTab === 'login' ? (
                            <div className="tab-pane" key="login">
                                <Formik
                                    initialValues={{ email: '', password: '' }}
                                    validationSchema={loginSchema}
                                    onSubmit={handleSubmit}
                                    enableReinitialize
                                >
                                    {({ isSubmitting }) => (
                                        <Form autoComplete="off">
                                            {/* — E-poçt */}
                                            <div className="form-group">
                                                <label htmlFor="login-email">
                                                    <span>E-poçt ünvanı</span>
                                                    <span className="star"> *</span>
                                                </label>
                                                <Field
                                                    type="email"
                                                    id="login-email"
                                                    name="email"
                                                    placeholder={t("loginRegisterModal.emailPlaceholder")}

                                                    autoComplete="off"
                                                />
                                                <ErrorMessageComponent name="email" />
                                            </div>
                                            {/* — Şifrə */}
                                            <div className="form-group">
                                                <label htmlFor="login-password">
                                                    <label>{t("loginRegisterModal.password")}</label>

                                                    <span className="star"> *</span>
                                                </label>
                                                <div className="password-wrapper">
                                                    <Field
                                                        type={showPassword ? 'text' : 'password'}
                                                        id="login-password"
                                                        name="password"
                                                        placeholder={t("loginRegisterModal.passwordPlaceholder")}

                                                        autoComplete="new-password"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="password-toggle"
                                                        onClick={togglePasswordVisibility}
                                                    >
                                                        {showPassword ? (
                                                            <AiOutlineEyeInvisible />
                                                        ) : (
                                                            <AiOutlineEye />
                                                        )}
                                                    </button>
                                                </div>
                                                <ErrorMessageComponent name="password" />
                                            </div>
                                            {/* — Forgot */}
                                            <div className="forgotPass">
                                                <span>{t("loginRegisterModal.forgotPassword")} </span>{' '}
                                                <Link to="/forgot-password" className="link">
                                                    {t("loginRegisterModal.recoverLink")}
                                                </Link>
                                            </div>
                                            {/* — Submit */}
                                            <button
                                                type="submit"
                                                className="submit-button123"
                                                disabled={
                                                    authLoading || isSubmitting || loadingUserLogin
                                                }
                                            >
                                                {authLoading || loadingUserLogin ? (
                                                    <PulseLoader size={6} color="#ffffff" />
                                                ) : (
                                                    <span>{t("loginRegisterModal.loginButton")}</span>

                                                )}
                                            </button>
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        ) : (
                            <div className="tab-pane" key="register">
                                <Formik
                                    initialValues={{
                                        name: '',
                                        surname: '',
                                        companyName: '',
                                        email: '',
                                        phoneNumber: '',
                                        password: '',
                                    }}
                                    validationSchema={registerSchema}
                                    onSubmit={handleSubmit}
                                    enableReinitialize
                                >
                                    {({ isSubmitting }) => (
                                        <Form autoComplete="off">
                                            {/* — Name / Surname */}
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    flexWrap: 'wrap',
                                                    gap: '16px',
                                                }}
                                            >
                                                <div
                                                    className="form-group"
                                                    style={{ flex: '0 0 47%' }}
                                                >
                                                    <label htmlFor="register-name">
                                                        <label>{t("loginRegisterModal.name")}</label>

                                                        <span className="star"> *</span>
                                                    </label>
                                                    <Field
                                                        type="text"
                                                        id="register-name"
                                                        name="name"
                                                        placeholder={t("loginRegisterModal.namePlaceholder")}

                                                        autoComplete="off"
                                                    />
                                                    <ErrorMessageComponent name="name" />
                                                </div>
                                                <div
                                                    className="form-group"
                                                    style={{ flex: '0 0 47%' }}
                                                >
                                                    <label htmlFor="register-surname">
                                                        <label>{t("loginRegisterModal.surname")}</label>

                                                        <span className="star"> *</span>
                                                    </label>
                                                    <Field
                                                        type="text"
                                                        id="register-surname"
                                                        name="surname"
                                                        placeholder={t("loginRegisterModal.surnamePlaceholder")}

                                                        autoComplete="off"
                                                    />
                                                    <ErrorMessageComponent name="surname" />
                                                </div>
                                            </div>
                                            {/* — Company */}
                                            <div className="form-group">
                                                <label htmlFor="register-companyName">
                                                    <label>{t("loginRegisterModal.companyName")}</label>

                                                    <span className="star"> *</span>
                                                </label>
                                                <Field
                                                    type="text"
                                                    id="register-companyName"
                                                    name="companyName"
                                                    placeholder={t("loginRegisterModal.companyPlaceholder")}

                                                    autoComplete="off"
                                                />
                                                <ErrorMessageComponent name="companyName" />
                                            </div>
                                            {/* — Email */}
                                            <div className="form-group">
                                                <label htmlFor="register-email">
                                                    <label>{t("loginRegisterModal.email")}</label>

                                                    <span className="star"> *</span>
                                                </label>
                                                <Field
                                                    type="email"
                                                    id="register-email"
                                                    name="email"
                                                    placeholder={t("loginRegisterModal.emailPlaceholder")}

                                                    autoComplete="off"
                                                />
                                                <ErrorMessageComponent name="email" />
                                            </div>
                                            {/* — Phone */}
                                            <div className="form-group">
                                                <label htmlFor="register-phoneNumber">
                                                    <label>{t("loginRegisterModal.phoneNumber")}</label>

                                                    <span className="star"> *</span>
                                                </label>
                                                <Field name="phoneNumber">
                                                    {({ field, form }) => (
                                                        <PhoneInput
                                                            country={'az'}
                                                            value={field.value}
                                                            onChange={(phone) =>
                                                                form.setFieldValue(
                                                                    field.name,
                                                                    phone.replace(/^\+/, '')
                                                                )
                                                            }
                                                            inputClass={`phone-input `}

                                                            onlyCountries={['az']}
                                                            disableDropdown
                                                            countryCodeEditable={false}
                                                            inputProps={{
                                                                name: 'phone',
                                                                required: true,
                                                                placeholder: 'xx xxx xx xx',
                                                            }}
                                                            containerStyle={{ width: '100%' }}
                                                        />
                                                    )}
                                                </Field>
                                                <ErrorMessageComponent name="phoneNumber" />
                                            </div>
                                            {/* — Password */}
                                            <div className="form-group">
                                                <label htmlFor="register-password">
                                                    <label>{t("loginRegisterModal.password")}</label>

                                                    <span className="star"> *</span>
                                                </label>
                                                <div className="password-wrapper">
                                                    <Field
                                                        type={showPassword ? 'text' : 'password'}
                                                        id="register-password"
                                                        name="password"
                                                        placeholder={t("loginRegisterModal.passwordPlaceholder")}

                                                        autoComplete="new-password"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="password-toggle"
                                                        onClick={togglePasswordVisibility}
                                                    >
                                                        {showPassword ? (
                                                            <AiOutlineEyeInvisible />
                                                        ) : (
                                                            <AiOutlineEye />
                                                        )}
                                                    </button>
                                                </div>
                                                <ErrorMessageComponent name="password" />
                                            </div>
                                            {/* — Submit */}
                                            <button
                                                type="submit"
                                                className="submit-button123 submit-button1"
                                                disabled={
                                                    authLoading || isSubmitting || loadingUserRegister
                                                }
                                            >
                                                {authLoading || loadingUserRegister ? (
                                                    <PulseLoader size={6} color="#ffffff" />
                                                ) : (
                                                    <span>{t("loginRegisterModal.registerButton")}</span>

                                                )}
                                            </button>
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default LoginRegisterModal;
