import { AppSidebar } from "@/modules/shared/components/AppSidebar"

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
  action?: React.ReactNode
  showHeader?: boolean
}

export function DashboardLayout({ children, title, action, showHeader = true }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex w-full overflow-hidden">
      <AppSidebar />
      
      <div className="flex-1 flex flex-col ml-64 min-w-0">
        {/* Page Header */}
        {showHeader && (
        <header className="h-16 border-b bg-background flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-4">
            {title && <h1 className="text-2xl font-semibold text-foreground">{title}</h1>}
          </div>
          
          {action && (
            <div className="flex items-center gap-4">
              {action}
            </div>
          )}
        </header>
        )}
        {/* Main Content */}
        <main className="flex-1 p-6 bg-muted/30 overflow-y-auto overflow-x-hidden min-w-0">
          {children}
        </main>
      </div>
    </div>
  )
}