import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, Input, Flex, Row, Col, Upload, message, Cascader, Checkbox, Spin } from 'antd';
import { UploadOutlined, CloseOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetProductByIdQuery, usePutProductsMutation, useGetCategoriesQuery } from '../../../services/adminApi.jsx';
import { PRODUCT_IMAGES } from '../../../contants/index.js';
import './index.scss';

// Helper functions to check file and string types
const isFile = (value) => value instanceof File;
const isString = (value) => typeof value === 'string';

// Validation schema for Specifications and Measures
const specMeasureValidation = Yup.object().shape({
    key: Yup.string().required('Açar tələb olunur'),
    keyEng: Yup.string().required('Açar (İngiliscə) tələb olunur'),
    keyRu: Yup.string().required('Açar (Rusca) tələb olunur'),
    value: Yup.string().required('Dəyər tələb olunur'),
    valueEng: Yup.string().required('Dəyər (İngiliscə) tələb olunur'),
    valueRu: Yup.string().required('Dəyər (Rusca) tələb olunur'),
});

const ProductsEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: product, isLoading: isProductLoading, refetch: refetchProduct } = useGetProductByIdQuery(id);
    const { data: getCategories, isLoading: isCategoriesLoading, error: categoriesError, refetch: refetchCategories } = useGetCategoriesQuery();
    const [updateProduct, { isLoading: isSubmitting }] = usePutProductsMutation();
    const categories = getCategories?.data || [];

    // Refetch data when the component mounts
    useEffect(() => {
        refetchProduct();
        refetchCategories();
    }, [refetchProduct, refetchCategories]);

    // Validation schema using Yup
    const validationSchema = Yup.object({
        Name: Yup.string().required('Məhsul adı tələb olunur'),
        NameEng: Yup.string().required('Məhsul adı (İngiliscə) tələb olunur'),
        NameRu: Yup.string().required('Məhsul adı (Rusca) tələb olunur'),
        Brand: Yup.string().required('Brend tələb olunur'),
        Model: Yup.string().required('Model tələb olunur'),
        Price: Yup.number()
            .required('Qiymət tələb olunur')
            .positive('Qiymət müsbət olmalıdır')
            .typeError('Qiymət rəqəm olmalıdır'),
        Discount: Yup.number()
            .nullable()
            .positive('Endirim müsbət olmalıdır')
            .typeError('Endirim rəqəm olmalıdır'),
        CategoryId: Yup.string().required('Alt kateqoriya tələb olunur'),
        CardImage: Yup.mixed().required('Kart şəkli tələb olunur'),
        Images: Yup.array()
            .min(1, 'Ən azı bir şəkil tələb olunur')
            .required('Şəkillər tələb olunur'),
        Specifications: Yup.array()
            .of(specMeasureValidation)
            .test('complete-or-empty', 'Bütün spesifikasiya sahələri doldurulmalı və ya boş olmalıdır', (value) => {
                if (!value || value.length === 0) return true;
                return value.every(
                    (spec) =>
                        (spec.key && spec.keyEng && spec.keyRu && spec.value && spec.valueEng && spec.valueRu) ||
                        (!spec.key && !spec.keyEng && !spec.keyRu && !spec.value && !spec.valueEng && !spec.valueRu)
                );
            }),
        Measures: Yup.array()
            .of(specMeasureValidation)
            .test('complete-or-empty', 'Bütün ölçü sahələri doldurulmalı və ya boş olmalıdır', (value) => {
                if (!value || value.length === 0) return true;
                return value.every(
                    (measure) =>
                        (measure.key && measure.keyEng && measure.keyRu && measure.value && measure.valueEng && measure.valueRu) ||
                        (!measure.key && !measure.keyEng && !measure.keyRu && !measure.value && !measure.valueEng && !measure.valueRu)
                );
            }),
    });

    // Initial form values
    const initialValues = {
        Id: product?.data?.id || '',
        Name: product?.data?.name || '',
        NameEng: product?.data?.nameEng || '',
        NameRu: product?.data?.nameRu || '',
        Brand: product?.data?.brand || '',
        Model: product?.data?.model || '',
        Price: product?.data?.price || '',
        Discount: product?.data?.discount || '',
        CategoryId: product?.data?.subCategoryId || '',
        CardImage: product?.data?.cardImage || '',
        isPopular: product?.data?.isPopular || false,
        isNew: product?.data?.isNew || false,
        isGreatOffer: product?.data?.isGreatOffer || false,
        Measures: product?.data?.measures || [],
        Specifications: product?.data?.specifications || [],
        Images: product?.data?.images || [],
        DeleteImageNames: [],
    };

    // Create cascader options for categories and subcategories
    const categoryOptions = categories.map((category) => ({
        value: category.id,
        label: category.name,
        children: category.subCategories.map((sub) => ({
            value: sub.id,
            label: sub.name,
        })),
    }));

    // Function to filter cascader options for search
    const filterCascader = (inputValue, path) => {
        return path.some((option) => option.label.toLowerCase().includes(inputValue.toLowerCase()));
    };

    // Handle form submission with multipart/form-data
    const onSubmit = async (values) => {
        try {
            const formData = new FormData();
            formData.append('Id', values.Id);
            formData.append('Name', values.Name);
            formData.append('NameEng', values.NameEng);
            formData.append('NameRu', values.NameRu);
            formData.append('Brand', values.Brand);
            formData.append('Model', values.Model);
            formData.append('Price', values.Price);
            if (values.Discount) formData.append('Discount', values.Discount);
            formData.append('CategoryId', values.CategoryId);
            if (isFile(values.CardImage)) formData.append('CardImage', values.CardImage);
            formData.append('isPopular', values.isPopular);
            formData.append('isNew', values.isNew);
            formData.append('isGreatOffer', values.isGreatOffer);
            if (values.Measures.length > 0 && values.Measures.some(measure => measure.key || measure.value)) {
                formData.append('MeasuresJson', JSON.stringify(values.Measures));
            }
            if (values.Specifications.length > 0 && values.Specifications.some(spec => spec.key || spec.value)) {
                formData.append('SpecificationsJson', JSON.stringify(values.Specifications));
            }
            values.Images.forEach((image) => {
                if (isFile(image)) formData.append('Images', image);
            });
            values.DeleteImageNames.forEach((name) => {
                if (isString(name)) formData.append('DeleteImageNames', name);
            });

            await updateProduct(formData).unwrap();
            message.success('Məhsul uğurla yeniləndi!');
            navigate('/cp/products');
        } catch (error) {
            console.error('Failed to update product:', error);
            message.error(error?.data?.message || 'Məhsul yenilənməsi uğursuz oldu!');
        }
    };

    if (isProductLoading || isCategoriesLoading) {
        return <Spin tip="Məlumatlar yüklənir..."/>;
    }

    if (categoriesError) {
        return <div className="error-message">Kateqoriyaları yükləmək alınmadı: {categoriesError.message}</div>;
    }

    // Default value for Cascader based on subCategoryId
    const getDefaultCascaderValue = () => {
        if (!product?.data?.subCategoryId || !categories.length) return undefined;
        const subCategory = categories
            .flatMap((cat) =>
                cat.subCategories.map((sub) => ({
                    categoryId: cat.id,
                    subCategoryId: sub.id,
                    subCategoryName: sub.name,
                }))
            )
            .find((item) => item.subCategoryId === product.data.subCategoryId);
        return subCategory ? [subCategory.categoryId, subCategory.subCategoryId] : undefined;
    };

    return (
        <Flex vertical gap="middle" className="product-add-container">
            <h2 className="product-add-title">Məhsulu Redaktə Et</h2>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}
                    enableReinitialize>
                {({ values, setFieldValue }) => (
                    <Form className="product-add-form">
                        <Row gutter={[16, 16]}>
                            <Col xs={24} sm={12}>
                                <label className="field-label">Məhsul Adı</label>
                                <Field name="Name" as={Input} placeholder="Məhsul Adı" className="field-input"/>
                                <ErrorMessage name="Name" component="div" className="error-message"/>
                            </Col>
                            <Col xs={24} sm={12}>
                                <label className="field-label">Məhsul Adı (İngiliscə)</label>
                                <Field name="NameEng" as={Input} placeholder="Məhsul Adı (İngiliscə)"
                                       className="field-input"/>
                                <ErrorMessage name="NameEng" component="div" className="error-message"/>
                            </Col>
                            <Col xs={24} sm={12}>
                                <label className="field-label">Məhsul Adı (Rusca)</label>
                                <Field name="NameRu" as={Input} placeholder="Məhsul Adı (Rusca)"
                                       className="field-input"/>
                                <ErrorMessage name="NameRu" component="div" className="error-message"/>
                            </Col>
                            <Col xs={24} sm={12}>
                                <label className="field-label">Brend</label>
                                <Field name="Brand" as={Input} placeholder="Brend" className="field-input"/>
                                <ErrorMessage name="Brand" component="div" className="error-message"/>
                            </Col>
                            <Col xs={24} sm={12}>
                                <label className="field-label">Model</label>
                                <Field name="Model" as={Input} placeholder="Model" className="field-input"/>
                                <ErrorMessage name="Model" component="div" className="error-message"/>
                            </Col>
                            <Col xs={24} sm={12}>
                                <label className="field-label">Qiymət</label>
                                <Field name="Price" as={Input} type="number" placeholder="Qiymət" step="0.01"
                                       className="field-input"/>
                                <ErrorMessage name="Price" component="div" className="error-message"/>
                            </Col>
                            <Col xs={24} sm={12}>
                                <label className="field-label">Endirim (İstəyə bağlı)</label>
                                <Field name="Discount" as={Input} type="number" placeholder="Endirim" step="0.01"
                                       className="field-input"/>
                                <ErrorMessage name="Discount" component="div" className="error-message"/>
                            </Col>
                            <Col xs={24} sm={12}>
                                <label className="field-label">Alt Kateqoriya</label>
                                <Field name="CategoryId">
                                    {({ field, form }) => {
                                        // Function to get the cascader value based on selected subcategory ID
                                        const getCascaderValue = () => {
                                            const subCategoryId = field.value || product?.data?.subCategoryId;

                                            if (!subCategoryId || !categories.length) return undefined;

                                            // Find the category that contains this subcategory
                                            for (const category of categories) {
                                                const subCategory = category.subCategories.find(sub => sub.id === subCategoryId);
                                                if (subCategory) {
                                                    return [category.id, subCategory.id];
                                                }
                                            }
                                            return undefined;
                                        };

                                        return (
                                            <Cascader
                                                options={categoryOptions}
                                                value={getCascaderValue()}
                                                onChange={(value) => {
                                                    // Set the subcategory ID (second value in the array)
                                                    form.setFieldValue('CategoryId', value ? value[1] : '');
                                                }}
                                                placeholder="Alt kateqoriya seçin"
                                                changeOnSelect={false}
                                                showSearch={{ filter: filterCascader }}
                                                className="field-input"
                                                displayRender={(labels, selectedOptions) => {
                                                    if (!selectedOptions || selectedOptions.length === 0) return '';
                                                    return selectedOptions[selectedOptions.length - 1].label; // Show only subcategory name
                                                }}
                                            />
                                        );
                                    }}
                                </Field>
                                <ErrorMessage name="CategoryId" component="div" className="error-message"/>
                            </Col>
                            <Col xs={24} sm={12}>
                                <label className="field-label">Kart Şəkli (Yalnız 1)</label>
                                <Field name="CardImage">
                                    {({ field }) => (
                                        <div className="image-container">
                                            <img
                                                width={100}
                                                height={100}
                                                src={
                                                    field.value && isFile(field.value)
                                                        ? URL.createObjectURL(field.value)
                                                        : field.value && isString(field.value)
                                                            ? `${PRODUCT_IMAGES}/${field.value}`
                                                            : '/placeholder-image.png'
                                                }
                                                alt="Card"
                                                className="card-image"
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
                                                    setFieldValue('CardImage', file);
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
                                <ErrorMessage name="CardImage" component="div" className="error-message"/>
                            </Col>
                            <Col xs={24} sm={12}>
                                <label className="field-label">Şəkillər (Minimum 1, Maksimum 5)</label>
                                <Upload
                                    multiple
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
                                        setFieldValue('Images', [...values.Images, file]);
                                        return false;
                                    }}
                                    accept="image/*"
                                    fileList={[]}
                                >
                                    <Button icon={<UploadOutlined />}>Şəkilləri Yüklə</Button>
                                </Upload>
                                <ErrorMessage name="Images" component="div" className="error-message"/>
                                {values.Images.length > 0 && (
                                    <Flex wrap="wrap" gap="small" className="image-preview-container">
                                        {values.Images.map((img, index) => (
                                            <div key={index} className="image-container">
                                                <img
                                                    width={80}
                                                    height={80}
                                                    src={isFile(img) ? URL.createObjectURL(img) : `${PRODUCT_IMAGES}/${img}`}
                                                    alt={`Product Image ${index + 1}`}
                                                    className="product-image"
                                                />
                                                <Button
                                                    type="danger"
                                                    shape="circle"
                                                    icon={<CloseOutlined />}
                                                    size="small"
                                                    className="delete-button"
                                                    onClick={() => {
                                                        const newImages = values.Images.filter((_, i) => i !== index);
                                                        const deletedImageName = isString(img) ? img : null;
                                                        setFieldValue('Images', newImages);
                                                        if (deletedImageName) {
                                                            setFieldValue('DeleteImageNames', [...values.DeleteImageNames, deletedImageName]);
                                                        }
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </Flex>
                                )}
                            </Col>
                            {/* Specifications Section */}
                            <Col xs={24}>
                                <label className="field-label">Spesifikasiyalar (Maksimum 10)</label>
                                {values.Specifications.length > 0 && values.Specifications.map((spec, index) => (
                                    <Row gutter={[16, 16]} key={index} className="spec-measure-row">
                                        <Col xs={24} sm={4}>
                                            <Field
                                                name={`Specifications[${index}].key`}
                                                as={Input}
                                                placeholder="Açar"
                                                className="field-input"
                                            />
                                            <ErrorMessage name={`Specifications[${index}].key`} component="div"
                                                          className="error-message"/>
                                        </Col>
                                        <Col xs={24} sm={4}>
                                            <Field
                                                name={`Specifications[${index}].keyEng`}
                                                as={Input}
                                                placeholder="Açar (İngiliscə)"
                                                className="field-input"
                                            />
                                            <ErrorMessage name={`Specifications[${index}].keyEng`} component="div"
                                                          className="error-message"/>
                                        </Col>
                                        <Col xs={24} sm={4}>
                                            <Field
                                                name={`Specifications[${index}].keyRu`}
                                                as={Input}
                                                placeholder="Açar (Rusca)"
                                                className="field-input"
                                            />
                                            <ErrorMessage name={`Specifications[${index}].keyRu`} component="div"
                                                          className="error-message"/>
                                        </Col>
                                        <Col xs={24} sm={4}>
                                            <Field
                                                name={`Specifications[${index}].value`}
                                                as={Input}
                                                placeholder="Dəyər"
                                                className="field-input"
                                            />
                                            <ErrorMessage name={`Specifications[${index}].value`} component="div"
                                                          className="error-message"/>
                                        </Col>
                                        <Col xs={24} sm={4}>
                                            <Field
                                                name={`Specifications[${index}].valueEng`}
                                                as={Input}
                                                placeholder="Dəyər (İngiliscə)"
                                                className="field-input"
                                            />
                                            <ErrorMessage name={`Specifications[${index}].valueEng`} component="div"
                                                          className="error-message"/>
                                        </Col>
                                        <Col xs={24} sm={4}>
                                            <Field
                                                name={`Specifications[${index}].valueRu`}
                                                as={Input}
                                                placeholder="Dəyər (Rusca)"
                                                className="field-input"
                                            />
                                            <ErrorMessage name={`Specifications[${index}].valueRu`} component="div"
                                                          className="error-message"/>
                                        </Col>
                                        <Col xs={24} sm={2}>
                                            <Button
                                                type="danger"
                                                onClick={() => {
                                                    const newSpecs = values.Specifications.filter((_, i) => i !== index);
                                                    setFieldValue('Specifications', newSpecs);
                                                }}
                                                className="delete-spec-measure"
                                            >
                                                Sil
                                            </Button>
                                        </Col>
                                    </Row>
                                ))}
                                <Button
                                    type="dashed"
                                    disabled={values.Specifications.length >= 10}
                                    onClick={() => {
                                        setFieldValue('Specifications', [
                                            ...values.Specifications,
                                            { key: '', keyEng: '', keyRu: '', value: '', valueEng: '', valueRu: '' },
                                        ]);
                                    }}
                                    className="add-spec-measure"
                                >
                                    Yeni Spesifikasiya Əlavə Et
                                </Button>
                            </Col>
                            {/* Measures Section */}
                            <Col xs={24}>
                                <label className="field-label">Ölçülər (Maksimum 10)</label>
                                {values.Measures.length > 0 && values.Measures.map((measure, index) => (
                                    <Row gutter={[16, 16]} key={index} className="spec-measure-row">
                                        <Col xs={24} sm={4}>
                                            <Field
                                                name={`Measures[${index}].key`}
                                                as={Input}
                                                placeholder="Açar"
                                                className="field-input"
                                            />
                                            <ErrorMessage name={`Measures[${index}].key`} component="div"
                                                          className="error-message"/>
                                        </Col>
                                        <Col xs={24} sm={4}>
                                            <Field
                                                name={`Measures[${index}].keyEng`}
                                                as={Input}
                                                placeholder="Açar (İngiliscə)"
                                                className="field-input"
                                            />
                                            <ErrorMessage name={`Measures[${index}].keyEng`} component="div"
                                                          className="error-message"/>
                                        </Col>
                                        <Col xs={24} sm={4}>
                                            <Field
                                                name={`Measures[${index}].keyRu`}
                                                as={Input}
                                                placeholder="Açar (Rusca)"
                                                className="field-input"
                                            />
                                            <ErrorMessage name={`Measures[${index}].keyRu`} component="div"
                                                          className="error-message"/>
                                        </Col>
                                        <Col xs={24} sm={4}>
                                            <Field
                                                name={`Measures[${index}].value`}
                                                as={Input}
                                                placeholder="Dəyər"
                                                className="field-input"
                                            />
                                            <ErrorMessage name={`Measures[${index}].value`} component="div"
                                                          className="error-message"/>
                                        </Col>
                                        <Col xs={24} sm={4}>
                                            <Field
                                                name={`Measures[${index}].valueEng`}
                                                as={Input}
                                                placeholder="Dəyər (İngiliscə)"
                                                className="field-input"
                                            />
                                            <ErrorMessage name={`Measures[${index}].valueEng`} component="div"
                                                          className="error-message"/>
                                        </Col>
                                        <Col xs={24} sm={4}>
                                            <Field
                                                name={`Measures[${index}].valueRu`}
                                                as={Input}
                                                placeholder="Dəyər (Rusca)"
                                                className="field-input"
                                            />
                                            <ErrorMessage name={`Measures[${index}].valueRu`} component="div"
                                                          className="error-message"/>
                                        </Col>
                                        <Col xs={24} sm={2}>
                                            <Button
                                                type="danger"
                                                onClick={() => {
                                                    const newMeasures = values.Measures.filter((_, i) => i !== index);
                                                    setFieldValue('Measures', newMeasures);
                                                }}
                                                className="delete-spec-measure"
                                            >
                                                Sil
                                            </Button>
                                        </Col>
                                    </Row>
                                ))}
                                <Button
                                    type="dashed"
                                    disabled={values.Measures.length >= 10}
                                    onClick={() => {
                                        setFieldValue('Measures', [
                                            ...values.Measures,
                                            { key: '', keyEng: '', keyRu: '', value: '', valueEng: '', valueRu: '' },
                                        ]);
                                    }}
                                    className="add-spec-measure"
                                >
                                    Yeni Ölçü Əlavə Et
                                </Button>
                            </Col>
                        </Row>
                        <Button type="primary" htmlType="submit" className="submit-button" loading={isSubmitting}>
                            Yadda Saxla
                        </Button>
                    </Form>
                )}
            </Formik>
        </Flex>
    );
};

export default ProductsEdit;