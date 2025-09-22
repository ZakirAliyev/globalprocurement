import './index.scss';
import {useState, useEffect, useMemo, useRef} from 'react';
import {Flex, Table, message, Checkbox} from 'antd';
import {
    useGetProductsQuery, usePostProductsChangeGreatOfferMutation, usePostProductsChangeNewMutation,
} from '../../../services/adminApi.jsx';

const GreatOfferProducts = () => {
    // 1) Fetch products
    const {data: getProducts, isLoading, error} = useGetProductsQuery();
    const [postProductsChangePopular] = usePostProductsChangeGreatOfferMutation();

    // 2) Keep list of all products
    const products = useMemo(() => getProducts?.data || [], [getProducts]);

    // 3) Which IDs are currently checked
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    // 4) Remember original popular IDs on first load
    const originalPopular = useRef([]);
    useEffect(() => {
        if (products.length && originalPopular.current.length === 0) {
            const popularIds = products.filter(p => p.isGreatOffer).map(p => p.id);
            originalPopular.current = popularIds;
            setSelectedRowKeys(popularIds);
        }
    }, [products]);

    // 5) Toggle one product’s popular status immediately on click
    const handleCheckboxChange = async (id) => {
        const willBePopular = !selectedRowKeys.includes(id);

        // Optimistically update UI
        setSelectedRowKeys(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );

        try {
            // Send only this ID
            await postProductsChangePopular(id).unwrap();
            message.success(`Product ${id} is now ${willBePopular ? 'popular' : 'not popular'}.`);

            // Update originalPopular to reflect new truth
            if (willBePopular) {
                originalPopular.current.push(id);
            } else {
                originalPopular.current = originalPopular.current.filter(x => x !== id);
            }
        } catch {
            // Roll back UI on error
            setSelectedRowKeys(prev =>
                willBePopular ? prev.filter(x => x !== id) : [...prev, id]
            );
            message.error('Failed to update popular status. Please try again.');
        }
    };

    // 6) Define table columns, including our instant-toggle checkbox
    const columns = [
        {
            title: 'Əla təkliflər',
            key: 'isGreatOffer',
            render: (_, record) => (
                <Checkbox
                    checked={selectedRowKeys.includes(record.id)}
                    onChange={() => handleCheckboxChange(record.id)}
                />
            )
        },
        {title: 'Name', dataIndex: 'name', key: 'name'},
        {title: 'Brand', dataIndex: 'brand', key: 'brand'},
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: p => (p != null ? `$${Number(p).toFixed(2)}` : 'N/A')
        },
        {
            title: 'Compare at Price',
            dataIndex: 'discount',
            key: 'discount',
            render: d => (d != null ? `$${Number(d).toFixed(2)}` : 'N/A')
        },
        {
            title: 'Category',
            dataIndex: 'categoryName',
            key: 'categoryName',
            render: v => v || 'N/A'
        },
        {
            title: 'Subcategory',
            dataIndex: 'subCategoryName',
            key: 'subCategoryName',
            render: v => v || 'N/A'
        },
        {
            title: 'Great Offer',
            dataIndex: 'isGreatOffer',
            key: 'isGreatOffer',
            render: v => (v ? 'Yes' : 'No')
        }
    ];

    if (error) {
        message.error('Failed to load products. Please try again.');
    }

    return (
        <Flex gap="middle" vertical>
            <Table
                columns={columns}
                dataSource={products}
                loading={isLoading}
                pagination={{pageSize: 6}}
                rowKey="id"
            />
        </Flex>
    );
};

export default GreatOfferProducts;
