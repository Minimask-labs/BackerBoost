import { LayoutProps } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Card } from "../ui/card";

const AuthLayout = ({ children }: LayoutProps) => {
  return (
    <div className="flex h-screen">
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 w-full">
        <Link className="flex items-start gap-2 mt-2" href="/">
          <Image
            src="/logo/backerboost.png"
            alt="Backerboost-Logo"
            width={30}
            height={30}
            className="mt-0.5"
          />
          <h1 className="font-mono sm:text-[30px] text-2xl font-bold text-green-600">
            Backerboost
          </h1>
        </Link>

        <Card className="w-full max-w-[500px] p-6 shadow-md max-sm:hidden mb-2">
          {children}
        </Card>

        <div className="sm:hidden max-sm:flex">
            {children}
        </div>
      </div>

      {/* MAKE THIS A CAROUSEL */}
      <section className="flex w-1/2 flex-col justify-center items-center max-md:hidden flex-wrap self-stretch bg-green-900 text-white px-4 py-6 space-y-6 h-full">
        <Image
          src="/crowdfunding-images/savings.png"
          alt="Placeholder.svg"
          width={400}
          height={400}
        />

        <h2 className="font-sans text-3xl font-bold leading-tight break-words text-center">
          Save and Get Funds.
        </h2>
        <p className="font-sans text-base text-center break-words">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Suscipit
          nisi veritatis consectetur minima! Cum, ducimus aliquam provident
          itaque officiis doloremque?
        </p>
      </section>
    </div>
  );
};

export default AuthLayout;
