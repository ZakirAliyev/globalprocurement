import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, Input, Flex, Row, Col, Upload, message, Cascader, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import {
    useGetCategoryByIdQuery,
    usePutCategoriesMutation,
    useGetCategoriesQuery,
} from '../../../services/adminApi.jsx';
import { CATEGORY_IMAGES } from '../../../contants/index.js';
import './index.scss';

// Helper to check if a value is a File
const isFile = (value) => value instanceof File;

// Validation schema for subcategory fields
const validationSchema = Yup.object({
    Id: Yup.string().required('ID tələb olunur'),
    Name: Yup.string().required('Alt kateqoriya adı tələb olunur'),
    NameEng: Yup.string().required('Alt kateqoriya adı (İngiliscə) tələb olunur'),
    NameRu: Yup.string().required('Alt kateqoriya adı (Rusca) tələb olunur'),
    ParentCategoryId: Yup.string().nullable(), // Allow null for no parent or top-level category
    CategoryImage: Yup.mixed().test(
        'is-required',
        'Alt kateqoriya şəkli tələb olunur',
        function (value) {
            return value && (typeof value === 'string' || isFile(value));
        }
    ),
});

const SubCategoriesEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Fetch subcategory by ID
    const { data: subCategory, isLoading: isSubCategoryLoading, refetch: refetchSubCategory } = useGetCategoryByIdQuery(id);
    // Fetch all categories for parent category selection
    const { data: getCategories, isLoading: isCategoriesLoading, error: categoriesError, refetch: refetchCategories } = useGetCategoriesQuery();

    // Refetch data when the component mounts
    useEffect(() => {
        refetchSubCategory();
        refetchCategories();
    }, [refetchSubCategory, refetchCategories]);

    const categories = getCategories?.data || [];
    const [updateSubCategory, { isLoading: isSubmitting }] = usePutCategoriesMutation();

    const parentCategoryOptions = [
        {
            value: id,
            label: 'Default',
        },
        ...categories
            .filter((cat) => !cat.subCategories.some(sub => sub.id === id))
            .map((cat) => ({
                value: cat.id,
                label: cat.name,
            })),
    ];

    // Filter function for Cascader search
    const filterCascader = (inputValue, path) =>
        path.some((option) => option.label.toLowerCase().includes(inputValue.toLowerCase()));

    const initialValues = {
        Id: subCategory?.data?.id || '',
        Name: subCategory?.data?.name || '',
        NameEng: subCategory?.data?.nameEng || '',
        NameRu: subCategory?.data?.nameRu || '',
        ParentCategoryId: subCategory?.data?.parentCategoryId ?? id,
        CategoryImage: subCategory?.data?.categoryImage || '',
    };

    // Handle form submission
    const onSubmit = async (values) => {
        try {
            const formData = new FormData();
            formData.append('Id', values.Id);
            formData.append('Name', values.Name);
            formData.append('NameEng', values.NameEng);
            formData.append('NameRu', values.NameRu);
            if (values.ParentCategoryId) {
                formData.append('ParentCategoryId', values.ParentCategoryId);
            }
            if (isFile(values.CategoryImage)) {
                formData.append('CategoryImage', values.CategoryImage);
            }

            await updateSubCategory(formData).unwrap();
            message.success('Alt kateqoriya uğurla yeniləndi!');
            navigate('/cp/subcategories');
        } catch (error) {
            message.error(error?.data?.message || 'Alt kateqoriya yenilənməsi uğursuz oldu!');
        }
    };

    // Show loading spinner while fetching data
    if (isSubCategoryLoading || isCategoriesLoading || !subCategory?.data) {
        return <Spin tip="Məlumatlar yüklənir..." />;
    }

    // Show error if categories cannot be loaded
    if (categoriesError) {
        return <div className="error-message">Kateqoriyaları yükləmək alınmadı: {categoriesError.message}</div>;
    }

    return (
        <Flex vertical gap="middle" className="subcategory-edit-container">
            <h2 className="subcategory-edit-title">Alt Kateqoriyanı Redaktə Et</h2>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
                enableReinitialize
            >
                {({ values, setFieldValue }) => (
                    <Form className="subcategory-edit-form">
                        <Row gutter={[16, 16]}>
                            <Col xs={24} sm={12}>
                                <label className="field-label">Alt Kateqoriya Adı</label>
                                <Field name="Name" as={Input} className="field-input" placeholder="Alt Kateqoriya Adı" />
                                <ErrorMessage name="Name" component="div" className="error-message" />
                            </Col>

                            <Col xs={24} sm={12}>
                                <label className="field-label">Alt Kateqoriya Adı (İngiliscə)</label>
                                <Field name="NameEng" as={Input} className="field-input" placeholder="Alt Kateqoriya Adı (İngiliscə)" />
                                <ErrorMessage name="NameEng" component="div" className="error-message" />
                            </Col>

                            <Col xs={24} sm={12}>
                                <label className="field-label">Alt Kateqoriya Adı (Rusca)</label>
                                <Field name="NameRu" as={Input} className="field-input" placeholder="Alt Kateqoriya Adı (Rusca)" />
                                <ErrorMessage name="NameRu" component="div" className="error-message" />
                            </Col>

                            <Col xs={24} sm={12}>
                                <label className="field-label">Üst Kateqoriya</label>
                                <Field name="ParentCategoryId">
                                    {({ field }) => (
                                        <Cascader
                                            options={parentCategoryOptions}
                                            value={field.value ? [field.value] : field.value === null ? [null] : []}
                                            onChange={(val) => setFieldValue('ParentCategoryId', val?.[0] || null)}
                                            showSearch={{ filter: filterCascader }}
                                            placeholder="Üst kateqoriya seçin"
                                            className="field-input"
                                            allowClear
                                        />
                                    )}
                                </Field>
                                <ErrorMessage name="ParentCategoryId" component="div" className="error-message" />
                            </Col>

                            <Col xs={24} sm={12}>
                                <label className="field-label">Alt Kateqoriya Şəkli (Yalnız 1)</label>
                                <Field name="CategoryImage">
                                    {({ field }) => (
                                        <div className="image-container">
                                            <img
                                                width={100}
                                                height={100}
                                                src={
                                                    isFile(field.value)
                                                        ? URL.createObjectURL(field.value)
                                                        : field.value
                                                            ? `${CATEGORY_IMAGES}/${field.value}`
                                                            : '/placeholder-image.png'
                                                }
                                                alt="Subcategory"
                                                className="subcategory-image"
                                            />
                                            <Upload
                                                beforeUpload={(file) => {
                                                    const isImage = file.type.startsWith('image/');
                                                    const isLt2M = file.size / 1024 / 1024 < 2;
                                                    if (!isImage) {
                                                        message.error('Yalnız şəkil faylları yüklənə bilər!');
                                                        return false;
                                                    }
                                                    if (!isLt2M) {
                                                        message.error('Şəkil 2MB-dən kiçik olmalıdır!');
                                                        return false;
                                                    }
                                                    setFieldValue('CategoryImage', file);
                                                    return false;
                                                }}
                                                accept="image/*"
                                                maxCount={1}
                                                fileList={[]}
                                                showUploadList={false}
                                            >
                                                <Button icon={<UploadOutlined />}>Şəkil Yüklə</Button>
                                            </Upload>
                                        </div>
                                    )}
                                </Field>
                                <ErrorMessage name="CategoryImage" component="div" className="error-message" />
                            </Col>
                        </Row>

                        <Button type="primary" htmlType="submit" loading={isSubmitting}>
                            Yadda Saxla
                        </Button>
                    </Form>
                )}
            </Formik>
        </Flex>
    );
};

export default SubCategoriesEdit;