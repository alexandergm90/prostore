'use server';

import { CartItem } from "@/types";
import {convertToPlainObject, formatError, round2} from "@/lib/utils";
import {cookies} from "next/headers";
import {auth} from "@/auth";
import {prisma} from "@/db/prisma";
import {cartItemSchema, insertCartSchema} from "@/lib/validator";
import {revalidatePath} from "next/cache";

// Calculate cart prices
const calcPrice = (items: CartItem[]) => {
   const itemsPrice = round2(
       items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
   );
   const shippingPrice = round2(itemsPrice > 100 ? 0 : 10);
   const taxPrice = round2(itemsPrice * 0.15);
   const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

   return {
       itemsPrice: itemsPrice.toFixed(2),
       shippingPrice: shippingPrice.toFixed(2),
       taxPrice: taxPrice.toFixed(2),
       totalPrice: totalPrice.toFixed(2),
   }
}

export async function addItemToCart(data: CartItem) {
    try {
        // Check for cart cookie
        const sessionCartId = (await cookies()).get('sessionCartId')?.value;
        if(!sessionCartId) throw new Error('No cart found');

        // Get session and user ID
        const session = await auth();
        const userId = session?.user?.id ? (session.user.id as string) : undefined;

        // Get cart
        const cart = await getMyCart();

        // Parse and validate item
        const item = cartItemSchema.parse(data);

        // Find product in db
        const product = await prisma.product.findFirst({
            where: { id: item.productId }
        })

        if(!product) throw new Error('Product not found');

        if(!cart) {
            const newCart = insertCartSchema.parse({
                userId: userId,
                items: [item],
                sessionCartId: sessionCartId,
                ...calcPrice([item]),
            })

            // Add to db
            await prisma.cart.create({
                data: newCart
            })

            // Revalidate product page
            revalidatePath(
                `/product/${product.slug}`)

            return {
                success: true,
                message: 'Item added to cart'
            }
        } else {

        }

        return {
            success: true,
            message: 'Item added to cart'
        }
    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        }
    }

}

export async function getMyCart() {
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if(!sessionCartId) throw new Error('No cart found');

    // Get session and user ID
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    // Get user cart from db
    const cart = await prisma.cart.findFirst({
        where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
    });

    if(!cart) return undefined;

    // Convert decimals and return
    return convertToPlainObject({
        ...cart,
        items: cart.items as CartItem[],
        itemsPrice: cart.itemsPrice.toString(),
        totalPrice: cart.totalPrice.toString(),
        shippingPrice: cart.shippingPrice.toString(),
        taxPrice: cart.taxPrice.toString(),
    });
}