// src/app/page.tsx
import Link from 'next/link';
import connectDB from '@/config/db';
connectDB();


export default function HomePage() {
  return (
    <div>
      <h1>Salon Management App</h1>
      <nav>
        <ul>
        <li><Link href="/super-admin/login">Super Admin Login</Link></li>
          <li><Link href="/super-admin/dashboard">Super Admin</Link></li>
          <li><Link href="/salon-admin/dashboard">Salon Admin</Link></li>
          <li><Link href="/customer/dashboard">Customer</Link></li>
        </ul>
      </nav>
    </div>
  );
}
