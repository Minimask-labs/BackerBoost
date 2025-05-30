import { Routes } from "@/enums";
import Link from "next/link";
import { BackerBoostLogo } from "../backerboost-logo";

const FooterSection = () => {
  const footerLinks = [
    {
      route: "#",
      title: "How It Works",
    },
    {
      route: Routes.discover,
      title: "Discover",
    },
    {
      route: Routes.create_campaign,
      title: "Start a Campaign",
    },
    {
      route: "#",
      title: "How It Works",
    },
  ];

  const companyLinks = [
    {
      route: "#",
      title: "About",
    },
    {
      route: "#",
      title: "Blog",
    },
    {
      route: "#",
      title: "Careers",
    },
  ];

  const legalLinks = [
    {
      route: "#",
      title: "Privacy",
    },
    {
      route: "#",
      title: "Terms",
    },
    {
      route: "#",
      title: "Terms",
    },
  ];

  return (
    <footer className="border-t">
      <div className="container flex flex-col gap-4 py-10 md:flex-row md:gap-8 md:py-12">
        <div className="flex flex-col gap-2 md:gap-4 md:flex-1">
          <Link href="/" className="flex items-center gap-2">
            <BackerBoostLogo className="h-8 w-8" />
            <span className="text-lg font-bold">BackerBoost</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            A decentralized crowdfunding platform that enables individuals to
            create funding requests for specific goals.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:flex-1">
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Platform</h3>
            <ul className="space-y-2">
              {footerLinks.map((link, index) => (
                <li key={`${index}~${link.route}`}>
                  <Link
                    href={link.route}
                    className="text-sm text-muted-foreground hover:underline"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Company</h3>
            <ul className="space-y-2">
              {companyLinks.map((link, index) => (
                <li key={`${index}~${link.route}`}>
                  <Link
                    href={link.route}
                    className="text-sm text-muted-foreground hover:underline"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Legal</h3>
            <ul className="space-y-2">
              {legalLinks.map((link, index) => (
                <li key={`${index}~${link.route}`}>
                  <Link
                    href={link.route}
                    className="text-sm text-muted-foreground hover:underline"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="container flex flex-col gap-4 border-t py-6 md:flex-row md:items-center">
        <p className="text-xs text-muted-foreground md:flex-1">
          © {new Date().getFullYear()} BackerBoost. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default FooterSection;
