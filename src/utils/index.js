export function navigateToHomePage() {
    window.location.href = '/';
}

export function navigateToCategoryPage(categoryId) {
    window.location.href = `/${categoryId}`;
}

export function navigateToSubCategoryPage(categoryId, subCategoryId) {
    window.location.href = `/${categoryId}/${subCategoryId}`;
}

export function navigateToDiscountsPage() {
    window.location.href = `/discounts`;
}

export function navigateToAboutPage() {
    window.location.href = `/about`;
}

export function navigateToWishlistPage() {
    window.location.href = `/wishlist`;
}