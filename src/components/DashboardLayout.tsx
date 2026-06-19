import React from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar: স্থায়ী এবং প্রফেশনাল */}
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0">
        <div className="p-6 text-2xl font-bold border-b border-slate-800">StoreMaster</div>
        <nav className="p-4 space-y-2">
          <a href="#" className="block p-3 rounded bg-blue-600">Home</a>
          <a href="#" className="block p-3 hover:bg-slate-800">Products</a>
          <a href="#" className="block p-3 hover:bg-slate-800">Analytics</a>
          <a href="#" className="block p-3 hover:bg-slate-800">Settings</a>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Dashboard Overview</h2>
          <div className="flex gap-4">
             {/* Profile Edit Option - শুধু ওনার এর জন্য */}
             <button className="text-sm border px-3 py-1 rounded">Edit Profile</button>
          </div>
        </header>
        
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
