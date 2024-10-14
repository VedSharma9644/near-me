// src/app/salon-admin/dashboard/page.tsx



import Link from 'next/link';

export default function SalonAdminDashboard() {
    return (
      <div>
        <h1>Salon Admin Dashboard</h1>
        {/* Add components or functionality here */}
        <li><Link href="/salon-admin/registeration">Salon Admin Registeration</Link></li>
      </div>
    );
  }
  