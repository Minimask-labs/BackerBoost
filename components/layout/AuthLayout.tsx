import { LayoutProps } from "@/types";
import Image from "next/image";
import Link from "next/link";

const AuthLayout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen">
      <div className="flex flex-1 flex-col items-start px-4 py-10 md:px-12 md:py-[50px] gap-16 w-full">
        <Link className="flex items-center gap-2"href="/">
          <Image
            src="/logo/backerboost.png"
            alt="Backerboost-Logo"
            width={36}
            height={36}
          />
          <h1 className="font-mono sm:text-3xl text-2xl font-bold text-green-600">
            Backerboost
          </h1>
        </Link>
        {children}
      </div>

      {/* MAKE THIS A CAROUSEL */}
      <section className="flex w-1/2 flex-col justify-center items-center max-md:hidden flex-wrap self-stretch bg-green-900 text-white px-4 py-6 space-y-6">
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
