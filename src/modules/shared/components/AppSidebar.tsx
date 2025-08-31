import { NavLink } from "react-router-dom"
import { cn } from "@/modules/shared/lib/utils"
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  UserCheck, 
  MapPin, 
  Settings, 
  Bell,
  User,
  LogOut
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/modules/shared/components/ui/avatar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/modules/shared/components/ui/dropdown-menu"
import { Button } from "@/modules/shared/components/ui/button"

// Navigation items grouped by category
const navigationItems = [
  {
    category: "Main",
    items: [
      { name: "Dashboard", href: "/", icon: LayoutDashboard },
    ]
  },
  {
    category: "ATP",
    items: [
      { name: "Dashboard", href: "/atp-dashboard", icon: LayoutDashboard },
      { name: "Area Coordinators", href: "/area-coordinators", icon: Users },
    ]
  },
  {
    category: "Property",
    items: [
      { name: "Property Management", href: "/properties", icon: Building2 },
      { name: "Services & Experiences", href: "/services", icon: MapPin },
    ]
  },
  {
    category: "User Management",
    items: [
      { name: "Hosts Management", href: "/hosts", icon: Users },
      { name: "CRM / Guest", href: "/crm-guest", icon: UserCheck },
    ]
  }
]

export function AppSidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen bg-white shadow-lg flex flex-col w-64 z-50">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 border-b">
        <h1 className="text-xl font-bold text-blue-600">
          Heaven Connect
        </h1>
      </div>

      {/* Navigation */}
      <nav className="p-4 flex-1 overflow-y-auto">
        {navigationItems.map((group, index) => (
          <div key={index} className="mb-6">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              {group.category}
            </h2>
            <ul className="space-y-1">
              {group.items.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) => cn(
                      "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                      isActive ? 
                        "bg-blue-50 text-blue-600 font-medium" : 
                        "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Settings */}
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            System
          </h2>
          <ul className="space-y-1">
            <li>
              <NavLink
                to="/settings"
                className={({ isActive }) => cn(
                  "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                  isActive ? 
                    "bg-blue-50 text-blue-600 font-medium" : 
                    "text-gray-700 hover:bg-gray-100"
                )}
              >
                <Settings className="w-5 h-5 mr-3" />
                Settings
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
      
      {/* User profile and notifications section at bottom */}
      <div className="border-t p-4 space-y-3">
        {/* Notifications */}
        <Button variant="ghost" size="sm" className="w-full justify-start text-gray-600 relative">
          <Bell className="h-5 w-5 mr-3" />
          <span>Notifications</span>
          <span className="absolute top-2 left-5 h-2 w-2 rounded-full bg-red-500" />
        </Button>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full justify-start text-left">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt="User" />
                  <AvatarFallback>AU</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start text-sm">
                  <span className="font-medium">Admin User</span>
                  <span className="text-xs text-gray-500">Administrator</span>
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}