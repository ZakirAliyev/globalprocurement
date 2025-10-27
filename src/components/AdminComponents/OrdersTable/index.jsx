import './index.scss';
import { useMemo } from 'react';
import { Table, Tag, Typography, Image, message } from 'antd';
import { useGetAllOrdersQuery } from '../../../services/adminApi.jsx';
import { PRODUCT_IMAGES } from '../../../contants/index.js';

const { Title } = Typography;

const OrdersTable = () => {
    const { data: getOrders, isLoading, error } = useGetAllOrdersQuery();

    const orders = useMemo(() => getOrders?.data || [], [getOrders]);

    if (error) {
        message.error('Sifarişləri yükləmək mümkün olmadı. Xahiş edirik, yenidən cəhd edin.');
    }

    const columns = [
        {
            title: 'Sifariş Nömrəsi',
            dataIndex: 'orderNumber',
            key: 'orderNumber',
            render: (text) => <span className="order-number">{text}</span>,
        },
        {
            title: 'Tarix',
            dataIndex: 'createdDate',
            key: 'createdDate',
            render: (text) => <span>{text}</span>,
        },
        {
            title: 'Müştəri',
            dataIndex: 'getUser',
            key: 'getUser',
            render: (user) => (
                <div>
                    <div>
                        <strong>
                            {user.name} {user.surname}
                        </strong>
                    </div>
                    <div>Email: {user.email}</div>
                    <div>Telefon: {user.phoneNumber || '-'}</div>
                </div>
            ),
        },
        {
            title: 'Məhsul Sayı',
            dataIndex: 'productCount',
            key: 'productCount',
            render: (count) => <Tag color="blue">{count}</Tag>,
        },
        {
            title: 'Ümumi Məbləğ',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (amount) => <strong>{Number(amount).toFixed(2)} ₼</strong>,
        },
        {
            title: 'Endirim',
            dataIndex: 'totalDiscount',
            key: 'totalDiscount',
            render: (discount) => (
                <span style={{ color: discount > 0 ? 'red' : '#999' }}>
                    {Number(discount).toFixed(2)} ₼
                </span>
            ),
        },
        {
            title: 'Məhsullar',
            dataIndex: 'products',
            key: 'products',
            render: (products) => (
                <div className="products-list">
                    {products.map((p, index) => (
                        <div
                            key={index}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                borderBottom: '1px solid #f0f0f0',
                                padding: '8px 0',
                            }}
                        >
                            <Image
                                width={60}
                                height={60}
                                src={`${PRODUCT_IMAGES}/${p.productImage}`}
                                alt={p.productName}
                                style={{ objectFit: 'cover', borderRadius: '6px' }}
                                fallback="/placeholder-image.png"
                            />
                            <div>
                                <div style={{ fontWeight: 500 }}>{p.productName}</div>
                                <div style={{ fontSize: '12px', color: '#666' }}>
                                    Kodu: {p.productCode} | Say: {p.quantity}
                                </div>
                                <div style={{ fontSize: '12px', color: '#444' }}>
                                    Qiymət: {p.price} ₼ | Endirim: {p.discount} ₼
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ),
        },
    ];

    return (
        <div className="orders-table-container">
            <Title level={4} className="table-title">
                Bütün Sifarişlər
            </Title>
            <Table
                columns={columns}
                dataSource={orders}
                loading={isLoading}
                pagination={{
                    pageSize: 5,
                    showSizeChanger: true,
                    pageSizeOptions: ['5', '10', '20'],
                    showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} sifariş`,
                }}
                rowKey="orderNumber"
                className="orders-table"
                locale={{
                    triggerDesc: 'Azalan sırayla sırala',
                    triggerAsc: 'Artan sırayla sırala',
                    cancelSort: 'Sıralamanı ləğv et',
                    emptyText: 'Sifariş yoxdur',
                }}
                scroll={{ x: 1200 }}
            />
        </div>
    );
};

export default OrdersTable;
