import './index.scss'
import {useState} from 'react';
import {Eye, EyeOff, Lock, Mail, Shield} from 'lucide-react';
import {usePostAdminsLoginMutation} from "../../../services/adminApi.jsx";
import {useNavigate} from "react-router";

function AdminLogin() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [postAdminsLogin] = usePostAdminsLoginMutation()

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email tələb olunur';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Düzgün email daxil edin';
        }

        if (!formData.password) {
            newErrors.password = 'Şifrə tələb olunur';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Şifrə minimum 6 simvol olmalıdır';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            const response = await postAdminsLogin(formData).unwrap()

            if (response?.statusCode === 200) {
                const token = response.data?.token;
                if (token) {
                    localStorage.setItem('token', token);
                }
                navigate('/cp/users')
            }

        } catch (error) {
            console.error('Login error:', error);
            alert('Giriş zamanı xəta baş verdi');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section id="adminLogin">
            <div className="login-container">
                {/* Header */}
                <div className="login-header">
                    <div className="logo-container">
                        <Shield className="logo-icon"/>
                    </div>
                    <h1 className="title">Admin Paneli</h1>
                    <p className="subtitle">Hesabınıza daxil olun</p>
                </div>

                {/* Login Form */}
                <div className="login-form-wrapper">
                    <div className="login-form">
                        {/* Email Field */}
                        <div className="input-group">
                            <label htmlFor="email" className="input-label">
                                Email
                            </label>
                            <div className="input-wrapper">
                                <Mail className="input-icon"/>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`input-field ${errors.email ? 'error' : ''}`}
                                    placeholder="admin@example.com"
                                />
                            </div>
                            {errors.email && (
                                <p className="error-message">{errors.email}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="input-group">
                            <label htmlFor="password" className="input-label">
                                Şifrə
                            </label>
                            <div className="input-wrapper">
                                <Lock className="input-icon"/>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`input-field ${errors.password ? 'error' : ''}`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="password-toggle"
                                >
                                    {showPassword ? <EyeOff/> : <Eye/>}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="error-message">{errors.password}</p>
                            )}
                        </div>

                        {/* Remember Me */}
                        <div className="form-options">
                            <label className="checkbox-label">
                                <input type="checkbox" className="checkbox"/>
                                <span>Məni xatırla</span>
                            </label>
                            <a href="#" className="forgot-password">
                                Şifrəni unutdunuz?
                            </a>
                        </div>

                        {/* Submit Button */}
                        <div
                            onClick={handleSubmit}
                            className={`submit-button123 ${isLoading ? 'loading' : ''}`}
                            style={{
                                margin: '0px auto'
                            }}
                        >
                            {isLoading ? (
                                <div className="loading-content">
                                    <div className="spinner"></div>
                                    Giriş edilir...
                                </div>
                            ) : (
                                'Daxil ol'
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="login-footer">
                        <p>Admin paneli - Yalnız səlahiyyətli istifadəçilər üçün</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default AdminLogin;