import React from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import LogoSettings from "@/components/settings/LogoSettings";

export default function LogoSettingsPage() {
  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 transition-colors">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Logo Settings</h1>
          <p className="text-muted-foreground">Customize your application logo</p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <LogoSettings />
        </div>
      </main>
    </div>
  );
} 