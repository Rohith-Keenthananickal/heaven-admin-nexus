import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/modules/shared/components/ui/button"
import { Input } from "@/modules/shared/components/ui/input"
import { Label } from "@/modules/shared/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/modules/shared/components/ui/card"
import { Checkbox } from "@/modules/shared/components/ui/checkbox"
import { Eye, EyeOff, Shield, Users, BarChart3, Settings, Mail, Lock } from "lucide-react"
import { authService } from "../services/authService"
import { LoginPayload } from "../models/auth.models"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

export default function SignIn() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload: LoginPayload = {
      email: formData.email,
      password: formData.password,
      auth_provider: "EMAIL",
    }
    handleLogin(payload)
    console.log("Sign in attempted:", formData)
  }

  const handleLogin = async (formData: LoginPayload) => {
    try {
      const response = await authService.login(formData)
      console.log("Login response:", response)
      if (response.data) {
        toast.success("Login successful")
        localStorage.setItem("heaven_connect_user", JSON.stringify(response?.data?.user))
        localStorage.setItem("heaven_connect_token", JSON.stringify(response?.data?.access_token))    
        navigate("/")
      } else {
        toast.error("Login failed")
      }
    } catch (error) {
      console.error("Login error:", error)
      toast.error("An error occurred during login")
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Panel - Sign In Form (50%) */}
      <div className="flex-1 flex justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center">
            <div className="flex items-center justify-center">
              <img 
                src="/favicon.png" 
                alt="Heaven Connect" 
                className="mr-3"
                width={'300px'}
              />
              {/* <span className="text-2xl font-bold text-black">Heaven Connect</span> */}
            </div>
            <h1 className="text-3xl font-bold text-black mb-2">Admin Sign In</h1>
            <p className="text-gray-600 mb-5">Welcome back! Please enter your credentials.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                  className="pl-10 h-12 rounded-lg border-gray-300 focus:border-primary focus:ring-primary"
                  required
                />
              </div>
            </div>
            
            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({...prev, password: e.target.value}))}
                  className="pl-10 pr-10 h-12 rounded-lg border-gray-300 focus:border-primary focus:ring-primary"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>
            
            {/* Remember me and Forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember"
                  checked={formData.remember}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({...prev, remember: checked as boolean}))
                  }
                  className="rounded border-gray-300"
                />
                <Label htmlFor="remember" className="text-sm text-gray-700">Remember me</Label>
              </div>
              <Link 
                to="/forgot-password" 
                className="text-sm text-primary hover:underline font-medium"
              >
                Forgot your password?
              </Link>
            </div>
            
            {/* Sign In Button */}
            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Sign In
            </Button>
          </form>
          
          {/* Sign Up Link */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary hover:underline font-medium">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Sunset Image (50%) */}
      <div className="flex-1 relative hidden lg:flex">
        {/* Sunset Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/sunset.jpg')`
          }}
        ></div>
        
        {/* Optional overlay for better text readability if needed */}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
    </div>
  )
}