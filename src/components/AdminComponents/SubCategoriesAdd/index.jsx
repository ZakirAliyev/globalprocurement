import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, Input, Flex, Row, Col, Upload, message, Spin, Cascader } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useGetCategoriesQuery, usePostCategoriesMutation } from '../../../services/adminApi.jsx';
import './index.scss';

// Helper function to check if a value is a File
const isFile = (value) => value instanceof File;

// Validation schema for the category form
const validationSchema = Yup.object({
    Name: Yup.string().required('Kateqoriya adı tələb olunur'),
    NameEng: Yup.string().required('Kateqoriya adı (İngiliscə) tələb olunur'),
    NameRu: Yup.string().required('Kateqoriya adı (Rusca) tələb olunur'),
    CategoryImage: Yup.mixed().required('Kateqoriya şəkli tələb olunur'),
    ParentCategoryId: Yup.string().nullable(), // Optional, can be null
});

const SubCategoriesAdd = () => {
    const navigate = useNavigate();
    const [createCategory, { isLoading: isSubmitting }] = usePostCategoriesMutation();
    const { data: parentCategories, isLoading: isCategoriesLoading, error: categoriesError } = useGetCategoriesQuery();
    const categories = parentCategories?.data || [];

    // Initial form values
    const initialValues = {
        Name: '',
        NameEng: '',
        NameRu: '',
        CategoryImage: null,
        ParentCategoryId: null, // Can be null or a selected category ID
    };

    // Handle form submission with multipart/form-data
    const onSubmit = async (values) => {
        try {
            const formData = new FormData();
            formData.append('Name', values.Name);
            formData.append('NameEng', values.NameEng);
            formData.append('NameRu', values.NameRu);
            if (isFile(values.CategoryImage)) {
                formData.append('CategoryImage', values.CategoryImage);
            }
            formData.append('ParentCategoryId', values.ParentCategoryId || ''); // Send empty string if null

            await createCategory(formData).unwrap();
            message.success('Kateqoriya uğurla yaradıldı!');
            navigate('/cp/gcategories');
        } catch (error) {
            console.error('Failed to create category:', error);
            message.error(error?.data?.message || 'Kateqoriya yaradılması uğursuz oldu!');
        }
    };

    // Create cascader options for parent categories only
    const categoryOptions = categories.map((category) => ({
        value: category.id,
        label: category.name,
    }));

    // Function to filter cascader options for search
    const filterCascader = (inputValue, path) => {
        return path.some((option) => option.label.toLowerCase().includes(inputValue.toLowerCase()));
    };

    return (
        <Flex vertical gap="middle" className="category-add-container">
            <h2 className="category-add-title">Yeni Kateqoriya Yarat</h2>
            {isCategoriesLoading ? (
                <Spin tip="Kateqoriyalar yüklənir..." />
            ) : categoriesError ? (
                <div className="error-message">Kateqoriyaları yükləmək alınmadı: {categoriesError.message}</div>
            ) : (
                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                    {({ values, setFieldValue }) => (
                        <Form className="category-add-form">
                            <Row gutter={[16, 16]}>
                                <Col xs={24} sm={12}>
                                    <label className="field-label">Kateqoriya Adı</label>
                                    <Field name="Name" as={Input} placeholder="Kateqoriya Adı" className="field-input" />
                                    <ErrorMessage name="Name" component="div" className="error-message" />
                                </Col>
                                <Col xs={24} sm={12}>
                                    <label className="field-label">Kateqoriya Adı (İngiliscə)</label>
                                    <Field name="NameEng" as={Input} placeholder="Kateqoriya Adı (İngiliscə)" className="field-input" />
                                    <ErrorMessage name="NameEng" component="div" className="error-message" />
                                </Col>
                                <Col xs={24} sm={12}>
                                    <label className="field-label">Kateqoriya Adı (Rusca)</label>
                                    <Field name="NameRu" as={Input} placeholder="Kateqoriya Adı (Rusca)" className="field-input" />
                                    <ErrorMessage name="NameRu" component="div" className="error-message" />
                                </Col>
                                <Col xs={24} sm={12}>
                                    <label className="field-label">Üst Kateqoriya (İstəyə bağlı)</label>
                                    <Field name="ParentCategoryId">
                                        {({ field }) => (
                                            <Cascader
                                                options={categoryOptions}
                                                onChange={(value) => {
                                                    setFieldValue('ParentCategoryId', value ? value[0] : null);
                                                }}
                                                placeholder="Üst kateqoriya seçin"
                                                showSearch={{ filter: filterCascader }}
                                                className="field-input"
                                                allowClear
                                            />
                                        )}
                                    </Field>
                                    <ErrorMessage name="ParentCategoryId" component="div" className="error-message" />
                                </Col>
                                <Col xs={24} sm={12}>
                                    <label className="field-label">Kateqoriya Şəkli (Yalnız 1)</label>
                                    <Field name="CategoryImage">
                                        {({ field }) => (
                                            <div className="image-container">
                                                {field.value && isFile(field.value) && (
                                                    <img
                                                        width={100}
                                                        height={100}
                                                        src={URL.createObjectURL(field.value)}
                                                        alt="Category"
                                                        className="category-image"
                                                    />
                                                )}
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
                                                >
                                                    <Button icon={<UploadOutlined />}>Şəkil Yüklə</Button>
                                                </Upload>
                                            </div>
                                        )}
                                    </Field>
                                    <ErrorMessage name="CategoryImage" component="div" className="error-message" />
                                </Col>
                            </Row>
                            <Button type="primary" htmlType="submit" className="submit-button123" loading={isSubmitting}>
                                Yadda Saxla
                            </Button>
                        </Form>
                    )}
                </Formik>
            )}
        </Flex>
    );
};

export default SubCategoriesAdd;