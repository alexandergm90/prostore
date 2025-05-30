import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/db/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import {compareSync} from "bcrypt-ts-edge";
import type {NextAuthConfig} from "next-auth";
import { cookies } from "next/headers";
import { NextResponse} from "next/server";

export const config = {
    pages: {
        signIn: '/sign-in',
        error: '/sign-in',
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60,
    },
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            credentials: {
                email: { type: 'email' },
                password: { type: 'password' }
            },
            async authorize(credentials){
                if(credentials == null) return null;

                const user = await prisma.user.findFirst({
                    where: {
                        email: credentials.email as string
                    }
                });

                if(user && user.password){
                    const isMatch = compareSync(credentials.password as string, user.password);

                    if(isMatch){
                        return {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            role: user.role
                        }
                    }
                }
                // If user does not exist or password does not match return null
                return null
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }: any) {
            if (user) {
                token.id = user.id;
                token.role = user.role;

                if(user.name === 'NO_NAME') {
                    token.name = user.email!.split('@')[0]

                    await prisma.user.update({
                        where: {
                            id: user.id
                        },
                        data: {
                            name: token.name
                        }
                    })


                }

                if(trigger === 'signIn' || trigger === 'signUp') {
                    const cookiesObject = await cookies();
                    const sessionCartId = cookiesObject.get('sessionCartId')?.value;

                    if(sessionCartId) {
                        const sessionCart = await prisma.cart.findFirst({
                            where: {sessionCartId}
                        });

                        if(sessionCart) {
                            // Delete current user cart
                            await prisma.cart.deleteMany({
                                where: { userId: user.id },
                            });

                            // Assign new cart
                            await prisma.cart.update({
                                where: { id: sessionCart.id },
                                data: {
                                    userId: user.id
                                }
                            });
                        }
                    }
                };
            }
            return token;
        },
        async session({session, user, trigger, token}: any){
            // Set the user ID from the token
            session.user.id = token.sub;
            session.user.role = token.role;
            session.name = token.name;

            // If there is an update, set the user name
            if(trigger === 'update') session.user.name = user.name
            return session;
        },
        authorized({ request, auth }: any){
            // Array of regex patterns of paths we want to protect
            const protectedPaths = [
                /\/shipping-address/,
                /\/payment-method/,
                /\/place-order/,
                /\/profile/,
                /\/user\/(.*)/,
                /\/order\/(.*)/,
                /\/admin/,
            ]

            // Get pathname from the req URL object
            const { pathname } = request.nextUrl;

            // Check if user is not authenticated and accessing a protected path
            if(!auth && protectedPaths.some(pattern => pattern.test(pathname))){
                return false;
            }

            // Check for session cart cookie
            if(!request.cookies.get('sessionCartId')){
                // Generate new session cart id cookie
                const sessionCartId = crypto.randomUUID();

                // Clone the req headers
                const newRequestHeaders = new Headers(request.headers);

                // Create new response and add the new headers
                const response = NextResponse.next({
                    request: {
                        headers: newRequestHeaders,
                    }
                });

                // Set newly generated sessionCartId in the response cookies
                response.cookies.set('sessionCartId', sessionCartId);

                return response;
            } else {
                return true;
            }
        }
    }
} satisfies NextAuthConfig;
export const { handlers, signIn, signOut, auth } = NextAuth(config)