import { useState } from 'react';
import './index.scss';
import { MdChevronRight } from 'react-icons/md';
import { LuLockKeyhole, LuLogOut, LuShoppingBag, LuUserRound } from 'react-icons/lu';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import image1 from '/src/assets/category1.png';
import image2 from '/src/assets/avatar.png';
import PageTop from '../../../components/PageTop/index.jsx';
import PageBottom from '../../../components/PageBottom/index.jsx';
import { useGetUsersMyProfileQuery, usePutUsersEditMyProfileMutation } from '../../../services/userApi.jsx';
import usePageLoader from '../../../hooks/index.jsx';
import Loader from '../../../components/Loader/index.jsx';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import ErrorMessageComponent from '../../../components/ErrorMessageComponent/index.jsx';
import PulseLoader from 'react-spinners/PulseLoader';
import { navigateToHomePage } from "../../../utils/index.js";
import { useChangePasswordMutation } from '../../../services/userApi.jsx';
import { useGetFilteredOrdersQuery } from "../../../services/userApi.jsx";
import { PRODUCT_IMAGES } from "../../../contants/index.js";
import { useTranslation } from "react-i18next";

function UserPage() {
    const { t } = useTranslation();

    const [selectedPanel, setSelectedPanel] = useState('hesab');
    const [openOrderId, setOpenOrderId] = useState(null);
    const [showPassword, setShowPassword] = useState({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false,
    });

    const [changePassword, { isLoading: loadingChangePassword }] = useChangePasswordMutation();

    // 🔹 API hooks
    const {
        data: getUsersMyProfile,
        isLoading: loadingUsersMyProfile,
    } = useGetUsersMyProfileQuery();
    const [updateUserProfile, { isLoading: loadingUpdateProfile }] = usePutUsersEditMyProfileMutation();
    const myProfile = getUsersMyProfile?.data;

    const isAnyLoading = loadingUsersMyProfile;
    const showLoader = usePageLoader(isAnyLoading);

    // 🔹 Orders API
    const { data: ordersData, isLoading: loadingOrders, error: ordersError } = useGetFilteredOrdersQuery(3);
    const orders = ordersData?.data || [];

    const handlePanelClick = (panel) => setSelectedPanel(panel);
    const handleOrderToggle = (orderId) => setOpenOrderId(openOrderId === orderId ? null : orderId);
    const togglePasswordVisibility = (field) =>
        setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));

    const normalizePhoneNumber = (phone) => {
        let normalized = phone.replace(/\D/g, '');
        if (normalized.startsWith('994')) return normalized;
        if (normalized.startsWith('0')) return '994' + normalized.slice(1);
        return normalized;
    };

    // 🔹 Validation schemas
    const accountSchema = Yup.object().shape({
        name: Yup.string().min(2).max(50).required(t("userPage.validation.name")),
        surname: Yup.string().min(2).max(50).required(t("userPage.validation.surname")),
        phoneNumber: Yup.string().matches(/^(994[0-9]{9}|0[0-9]{9})$/).required(t("userPage.validation.phone")),
        email: Yup.string().email().optional(),
    });

    const passwordSchema = Yup.object().shape({
        currentPassword: Yup.string().min(6).required(t("userPage.validation.currentPassword")),
        newPassword: Yup.string()
            .min(6)
            .matches(/[A-Z]/, t("userPage.validation.upper"))
            .matches(/[a-z]/, t("userPage.validation.lower"))
            .matches(/[0-9]/, t("userPage.validation.number"))
            .matches(/[^A-Za-z0-9]/, t("userPage.validation.special"))
            .required(t("userPage.validation.newPassword")),
        confirmPassword: Yup.string()
            .required(t("userPage.validation.confirmPassword"))
            .oneOf([Yup.ref('newPassword'), null], t("userPage.validation.match")),
    });

    const handleAccountSubmit = async (values, { setSubmitting, setErrors }) => {
        const formattedValues = { ...values, phoneNumber: '+' + normalizePhoneNumber(values.phoneNumber) };
        try {
            await updateUserProfile(formattedValues).unwrap();
            alert(t("userPage.profileUpdated"));
        } catch (error) {
            setErrors({ submit: t("userPage.error") + ': ' + (error.data?.message || error.message) });
        } finally {
            setSubmitting(false);
        }
    };

    const handlePasswordSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
        try {
            await changePassword({
                oldPassword: values.currentPassword,
                newPassword: values.newPassword,
            }).unwrap();
            alert(t("userPage.passwordChanged"));
            resetForm();
        } catch (error) {
            setErrors({
                submit: t("userPage.error") + ': ' + (error?.data?.message || error?.message),
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('auth');
        window.location.href = '/';
    };

    return (
        <>
            {showLoader && <Loader isVisible={isAnyLoading} />}
            <PageTop />
            <section id="userPage">
                <div className="container">
                    <div className="navigation">
                        <div className="navText" onClick={() => navigateToHomePage()}>{t("userPage.home")}</div>
                        <MdChevronRight className="navText" />
                        <div className="selected navText">{t("userPage.title")}</div>
                    </div>

                    <div className="row">
                        <div className="col-3 col-md-12 col-sm-12 col-xs-12">
                            <div className="box">
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    flexDirection: 'column',
                                    height: '100%'
                                }}>
                                    <div>
                                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                                            <div className="imageWrapper">
                                                <img src={image2} alt={t("userPage.title")} />
                                            </div>
                                            <div className="textWrapper">
                                                <div className="ilk">{t("userPage.title")}</div>
                                                <div className="ikinci">{myProfile?.name} {myProfile?.surname}</div>
                                            </div>
                                        </div>

                                        <div
                                            className={`panel panel1 ${selectedPanel === 'hesab' ? 'selected1' : ''}`}
                                            onClick={() => handlePanelClick('hesab')}
                                            aria-label={t("userPage.accountInfo")}
                                        >
                                            <LuUserRound className="icon" />
                                            <span>{t("userPage.accountInfo")}</span>
                                        </div>

                                        <div
                                            className={`panel ${selectedPanel === 'şifrə' ? 'selected1' : ''}`}
                                            onClick={() => handlePanelClick('şifrə')}
                                            aria-label={t("userPage.changePassword")}
                                        >
                                            <LuLockKeyhole className="icon" />
                                            <span>{t("userPage.changePassword")}</span>
                                        </div>

                                        <div
                                            className={`panel ${selectedPanel === 'sifarişlər' ? 'selected1' : ''}`}
                                            onClick={() => handlePanelClick('sifarişlər')}
                                            aria-label={t("userPage.myOrders")}
                                        >
                                            <LuShoppingBag className="icon" />
                                            <span>{t("userPage.myOrders")}</span>
                                        </div>
                                    </div>
                                    <div
                                        className={`panel panel3`}
                                        onClick={handleLogout}
                                        aria-label={t("userPage.logout")}
                                    >
                                        <LuLogOut className="icon" />
                                        <span>{t("userPage.logout")}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-9 col-md-12 col-sm-12 col-xs-12">
                            <div className="box">
                                {selectedPanel === 'hesab' && (
                                    <Formik
                                        initialValues={{
                                            name: myProfile?.name || '',
                                            surname: myProfile?.surname || '',
                                            email: myProfile?.email || '',
                                            phoneNumber: myProfile?.phoneNumber?.replace(/^\+/, '') || '',
                                        }}
                                        validationSchema={accountSchema}
                                        onSubmit={handleAccountSubmit}
                                        enableReinitialize
                                    >
                                        {({ isSubmitting, errors, touched }) => (
                                            <Form autoComplete="off">
                                                <div className="account">{t("userPage.accountInfo")}</div>
                                                {errors.submit && <div className="error">{errors.submit}</div>}
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    flexWrap: 'wrap',
                                                    gap: '16px'
                                                }}>
                                                    <div className="form-group" style={{ flex: '0 0 47%' }}>
                                                        <label htmlFor="firstName">
                                                            <span>{t("userPage.name")}</span>
                                                            <span className="star"> *</span>
                                                        </label>
                                                        <Field
                                                            type="text"
                                                            id="firstName"
                                                            name="name"
                                                            placeholder={t("userPage.namePlaceholder")}
                                                            autoComplete="off"
                                                            className={touched.name && errors.name ? 'error-input' : ''}
                                                        />
                                                        <ErrorMessageComponent name="name" />
                                                    </div>
                                                    <div className="form-group" style={{ flex: '0 0 47%' }}>
                                                        <label htmlFor="lastName">
                                                            <span>{t("userPage.surname")}</span>
                                                            <span className="star"> *</span>
                                                        </label>
                                                        <Field
                                                            type="text"
                                                            id="lastName"
                                                            name="surname"
                                                            placeholder={t("userPage.surnamePlaceholder")}
                                                            autoComplete="off"
                                                            className={touched.surname && errors.surname ? 'error-input' : ''}
                                                        />
                                                        <ErrorMessageComponent name="surname" />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="phone">
                                                        <span>{t("userPage.phone")}</span>
                                                        <span className="star"> *</span>
                                                    </label>
                                                    <Field name="phoneNumber">
                                                        {({ field, form }) => (
                                                            <PhoneInput
                                                                country={'az'}
                                                                value={field.value}
                                                                onChange={(phone) => form.setFieldValue(field.name, normalizePhoneNumber(phone))}
                                                                onBlur={() => form.setFieldTouched(field.name, true)}
                                                                inputClass={`phone-input ${touched.phoneNumber && errors.phoneNumber ? 'error-input' : ''}`}
                                                                onlyCountries={['az']}
                                                                disableDropdown={true}
                                                                countryCodeEditable={false}
                                                                inputProps={{
                                                                    name: 'phoneNumber',
                                                                    required: true,
                                                                    placeholder: t("userPage.phonePlaceholder"),
                                                                }}
                                                                containerStyle={{ width: '100%' }}
                                                            />
                                                        )}
                                                    </Field>
                                                    <ErrorMessageComponent name="phoneNumber" />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="email">
                                                        <span>{t("userPage.email")}</span>
                                                    </label>
                                                    <Field
                                                        type="email"
                                                        id="email"
                                                        name="email"
                                                        placeholder={t("userPage.emailPlaceholder")}
                                                        readOnly
                                                        disabled
                                                        className={touched.email && errors.email ? 'error-input' : ''}
                                                    />
                                                    <ErrorMessageComponent name="email" />
                                                </div>
                                                <button
                                                    type="submit"
                                                    className="submit-button123 submit-button1"
                                                    disabled={isSubmitting || loadingUpdateProfile}
                                                >
                                                    {isSubmitting || loadingUpdateProfile ? (
                                                        <PulseLoader size={8} color="#fff" />
                                                    ) : (
                                                        'Yadda saxla'
                                                    )}
                                                </button>
                                            </Form>
                                        )}
                                    </Formik>
                                )}

                                {selectedPanel === 'şifrə' && (
                                    <Formik
                                        initialValues={{
                                            currentPassword: '',
                                            newPassword: '',
                                            confirmPassword: '',
                                        }}
                                        validationSchema={passwordSchema}
                                        onSubmit={handlePasswordSubmit}
                                        enableReinitialize
                                    >
                                        {({ isSubmitting, errors, touched }) => (
                                            <Form autoComplete="off">
                                                <div className="account">{t("userPage.changePassword")}</div>
                                                {errors.submit && <div className="error">{errors.submit}</div>}
                                                <div className="form-group">
                                                    <label htmlFor="currentPassword">
                                                        <span>{t("userPage.currentPassword")}</span>
                                                        <span className="star"> *</span>
                                                    </label>
                                                    <div className="password-wrapper">
                                                        <Field
                                                            type={showPassword.currentPassword ? 'text' : 'password'}
                                                            id="currentPassword"
                                                            name="currentPassword"
                                                            placeholder={t("userPage.currentPasswordPlaceholder")}
                                                            autoComplete="new-password"
                                                            className={touched.currentPassword && errors.currentPassword ? 'error-input' : ''}
                                                        />
                                                        <button
                                                            type="button"
                                                            className="password-toggle"
                                                            onClick={() => togglePasswordVisibility('currentPassword')}
                                                        >
                                                            {showPassword.currentPassword ? <AiOutlineEyeInvisible /> :
                                                                <AiOutlineEye />}
                                                        </button>
                                                    </div>
                                                    <ErrorMessageComponent name="currentPassword" />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="newPassword">
                                                        <span>{t("userPage.newPassword")}</span>
                                                        <span className="star"> *</span>
                                                    </label>
                                                    <div className="password-wrapper">
                                                        <Field
                                                            type={showPassword.newPassword ? 'text' : 'password'}
                                                            id="newPassword"
                                                            name="newPassword"
                                                            placeholder={t("userPage.newPasswordPlaceholder")}
                                                            autoComplete="new-password"
                                                            className={touched.newPassword && errors.newPassword ? 'error-input' : ''}
                                                        />
                                                        <button
                                                            type="button"
                                                            className="password-toggle"
                                                            onClick={() => togglePasswordVisibility('newPassword')}
                                                        >
                                                            {showPassword.newPassword ? <AiOutlineEyeInvisible /> :
                                                                <AiOutlineEye />}
                                                        </button>
                                                    </div>
                                                    <ErrorMessageComponent name="newPassword" />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="confirmPassword">
                                                        <span>{t("userPage.confirmPassword")}</span>
                                                        <span className="star"> *</span>
                                                    </label>
                                                    <div className="password-wrapper">
                                                        <Field
                                                            type={showPassword.confirmPassword ? 'text' : 'password'}
                                                            id="confirmPassword"
                                                            name="confirmPassword"
                                                            placeholder={t("userPage.confirmPasswordPlaceholder")}
                                                            autoComplete="new-password"
                                                            className={touched.confirmPassword && errors.confirmPassword ? 'error-input' : ''}
                                                        />
                                                        <button
                                                            type="button"
                                                            className="password-toggle"
                                                            onClick={() => togglePasswordVisibility('confirmPassword')}
                                                        >
                                                            {showPassword.confirmPassword ? <AiOutlineEyeInvisible /> :
                                                                <AiOutlineEye />}
                                                        </button>
                                                    </div>
                                                    <ErrorMessageComponent name="confirmPassword" />
                                                </div>
                                                <button
                                                    type="submit"
                                                    className="submit-button123 submit-button1"
                                                    disabled={isSubmitting || loadingUpdateProfile}
                                                >
                                                    {isSubmitting || loadingUpdateProfile ? (
                                                        <PulseLoader size={8} color="#fff" />
                                                    ) : (
                                                        'Yadda saxla'
                                                    )}
                                                </button>
                                            </Form>
                                        )}
                                    </Formik>
                                )}

                                {selectedPanel === 'sifarişlər' && (
                                    <>
                                        <h3>{t("userPage.myOrders")}</h3>
                                        {loadingOrders && <p>{t("userPage.loading")}</p>}
                                        {ordersError && <p>{t("userPage.error")}: {ordersError.message}</p>}

                                        {orders.map((order) => {
                                            const subtotal = order.products.reduce(
                                                (sum, p) => sum + p.price * p.quantity,
                                                0
                                            );
                                            const discount = order.totalDiscount || 0;
                                            const total = order.totalAmount;

                                            return (
                                                <div className="summary" key={order.orderNumber}>
                                                    <div
                                                        className="order-summary-row"
                                                        onClick={() => handleOrderToggle(order.orderNumber)}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <div className="summary-col">
                                                            <div className="summary-title">{t("userPage.orderBuyer")}</div>
                                                            <div className="summary-value">
                                                                {order.getUser?.name} {order.getUser?.surname}
                                                            </div>
                                                        </div>
                                                        <div className="summary-col">
                                                            <div className="summary-title">{t("userPage.orderDate")}</div>
                                                            <div className="summary-value">{order.createdDate}</div>
                                                        </div>
                                                        <div className="summary-col">
                                                            <div className="summary-title">{t("userPage.productCount")}</div>
                                                            <div className="summary-value">{order.productCount}</div>
                                                        </div>
                                                        <div className="summary-col">
                                                            <div className="summary-title">{t("userPage.orderNo")}</div>
                                                            <div className="summary-value">{order.orderNumber}</div>
                                                        </div>
                                                        <div className="summary-col">
                                                            <div className="summary-title">{t("userPage.orderTotal")}</div>
                                                            <div className="summary-value">{order.totalAmount} ₼</div>
                                                        </div>
                                                    </div>

                                                    <div className={`order-details ${openOrderId === order.orderNumber ? 'open' : 'closed'}`}>
                                                        <div className="mini-list">
                                                            {order.products.map((p, index) => (
                                                                <div key={index} className="mini-item">
                                                                    <div className="mini-image">
                                                                        <img src={PRODUCT_IMAGES + p.productImage} alt={p.productName} />
                                                                    </div>
                                                                    <div className="mini-info">
                                                                        <h4>{p.productName}</h4>
                                                                        <p>{t("userPage.orderCode")}: {p.productCode}</p>
                                                                        <p>{t("userPage.orderQuantity")}: {p.quantity}</p>
                                                                        <p className="mini-price">{p.price} ₼</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        <div className="divider"></div>

                                                        <div className="totals">
                                                            <div className="totals-row">
                                                                <span>{t("userPage.orderSubtotal")}</span>
                                                                <span>{subtotal} ₼</span>
                                                            </div>
                                                            <div className="totals-row">
                                                                <span>{t("userPage.orderDiscount")}</span>
                                                                <span>{discount} ₼</span>
                                                            </div>
                                                            <div className="totals-row total">
                                                                <span>{t("userPage.orderFinalTotal")}</span>
                                                                <span>{total} ₼</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <PageBottom />
        </>
    );
}

export default UserPage;
