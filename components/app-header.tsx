"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Leaf, Menu, X } from "lucide-react";

export function AppHeader() {
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { href: "/home", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/features", label: "Features" },
    { href: "/use-cases", label: "Use Cases" },
    { href: "/pricing", label: "Pricing" },
    { href: "/admin", label: "Admin" },
  ];

  return (
    <header className="w-full bg-gradient-to-b from-fresh-green/80 via-white to-transparent shadow-sm border-b border-green-100">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 gap-4">
        <Link href="/" className="flex items-center gap-3" aria-label="FreshSense Home">
          <Leaf className="h-6 w-6 text-fresh-green-600" strokeWidth={2} />
          <span className="text-2xl font-extrabold tracking-tight text-fresh-green">FreshSense</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <NavigationMenu>
            <NavigationMenuList>
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink 
                    href={item.href} 
                    className="text-base px-4 py-2 rounded-md font-medium text-green-900 hover:bg-fresh-green/10 transition"
                  >
                    {item.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="md:hidden p-2 h-auto"
              aria-label="Open navigation menu"
            >
              <Menu className="h-6 w-6 text-fresh-green-600" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] sm:w-[350px]">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between pb-4 border-b">
                <div className="flex items-center gap-3">
                  <Leaf className="h-6 w-6 text-fresh-green-600" strokeWidth={2} />
                  <span className="text-xl font-extrabold tracking-tight text-fresh-green">FreshSense</span>
                </div>
              </div>
              
              <nav className="flex-1 pt-6">
                <div className="space-y-2">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-3 text-lg font-medium text-green-900 hover:bg-fresh-green/10 rounded-md transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
