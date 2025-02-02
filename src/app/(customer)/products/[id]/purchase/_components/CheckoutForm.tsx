"use client";

import { userOrderExists } from "@/app/actions/orders";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Elements,
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Image from "next/image";

import { FormEvent, useState } from "react";

const stripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string);

type CheckoutFormProps = {
  product: {
    id: string;
    imagePath: string;
    name: string;
    priceInCents: number;
    description: string;
  };
  clientSecret: string;
};

export function CheckoutForm({ product, clientSecret }: CheckoutFormProps) {
  return (
    <>
      <div className="max-w-5xl w-full mx-auto space-y-8  p-8 rounded-lg">
        <div className="flex gap-4 items-center ">
          <div className="aspect-video flex-shrink-0 w-1/3 relative">
            <Image
              src={product.imagePath}
              fill
              alt={product.name}
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-lg">${product.priceInCents / 100}</p>
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <p className="text-lg">{product.description}</p>
          </div>
        </div>
        <Elements options={{ clientSecret }} stripe={stripe}>
          <Form priceInCents={product.priceInCents} productId={product.id} />
        </Elements>
      </div>
    </>
  );
}

function Form({
  priceInCents,
  productId,
}: {
  priceInCents: number;
  productId: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState<string>();
  const [email, setEmail] = useState<string>();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (stripe == null || elements == null || email == null) return;
    setIsLoading(true);

    const orderExist = await userOrderExists(email, productId);

    if (orderExist) {
      setErrorMessage("Already purchased this");
      setIsLoading(false);
      return;
    }

    stripe
      .confirmPayment({
        elements,
        confirmParams: {
          return_url: `${
            process.env.NEXT_PUBLIC_SERVER_URL as string
          }/stripe/purchase-success`,
        },
      })
      .then(({ error }) => {
        if (error.type === "card_error" || error.type === "validation_error") {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("An unknown error");
        }
      })
      .finally(() => setIsLoading(false));
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          {ErrorMessage && (
            <CardDescription className="text-destructive">
              {ErrorMessage}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <PaymentElement />
          <div className="mt-4">
            <LinkAuthenticationElement
              onChange={(e) => setEmail(e.value.email)}
            />
          </div>
          <CardFooter className="pt-8">
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={stripe == null || elements == null || isLoading}
            >
              {isLoading ? "Processing..." : `Pay $ ${priceInCents / 100}`}
            </Button>
          </CardFooter>
        </CardContent>
      </Card>
    </form>
  );
}
