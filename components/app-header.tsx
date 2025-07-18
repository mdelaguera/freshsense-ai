"use client";
import Image from "next/image";
import Link from "next/link";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { Leaf } from "lucide-react";

export function AppHeader() {
  return (
    <header className="w-full bg-gradient-to-b from-fresh-green/80 via-white to-transparent shadow-sm border-b border-green-100">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 gap-4">
        <Link href="/" className="flex items-center gap-3" aria-label="FreshSense Home">
          <Leaf className="h-6 w-6 text-fresh-green-600" strokeWidth={2} />
          <span className="text-2xl font-extrabold tracking-tight text-fresh-green">FreshSense</span>
        </Link>
        <nav className="hidden md:block">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink href="/analyze" className="text-base px-4 py-2 rounded-md font-medium text-green-900 hover:bg-fresh-green/10 transition">Analyze</NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/dashboard" className="text-base px-4 py-2 rounded-md font-medium text-green-900 hover:bg-fresh-green/10 transition">Dashboard</NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/" className="text-base px-4 py-2 rounded-md font-medium text-green-900 hover:bg-fresh-green/10 transition">Home</NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>
      </div>
    </header>
  );
}
