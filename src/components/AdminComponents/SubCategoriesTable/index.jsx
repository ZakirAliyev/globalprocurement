import { useState, useEffect } from 'react';
import { Button, Flex, Table, Image, message } from 'antd';
import { useDeleteCategoryMutation, useGetCategoriesQuery } from '../../../services/adminApi.jsx';
import { useNavigate } from 'react-router-dom';
import { TbPencil } from 'react-icons/tb';
import { CATEGORY_IMAGES } from '../../../contants/index.js';

const SubCategoriesTable = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { data: getCategories, isLoading, refetch } = useGetCategoriesQuery();
    const [deleteSubCategory] = useDeleteCategoryMutation();

    // Refetch data when the component mounts
    useEffect(() => {
        refetch();
    }, [refetch]);

    // Extract subcategories from all categories
    const subCategories = getCategories?.data
        ?.flatMap(category => category.subCategories)
        .map((subCategory, index) => ({
            key: subCategory.id,
            index: index + 1,
            id: subCategory.id,
            name: subCategory.name,
            nameEng: subCategory.nameEng,
            nameRu: subCategory.nameRu,
            categoryImage: subCategory.categoryImage,
            productsCount: subCategory.products.length,
        })) || [];

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
                    alt="Subcategory"
                    style={{ objectFit: 'cover', borderRadius: '4px' }}
                    fallback="/placeholder-image.png"
                />
            ),
        },
        {
            title: 'Alt Kateqoriya Adı',
            dataIndex: 'name',
            key: 'name',
            width: '25%',
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
            title: 'Məhsul Sayı',
            dataIndex: 'productsCount',
            key: 'productsCount',
            render: (count) => count || 0,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Button type="link" onClick={() => navigate(`/cp/subcategories/${record.id}`)}>
                    <TbPencil fontSize="large" />
                </Button>
            ),
        },
    ];

    const handleBulkDelete = async () => {
        setLoading(true);
        try {
            const deletePromises = selectedRowKeys.map(async (subCategoryId) => {
                try {
                    await deleteSubCategory(subCategoryId).unwrap();
                    return { id: subCategoryId, success: true };
                } catch (error) {
                    return { id: subCategoryId, success: false, error };
                }
            });

            const results = await Promise.all(deletePromises);

            const failedDeletions = results.filter(result => !result.success);
            if (failedDeletions.length === 0) {
                message.success(`${selectedRowKeys.length} alt kateqoriya uğurla silindi`);
            } else {
                failedDeletions.forEach(failed => {
                    message.error(`Alt kateqoriya ID ${failed.id} silinərkən xəta: ${failed.error.message}`);
                });
                message.success(
                    `${selectedRowKeys.length - failedDeletions.length} alt kateqoriya uğurla silindi`
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
                    {hasSelected ? `${selectedRowKeys.length} alt kateqoriya seçilib` : null}
                </div>
                <Button
                    type="primary"
                    onClick={() => navigate('/cp/subcategory/add')}
                >
                    Alt Kateqoriya Əlavə et
                </Button>
            </Flex>
            <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={subCategories}
                pagination={{
                    pageSize: 4,
                }}
                loading={isLoading}
                scroll={{ x: 1000 }}
            />
        </Flex>
    );
};

export default SubCategoriesTable;