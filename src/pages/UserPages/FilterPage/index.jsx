import './index.scss';
import {FaMinus, FaPlus} from 'react-icons/fa6';
import {MdChevronRight} from 'react-icons/md';
import Card from '../../../components/UserComponents/Card/index.jsx';
import PageTop from '../../../components/PageTop/index.jsx';
import PageBottom from '../../../components/PageBottom/index.jsx';
import {useGetCategoryByIdQuery} from "../../../services/adminApi.jsx";
import {useParams, useNavigate} from 'react-router-dom';
import {useState, useMemo, useEffect} from "react";

function FilterPage() {
    const {categoryId, subCategoryId} = useParams();
    const navigate = useNavigate();

    const sortLabels = {
        bestseller: "Ən çox satılan",
        newest: "Ən yenilər",
        priceDesc: "Bahadan ucuza",
        priceAsc: "Ucuzdan bahaya",
    };

    // 🔹 Əsas və subcategory sorğuları
    const {
        data: categoryData,
        isLoading: isCategoryLoading,
        error: categoryError
    } = useGetCategoryByIdQuery(categoryId, {skip: !categoryId});

    const {
        data: subCategoryData,
        isLoading: isSubCategoryLoading,
        error: subCategoryError
    } = useGetCategoryByIdQuery(subCategoryId, {skip: !subCategoryId});

    // 🔹 React state ilə idarə
    const [category, setCategory] = useState(null);
    const [subCategory, setSubCategory] = useState(null);

    // Əsas category data yeniləndikdə state-ə yaz
    useEffect(() => {
        if (categoryData?.data) setCategory(categoryData.data);
    }, [categoryData]);

    // Subcategory dəyişdikdə və ya silindikdə yeniləyirik
    useEffect(() => {
        if (!subCategoryId) setSubCategory(null);
        else if (subCategoryData?.data) setSubCategory(subCategoryData.data);
    }, [subCategoryData, subCategoryId]);

    // 🔹 Filter vəziyyətləri
    const [openFilters, setOpenFilters] = useState({
        brend: true,
        marka: false,
        price: false,
    });

    const [filters, setFilters] = useState({
        brands: [],
        models: [],
        minPrice: 0,
        maxPrice: 100000,
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [sortOpen, setSortOpen] = useState(false);
    const [sortType, setSortType] = useState(null);
    const itemsPerPage = 20;

    // 🔹 Məhsul siyahısı (əvvəlki kimi)
    const baseProducts = useMemo(() => {
        if (subCategory) return subCategory.products || [];
        if (category)
            return [
                ...(category.products || []),
                ...(category.subCategories?.flatMap(sub => sub.products || []) || [])
            ];
        return [];
    }, [category, subCategory, categoryId, subCategoryId]);

    const availableBrands = useMemo(() => {
        const brands = baseProducts
            .map(p => p.brand)
            .filter(b => b && b.trim() !== '');
        return [...new Set(brands)]; // təkrarlanmayanlar
    }, [baseProducts]);


    // 🔹 Filter tətbiqi
    const filteredProducts = useMemo(() => {
        let result = [...baseProducts];

        if (filters.brands.length > 0) {
            result = result.filter(p =>
                filters.brands.some(b =>
                    p.brand?.toLowerCase().includes(b.toLowerCase())
                )
            );
        }

        if (filters.models.length > 0) {
            result = result.filter(p =>
                filters.models.some(m =>
                    p.model?.toLowerCase().includes(m.toLowerCase())
                )
            );
        }

        result = result.filter(p =>
            (p.price >= filters.minPrice) && (p.price <= filters.maxPrice)
        );

        return result;
    }, [baseProducts, filters, categoryId, subCategoryId]);

    // 🔹 Sort tətbiqi
    const sortedProducts = useMemo(() => {
        let products = [...filteredProducts];
        switch (sortType) {
            case 'bestseller':
                return products.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
            case 'newest':
                return products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            case 'priceDesc':
                return products.sort((a, b) => b.price - a.price);
            case 'priceAsc':
                return products.sort((a, b) => a.price - b.price);
            default:
                return products;
        }
    }, [filteredProducts, sortType]);

    // 🔹 Pagination hesablaması
    const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage);

    // 🔹 Filter funksiyaları
    const toggleFilter = (key) => {
        setOpenFilters(prev => ({...prev, [key]: !prev[key]}));
    };

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => {
            const currentValues = prev[filterType];
            const updatedValues = currentValues.includes(value)
                ? currentValues.filter(item => item !== value)
                : [...currentValues, value];
            return {...prev, [filterType]: updatedValues};
        });
        setCurrentPage(1);
    };

    const handlePriceChange = (type, value) => {
        const numValue = parseFloat(value) || 0;
        setFilters(prev => ({...prev, [type]: numValue >= 0 ? numValue : 0}));
        setCurrentPage(1);
    };

    const resetFilter = (filterType) => {
        if (filterType === 'minPrice' || filterType === 'maxPrice') {
            const highest = baseProducts.length > 0 ? Math.max(...baseProducts.map(p => p.price)) : 100000;
            setFilters(prev => ({
                ...prev,
                minPrice: 0,
                maxPrice: highest
            }));
        } else {
            setFilters(prev => ({
                ...prev,
                [filterType]: Array.isArray(prev[filterType]) ? [] : 0
            }));
        }
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({top: 0, behavior: 'smooth'});
    };

    const handleSort = (type) => {
        setSortType(type);
        setSortOpen(false);
    };

    // 🔹 Pagination komponenti
    const Pagination = ({currentPage, totalPages, onPageChange}) => {
        if (totalPages <= 1) return null;
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    className={`page-btn ${i === currentPage ? 'active' : ''}`}
                    onClick={() => onPageChange(i)}
                >
                    {i}
                </button>
            );
        }
        return (
            <div className="pagination">
                <button
                    className="nav-btn"
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                >
                    &lt;
                </button>
                {pages}
                <button
                    className="nav-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                >
                    &gt;
                </button>
            </div>
        );
    };

    return (
        <>
            <PageTop/>
            <section id="filterPage">
                <div className="container">
                    {/* Navigasiya */}
                    <div className="navigation">
                        <div className="navText" onClick={() => navigate('/')}>
                            Ana səhifə
                        </div>
                        <MdChevronRight className="navText"/>
                        {category && (
                            <div
                                className="navText"
                                onClick={() => navigate(`/${category.id}`)}
                            >
                                {category.name}
                            </div>
                        )}
                        {subCategory && (
                            <>
                                <MdChevronRight className="navText"/>
                                <div className="selected navText">{subCategory.name}</div>
                            </>
                        )}
                    </div>

                    {/* Başlıq */}
                    <h2>{subCategory?.name || category?.name || 'Kateqoriya'}</h2>
                    <div className="line3"></div>

                    <div className="row">
                        {/* Sol tərəf */}
                        <div className="col-3 col-md-0 col-sm-0 col-xs-0 pd0">
                            <div className="box">
                                <div className="h4" style={{marginBottom: 0}}>
                                    Məhsul kateqoriyaları
                                </div>
                                <div style={{maxHeight: '200px', overflow: 'auto'}} className="dordyuzluk">
                                    {category?.subCategories?.length > 0 ? (
                                        category.subCategories.map((sub, index) => (
                                            <div
                                                key={index}
                                                className="h5 subcat-item"
                                                onClick={() => navigate(`/${category.id}/${sub.id}`)}
                                            >
                                                <span>{sub.name}</span>
                                                <span className="count"> ({sub.products?.length || 0})</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="h5" style={{marginTop: '20px'}}>
                                            Alt kateqoriya yoxdur
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Filtr paneli */}
                            <div className="box">
                                <div className="h4">Filtr</div>
                                <div className="line"></div>

                                {/* Brend filter */}
                                <div className="filter-header" onClick={() => toggleFilter('brend')}>
                                    <div className="left">
                                        {openFilters.brend ? <FaMinus className="icon"/> : <FaPlus className="icon"/>}
                                        <span className="h4 title">Brend</span>
                                    </div>
                                    <span
                                        className="reset"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            resetFilter('brands');
                                        }}
                                    >
                                        Sıfırlayın
                                    </span>
                                </div>
                                <div className={`filter-content ${openFilters.brend ? 'open' : ''}`}>
                                    {availableBrands.length > 0 ? (
                                        availableBrands.map((brand, index) => (
                                            <div className="inputWrapper" key={`brand-${index}`}>
                                                <input
                                                    type="checkbox"
                                                    checked={filters.brands.includes(brand)}
                                                    onChange={() => handleFilterChange('brands', brand)}
                                                    id={`brand-${index}`}
                                                />
                                                <label htmlFor={`brand-${index}`} className="h5">
                                                    {brand}
                                                </label>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="h5" style={{marginTop: '10px'}}>
                                            Brendlər yoxdur
                                        </div>
                                    )}
                                </div>


                                <div className="line line1"></div>

                                {/* Qiymət filter */}
                                <div className="filter-header" onClick={() => toggleFilter('price')}>
                                    <div className="left">
                                        {openFilters.price ? <FaMinus className="icon"/> : <FaPlus className="icon"/>}
                                        <span className="h4 title">Qiymət</span>
                                    </div>
                                    <span
                                        className="reset"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            resetFilter('minPrice');
                                            resetFilter('maxPrice');
                                        }}
                                    >
                                        Sıfırlayın
                                    </span>
                                </div>
                                <div className={`filter-content ${openFilters.price ? 'open' : ''}`}>
                                    <div className="max-price-info">
                                        <span>Ən yüksək qiymət </span>
                                        <strong>
                                            {baseProducts.length > 0
                                                ? `${Math.max(...baseProducts.map(p => p.price)).toLocaleString('az-AZ', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })} ₼`
                                                : '0 ₼'}
                                        </strong>
                                    </div>

                                    <div className="price-inputs">
                                        <div className="price-box">
                                            <span className="currency">₼</span>
                                            <input
                                                type="number"
                                                placeholder="Min"
                                                value={filters.minPrice || ''}
                                                onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>
                                        <div className="price-box">
                                            <span className="currency">₼</span>
                                            <input
                                                type="number"
                                                placeholder="Max"
                                                value={filters.maxPrice || ''}
                                                onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sağ tərəf */}
                        <div className="col-9 col-md-12 col-xs-12 col-sm-12 pd1">
                            {isCategoryLoading || isSubCategoryLoading ? (
                                <div className="col-12">Yüklənir...</div>
                            ) : categoryError || subCategoryError ? (
                                <div className="col-12">Xəta baş verdi</div>
                            ) : (
                                <>
                                    {/* Sıralama */}
                                    <div className="box pd2" style={{
                                        fontSize: '14px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: '16px'
                                    }}>
                                        <span>{filteredProducts.length} məhsul</span>
                                        <div className="sort-dropdown">
                                            <button
                                                className="sort-button"
                                                onClick={() => setSortOpen(!sortOpen)}
                                            >
                                                <i className="fa-solid fa-filter"></i>
                                                <span>
                                                    {sortType ? sortLabels[sortType] : "Sıralama"}
                                                </span>
                                            </button>

                                            {sortOpen && (
                                                <div className="sort-menu">
                                                    {Object.entries(sortLabels).map(([key, label]) => (
                                                        <div
                                                            key={key}
                                                            className={`sort-option ${sortType === key ? "active" : ""}`}
                                                            onClick={() => handleSort(key)}
                                                        >
                                                            {label}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Məhsullar */}
                                    <div className="row">
                                        {currentProducts.length > 0 ? (
                                            currentProducts.map((item) => (
                                                <div className="col-3 col-md-4 col-sm-6 col-xs-6" key={item.id}>
                                                    <Card item={item}/>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="col-12">Heç bir məhsul tapılmadı</div>
                                        )}
                                    </div>

                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={handlePageChange}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>
            <PageBottom/>
        </>
    );
}

export default FilterPage;
