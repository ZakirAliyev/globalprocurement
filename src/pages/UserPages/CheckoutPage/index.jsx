// src/pages/CheckoutPage/index.jsx
import "./index.scss";
import {MdChevronRight} from "react-icons/md";
import {useEffect, useMemo, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";

import {useAuth} from "../../../context/AuthContext/index.jsx";
import {useBasket} from "../../../context/BasketContext/index.jsx";
import {
    useGetUsersMyProfileQuery,
    useBasketsAddMultipleMutation,
    usePostBasketCheckoutMutation,
} from "../../../services/userApi.jsx";

import {PRODUCT_IMAGES} from "../../../contants/index.js";
import PageTop from "../../../components/PageTop/index.jsx";
import PageBottom from "../../../components/PageBottom/index.jsx";
import Loader from "../../../components/Loader";
import usePageLoader from "../../../hooks/index.jsx";
import {PulseLoader} from "react-spinners";

function CheckoutPage() {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const {auth} = useAuth();
    const {items, clear} = useBasket();

    const [form, setForm] = useState({
        name: "",
        surname: "",
        email: "",
        phoneNumber: "",
        note: "",
        paymentByTransfer: true,
    });

    const [submitting, setSubmitting] = useState(false);

    const {
        data: profileRes,
        isFetching: loadingProfile,
        isError: profileError,
    } = useGetUsersMyProfileQuery(undefined, {skip: !auth?.token});

    const isAnyLoading = !!loadingProfile;
    const showLoader = usePageLoader(isAnyLoading);

    useEffect(() => {
        const d = profileRes?.data;
        if (!d) return;

        setForm((prev) => ({
            ...prev,
            name: d.name ?? "",
            surname: d.surname ?? "",
            email: d.email ?? "",
            phoneNumber: (d.phoneNumber ?? "").replace(/^\+/, ""),
        }));
    }, [profileRes]);

    const formatAz = (n) => `${Number(n ?? 0).toFixed(2)} ₼`;

    const getImageSrc = (p) => {
        const idOrUrl =
            p.image ||
            (Array.isArray(p.images) && p.images[0]) ||
            p.cardImage;

        if (!idOrUrl) return "/assets/placeholder.png";

        const looksLikeUrl =
            typeof idOrUrl === "string" && /^https?:\/\//i.test(idOrUrl);

        return looksLikeUrl
            ? idOrUrl
            : `${PRODUCT_IMAGES}/${idOrUrl}`;
    };

    const {currentSubtotal, compareSubtotal, savings} = useMemo(() => {
        let cur = 0;
        let comp = 0;

        for (const p of items) {
            const qty = Number(p.quantity || 1);
            const price = Number(p.price || 0);
            const compare = Number(p.discount || 0);

            cur += price * qty;
            comp += (compare > price ? compare : price) * qty;
        }

        return {
            currentSubtotal: cur,
            compareSubtotal: comp,
            savings: Math.max(0, comp - cur),
        };
    }, [items]);

    const onChange = (e) => {
        const {id, value, type, checked} = e.target;
        setForm((s) => ({
            ...s,
            [id]: type === "checkbox" ? checked : value,
        }));
    };

    const normalizePhone = (raw) => {
        if (!raw) return "";
        const digits = String(raw).replace(/\D+/g, "");
        return `+${digits}`;
    };

    const getPaymentMethod = () =>
        form.paymentByTransfer
            ? t("checkout.payment.transfer")
            : "OTHER";

    const buildOrderPayload = () => {
        const fullName = `${form.name.trim()} ${form.surname.trim()}`.trim();

        const mappedItems = items.map((p) => ({
            productId: String(p.id),
            productName: p.name || "",
            price: Number(p.price || 0),
            discount: Number(p.discount || 0),
            quantity: Number(p.quantity || 1),
            finalPrice: Number(p.price || 0),
        }));

        return {
            fullName,
            email: form.email || "",
            phone: normalizePhone(form.phoneNumber),
            paymentMethod: getPaymentMethod(),
            items: mappedItems,
        };
    };

    const [basketsAddMultiple] = useBasketsAddMultipleMutation();
    const [postBasketCheckout] = usePostBasketCheckoutMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !form.name?.trim() ||
            !form.surname?.trim() ||
            !form.email?.trim() ||
            !form.phoneNumber?.trim()
        ) {
            alert(t("checkout.validation.required"));
            return;
        }

        if (items.length === 0) {
            alert(t("checkout.validation.emptyBasket"));
            navigate("/");
            return;
        }

        const orderPayload = buildOrderPayload();

        const basketSyncBody = items.map((p) => ({
            productId: String(p.id),
            quantity: Number(p.quantity || 1),
        }));

        setSubmitting(true);

        try {
            const addRes = await basketsAddMultiple(basketSyncBody).unwrap();

            if (addRes?.statusCode !== 200) {
                alert(
                    addRes?.message || t("checkout.errors.sync")
                );
                return;
            }

            const checkoutRes = await postBasketCheckout(orderPayload).unwrap();

            if (checkoutRes?.statusCode === 200) {
                clear();
                navigate("/success");
            } else {
                alert(
                    checkoutRes?.message ||
                    t("checkout.errors.checkout")
                );
            }
        } catch (err) {
            alert(t("checkout.errors.generic"));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            {showLoader && <Loader isVisible={isAnyLoading}/>}

            <PageTop/>

            <section id="checkoutPage">
                <div className="container">
                    <div className="navigation">
                        <div
                            className="navText"
                            onClick={() => navigate("/")}
                        >
                            {t("checkout.home")}
                        </div>

                        <MdChevronRight className="navText"/>

                        <div
                            className="navText"
                            onClick={() => navigate("/basket")}
                        >
                            {t("checkout.basket")}
                        </div>

                        <MdChevronRight className="navText"/>

                        <div className="selected navText">
                            {t("checkout.title")}
                        </div>
                    </div>

                    <h2>{t("checkout.title")}</h2>
                    <div className="line3"></div>

                    <div className="row">
                        {/* LEFT */}
                        <div className="col-9">
                            <form onSubmit={handleSubmit} noValidate>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        flexWrap: "wrap",
                                        gap: "16px",
                                    }}
                                >
                                    <div
                                        className="form-group"
                                        style={{flex: "0 0 47%"}}
                                    >
                                        <label htmlFor="name">
                                            <span>{t("checkout.form.name")}</span>
                                            <span className="star"> *</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            placeholder={t("checkout.form.namePlaceholder")}
                                            value={form.name}
                                            onChange={onChange}
                                            disabled={loadingProfile || submitting}
                                        />
                                    </div>

                                    <div
                                        className="form-group"
                                        style={{flex: "0 0 47%"}}
                                    >
                                        <label htmlFor="surname">
                                            <span>{t("checkout.form.surname")}</span>
                                            <span className="star"> *</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="surname"
                                            placeholder={t("checkout.form.surnamePlaceholder")}
                                            value={form.surname}
                                            onChange={onChange}
                                            disabled={loadingProfile || submitting}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">
                                        <span>{t("checkout.form.email")}</span>
                                        <span className="star"> *</span>
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        placeholder="example@mail.com"
                                        value={form.email}
                                        onChange={onChange}
                                        disabled={loadingProfile || submitting}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="phoneNumber">
                                        <span>{t("checkout.form.phone")}</span>
                                        <span className="star"> *</span>
                                    </label>
                                    <input
                                        type="tel"
                                        id="phoneNumber"
                                        placeholder="+994 12 345 67 89"
                                        value={form.phoneNumber}
                                        onChange={onChange}
                                        disabled={loadingProfile || submitting}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="paymentByTransfer">
                                        <span>{t("checkout.form.payment")}</span>
                                        <span className="star"> *</span>
                                    </label>

                                    <div
                                        style={{
                                            height: "40px",
                                            width: "100%",
                                            border: "1px solid var(--register-input-border)",
                                            borderRadius: "8px",
                                            display: "flex",
                                            alignItems: "center",
                                            margin: "4px auto 24px",
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            id="paymentByTransfer"
                                            style={{
                                                width: "16px",
                                                margin: "0 24px",
                                                height: "24px",
                                            }}
                                            checked={true}
                                            readOnly
                                        />
                                        <span style={{fontSize: "14px"}}>
                                            {t("checkout.payment.transfer")}
                                        </span>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="note">
                                        <span>{t("checkout.form.note")}</span>
                                    </label>
                                    <textarea
                                        id="note"
                                        placeholder={t("checkout.form.notePlaceholder")}
                                        value={form.note}
                                        onChange={onChange}
                                        disabled={submitting}
                                        rows={5}
                                    />
                                </div>

                                {profileError && (
                                    <div
                                        className="form-hint"
                                        style={{
                                            color: "var(--error-text)",
                                            marginBottom: 8,
                                        }}
                                    >
                                        {t("checkout.profileError")}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="submit-button123 submit-button1"
                                    disabled={items.length === 0 || submitting}
                                >
                                    {submitting ? (
                                        <PulseLoader size={6} color="var(--bg-color)"/>
                                    ) : (
                                        t("checkout.submit")
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* RIGHT */}
                        <div className="col-3">
                            <div className="summary">
                                <h3>{t("checkout.summary.title")}</h3>

                                <div className="mini-list">
                                    {items.map((p) => {
                                        const price = Number(p.price || 0);
                                        const compare = Number(p.discount || 0);
                                        const showCompare = compare > price;

                                        return (
                                            <div key={p.id} className="mini-item">
                                                <div className="mini-image">
                                                    <img
                                                        src={getImageSrc(p)}
                                                        alt={p.name}
                                                    />
                                                </div>
                                                <div className="mini-info">
                                                    <h4>{p.name}</h4>
                                                    <p>
                                                        {t("checkout.summary.quantity")}:{" "}
                                                        {p.quantity || 1}
                                                    </p>
                                                    <p className="mini-price">
                                                        <span className="current-price">
                                                            {formatAz(price)}
                                                        </span>
                                                        {showCompare && (
                                                            <span
                                                                className="old-price"
                                                                style={{
                                                                    marginLeft: 6,
                                                                    textDecoration: "line-through",
                                                                    opacity: 0.6,
                                                                }}
                                                            >
                                                                {formatAz(compare)}
                                                            </span>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {items.length === 0 && (
                                        <div className="mini-empty">
                                            {t("checkout.summary.empty")}
                                        </div>
                                    )}
                                </div>

                                <div className="divider"></div>

                                <div className="totals">
                                    <div className="totals-row">
                                        <span>{t("checkout.summary.subtotal")}</span>
                                        <span>{formatAz(compareSubtotal)}</span>
                                    </div>
                                    <div className="totals-row">
                                        <span>{t("checkout.summary.discount")}</span>
                                        <span>{formatAz(savings)}</span>
                                    </div>
                                    <div className="totals-row total">
                                        <span>{t("checkout.summary.total")}</span>
                                        <span>{formatAz(currentSubtotal)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <PageBottom/>
        </>
    );
}

export default CheckoutPage;
