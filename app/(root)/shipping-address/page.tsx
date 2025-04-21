import { auth } from '@/auth';
import { getMyCart } from "@/lib/actions/cart.actions";
import { getUserById} from "@/lib/actions/user.actions";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { ShippingAddress as ShippingAddressType } from "@/types";
import ShippingAddressForm from "./shipping-address-form";
import CheckoutSteps from "@/components/shared/checkout";

export const metadata: Metadata = {
    title: 'Shipping Address',
};

const ShippingAddress = async () => {
    const cart = await getMyCart();

    if(!cart || cart.items.length === 0) redirect ('/cart');

    const session = await auth();
    const userId = session?.user?.id;

    if(!userId) redirect('/sign-in')
    const user = await getUserById(userId);

    return <div>
        <CheckoutSteps current={1} />
        <ShippingAddressForm address={user.address as ShippingAddressType} />
    </div>
}

export default ShippingAddress;