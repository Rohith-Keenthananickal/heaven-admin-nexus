import { NavLink, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
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
  LogOut,
  ChevronDown,
  ChevronRight
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

// Navigation items with main categories as expandable items
const navigationItems = [
  { 
    name: "Dashboard", 
    href: "/", 
    icon: LayoutDashboard 
  },
  { 
    name: "ATP", 
    icon: Users,
    submenu: [
      { name: "Dashboard", href: "/atp-dashboard" },
      { name: "Area Coordinators", href: "/area-coordinators" }
    ]
  },
  { 
    name: "Property", 
    icon: Building2,
    submenu: [
      { name: "Property Management", href: "/properties" },
      { name: "Services & Experiences", href: "/services" }
    ]
  },
  { 
    name: "User Management", 
    icon: UserCheck,
    submenu: [
      { name: "Hosts Management", href: "/hosts" },
      { name: "CRM / Guest", href: "/crm-guest" }
    ]
  },
  { 
    name: "Settings", 
    href: "/settings", 
    icon: Settings 
  }
]

export function AppSidebar() {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const navigate = useNavigate()

  // Load expanded state from localStorage on component mount
  useEffect(() => {
    const savedExpanded = localStorage.getItem('sidebar-expanded-items')
    if (savedExpanded) {
      try {
        const parsed = JSON.parse(savedExpanded)
        setExpandedItems(new Set(parsed))
      } catch (error) {
        console.error('Error parsing saved expanded items:', error)
      }
    }
  }, [])

  // Save expanded state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sidebar-expanded-items', JSON.stringify(Array.from(expandedItems)))
  }, [expandedItems])

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(itemName)) {
        newSet.delete(itemName)
      } else {
        newSet.add(itemName)
      }
      return newSet
    })
  }

  const handleLogout = () => {
    // Clear all localStorage data
    localStorage.clear()
    
    // Redirect to signin page
    navigate('/signin')
  }

  return (
    <aside className="fixed left-0 top-0 h-screen bg-white shadow-lg flex flex-col w-64 z-50 border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        <h1 className="text-xl font-bold text-blue-600">
          Heaven Connect
        </h1>
      </div>

      {/* Navigation */}
      <nav className="p-4 flex-1 overflow-y-auto">
        <ul className="space-y-1">
          {navigationItems.map((item) => (
            <li key={item.name}>
              {item.submenu ? (
                <>
                  <button
                    onClick={() => toggleExpanded(item.name)}
                    className={cn(
                      "flex items-center justify-between w-full px-3 py-2 text-sm rounded-md transition-colors text-left",
                      "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <div className="flex items-center">
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </div>
                    {expandedItems.has(item.name) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  {expandedItems.has(item.name) && (
                    <ul className="ml-6 mt-1 space-y-1" onClick={(e) => e.stopPropagation()}>
                      {item.submenu.map((subItem) => (
                        <li key={subItem.name}>
                          <NavLink
                            to={subItem.href}
                            onClick={(e) => e.stopPropagation()}
                            className={({ isActive }) => cn(
                              "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                              isActive ? 
                                "bg-blue-50 text-blue-600 font-medium" : 
                                "text-gray-600 hover:bg-gray-50"
                            )}
                          >
                            <span className="w-2 h-2 rounded-full bg-gray-400 mr-3" />
                            {subItem.name}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
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
              )}
            </li>
          ))}
        </ul>
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
            <DropdownMenuItem 
              className="text-red-600 cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}