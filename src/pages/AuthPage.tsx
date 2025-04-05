
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthForm from "@/components/auth/AuthForm";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoCircle } from "lucide-react";

export default function AuthPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect to home if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-12 bg-gray-50">
        <div className="max-w-md w-full px-4">
          <div className="mb-4">
            <Alert>
              <InfoCircle className="h-4 w-4 mr-2" />
              <AlertDescription>
                For testing, please disable email verification in the Supabase dashboard under Authentication → Email Templates.
              </AlertDescription>
            </Alert>
          </div>
          <AuthForm />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
