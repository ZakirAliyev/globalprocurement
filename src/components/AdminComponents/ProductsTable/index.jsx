import { useState, useEffect } from 'react';
import { Button, Flex, Table, Tag, Image, message } from 'antd';
import { useGetProductsQuery, useDeleteProductMutation } from '../../../services/adminApi.jsx';
import { useNavigate } from 'react-router-dom';
import { PRODUCT_IMAGES } from '../../../contants/index.js';
import { TbPencil } from 'react-icons/tb';

const ProductsTable = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { data: getProducts, isLoading, refetch } = useGetProductsQuery();
    const [deleteProduct] = useDeleteProductMutation();

    // Refetch data when the component mounts
    useEffect(() => {
        refetch();
    }, [refetch]);

    const products = getProducts?.data || [];

    const dataSource = products.map((product, index) => ({
        key: product.id,
        index: index + 1,
        id: product.id,
        name: product.name,
        nameEng: product.nameEng,
        nameRu: product.nameRu,
        brand: product.brand || '-',
        model: product.model || '-',
        price: product.price,
        discount: product.discount,
        isPopular: product.isPopular,
        isNew: product.isNew,
        isGreatOffer: product.isGreatOffer,
        categoryName: product.categoryName,
        subCategoryName: product.subCategoryName,
        categoryId: product.categoryId,
        subCategoryId: product.subCategoryId,
        cardImage: product.cardImage,
        specifications: product.specifications,
        measures: product.measures,
        images: product.images || [],
    }));

    const columns = [
        {
            title: 'ID',
            dataIndex: 'index',
            key: 'index',
            width: '5%',
        },
        {
            title: 'Şəkil',
            dataIndex: 'cardImage',
            key: 'cardImage',
            width: '80px',
            render: (image) => (
                <Image
                    width={75}
                    height={75}
                    src={image && `${PRODUCT_IMAGES}/${image}`}
                    alt="Product"
                    style={{ objectFit: 'cover', borderRadius: '4px' }}
                    fallback="/placeholder-image.png"
                />
            ),
        },
        {
            title: 'Məhsul Adı',
            dataIndex: 'name',
            key: 'name',
            width: '25%',
        },
        {
            title: 'Brend',
            dataIndex: 'brand',
            key: 'brand',
        },
        {
            title: 'Model',
            dataIndex: 'model',
            key: 'model',
        },
        {
            title: 'Qiymət',
            dataIndex: 'price',
            key: 'price',
            render: (price, record) => (
                <div>
                    {record.discount ? (
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexDirection: 'column',
                            }}
                        >
                            <span style={{ textDecoration: 'line-through', color: '#999' }}>
                                {record.discount} ₼
                            </span>
                            <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>
                                {price} ₼
                            </span>
                        </div>
                    ) : (
                        <span style={{ fontWeight: 'bold' }}>{price} ₼</span>
                    )}
                </div>
            ),
        },
        {
            title: 'Kateqoriya',
            dataIndex: 'categoryName',
            key: 'categoryName',
        },
        {
            title: 'Alt Kateqoriya',
            dataIndex: 'subCategoryName',
            key: 'subCategoryName',
        },
        {
            title: 'Etiketlər',
            key: 'tags',
            render: (_, record) => (
                <div>
                    {record.isPopular && (
                        <Tag color="red" style={{ marginBottom: '7px' }}>
                            Populyar
                        </Tag>
                    )}
                    {record.isNew && (
                        <Tag color="green" style={{ marginBottom: '7px' }}>
                            Yeni
                        </Tag>
                    )}
                    {record.isGreatOffer && (
                        <Tag color="gold" style={{ marginBottom: '7px' }}>
                            Böyük Təklif
                        </Tag>
                    )}
                    {record.discount && (
                        <Tag color="orange" style={{ marginBottom: '7px' }}>
                            Endirim
                        </Tag>
                    )}
                </div>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Button type="link" onClick={() => navigate(`/cp/products/${record.id}`)}>
                    <TbPencil fontSize="large" />
                </Button>
            ),
        },
    ];

    const handleBulkDelete = async () => {
        setLoading(true);
        try {
            // Process each deletion individually
            const deletePromises = selectedRowKeys.map(async (productId) => {
                try {
                    await deleteProduct(productId).unwrap();
                    return { id: productId, success: true };
                } catch (error) {
                    return { id: productId, success: false, error };
                }
            });

            const results = await Promise.all(deletePromises);

            // Check results and show appropriate messages
            const failedDeletions = results.filter(result => !result.success);
            if (failedDeletions.length === 0) {
                message.success(`${selectedRowKeys.length} məhsul uğurla silindi`);
            } else {
                failedDeletions.forEach(failed => {
                    message.error(`Məhsul ID ${failed.id} silinərkən xəta: ${failed.error.message}`);
                });
                message.success(
                    `${selectedRowKeys.length - failedDeletions.length} məhsul uğurla silindi`
                );
            }

            // Clear selections and refresh data
            setSelectedRowKeys([]);
            refetch();
        } catch (error) {
            message.error('Silinmə əməliyyatı uğursuz oldu');
        } finally {
            setLoading(false);
        }
    };

    const onSelectChange = (newSelectedRowKeys) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const hasSelected = selectedRowKeys.length > 0;

    return (
        <Flex gap="middle" vertical>
            <Flex
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '16px',
                    }}
                >
                    <Button
                        type="primary"
                        onClick={handleBulkDelete}
                        disabled={!hasSelected}
                        loading={loading}
                    >
                        Sil
                    </Button>
                    {hasSelected ? `${selectedRowKeys.length} məhsul seçilib` : null}
                </div>
            </Flex>
            <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={dataSource}
                pagination={{
                    pageSize: 4,
                }}
                loading={isLoading}
                scroll={{ x: 1200 }}
            />
        </Flex>
    );
};

export default ProductsTable;