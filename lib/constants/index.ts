export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Prostore';
export const APP_DESCRIPTION = process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'A modern ecommerce platform built on top of Next.js';
export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
export const LATEST_PRODUCTS_LIMIT = Number(process.env.LATEST_PRODUCTS_LIMIT) || 4;

export const signInDefaultValues = {
    email: '',
    password: '',
}

export const signUpDefaultValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
}

export const shippingAddressDefaultValues = {
    fullName: 'John Doe',
    streetAddress: '123 Main Street',
    city: 'Galati',
    postalCode: '12145',
    country: 'Romania',
}

export const PAYMENT_METHODS = process.env.PAYMENT_METHODS ? process.env.PAYMENT_METHODS.split(', ') : ['PayPal', 'Stripe', 'Cash on delivery'];
export const DEFAULT_PAYMENT_METHOD = process.env.DEFAULT_PAYMENT_METHOD || 'PayPal';