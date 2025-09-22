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

// Helper
const isFile = (value) => value instanceof File;

const validationSchema = Yup.object({
    Id: Yup.string().required('ID tələb olunur'),
    Name: Yup.string().required('Kateqoriya adı tələb olunur'),
    NameEng: Yup.string().required('Kateqoriya adı (İngiliscə) tələb olunur'),
    NameRu: Yup.string().required('Kateqoriya adı (Rusca) tələb olunur'),
    ParentCategoryId: Yup.string().nullable(), // Optional, can be null
    CategoryImage: Yup.mixed().test(
        'is-required',
        'Kateqoriya şəkli tələb olunur',
        function (value) {
            return value && (typeof value === 'string' || isFile(value));
        }
    ),
});

const CategoriesEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: category, isLoading: isCategoryLoading, refetch: refetchCategory } = useGetCategoryByIdQuery(id);
    const { data: getCategories, isLoading: isCategoriesLoading, error: categoriesError, refetch: refetchCategories } = useGetCategoriesQuery();
    const [updateCategory, { isLoading: isSubmitting }] = usePutCategoriesMutation();

    // Refetch data when the component mounts
    useEffect(() => {
        refetchCategory();
        refetchCategories();
    }, [refetchCategory, refetchCategories]);

    const categories = getCategories?.data || [];

    const initialValues = {
        Id: category?.data?.id || '',
        Name: category?.data?.name || '',
        NameEng: category?.data?.nameEng || '',
        NameRu: category?.data?.nameRu || '',
        ParentCategoryId: category?.data?.parentCategoryId || '',
        CategoryImage: category?.data?.categoryImage || '',
    };

    const parentCategoryOptions = categories
        .filter((cat) => !cat.parentCategoryId && cat.id !== id)
        .map((cat) => ({
            value: cat.id,
            label: cat.name,
        }));

    const filterCascader = (inputValue, path) =>
        path.some((option) => option.label.toLowerCase().includes(inputValue.toLowerCase()));

    const onSubmit = async (values) => {
        try {
            const formData = new FormData();
            formData.append('Id', values.Id);
            formData.append('Name', values.Name);
            formData.append('NameEng', values.NameEng);
            formData.append('NameRu', values.NameRu);
            formData.append('ParentCategoryId', values.ParentCategoryId || '');
            if (isFile(values.CategoryImage)) {
                formData.append('CategoryImage', values.CategoryImage);
            }

            await updateCategory(formData).unwrap();
            message.success('Kateqoriya uğurla yeniləndi!');
            navigate('/cp/gcategories');
        } catch (error) {
            message.error(error?.data?.message || 'Kateqoriya yenilənməsi uğursuz oldu!');
        }
    };

    if (isCategoryLoading || isCategoriesLoading || !category?.data) {
        return <Spin tip="Məlumatlar yüklənir..." />;
    }

    if (categoriesError) {
        return <div className="error-message">Kateqoriyaları yükləmək alınmadı: {categoriesError.message}</div>;
    }

    return (
        <Flex vertical gap="middle" className="category-edit-container">
            <h2 className="category-edit-title">Kateqoriyanı Redaktə Et</h2>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
                enableReinitialize
            >
                {({ values, setFieldValue }) => (
                    <Form className="category-edit-form">
                        <Row gutter={[16, 16]}>
                            <Col xs={24} sm={12}>
                                <label className="field-label">Kateqoriya Adı</label>
                                <Field name="Name" as={Input} className="field-input" placeholder="Kateqoriya Adı" />
                                <ErrorMessage name="Name" component="div" className="error-message" />
                            </Col>

                            <Col xs={24} sm={12}>
                                <label className="field-label">Kateqoriya Adı (İngiliscə)</label>
                                <Field name="NameEng" as={Input} className="field-input" placeholder="Kateqoriya Adı (İngiliscə)" />
                                <ErrorMessage name="NameEng" component="div" className="error-message" />
                            </Col>

                            <Col xs={24} sm={12}>
                                <label className="field-label">Kateqoriya Adı (Rusca)</label>
                                <Field name="NameRu" as={Input} className="field-input" placeholder="Kateqoriya Adı (Rusca)" />
                                <ErrorMessage name="NameRu" component="div" className="error-message" />
                            </Col>

                            <Col xs={24} sm={12}>
                                <label className="field-label">Kateqoriya Şəkli (Yalnız 1)</label>
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
                                                alt="Category"
                                                className="category-image"
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

export default CategoriesEdit;