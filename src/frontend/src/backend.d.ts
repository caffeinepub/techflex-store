import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Category {
    id: string;
    name: string;
    imageUrl: string;
}
export interface CartProduct {
    quantity: bigint;
    product: Product;
}
export interface UserProfile {
    name: string;
}
export interface Product {
    id: string;
    inStock: boolean;
    name: string;
    description: string;
    imageUrl: string;
    category: string;
    price: bigint;
    discountedPrice: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addToCart(productId: string, quantity: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearCart(): Promise<void>;
    createCategory(category: Category): Promise<void>;
    createProduct(product: Product): Promise<void>;
    deleteCategory(categoryId: string): Promise<void>;
    deleteProduct(productId: string): Promise<void>;
    getAllProducts(): Promise<Array<Product>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCart(): Promise<Array<CartProduct>>;
    getCategories(): Promise<Array<Category>>;
    getCategory(categoryId: string): Promise<Category>;
    getProduct(productId: string): Promise<Product>;
    getProductsByCategory(category: string): Promise<Array<Product>>;
    getProductsByPriceRange(minPrice: bigint, maxPrice: bigint): Promise<Array<Product>>;
    getProductsSortedByPrice(): Promise<Array<Product>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    removeFromCart(productId: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    seedData(): Promise<void>;
    updateCartQuantity(productId: string, quantity: bigint): Promise<void>;
    updateCategory(category: Category): Promise<void>;
    updateProduct(product: Product): Promise<void>;
}
