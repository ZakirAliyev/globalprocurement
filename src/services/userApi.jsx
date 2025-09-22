import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://globalpro-001-site1.jtempurl.com/api',
        prepareHeaders: (headers) => {
            const auth = localStorage.getItem('auth');
            const token = auth ? JSON.parse(auth).token : null;
            if (token) headers.set('Authorization', `Bearer ${token}`);
            return headers;
        },
    }),
    endpoints: (builder) => ({
        /* PRODUCTS */
        getProducts: builder.query({
            query: () => ({
                url: `/Products`
            })
        }),
        getProductsGreatOffer: builder.query({
            query: () => ({
                url: `/Products/great-offer`
            })
        }),
        getProductsPopular: builder.query({
            query: () => ({
                url: `/Products/popular`
            })
        }),
        getProductsInDiscount: builder.query({
            query: () => ({
                url: `/Products/in-discount`
            })
        }),
        getProductsInNew: builder.query({
            query: () => ({
                url: `/Products/in-new`
            })
        }),
        getProductById: builder.query({
            query: (id) => ({
                url: `/Products/${id}`
            })
        }),
        postProductsFilter: builder.mutation({
            query: (filterBody) => ({
                url: `/Products/filter`,
                method: 'POST',
                body: filterBody,
                headers: {'Content-Type': 'application/json'}
            })
        }),

        /* CATEGORIES */
        getCategories: builder.query({
            query: () => ({
                url: `/Categories`
            })
        }),

        /* WISHLIST */
        postWishlistManage: builder.mutation({
            query: data => ({
                url: `/Wishlist/manage`,
                method: 'POST',
                body: data,
                headers: {
                    'Content-Type': 'application/json'
                }
            }),
        }),
        getWishlist: builder.query({
            query: () => ({
                url: `/Wishlist`
            })
        }),

        /* USERS */
        postUserLogin: builder.mutation({
            query: data => ({
                url: `/Users/login`,
                method: 'POST',
                body: data,
                headers: {
                    'Content-Type': 'application/json'
                }
            }),
        }),
        postUserRegister: builder.mutation({
            query: data => ({
                url: `/Users/register`,
                method: 'POST',
                body: data,
                headers: {
                    'Content-Type': 'application/json'
                }
            }),
        }),
        getUsersMyProfile: builder.query({
            query: () => ({
                url: `/Users/my-profile`,
            })
        }),
        putUsersEditMyProfile: builder.mutation({
            query: data => ({
                url: `/Users/edit-my-profile`,
                method: 'PUT',
                body: data,
                headers: {
                    'Content-Type': 'application/json'
                }
            }),
        }),

        /* BASKET */
        postBasketCheckout: builder.mutation({
            query: data => ({
                url: `/Baskets/checkout`,
                method: 'POST',
                body: data,
                headers: {
                    'Content-Type': 'application/json'
                }
            }),
        }),
        basketsAddMultiple: builder.mutation({
            query: data => ({
                url: `/Baskets/add-multiple`,
                method: 'POST',
                body: data,
                headers: {
                    'Content-Type': 'application/json'
                }
            }),
        }),
    }),
})

export const {
    /* PRODUCTS */
    useGetProductsQuery,
    useGetProductsGreatOfferQuery,
    useGetProductsPopularQuery,
    useGetProductsInDiscountQuery,
    useGetProductsInNewQuery,
    useGetProductByIdQuery,
    usePostProductsFilterMutation,

    /* CATEGORIES */
    useGetCategoriesQuery,

    /* WISHLIST */
    usePostWishlistManageMutation,
    useGetWishlistQuery,

    /* USERS */
    usePostUserLoginMutation,
    usePostUserRegisterMutation,
    useGetUsersMyProfileQuery,
    usePutUsersEditMyProfileMutation,

    /* BASKET */
    usePostBasketCheckoutMutation,
    useBasketsAddMultipleMutation
} = userApi