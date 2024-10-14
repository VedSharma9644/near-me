// src/app/super-admin/login/page.tsx
"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button'; // Adjust the path if needed
import { Input } from '@/components/ui/input'; // Adjust the path if needed
import { useAuth } from "@/context/authContext"; // Adjust the path if needed




export default function SuperAdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const { login, state } = useAuth(); // Access the login function and auth state

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
    
      // Simulate user login and user data
      const userData = { email }; // Replace with actual user data
    
      // Call the login function with user data
      login(userData);
      router.push("/super-admin/dashboard"); // Redirect after login
    };

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-xl font-bold">Super Admin Login</h1>
            {state.error && <p className="text-red-500">{state.error}</p>} {/* Show error message */}
            <form onSubmit={handleSubmit} className="w-full max-w-sm">
                <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} // Correct usage
                    required
                />
                <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} // Correct usage
                    required
                />
                <Button type="submit" className="mt-4">
                    Login
                </Button>
            </form>
        </div>
    );
}
