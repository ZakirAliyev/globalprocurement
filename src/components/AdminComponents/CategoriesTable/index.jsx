import { useState, useEffect } from 'react';
import { Button, Flex, Table, Image, message } from 'antd';
import { useGetCategoriesQuery, useDeleteCategoryMutation } from '../../../services/adminApi.jsx';
import { useNavigate } from 'react-router-dom';
import { TbPencil } from 'react-icons/tb';
import { CATEGORY_IMAGES } from '../../../contants/index.js';

const CategoriesTable = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { data: getCategories, isLoading, refetch } = useGetCategoriesQuery();
    const [deleteCategory] = useDeleteCategoryMutation();

    // Refetch data when the component mounts
    useEffect(() => {
        refetch();
    }, [refetch]);

    const categories = getCategories?.data || [];

    const dataSource = categories.map((category, index) => ({
        key: category.id,
        index: index + 1,
        id: category.id,
        name: category.name,
        nameEng: category.nameEng,
        nameRu: category.nameRu,
        categoryImage: category.categoryImage,
        subCategoriesCount: category.subCategories.length,
        subCategories: category.subCategories,
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
            dataIndex: 'categoryImage',
            key: 'categoryImage',
            width: '80px',
            render: (image) => (
                <Image
                    width={75}
                    height={75}
                    src={image && `${CATEGORY_IMAGES}/${image}`}
                    alt="Category"
                    style={{ objectFit: 'cover', borderRadius: '4px' }}
                />
            ),
        },
        {
            title: 'Kateqoriya Adı',
            dataIndex: 'name',
            key: 'name',
            width: '25%',
        },
        {
            title: 'Kateqoriya Adı (İngiliscə)',
            dataIndex: 'nameEng',
            key: 'nameEng',
        },
        {
            title: 'Kateqoriya Adı (Rusca)',
            dataIndex: 'nameRu',
            key: 'nameRu',
        },
        {
            title: 'Alt Kateqoriyalar',
            dataIndex: 'subCategoriesCount',
            key: 'subCategoriesCount',
            render: (count) => count || 0,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Button type="link" onClick={() => navigate(`/cp/gcategories/${record.id}`)}>
                    <TbPencil fontSize="large" />
                </Button>
            ),
        },
    ];

    const expandedRowRender = (record) => {
        const subColumns = [
            {
                title: 'Alt Kateqoriya Adı',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: 'Alt Kateqoriya Adı (İngiliscə)',
                dataIndex: 'nameEng',
                key: 'nameEng',
            },
            {
                title: 'Alt Kateqoriya Adı (Rusca)',
                dataIndex: 'nameRu',
                key: 'nameRu',
            },
            {
                title: 'Şəkil',
                dataIndex: 'categoryImage',
                key: 'categoryImage',
                render: (image) => (
                    <Image
                        width={50}
                        height={50}
                        src={image && `/category-images/${image}`}
                        alt="Subcategory"
                        style={{ objectFit: 'cover', borderRadius: '4px' }}
                        fallback="/placeholder-image.png"
                    />
                ),
            },
            {
                title: 'Məhsul Sayı',
                dataIndex: 'products',
                key: 'products',
                render: (products) => products.length || 0,
            },
        ];

        const subData = record.subCategories.map((sub, index) => ({
            key: sub.id,
            index: index + 1,
            name: sub.name,
            nameEng: sub.nameEng,
            nameRu: sub.nameRu,
            categoryImage: sub.categoryImage,
            products: sub.products,
        }));

        return (
            <Table
                columns={subColumns}
                dataSource={subData}
                pagination={false}
                size="small"
            />
        );
    };

    const handleBulkDelete = async () => {
        setLoading(true);
        try {
            const deletePromises = selectedRowKeys.map(async (categoryId) => {
                try {
                    await deleteCategory(categoryId).unwrap();
                    return { id: categoryId, success: true };
                } catch (error) {
                    return { id: categoryId, success: false, error };
                }
            });

            const results = await Promise.all(deletePromises);

            const failedDeletions = results.filter(result => !result.success);
            if (failedDeletions.length === 0) {
                message.success(`${selectedRowKeys.length} kateqoriya uğurla silindi`);
            } else {
                failedDeletions.forEach(failed => {
                    message.error(`Kateqoriya ID ${failed.id} silinərkən xəta: ${failed.error.message}`);
                });
                message.success(
                    `${selectedRowKeys.length - failedDeletions.length} kateqoriya uğurla silindi`
                );
            }

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
                    {hasSelected ? `${selectedRowKeys.length} kateqoriya seçilib` : null}
                </div>
            </Flex>
            <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={dataSource}
                expandable={{
                    expandedRowRender,
                    rowExpandable: (record) => record.subCategoriesCount > 0,
                }}
                pagination={{
                    pageSize: 4,
                }}
                loading={isLoading}
                scroll={{ x: 1000 }}
            />
        </Flex>
    );
};

export default CategoriesTable;