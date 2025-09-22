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
        email: Yup.string().email('Səhv e-poçt formatı!').required('Tələb olunur'),
        password: Yup.string().required('Tələb olunur'),
    });

    const registerSchema = Yup.object().shape({
        name: Yup.string().required('Tələb olunur'),
        surname: Yup.string().required('Tələb olunur'),
        companyName: Yup.string().required('Tələb olunur'),
        email: Yup.string().email('Səhv e-poçt formatı!').required('Tələb olunur'),
        phoneNumber: Yup.string()
            .matches(
                /^994[0-9]{9}$/,
                'Telefon nömrəsi +994 (50) 123 45 67 formatında olmalıdır'
            )
            .required('Tələb olunur'),
        password: Yup.string()
            .required('Tələb olunur')
            .min(6, 'Şifrə minimum 6 simvoldan ibarət olmalıdır')
            .matches(/[A-Z]/, 'Ən azı bir böyük hərf olmalıdır')
            .matches(/[a-z]/, 'Ən azı bir kiçik hərf olmalıdır')
            .matches(/[0-9]/, 'Ən azı bir rəqəm olmalıdır')
            .matches(
                /[^A-Za-z0-9]/,
                'Ən azı bir xüsusi simvol olmalıdır (məs: !@#$%^&*)'
            ),
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

                    alert('Uğurla daxil oldunuz!');
                    handleClose();
                }
            } catch {
                alert('E-poçt ünvanı və ya şifrə səhvdir');
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

                        alert('Qeydiyyat və daxil olma uğurludur!');
                        handleClose();
                    }
                }
            } catch (e) {
                alert('E-poçt ünvanı artıq istifadə olunub');
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
                            Giriş
                        </button>
                        <button
                            className={`tab-button ${
                                activeTab === 'register' ? 'active' : ''
                            }`}
                            onClick={() => handleTabChange('register')}
                        >
                            Qeydiyyat
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
                                                    placeholder="E-poçt ünvanınızı daxil edin"
                                                    autoComplete="off"
                                                />
                                                <ErrorMessageComponent name="email" />
                                            </div>
                                            {/* — Şifrə */}
                                            <div className="form-group">
                                                <label htmlFor="login-password">
                                                    <span>Şifrə</span>
                                                    <span className="star"> *</span>
                                                </label>
                                                <div className="password-wrapper">
                                                    <Field
                                                        type={showPassword ? 'text' : 'password'}
                                                        id="login-password"
                                                        name="password"
                                                        placeholder="Şifrənizi daxil edin"
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
                                                Şifrəni unutmusunuz?{' '}
                                                <Link to="#" className="link">
                                                    Bərpa etmək üçün buraya klikləyin.
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
                                                    <span>Daxil ol</span>
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
                                                        <span>Ad</span>
                                                        <span className="star"> *</span>
                                                    </label>
                                                    <Field
                                                        type="text"
                                                        id="register-name"
                                                        name="name"
                                                        placeholder="Adınız"
                                                        autoComplete="off"
                                                    />
                                                    <ErrorMessageComponent name="name" />
                                                </div>
                                                <div
                                                    className="form-group"
                                                    style={{ flex: '0 0 47%' }}
                                                >
                                                    <label htmlFor="register-surname">
                                                        <span>Soyad</span>
                                                        <span className="star"> *</span>
                                                    </label>
                                                    <Field
                                                        type="text"
                                                        id="register-surname"
                                                        name="surname"
                                                        placeholder="Soyadınız"
                                                        autoComplete="off"
                                                    />
                                                    <ErrorMessageComponent name="surname" />
                                                </div>
                                            </div>
                                            {/* — Company */}
                                            <div className="form-group">
                                                <label htmlFor="register-companyName">
                                                    <span>Şirkət adı</span>
                                                    <span className="star"> *</span>
                                                </label>
                                                <Field
                                                    type="text"
                                                    id="register-companyName"
                                                    name="companyName"
                                                    placeholder="Şirkətinizin adını daxil edin"
                                                    autoComplete="off"
                                                />
                                                <ErrorMessageComponent name="companyName" />
                                            </div>
                                            {/* — Email */}
                                            <div className="form-group">
                                                <label htmlFor="register-email">
                                                    <span>E-poçt ünvanı</span>
                                                    <span className="star"> *</span>
                                                </label>
                                                <Field
                                                    type="email"
                                                    id="register-email"
                                                    name="email"
                                                    placeholder="E-poçt ünvanınızı daxil edin"
                                                    autoComplete="off"
                                                />
                                                <ErrorMessageComponent name="email" />
                                            </div>
                                            {/* — Phone */}
                                            <div className="form-group">
                                                <label htmlFor="register-phoneNumber">
                                                    <span>Telefon nömrəsi</span>
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
                                                            inputClass="phone-input"
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
                                                    <span>Şifrə</span>
                                                    <span className="star"> *</span>
                                                </label>
                                                <div className="password-wrapper">
                                                    <Field
                                                        type={showPassword ? 'text' : 'password'}
                                                        id="register-password"
                                                        name="password"
                                                        placeholder="Şifrənizi daxil edin"
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
                                                    <span>Qeydiyyat</span>
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
