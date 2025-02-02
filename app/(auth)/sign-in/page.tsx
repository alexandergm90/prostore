import {Metadata} from "next";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import {APP_NAME} from "@/lib/constants";

export const metadata: Metadata = {
  title: 'Sign In'
};

const SignInPage = () => {
  return <div className="w-full max-w-md mx-auto">
    <Card>
      <CardHeader className="space-y-4">
        <Link href="/" className="flex-center">
          <Image src='/images/logo.svg' width={120} height={32} alt={`${APP_NAME} logo`} priority={true} />
        </Link>
        <CardTitle className="text-center">Sign In</CardTitle>
        <CardDescription className="text-center">
          Sign in to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">

      </CardContent>
      </Card>
  </div>;
};

export default SignInPage;