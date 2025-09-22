import './index.scss';
import { useMemo } from 'react';
import { Table, Tag, Typography, message } from 'antd';
import { useGetOrdersFilteredOrdersQuery } from '../../../services/adminApi.jsx';

const { Title } = Typography;

const OrdersTable = () => {
    // Sifarişləri əldə et
    const { data: getOrdersFilteredOrders, isLoading, error } = useGetOrdersFilteredOrdersQuery();
    const orders = useMemo(() => getOrdersFilteredOrders?.data || [], [getOrdersFilteredOrders]);

    // Xətaları idarə et
    if (error) {
        message.error('Sifarişləri yükləmək mümkün olmadı. Xahiş edirik, yenidən cəhd edin.');
    }

    // Cədvəl sütunlarını təyin et
    const columns = [
        {
            title: 'Sifariş Nömrəsi',
            dataIndex: 'orderNumber',
            key: 'orderNumber',
            sorter: (a, b) => a.orderNumber.localeCompare(b.orderNumber),
            render: (text) => <span className="order-number">{text}</span>,
        },
        {
            title: 'Yaradılma Tarixi',
            dataIndex: 'createdDate',
            key: 'createdDate',
            render: (text) => <span className="order-number">{text}</span>,
        },
        {
            title: 'Məhsul Sayı',
            dataIndex: 'productCount',
            key: 'productCount',
            sorter: (a, b) => a.productCount - b.productCount,
            render: (count) => <Tag color="blue" className="product-count-tag">{count}</Tag>,
        },
        {
            title: 'Ümumi Məbləğ',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            sorter: (a, b) => a.totalAmount - b.totalAmount,
            render: (amount) => `${Number(amount).toFixed(2)} AZN`,
        },
        {
            title: 'Məhsullar',
            dataIndex: 'products',
            key: 'products',
            render: (products) => (
                <div className="products-list">
                    {products.map((product, index) => (
                        <div key={index} className="product-item">
                            <div className="product-name">{product.productName}</div>
                            <div className="product-detail">Məhsul Kodu: {product.productCode}</div>
                            <div className="product-detail">Say: {product.quantity}</div>
                            <div className="product-detail">Qiymət: ${Number(product.price).toFixed(2)} AZN</div>
                            <div className="product-detail">Endirim: ${Number(product.discount).toFixed(2)} AZN</div>
                        </div>
                    ))}
                </div>
            ),
        },
    ];

    return (
        <div className="orders-table-container">
            <Title level={4} className="table-title">Sifarişlər</Title>
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
                    emptyText: 'Məlumat yoxdur',
                }}
            />
        </div>
    );
};

export default OrdersTable;