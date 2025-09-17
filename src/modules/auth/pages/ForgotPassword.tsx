import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/modules/shared/components/ui/button"
import { Input } from "@/modules/shared/components/ui/input"
import { Card, CardContent } from "@/modules/shared/components/ui/card"
import { Mail, RotateCcw, ArrowLeft } from "lucide-react"
import { toast } from "sonner"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast.error("Please enter your email address")
      return
    }

    setIsLoading(true)
    try {
      // TODO: Implement actual password reset API call
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      toast.success("Password reset link sent to your email")
      setEmail("")
    } catch (error) {
      console.error("Password reset error:", error)
      toast.error("Failed to send reset link. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md border-0 shadow-xl">
        <CardContent className="p-8">
          {/* Branding Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <img 
                src="/favicon.png" 
                alt="Heaven Connect" 
                className="w-24 mr-3"
              />
              <div className="text-left">
                <h1 className="text-xl font-bold text-gray-800">Heaven Connect</h1>
                <p className="text-sm text-gray-500">Admin Panel</p>
              </div>
            </div>
          </div>

          {/* Password Reset Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                <RotateCcw className="w-10 h-10 text-primary" />
              </div>
            </div>
          </div>

          {/* Title and Instructions */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Reset Your Password</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Enter your email address and we will send you a link to reset your password.
            </p>
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 rounded-lg border-gray-300 focus:border-primary focus:ring-primary"
                  required
                />
              </div>
            </div>

            {/* Send Reset Link Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>

          {/* Back to Sign In Link */}
          <div className="text-center mt-6">
            <Link 
              to="/signin" 
              className="inline-flex items-center text-primary hover:text-primary/80 font-medium text-sm transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Sign In
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-center mt-8 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              © 2024 Heaven Connect. All rights reserved.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
