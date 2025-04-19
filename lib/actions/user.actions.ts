'use server';

import {
    signInFormSchema,
    signUpFormSchema,
} from '@/lib/validator';
import { signIn, signOut } from '@/auth';
import {isRedirectError } from 'next/dist/client/components/redirect-error';
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from '@/db/prisma';
import { formatError } from '../utils';

// Sign in the user with credentials
export async function signInWithCredentials(
    prevState: unknown,
    formData: FormData
) {
    try {
        const user = signInFormSchema.parse({
            email: formData.get('email'),
            password: formData.get('password'),
        });

        const callbackUrl = formData.get('callbackUrl') || '/';

        await signIn('credentials', {
            ...user,
            redirect: false,
            callbackUrl
        });

        return { success: true, message: 'Signed in successfully', redirectUrl: callbackUrl };
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        }
        return { success: false, message: 'Invalid email or password' };
    }
}

// Sign user out
export async function signOutUser() {
    await signOut();
}

// Sign up user
export async function signUpUser(prevState: unknown, formData: FormData){
    try {
        const user = signUpFormSchema.parse({
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword'),
        });

        const callbackUrl = formData.get('callbackUrl') || '/';

        const plainPassword = user.password;

        user.password = hashSync(user.password, 10);

        await prisma.user.create({
            data: {
                name: user.name,
                email: user.email,
                password: user.password
            }
        });

        await signIn('credentials', {
            email: user.email,
            password: plainPassword,
            callbackUrl
        })

        return { success: true, message: 'Signed up successfully', redirectUrl: callbackUrl };
    } catch(error) {
        if (isRedirectError(error)) {
            throw error;
        }
        return { success: false, message: formatError(error) };
    }
}

// Get user by ID
export async function getUserById(id: string) {
    const user = await prisma.user.findFirst({
        where: { id }
    });

    if(!user) throw new Error('User not found');
    return user;
}

