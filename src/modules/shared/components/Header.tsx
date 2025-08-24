import { SidebarTrigger } from "@/modules/shared/components/ui/sidebar"
import { Button } from "@/modules/shared/components/ui/button"
import { Bell, User } from "lucide-react"
import { authService } from "@/modules/auth/services/authService"

interface HeaderProps {
  title?: string
  action?: React.ReactNode
}

export function Header({ title, action }: HeaderProps) {
  const user = authService.getCurrentUser();
  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        {title && <h1 className="text-2xl font-semibold text-foreground">{title}</h1>}
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
            <User className="h-4 w-4" />
          </div>
          <div className="text-sm">
            <div className="font-medium">{user?.full_name}</div>
            <div className="text-muted-foreground">Admin</div>
          </div>
        </div>
      </div>
    </header>
  )
}
