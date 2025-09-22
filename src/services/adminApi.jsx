import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const rawBaseQuery = fetchBaseQuery({
    baseUrl: 'https://globalpro-001-site1.jtempurl.com/api',
    prepareHeaders: (headers) => {
        try {
            const token = localStorage.getItem('token');
            if (token) headers.set('Authorization', `Bearer ${token}`);
        } catch (_) {}
        return headers;
    },
});

// 401 olduqda redirect edən wrapper
const baseQueryWith401Redirect = async (args, api, extraOptions) => {
    const result = await rawBaseQuery(args, api, extraOptions);

    const goHome = () => {
        try { localStorage.removeItem('token'); } catch (_) {}
        if (typeof window !== 'undefined' && window.location.pathname !== '/') {
            window.location.assign('/');
        }
    };

    // HTTP səviyyəsində 401 (fetchBaseQuery error qaytarır)
    if (result?.error && result.error.status === 401) {
        goHome();
    }

    // Backend cavabı içində statusCode === 401 (məs: { statusCode: 401, ... })
    if (result?.data && typeof result.data === 'object') {
        const statusCode =
            result.data.statusCode ?? result.data.status ?? result.data.code;
        if (statusCode === 401) {
            goHome();
        }
    }

    return result;
};

export const adminApi = createApi({
    reducerPath: 'adminApi',
    baseQuery: baseQueryWith401Redirect,
    endpoints: (builder) => ({
        getUsers: builder.query({
            query: () => ({ url: `/Users` }),
        }),
        getProducts: builder.query({
            query: () => ({ url: `/Products` }),
        }),
        getProductById: builder.query({
            query: (id) => ({ url: `/Products/${id}` }),
        }),
        postAdminsLogin: builder.mutation({
            query: (data) => ({
                url: `/Admins/login`,
                method: 'POST',
                body: data,
                headers: { 'Content-Type': 'application/json' },
            }),
        }),
        putProducts: builder.mutation({
            query: (data) => ({
                url: `/Products`,
                method: 'PUT',
                body: data,
            }),
        }),
        postProducts: builder.mutation({
            query: (data) => ({
                url: `/Products`,
                method: 'POST',
                body: data,
            }),
        }),
        getCategories: builder.query({
            query: () => ({ url: `/Categories` }),
        }),
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `/Products?id=${id}`,
                method: 'DELETE',
            }),
        }),
        deleteCategory: builder.mutation({
            query: (id) => ({
                url: `/Categories?id=${id}`,
                method: 'DELETE',
            }),
        }),
        putCategories: builder.mutation({
            query: (data) => ({
                url: `/Categories`,
                method: 'PUT',
                body: data,
            }),
        }),
        postCategories: builder.mutation({
            query: (data) => ({
                url: `/Categories`,
                method: 'POST',
                body: data,
            }),
        }),
        getCategoryById: builder.query({
            query: (id) => ({ url: `/Categories/${id}` }),
        }),
        postProductsChangePopular: builder.mutation({
            query: (id) => ({
                url: `/Products/change-popular/${id}`,
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
            }),
        }),
        postProductsChangeGreatOffer: builder.mutation({
            query: (id) => ({
                url: `/Products/change-great-offer/${id}`,
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
            }),
        }),
        postProductsChangeNew: builder.mutation({
            query: (id) => ({
                url: `/Products/change-new/${id}`,
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
            }),
        }),
        getOrdersFilteredOrders: builder.query({
            query: () => ({ url: `/Orders/filtered-orders?filter=${3}` }),
        }),
    }),
});

export const {
    useGetUsersQuery,
    useGetProductsQuery,
    usePostAdminsLoginMutation,
    usePutProductsMutation,
    useGetProductByIdQuery,
    usePostProductsMutation,
    useGetCategoriesQuery,
    useDeleteProductMutation,
    useDeleteCategoryMutation,
    usePutCategoriesMutation,
    usePostCategoriesMutation,
    useGetCategoryByIdQuery,
    usePostProductsChangePopularMutation,
    usePostProductsChangeGreatOfferMutation,
    usePostProductsChangeNewMutation,
    useGetOrdersFilteredOrdersQuery,
} = adminApi;
