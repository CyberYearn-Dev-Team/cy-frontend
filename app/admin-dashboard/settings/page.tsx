"use client";

import React, { useState } from "react";
import {
  Save,
  Upload,
  History,
  AlertCircle,
  Check,
} from "lucide-react";

// shared layout
import AdminSidebar from "@/components/ui/admin-sidebar";
import AdminHeader from "@/components/ui/admin-header";

interface Badge {
  id: string;
  name: string;
  xpThreshold: number;
}

interface GamificationSettings {
  streakFreezeEnabled: boolean;
  streakFreezeLimit: number;
  streakRebuildEnabled: boolean;
  streakRebuildDays: number;
  dailyXpCap: number;
}

interface BrandingSettings {
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  platformName: string;
}

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  section: string;
  changes: string;
}

const PlatformSettings: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"branding" | "gamification" | "audit">("branding");
  const [saved, setSaved] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Branding State
  const [branding, setBranding] = useState<BrandingSettings>({
    logoUrl: "/logo.png",
    primaryColor: "#3b82f6",
    secondaryColor: "#8b5cf6",
    accentColor: "#10b981",
    platformName: "Learning Platform",
  });

  // Gamification State
  const [gamification, setGamification] = useState<GamificationSettings>({
    streakFreezeEnabled: true,
    streakFreezeLimit: 2,
    streakRebuildEnabled: true,
    streakRebuildDays: 7,
    dailyXpCap: 1000,
  });

  const [badges, setBadges] = useState<Badge[]>([
    { id: "1", name: "Novice", xpThreshold: 0 },
    { id: "2", name: "Learner", xpThreshold: 100 },
    { id: "3", name: "Achiever", xpThreshold: 500 },
    { id: "4", name: "Expert", xpThreshold: 1000 },
    { id: "5", name: "Master", xpThreshold: 5000 },
  ]);

  // Audit Log State
  const [auditLogs] = useState<AuditLog[]>([
    {
      id: "1",
      timestamp: "2025-10-01 14:30:22",
      user: "admin@platform.com",
      action: "Updated",
      section: "Branding",
      changes: "Changed primary color from #4f46e5 to #3b82f6",
    },
    {
      id: "2",
      timestamp: "2025-10-01 10:15:08",
      user: "admin@platform.com",
      action: "Updated",
      section: "Gamification",
      changes: "Enabled streak freeze, set limit to 2",
    },
    {
      id: "3",
      timestamp: "2025-09-30 16:45:33",
      user: "superadmin@platform.com",
      action: "Updated",
      section: "Badges",
      changes: 'Added new badge "Master" with 5000 XP threshold',
    },
  ]);

  const handleSave = () => setShowConfirm(true);

  const confirmSave = () => {
    setSaved(true);
    setShowConfirm(false);
    setTimeout(() => setSaved(false), 3000);

    console.log("Saving settings:", { branding, gamification, badges });
  };

  const updateBadge = (id: string, field: keyof Badge, value: string | number) => {
    setBadges((prev) =>
      prev.map((badge) =>
        badge.id === id ? { ...badge, [field]: value } : badge
      )
    );
  };

  return (
<div className="flex h-screen bg-gray-50">
  <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
  <div className="flex-1 flex flex-col overflow-hidden">
    <AdminHeader setSidebarOpen={setSidebarOpen} />
    <main className="flex-1 p-6 overflow-y-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Platform Settings</h1>
                <p className="text-gray-600 mt-1">
                  Configure platform-wide parameters and branding
                </p>
              </div>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Save size={20} />
                Save Changes
              </button>
            </div>
          </div>

 {/* Success Message */}
        {saved && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <Check className="text-green-600" size={20} />
            <span className="text-green-800 font-medium">Settings saved successfully!</span>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex gap-8 px-6">
              <button
                onClick={() => setActiveTab('branding')}
                className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                  activeTab === 'branding'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Branding
              </button>
              <button
                onClick={() => setActiveTab('gamification')}
                className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                  activeTab === 'gamification'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Gamification
              </button>
              <button
                onClick={() => setActiveTab('audit')}
                className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                  activeTab === 'audit'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <History size={18} />
                  Audit Log
                </div>
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Branding Tab */}
            {activeTab === 'branding' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Brand Identity</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Platform Name
                      </label>
                      <input
                        type="text"
                        value={branding.platformName}
                        onChange={(e) => setBranding({ ...branding, platformName: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Logo URL
                      </label>
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={branding.logoUrl}
                          onChange={(e) => setBranding({ ...branding, logoUrl: e.target.value })}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                          <Upload size={18} />
                          Upload
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Theme Colors</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Primary Color
                      </label>
                      <div className="flex gap-3 items-center">
                        <input
                          type="color"
                          value={branding.primaryColor}
                          onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                          className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={branding.primaryColor}
                          onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Secondary Color
                      </label>
                      <div className="flex gap-3 items-center">
                        <input
                          type="color"
                          value={branding.secondaryColor}
                          onChange={(e) => setBranding({ ...branding, secondaryColor: e.target.value })}
                          className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={branding.secondaryColor}
                          onChange={(e) => setBranding({ ...branding, secondaryColor: e.target.value })}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Accent Color
                      </label>
                      <div className="flex gap-3 items-center">
                        <input
                          type="color"
                          value={branding.accentColor}
                          onChange={(e) => setBranding({ ...branding, accentColor: e.target.value })}
                          className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={branding.accentColor}
                          onChange={(e) => setBranding({ ...branding, accentColor: e.target.value })}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">Preview</h4>
                  <div className="flex items-center gap-4 p-4 bg-white rounded-lg">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: branding.primaryColor }}
                    >
                      {branding.platformName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-lg" style={{ color: branding.primaryColor }}>
                        {branding.platformName}
                      </div>
                      <div className="text-sm" style={{ color: branding.secondaryColor }}>
                        Empowering learners everywhere
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Gamification Tab */}
            {activeTab === 'gamification' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Streak Rules</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">Streak Freeze</div>
                        <div className="text-sm text-gray-600">Allow users to freeze their streak</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={gamification.streakFreezeEnabled}
                          onChange={(e) => setGamification({ ...gamification, streakFreezeEnabled: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    {gamification.streakFreezeEnabled && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Maximum Streak Freezes per Month
                        </label>
                        <input
                          type="number"
                          value={gamification.streakFreezeLimit}
                          onChange={(e) => setGamification({ ...gamification, streakFreezeLimit: parseInt(e.target.value) })}
                          min="0"
                          max="10"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">Streak Rebuild</div>
                        <div className="text-sm text-gray-600">Allow users to rebuild lost streaks</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={gamification.streakRebuildEnabled}
                          onChange={(e) => setGamification({ ...gamification, streakRebuildEnabled: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    {gamification.streakRebuildEnabled && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rebuild Window (days after streak is lost)
                        </label>
                        <input
                          type="number"
                          value={gamification.streakRebuildDays}
                          onChange={(e) => setGamification({ ...gamification, streakRebuildDays: parseInt(e.target.value) })}
                          min="1"
                          max="30"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">XP Settings</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Daily XP Cap
                    </label>
                    <input
                      type="number"
                      value={gamification.dailyXpCap}
                      onChange={(e) => setGamification({ ...gamification, dailyXpCap: parseInt(e.target.value) })}
                      min="100"
                      step="100"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-sm text-gray-600 mt-1">Maximum XP a user can earn per day</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Badge Thresholds</h3>
                  
                  <div className="space-y-3">
                    {badges.map((badge) => (
                      <div key={badge.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={badge.name}
                            onChange={(e) => updateBadge(badge.id, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Badge name"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={badge.xpThreshold}
                            onChange={(e) => updateBadge(badge.id, 'xpThreshold', parseInt(e.target.value))}
                            min="0"
                            step="100"
                            className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <span className="text-gray-600 text-sm">XP</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Audit Log Tab */}
            {activeTab === 'audit' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Changes</h3>
                
                <div className="space-y-3">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <History size={18} className="text-gray-500" />
                          <span className="font-medium text-gray-900">{log.section}</span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            {log.action}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">{log.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{log.changes}</p>
                      <p className="text-xs text-gray-500">By: {log.user}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">Audit Log Retention</p>
                    <p>Changes are logged and retained for 90 days for compliance and security purposes.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Confirm Changes</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to save these platform-wide settings? Changes will affect all users immediately.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                Confirm Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default PlatformSettings;
