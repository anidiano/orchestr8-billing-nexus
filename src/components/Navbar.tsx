
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 w-full">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-6 md:gap-10">
          <Link to="/" className="flex items-center space-x-2">
            <svg 
              viewBox="0 0 24 24" 
              className="h-6 w-6 text-orchestr8-500 fill-current"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
            <span className="font-bold text-xl hidden md:inline-block">Orchestr8</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link to="/dashboard" className="font-medium transition-colors hover:text-orchestr8-500">
              Dashboard
            </Link>
            <Link to="/usage" className="font-medium transition-colors hover:text-orchestr8-500">
              Usage
            </Link>
            <Link to="/billing" className="font-medium transition-colors hover:text-orchestr8-500">
              Billing
            </Link>
            <Link to="/settings" className="font-medium transition-colors hover:text-orchestr8-500">
              Settings
            </Link>
            <Link to="/docs" className="font-medium transition-colors hover:text-orchestr8-500">
              Docs
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <div className="rounded-full bg-orchestr8-600 text-white h-8 w-8 flex items-center justify-center">
                  AB
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                API Keys
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
