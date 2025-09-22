import './index.scss';
import { FaMinus, FaPlus } from 'react-icons/fa6';
import { MdChevronRight } from 'react-icons/md';
import { BsFilterLeft } from 'react-icons/bs';
import Card from '../../../components/UserComponents/Card/index.jsx';
import { useState, useRef, useEffect, useCallback } from 'react';
import PageTop from '../../../components/PageTop/index.jsx';
import PageBottom from '../../../components/PageBottom/index.jsx';
import { useGetProductsQuery, usePostProductsFilterMutation } from '../../../services/userApi.jsx';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import debounce from 'lodash/debounce';

function Pagination({ currentPage, totalPages, onPageChange }) {
    const maxVisiblePages = 5;

    const getPages = () => {
        const pages = [];
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
            return pages;
        }

        const sidePages = Math.floor((maxVisiblePages - 3) / 2);
        let startPage = Math.max(2, currentPage - sidePages);
        let endPage = Math.min(totalPages - 1, currentPage + sidePages);

        if (endPage - startPage + 2 < maxVisiblePages) {
            if (currentPage <= sidePages + 2) {
                endPage = Math.min(totalPages - 1, maxVisiblePages - 1);
                startPage = 2;
            } else if (currentPage > totalPages - sidePages - 1) {
                startPage = Math.max(2, totalPages - maxVisiblePages + 2);
                endPage = totalPages - 1;
            }
        }

        pages.push(1);
        if (startPage > 2) pages.push('...');
        for (let i = startPage; i <= endPage; i++) pages.push(i);
        if (endPage < totalPages - 1) pages.push('...');
        if (totalPages > 1) pages.push(totalPages);

        return pages;
    };

    const handleClick = (page) => {
        if (page === '...' || page === currentPage) return;
        onPageChange(page);
    };

    return (
        <div className="pagination" role="navigation" aria-label="Pagination">
            <button
                className="nav-btn"
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                aria-label="Previous page"
            >
                &lt;
            </button>
            {getPages().map((page, index) => (
                <button
                    key={`${page}-${index}`}
                    className={`page-btn ${page === currentPage ? 'active' : ''}`}
                    onClick={() => handleClick(page)}
                    disabled={page === '...'}
                    aria-label={page === '...' ? 'More pages' : `Page ${page}`}
                    aria-current={page === currentPage ? 'page' : undefined}
                >
                    {page}
                </button>
            ))}
            <button
                className="nav-btn"
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                aria-label="Next page"
            >
                &gt;
            </button>
        </div>
    );
}

const SortDropdown = ({ onSelect, selectedSort }) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    const options = [
        { value: 'enyeniler', label: 'Ən yenilər' },
        { value: 'bahadanucuza', label: 'Bahadan ucuza' },
        { value: 'ucuzdanbahaya', label: 'Ucuzdan bahaya' },
    ];

    const handleSelect = (value) => {
        onSelect(value);
        setOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="sort-dropdown" ref={dropdownRef}>
            <div
                className="sort-button"
                onClick={() => setOpen(!open)}
                role="button"
                aria-expanded={open}
                aria-label="Sort options"
            >
                <BsFilterLeft style={{ fontSize: '20px' }} />
                <span>{options.find((opt) => opt.value === selectedSort)?.label || 'Sırala'}</span>
            </div>
            {open && (
                <div className="sort-menu">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            className="sort-option"
                            onClick={() => handleSelect(option.value)}
                            role="option"
                            aria-selected={selectedSort === option.value}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

function FilterPage() {
    const itemsPerPage = 4;
    const [currentPage, setCurrentPage] = useState(1);
    const [openFilters, setOpenFilters] = useState({
        brend: true,
        marka: false,
        weight: false,
        voltage: false,
        volume: false,
        length: false,
        price: false,
    });
    const [filters, setFilters] = useState({
        brands: [],
        models: [],
        minPrice: 0,
        maxPrice: 100000,
        categories: [],
        weights: [],
        voltages: [],
        volumes: [],
        lengths: [],
    });
    const [sortBy, setSortBy] = useState('');

    const location = useLocation();
    const navigate = useNavigate();
    const { id: categoryId } = useParams(); // Extract category ID from URL path

    const [postProductsFilter, { data: filteredProductsData, isLoading: loadingFilter, error: filterError }] =
        usePostProductsFilterMutation();

    const hasFilters =
        Object.values(filters).some((arr) => Array.isArray(arr) && arr.length > 0) ||
        filters.minPrice > 0 ||
        filters.maxPrice > 0;

    const skipFetch = hasFilters || filters.minPrice > 0 || filters.maxPrice > 0;
    const { data: getProducts, isLoading: loadingProducts } = useGetProductsQuery(undefined, { skip: skipFetch });

    const productsData = hasFilters ? filteredProductsData?.data : getProducts?.data;
    const isLoading = hasFilters ? loadingFilter : loadingProducts;
    const error = filterError;

    // Client-side sorting
    const sortProducts = (products) => {
        if (!products) return [];
        const sorted = [...products];
        switch (sortBy) {
            case 'enyeniler':
                return sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
            case 'bahadanucuza':
                return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
            case 'ucuzdanbahaya':
                return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
            default:
                return sorted;
        }
    };

    const sortedProducts = sortProducts(productsData);
    const totalPages = Math.ceil((sortedProducts?.length || 0) / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentProducts = sortedProducts?.slice(startIndex, startIndex + itemsPerPage) || [];

    const toggleFilter = (key) => {
        setOpenFilters((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleFilterChange = (filterType, value) => {
        setFilters((prev) => {
            const newFilters = { ...prev };
            const currentValues = newFilters[filterType];
            if (currentValues.includes(value)) {
                newFilters[filterType] = currentValues.filter((item) => item !== value);
            } else {
                newFilters[filterType] = [...currentValues, value];
            }
            return newFilters;
        });
        setCurrentPage(1);
    };

    const resetFilter = (filterType) => {
        setFilters((prev) => ({ ...prev, [filterType]: Array.isArray(prev[filterType]) ? [] : 0 }));
        setCurrentPage(1);
    };

    const handlePriceChange = (type, value) => {
        const numValue = parseFloat(value) || 0;
        setFilters((prev) => ({
            ...prev,
            [type]: numValue >= 0 ? numValue : 0,
        }));
        setCurrentPage(1);
    };

    const debouncedPostFilter = useRef(
        debounce((body) => {
            postProductsFilter(body);
        }, 300)
    ).current;

    const updateUrlParams = useCallback(() => {
        const params = new URLSearchParams();
        if (currentPage > 1) params.set('page', currentPage);
        if (sortBy) params.set('sort', sortBy);
        Object.entries(filters).forEach(([key, value]) => {
            if (Array.isArray(value) && value.length) {
                value.forEach((v) => params.append(key, v));
            } else if (typeof value === 'number' && value > 0) {
                params.set(key, value);
            }
        });

        const newSearch = params.toString();
        if (newSearch !== location.search.slice(1)) {
            navigate({ search: newSearch }, { replace: true });
        }
    }, [filters, currentPage, sortBy, navigate, location.search]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const page = parseInt(params.get('page')) || 1;
        const sort = params.get('sort') || '';
        const newFilters = {
            brands: params.getAll('brands'),
            models: params.getAll('models'),
            minPrice: parseFloat(params.get('minPrice')) || 0,
            maxPrice: parseFloat(params.get('maxPrice')) || 0,
            categories: categoryId ? [categoryId, ...params.getAll('categories')] : params.getAll('categories'), // Include categoryId
            weights: params.getAll('weights'),
            voltages: params.getAll('voltages'),
            volumes: params.getAll('volumes'),
            lengths: params.getAll('lengths'),
        };

        setCurrentPage(page);
        setSortBy(sort);
        setFilters(newFilters);
    }, [location, categoryId]);

    useEffect(() => {
        if (!hasFilters && !categoryId) return; // Skip if no filters and no category ID

        const filterBody = {
            brands: filters.brands,
            models: filters.models,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
            categories: filters.categories, // Includes categoryId
            weights: filters.weights,
            voltages: filters.voltages,
            volumes: filters.volumes,
            lengths: filters.lengths,
            orderBy: sortBy,
        };

        debouncedPostFilter(filterBody);
        updateUrlParams();
    }, [filters, sortBy, hasFilters, debouncedPostFilter, updateUrlParams, categoryId]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSortChange = (value) => {
        setSortBy(value);
        setCurrentPage(1);
    };

    return (
        <>
            <PageTop />
            <section id="filterPage">
                <div className="container">
                    <div className="navigation">
                        <div className="navText">Ana səhifə</div>
                        <MdChevronRight className="navText" />
                        <div className="selected navText">İnşaat materialları</div>
                    </div>
                    <h2>İnşaat materialları</h2>
                    <div className="line3"></div>
                    <div className="row">
                        <div className="col-3 col-md-0 col-sm-0 col-xs-0 pd0">
                            <div className="box">
                                <div className="h4" style={{ marginBottom: 0 }}>
                                    Məhsul kateqoriyaları
                                </div>
                                <div className="h5" style={{ marginTop: '20px' }}>
                                    Alçı, suvaq və materialları (43)
                                </div>
                                <div className="h5">Silikonlar, mastiklər, köpüklər (21)</div>
                                <div className="h5">Alçı, suvaq və materialları (7)</div>
                                <div className="h5">Silikonlar, mastiklər, köpüklər (15)</div>
                            </div>
                            <div className="box">
                                <div className="h4">Filtr</div>
                                <div className="line"></div>
                                {/* Brand Filter */}
                                <div className="filter-header" onClick={() => toggleFilter('brend')}>
                                    <div className="left">
                                        {openFilters.brend ? <FaMinus className="icon" /> : <FaPlus className="icon" />}
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
                                    {['Bramex', 'DWT MMA', 'Fab', 'Dünya', 'Bosh', 'Sait', 'Strong', 'Mehtap'].map(
                                        (brand, index) => (
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
                                        )
                                    )}
                                </div>
                                <div className="line line1"></div>
                                {/* Model Filter */}
                                <div className="filter-header" onClick={() => toggleFilter('marka')}>
                                    <div className="left">
                                        {openFilters.marka ? <FaMinus className="icon" /> : <FaPlus className="icon" />}
                                        <span className="h4 title">Marka</span>
                                    </div>
                                    <span
                                        className="reset"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            resetFilter('models');
                                        }}
                                    >
                                        Sıfırlayın
                                    </span>
                                </div>
                                <div className={`filter-content ${openFilters.marka ? 'open' : ''}`}>
                                    {['Model A', 'Model B', 'Model C', 'Model D', 'Model E'].map((model, index) => (
                                        <div className="inputWrapper" key={`model-${index}`}>
                                            <input
                                                type="checkbox"
                                                checked={filters.models.includes(model)}
                                                onChange={() => handleFilterChange('models', model)}
                                                id={`model-${index}`}
                                            />
                                            <label htmlFor={`model-${index}`} className="h5">
                                                {model}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                <div className="line line1"></div>
                                {/* Price Filter */}
                                <div className="filter-header" onClick={() => toggleFilter('price')}>
                                    <div className="left">
                                        {openFilters.price ? <FaMinus className="icon" /> : <FaPlus className="icon" />}
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
                                    <div className="inputWrapper">
                                        <label htmlFor="minPrice" className="h5">
                                            Minimum Qiymət
                                        </label>
                                        <input
                                            type="number"
                                            value={filters.minPrice || ''}
                                            onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                                            id="minPrice"
                                            min="0"
                                            step="0.01"
                                            placeholder="0"
                                        />
                                    </div>
                                    <div className="inputWrapper">
                                        <label htmlFor="maxPrice" className="h5">
                                            Maksimum Qiymət
                                        </label>
                                        <input
                                            type="number"
                                            value={filters.maxPrice || ''}
                                            onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                                            id="maxPrice"
                                            min="0"
                                            step="0.01"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                                <div className="line line1"></div>
                                {/* Weight Filter */}
                                <div className="filter-header" onClick={() => toggleFilter('weight')}>
                                    <div className="left">
                                        {openFilters.weight ? <FaMinus className="icon" /> : <FaPlus className="icon" />}
                                        <span className="h4 title">Çəki</span>
                                    </div>
                                    <span
                                        className="reset"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            resetFilter('weights');
                                        }}
                                    >
                                        Sıfırlayın
                                    </span>
                                </div>
                                <div className={`filter-content ${openFilters.weight ? 'open' : ''}`}>
                                    {['1kg', '5kg', '10kg', '25kg'].map((weight, index) => (
                                        <div className="inputWrapper" key={`weight-${index}`}>
                                            <input
                                                type="checkbox"
                                                checked={filters.weights.includes(weight)}
                                                onChange={() => handleFilterChange('weights', weight)}
                                                id={`weight-${index}`}
                                            />
                                            <label htmlFor={`weight-${index}`} className="h5">
                                                {weight}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                <div className="line line1"></div>
                                {/* Voltage Filter */}
                                <div className="filter-header" onClick={() => toggleFilter('voltage')}>
                                    <div className="left">
                                        {openFilters.voltage ? <FaMinus className="icon" /> : <FaPlus className="icon" />}
                                        <span className="h4 title">Gərginlik</span>
                                    </div>
                                    <span
                                        className="reset"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            resetFilter('voltages');
                                        }}
                                    >
                                        Sıfırlayın
                                    </span>
                                </div>
                                <div className={`filter-content ${openFilters.voltage ? 'open' : ''}`}>
                                    {['12V', '24V', '220V'].map((voltage, index) => (
                                        <div className="inputWrapper" key={`voltage-${index}`}>
                                            <input
                                                type="checkbox"
                                                checked={filters.voltages.includes(voltage)}
                                                onChange={() => handleFilterChange('voltages', voltage)}
                                                id={`voltage-${index}`}
                                            />
                                            <label htmlFor={`voltage-${index}`} className="h5">
                                                {voltage}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                <div className="line line1"></div>
                                {/* Volume Filter */}
                                <div className="filter-header" onClick={() => toggleFilter('volume')}>
                                    <div className="left">
                                        {openFilters.volume ? <FaMinus className="icon" /> : <FaPlus className="icon" />}
                                        <span className="h4 title">Həcm</span>
                                    </div>
                                    <span
                                        className="reset"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            resetFilter('volumes');
                                        }}
                                    >
                                        Sıfırlayın
                                    </span>
                                </div>
                                <div className={`filter-content ${openFilters.volume ? 'open' : ''}`}>
                                    {['1L', '5L', '10L'].map((volume, index) => (
                                        <div className="inputWrapper" key={`volume-${index}`}>
                                            <input
                                                type="checkbox"
                                                checked={filters.volumes.includes(volume)}
                                                onChange={() => handleFilterChange('volumes', volume)}
                                                id={`volume-${index}`}
                                            />
                                            <label htmlFor={`volume-${index}`} className="h5">
                                                {volume}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                <div className="line line1"></div>
                                {/* Length Filter */}
                                <div className="filter-header" onClick={() => toggleFilter('length')}>
                                    <div className="left">
                                        {openFilters.length ? <FaMinus className="icon" /> : <FaPlus className="icon" />}
                                        <span className="h4 title">Uzunluq</span>
                                    </div>
                                    <span
                                        className="reset"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            resetFilter('lengths');
                                        }}
                                    >
                                        Sıfırlayın
                                    </span>
                                </div>
                                <div className={`filter-content ${openFilters.length ? 'open' : ''}`}>
                                    {['1m', '2m', '5m'].map((length, index) => (
                                        <div className="inputWrapper" key={`length-${index}`}>
                                            <input
                                                type="checkbox"
                                                checked={filters.lengths.includes(length)}
                                                onChange={() => handleFilterChange('lengths', length)}
                                                id={`length-${index}`}
                                            />
                                            <label htmlFor={`length-${index}`} className="h5">
                                                {length}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="col-9 col-md-12 col-xs-12 col-sm-12 pd1">
                            <div
                                className="box pd2"
                                style={{
                                    fontSize: '14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <span>{sortedProducts?.length || 0} məhsul</span>
                                <SortDropdown onSelect={handleSortChange} selectedSort={sortBy} />
                            </div>
                            {isLoading ? (
                                <div className="col-12">Yüklənir...</div>
                            ) : error ? (
                                <div className="col-12">Xəta: {error?.message || 'Məlumat yüklənə bilmədi'}</div>
                            ) : (
                                <div className="row">
                                    {currentProducts.length > 0 ? (
                                        currentProducts.map((item) => (
                                            <div className="col-3 col-md-4 col-sm-6 col-xs-6" key={`product-${item.id}`}>
                                                <Card item={item} />
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-12">Heç bir məhsul yoxdur</div>
                                    )}
                                </div>
                            )}
                            {totalPages > 1 && (
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </section>
            <PageBottom />
        </>
    );
}

export default FilterPage;