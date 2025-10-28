import MainPage from '../pages/UserPages/index.jsx';
import HomePage from '../pages/UserPages/HomePage/index.jsx';
import ProductDetailsPage from '../pages/UserPages/ProductDetailsPage/index.jsx';
import WishlistPage from '../pages/UserPages/WishlistPage/index.jsx';
import DiscountsPage from '../pages/UserPages/DiscountsPage/index.jsx';
import FilterPage from '../pages/UserPages/FilterPage/index.jsx';
import AboutPage from '../pages/UserPages/AboutPage/index.jsx';
import SuccessPage from '../pages/UserPages/SuccessPage/index.jsx';
import FailedPage from '../pages/UserPages/FailedPage/index.jsx';
import ErrorPage from '../pages/UserPages/ErrorPage/index.jsx';
import ForgotPasswordPage from '../pages/UserPages/ForgotPasswordPage/index.jsx';
import ResetPasswordPage from '../pages/UserPages/ResetPasswordPage/index.jsx';
import PasswordSuccessPage from '../pages/UserPages/PasswordSuccessPage/index.jsx';
import BasketPage from '../pages/UserPages/BasketPage/index.jsx';
import CheckoutPage from '../pages/UserPages/CheckoutPage/index.jsx';
import UserPage from '../pages/UserPages/UserPage/index.jsx';
import AdminPages from '../pages/AdminPages/index.jsx';
import AdminDashboard from '../pages/AdminPages/AdminDashboard/index.jsx';
import AdminLogin from '../pages/AdminPages/AdminLogin/index.jsx';
import BestSellerPage from "../pages/UserPages/BestSellerPage/index.jsx";
import GreatOffersPage from "../pages/UserPages/GreatOffersPage/index.jsx";
import NewProductsPage from "../pages/UserPages/NewProductsPage/index.jsx";

export const ROUTES = [
    {
        path: '/',
        element: <MainPage />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: ':categoryId/:subCategoryId/:id',
                element: <ProductDetailsPage />,
            },
            {
                path: 'wishlist',
                element: <WishlistPage />,
            },
            {
                path: 'discounts',
                element: <DiscountsPage />,
            },
            {
                path: 'best-seller',
                element: <BestSellerPage />,
            },
            {
                path: '/great-offers',
                element: <GreatOffersPage/>
            },
            {
                path: '/new-products',
                element: <NewProductsPage />
            },
            {
                path: 'filter',
                element: <FilterPage />,
            },
            {
                path: ':categoryId',
                element: <FilterPage />,
            },
            {
                path: ':categoryId/:subCategoryId',
                element: <FilterPage />,
            },
            {
                path: 'about',
                element: <AboutPage />,
            },
            {
                path: 'success',
                element: <SuccessPage />,
            },
            {
                path: 'failed',
                element: <FailedPage />,
            },
            {
                path: 'forgot-password',
                element: <ForgotPasswordPage />,
            },
            {
                path: 'reset-password',
                element: <ResetPasswordPage />,
            },
            {
                path: 'password-success',
                element: <PasswordSuccessPage />,
            },
            {
                path: 'basket',
                element: <BasketPage />,
            },
            {
                path: 'checkout',
                element: <CheckoutPage />,
            },
            {
                path: 'user',
                element: <UserPage />,
            },
            {
                path: 'cp',
                element: <AdminPages />,
                children: [
                    {
                        index: true,
                        element: <AdminLogin />,
                    },
                    {
                        path: 'users',
                        element: <AdminDashboard />,
                    },
                    {
                        path: 'products',
                        element: <AdminDashboard />,
                    },
                    {
                        path: 'product/add',
                        element: <AdminDashboard />,
                    },
                    {
                        path: 'products/:id',
                        element: <AdminDashboard />,
                    },
                    {
                        path: 'gcategories',
                        element: <AdminDashboard />,
                    },
                    {
                        path: 'gcategory/add',
                        element: <AdminDashboard />,
                    },
                    {
                        path: 'gcategories/:id',
                        element: <AdminDashboard />,
                    },
                    {
                        path: 'subcategories',
                        element: <AdminDashboard />,
                    },
                    {
                        path: 'subcategory/add',
                        element: <AdminDashboard />,
                    },
                    {
                        path: 'subcategories/:id',
                        element: <AdminDashboard />,
                    },
                    {
                        path: 'popular-products',
                        element: <AdminDashboard />,
                    },
                    {
                        path: 'new-products',
                        element: <AdminDashboard />,
                    },
                    {
                        path: 'great-products',
                        element: <AdminDashboard />,
                    },
                    {
                        path: 'orders',
                        element: <AdminDashboard />,
                    },
                    {
                        path: '*',
                        element: <ErrorPage />,
                    },
                ],
            },
            {
                path: '*',
                element: <ErrorPage />,
            },
        ],
    },
];