import { Link } from "react-router-dom"
import { Button } from "@/modules/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/modules/shared/components/ui/card"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/20">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-lg text-center">
          <CardHeader className="pb-8">
            <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">404</span>
            </div>
            <CardTitle className="text-2xl font-bold">Page Not Found</CardTitle>
            <p className="text-muted-foreground">The page you're looking for doesn't exist.</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Button asChild className="w-full">
                <Link to="/">
                  <Home className="h-4 w-4 mr-2" />
                  Go to Dashboard
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="w-full">
                <Link to="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Back
                </Link>
              </Button>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Need help? {" "}
                <Link to="/support" className="text-primary hover:underline">
                  Contact Support
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
