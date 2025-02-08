'use server';

import {
    signInFormSchema
} from '@/lib/validator';
import { signIn, signOut } from '@/auth';
import {isRedirectError } from 'next/dist/client/components/redirect-error';

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
        console.log(error);
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

