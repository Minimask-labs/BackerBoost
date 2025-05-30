import Link from "next/link";
import { Button } from "../ui/button";
import { BackerBoostLogo } from "../backerboost-logo";

const Header = () => {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <BackerBoostLogo className="h-10 w-10" />
          <span className="text-xl font-bold">BackerBoost</span>
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link
            href="/"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Home
          </Link>
          <Link
            href="/discover"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Discover
          </Link>
          <Link
            href="/how-it-works"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            How It Works
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/sign-in">
            <Button>Start a Campaign</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
