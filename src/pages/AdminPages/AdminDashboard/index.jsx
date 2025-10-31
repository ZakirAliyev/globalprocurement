import { useMatch } from 'react-router-dom';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import {
    UserOutlined,
    ShoppingOutlined,
    TagsOutlined,
    FileTextOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '/public/assets/logo.png';
import image1 from '/public/assets/profileImage.png';
import { FiLogOut } from 'react-icons/fi';
import './index.scss';
import UsersTable from '../../../components/AdminComponents/UsersTable/index.jsx';
import ProductsTable from '../../../components/AdminComponents/ProductsTable/index.jsx';
import ProductsAdd from '../../../components/AdminComponents/ProductsAdd/index.jsx';
import CategoriesTable from '../../../components/AdminComponents/CategoriesTable/index.jsx';
import CategoriesAdd from '../../../components/AdminComponents/CategoriesAdd/index.jsx';
import ProductsEdit from '../../../components/AdminComponents/ProductsEdit/index.jsx';
import CategoriesEdit from '../../../components/AdminComponents/CategoriesEdit/index.jsx';
import SubCategoriesTable from '../../../components/AdminComponents/SubCategoriesTable/index.jsx';
import SubCategoriesEdit from "../../../components/AdminComponents/SubCategoriesEdit/index.jsx";
import SubCategoriesAdd from "../../../components/AdminComponents/SubCategoriesAdd/index.jsx";
import PopularProducts from "../../../components/AdminComponents/PopularProducts/index.jsx";
import NewProducts from "../../../components/AdminComponents/NewProducts/index.jsx";
import GreatOfferProducts from "../../../components/AdminComponents/GreatOfferProducts/index.jsx";
import OrdersTable from "../../../components/AdminComponents/OrdersTable/index.jsx";

const { Header, Content, Sider } = Layout;

const items2 = [
    {
        key: 'sub1',
        icon: <UserOutlined />,
        label: 'İstifadəçilər',
        path: '/cp/users',
    },
    {
        key: 'sub2',
        icon: <ShoppingOutlined />,
        label: 'Məhsul',
        path: '/cp/products',
        children: [
            {
                key: 'sub2-1',
                label: 'Məhsullar',
                path: '/cp/products',
            },
            {
                key: 'sub2-2',
                label: 'Əlavə et',
                path: '/cp/product/add',
            },
        ],
    },
    {
        key: 'sub3',
        icon: <TagsOutlined />,
        label: 'Kateqoriyalar',
        path: '/cp/gcategories',
        children: [
            {
                key: 'sub3-1',
                label: 'Kateqoriyalar',
                path: '/cp/gcategories',
            },
            {
                key: 'sub3-2',
                label: 'Əlavə et',
                path: '/cp/gcategory/add',
            },
            {
                key: 'sub3-3',
                label: 'Alt Kateqoriyalar',
                path: '/cp/subcategories',
            },
            {
                key: 'sub3-4',
                label: 'Alt Kateqoriya Əlavə et',
                path: '/cp/subcategory/add',
            },
        ],
    },
    {
        key: 'sub5',
        icon: <FileTextOutlined />,
        label: 'Popular məhsullar',
        path: '/cp/popular-products',
    },
    {
        key: 'sub6',
        icon: <TagsOutlined />,
        label: 'Yeni məhsullar',
        path: '/cp/new-products',
    },
    {
        key: 'sub7',
        icon: <FileTextOutlined />,
        label: 'Əla təkliflər',
        path: '/cp/great-products',
    },
    {
        key: 'sub4',
        icon: <FileTextOutlined />,
        label: 'Sifarişlər',
        path: '/cp/orders',
    },
];

const AdminDashboard = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const navigate = useNavigate();
    const location = useLocation();
    const isProductEdit = useMatch('/cp/products/:id');
    const isCategoryEdit = useMatch('/cp/gcategories/:id');
    const isSubCategoryEdit = useMatch('/cp/subcategories/:id');

    // Build key-to-path map for reliable navigation
    const keyToPathMap = {};
    const buildKeyPathMap = (items) => {
        items.forEach((item) => {
            keyToPathMap[item.key] = item.path;
            if (item.children) {
                item.children.forEach((child) => {
                    keyToPathMap[child.key] = child.path;
                });
            }
        });
    };
    buildKeyPathMap(items2);

    // Get selected menu key based on current path
    const getSelectedKey = () => {
        for (const [key, path] of Object.entries(keyToPathMap)) {
            if (path === location.pathname) {
                return key;
            }
        }
        if (isProductEdit) return 'sub2-1'; // Stay on products list for product edit
        if (isCategoryEdit) return 'sub3-1'; // Stay on categories list for category edit
        if (isSubCategoryEdit) return 'sub3-3'; // Stay on subcategories list for subcategory edit
        return 'sub1'; // Default fallback
    };
    const selectedKey = getSelectedKey();

    // Handle sidebar menu clicks
    const handleMenuClick = ({ key }) => {
        const path = keyToPathMap[key];
        if (path) {
            navigate(path);
        }
    };

    return (
        <Layout style={{ width: '100%', height: '100dvh' }}>
            <Header
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 16px',
                    justifyContent: 'space-between',
                    color: 'white',
                    background: 'var(--bottom-nav-bg)',
                }}
            >
                <img src={logo} alt="Logo" className="demo-logo" />
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexDirection: 'row-reverse' }}>
                    <img src={image1} alt="profile" style={{ borderRadius: '50%', width: '40px' }} />
                    <div>Xoş gəlmisiniz, Admin!</div>
                </div>
            </Header>

            <Layout>
                <Sider width={250} style={{ background: colorBgContainer, padding: '12px 16px' }}>
                    <Menu
                        mode="inline"
                        selectedKeys={[selectedKey]}
                        style={{ height: '100%', borderInlineEnd: 0, padding: '32px 0' }}
                        items={items2.map(({ key, icon, label, children }) => ({
                            key,
                            icon,
                            label,
                            children: children?.map(({ key, label }) => ({ key, label })),
                        }))}
                        onClick={handleMenuClick}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '40px',
                            left: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            color: 'red',
                            cursor: 'pointer',
                        }}
                    >
                        <FiLogOut />
                        <div>Çıxış et</div>
                    </div>
                </Sider>

                <Layout style={{ padding: '0 24px 24px' }}>
                    <Breadcrumb
                        items={[{ title: 'Global Procurement Services' }, { title: 'Admin Panel' }]}
                        style={{ margin: '16px 0' }}
                    />
                    <Content
                        style={{
                            padding: 24,
                            margin: 0,
                            minHeight: 280,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                            overflowY: 'auto',
                        }}
                    >
                        {location.pathname === '/cp/users' && <UsersTable />}
                        {location.pathname === '/cp/products' && <ProductsTable />}
                        {location.pathname === '/cp/product/add' && <ProductsAdd />}
                        {location.pathname === '/cp/gcategories' && <CategoriesTable />}
                        {location.pathname === '/cp/gcategory/add' && <CategoriesAdd />}
                        {location.pathname === '/cp/subcategories' && <SubCategoriesTable />}
                        {location.pathname === '/cp/subcategory/add' && <SubCategoriesAdd />}
                        {location.pathname === '/cp/popular-products' && <PopularProducts />}
                        {location.pathname === '/cp/new-products' && <NewProducts />}
                        {location.pathname === '/cp/great-products' && <GreatOfferProducts />}
                        {location.pathname === '/cp/orders' && <OrdersTable />}
                        {isProductEdit && <ProductsEdit />}
                        {isCategoryEdit && <CategoriesEdit />}
                        {isSubCategoryEdit && <SubCategoriesEdit />}
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default AdminDashboard;