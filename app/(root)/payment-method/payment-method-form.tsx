'use client';
import {useRouter} from "next/navigation";
import {toast} from "sonner";
import {useTransition} from "react";
import {paymentMethodSchema} from "@/lib/validator";
import CheckoutSteps from "@/components/shared/checkout";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {DEFAULT_PAYMENT_METHOD} from "@/lib/constants";

const PaymentMethodForm = ({preferredPaymentMethod}: { preferredPaymentMethod: string | null }) => {

    const router = useRouter();

    const form = useForm<z.infer<typeof paymentMethodSchema>>({
        resolver: zodResolver(paymentMethodSchema),
        defaultValues: {
            type: preferredPaymentMethod || DEFAULT_PAYMENT_METHOD
        }
    })

    const [isPending, startTransition] = useTransition();


    return <div>
        <CheckoutSteps current={2}/>
    </div>
}

export default PaymentMethodForm;