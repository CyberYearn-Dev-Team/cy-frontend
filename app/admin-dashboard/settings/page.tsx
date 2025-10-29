"use client";

import React, { useState, useMemo } from "react";
import {
  Save,
  Upload,
  History,
  AlertCircle,
  Check,
  Plus,
  Trash2,
} from "lucide-react";

// shared layout
import AdminSidebar from "@/components/ui/admin-sidebar";
import AdminHeader from "@/components/ui/admin-header";
import Nav from "@/components/ui/admin-nav"; // ADDED AdminNav Import

// 🎨 Theme Colors
const primary = "#72a210";
const secondary = "#507800";
const bgLight = "bg-gray-50 dark:bg-gray-950";
const bgCard = "bg-white dark:bg-gray-900";
const textDark = "text-gray-900 dark:text-gray-100";
const textMedium = "text-gray-600 dark:text-gray-400";
const textLight = "text-gray-500 dark:text-gray-300";

// Types
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

  // Branding State - Initialized with your theme colors
  const [branding, setBranding] = useState<BrandingSettings>({
    logoUrl: "/logo.png",
    primaryColor: primary, // MATCHED THEME
    secondaryColor: secondary, // MATCHED THEME
    accentColor: "#f59e0b", // A contrasting accent (amber) for buttons/highlights
    platformName: "Green Growth Platform",
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
      changes: `Changed primary color from #4f46e5 to ${primary}`,
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
      action: "Created",
      section: "Badges",
      changes: 'Added new badge "Master" with 5000 XP threshold',
    },
  ]);

  const handleSave = () => setShowConfirm(true);

  const confirmSave = () => {
    setSaved(true);
    setShowConfirm(false);
    setTimeout(() => setSaved(false), 3000);

    // In a real application, this is where you'd make your API call to save settings
    console.log("Saving settings:", { branding, gamification, badges });
  };

  const updateBadge = (id: string, field: keyof Badge, value: string | number) => {
    setBadges((prev) =>
      prev.map((badge) =>
        badge.id === id ? { ...badge, [field]: value } : badge
      )
    );
  };

  const addBadge = () => {
    const newId = (Date.now()).toString(); // More unique ID generation
    const lastThreshold = badges.length > 0 ? sortedBadges[sortedBadges.length - 1].xpThreshold : 0;
    setBadges(prev => [...prev, { id: newId, name: `New Badge ${newId.slice(-4)}`, xpThreshold: lastThreshold + 500 }]);
  };

  const deleteBadge = (id: string) => {
    setBadges(prev => prev.filter(badge => badge.id !== id));
  };

  // Memoize sorted badges to ensure 'Novice' (0 XP) is first and others are sorted by threshold
  const sortedBadges = useMemo(() => {
    return [...badges].sort((a, b) => a.xpThreshold - b.xpThreshold);
  }, [badges]);

  return (
    <div className={`flex h-screen overflow-hidden ${bgLight}`}>
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> 
    
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader setSidebarOpen={setSidebarOpen} />
    
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-30">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4">
              <div>
                <h1 className={`text-3xl font-bold ${textDark}`}>Platform Settings</h1>
                <p className={`${textMedium} mt-1`}>
                  Configure platform-wide parameters and branding
                </p>
              </div>
              <button
                onClick={handleSave}
                style={{ backgroundColor: primary }}
                className="flex items-center gap-2 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:opacity-90 transition-opacity font-medium shadow-md disabled:opacity-50 w-full sm:w-auto justify-center"
              >
                <Save size={20} />
                Save Changes
              </button>
            </div>
          </div>

          {/* Success Message */}
          {saved && (
            <div className="bg-green-100 border border-green-300 dark:bg-green-900/50 dark:border-green-700 rounded-lg p-4 mb-6 flex items-center gap-3 transition-opacity duration-300">
              <Check className="text-green-600 dark:text-green-400" size={20} />
              <span className="text-green-800 dark:text-green-200 font-medium">Settings saved successfully!</span>
            </div>
          )}

          {/* Tabs Container */}
          <div className={`${bgCard} rounded-lg shadow-xl border border-gray-200 dark:border-gray-800`}>
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex gap-4 sm:gap-8 px-4 sm:px-6">
                {/* Branding Tab */}
                <button
                  onClick={() => setActiveTab('branding')}
                  className={`py-3 sm:py-4 px-2 border-b-2 font-medium text-sm sm:text-base transition-colors ${
                    activeTab === 'branding'
                      ? 'text-gray-900 dark:text-gray-100' // Base text color
                      : `${textMedium} hover:text-gray-900 dark:hover:text-gray-200`
                  }`}
                  style={{ 
                    borderColor: activeTab === 'branding' ? primary : 'transparent',
                    color: activeTab === 'branding' ? primary : undefined,
                  }}
                >
                  Branding
                </button>
                {/* Gamification Tab */}
                <button
                  onClick={() => setActiveTab('gamification')}
                  className={`py-3 sm:py-4 px-2 border-b-2 font-medium text-sm sm:text-base transition-colors ${
                    activeTab === 'gamification'
                      ? 'text-gray-900 dark:text-gray-100'
                      : `${textMedium} hover:text-gray-900 dark:hover:text-gray-200`
                  }`}
                  style={{ 
                    borderColor: activeTab === 'gamification' ? primary : 'transparent',
                    color: activeTab === 'gamification' ? primary : undefined,
                  }}
                >
                  Gamification
                </button>
                {/* Audit Tab */}
                <button
                  onClick={() => setActiveTab('audit')}
                  className={`py-3 sm:py-4 px-2 border-b-2 font-medium text-sm sm:text-base transition-colors ${
                    activeTab === 'audit'
                      ? 'text-gray-900 dark:text-gray-100'
                      : `${textMedium} hover:text-gray-900 dark:hover:text-gray-200`
                  }`}
                  style={{ 
                    borderColor: activeTab === 'audit' ? primary : 'transparent',
                    color: activeTab === 'audit' ? primary : undefined,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <History size={18} />
                    Audit Log
                  </div>
                </button>
              </nav>
            </div>

            <div className="p-4 sm:p-6">
              {/* Branding Tab Content */}
              {activeTab === 'branding' && (
                <div className="space-y-8">
                  <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h3 className={`text-xl font-semibold ${textDark} mb-4 border-b pb-2 border-gray-200 dark:border-gray-700`}>Brand Identity</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className={`block text-sm font-medium ${textMedium} mb-2`}>
                          Platform Name
                        </label>
                        <input
                          type="text"
                          value={branding.platformName}
                          onChange={(e) => setBranding({ ...branding, platformName: e.target.value })}
                          className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 ${textDark} rounded-lg focus:ring-2 focus:ring-opacity-50`}
                          style={{ borderColor: branding.primaryColor + '80', boxShadow: `0 0 0 1px ${branding.primaryColor + '80'}` }}
                        />
                      </div>

                      <div>
                        <label className={`block text-sm font-medium ${textMedium} mb-2`}>
                          Logo URL
                        </label>
                        <div className="flex gap-3">
                          <input
                            type="text"
                            value={branding.logoUrl}
                            onChange={(e) => setBranding({ ...branding, logoUrl: e.target.value })}
                            className={`flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 ${textDark} rounded-lg focus:ring-2 focus:ring-opacity-50`}
                            style={{ borderColor: branding.primaryColor + '80', boxShadow: `0 0 0 1px ${branding.primaryColor + '80'}` }}
                          />
                          <button 
                            className={`flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-700 ${textDark} rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-sm`}
                          >
                            <Upload size={18} />
                            Upload
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h3 className={`text-xl font-semibold ${textDark} mb-4 border-b pb-2 border-gray-200 dark:border-gray-700`}>Theme Colors</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Primary Color */}
                      <div>
                        <label className={`block text-sm font-medium ${textMedium} mb-2`}>
                          Primary Color
                        </label>
                        <div className="flex gap-3 items-center">
                          <input
                            type="color"
                            value={branding.primaryColor}
                            onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                            className="h-10 w-10 rounded border border-gray-300 dark:border-gray-700 cursor-pointer p-0 overflow-hidden"
                          />
                          <input
                            type="text"
                            value={branding.primaryColor}
                            onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                            className={`flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 ${textDark} rounded-lg focus:ring-2 focus:ring-opacity-50`}
                            style={{ borderColor: branding.primaryColor + '80', boxShadow: `0 0 0 1px ${branding.primaryColor + '80'}` }}
                          />
                        </div>
                      </div>

                      {/* Secondary Color */}
                      <div>
                        <label className={`block text-sm font-medium ${textMedium} mb-2`}>
                          Secondary Color
                        </label>
                        <div className="flex gap-3 items-center">
                          <input
                            type="color"
                            value={branding.secondaryColor}
                            onChange={(e) => setBranding({ ...branding, secondaryColor: e.target.value })}
                            className="h-10 w-10 rounded border border-gray-300 dark:border-gray-700 cursor-pointer p-0 overflow-hidden"
                          />
                          <input
                            type="text"
                            value={branding.secondaryColor}
                            onChange={(e) => setBranding({ ...branding, secondaryColor: e.target.value })}
                            className={`flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 ${textDark} rounded-lg focus:ring-2 focus:ring-opacity-50`}
                            style={{ borderColor: branding.primaryColor + '80', boxShadow: `0 0 0 1px ${branding.primaryColor + '80'}` }}
                          />
                        </div>
                      </div>

                      {/* Accent Color */}
                      <div>
                        <label className={`block text-sm font-medium ${textMedium} mb-2`}>
                          Accent Color
                        </label>
                        <div className="flex gap-3 items-center">
                          <input
                            type="color"
                            value={branding.accentColor}
                            onChange={(e) => setBranding({ ...branding, accentColor: e.target.value })}
                            className="h-10 w-10 rounded border border-gray-300 dark:border-gray-700 cursor-pointer p-0 overflow-hidden"
                          />
                          <input
                            type="text"
                            value={branding.accentColor}
                            onChange={(e) => setBranding({ ...branding, accentColor: e.target.value })}
                            className={`flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 ${textDark} rounded-lg focus:ring-2 focus:ring-opacity-50`}
                            style={{ borderColor: branding.primaryColor + '80', boxShadow: `0 0 0 1px ${branding.primaryColor + '80'}` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Live Preview */}
                  <div className={`${bgCard} rounded-lg p-6 border border-opacity-50 dark:border-opacity-50 shadow-lg`} style={{ borderColor: branding.primaryColor }}>
                    <h4 className={`font-medium ${textDark} mb-3`}>Live Preview (Header Example)</h4>
                    <div className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700" style={{ backgroundColor: branding.primaryColor + '1A' }}> {/* Light tint of primary */}
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md"
                        style={{ backgroundColor: branding.primaryColor }}
                      >
                        {branding.platformName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-lg dark:text-gray-100" style={{ color: branding.primaryColor }}>
                          {branding.platformName}
                        </div>
                        <div className="text-sm dark:text-gray-400" style={{ color: branding.secondaryColor }}>
                          Empowering learners everywhere
                        </div>
                      </div>
                      <button 
                        className="ml-auto px-4 py-2 rounded-full text-sm font-semibold text-white shadow-md hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: branding.accentColor }}
                      >
                        Action
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Gamification Tab Content */}
              {activeTab === 'gamification' && (
                <div className="space-y-8">
                  {/* Streak Rules */}
                  <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h3 className={`text-xl font-semibold ${textDark} mb-4 border-b pb-2 border-gray-200 dark:border-gray-700`}>Streak Rules</h3>

                    <div className="space-y-4">
                      {/* Streak Freeze */}
                      <div className={`p-4 ${bgCard} rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className={`font-medium ${textDark}`}>Streak Freeze</div>
                            <div className={`text-sm ${textMedium}`}>Allow users to use tokens to freeze their streak for a day.</div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={gamification.streakFreezeEnabled}
                              onChange={(e) => setGamification({ ...gamification, streakFreezeEnabled: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div 
                              className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 dark:peer-focus:ring-gray-700 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
                              style={{ backgroundColor: gamification.streakFreezeEnabled ? primary : undefined, boxShadow: gamification.streakFreezeEnabled ? `0 0 0 4px ${primary}33` : undefined }}
                            />
                          </label>
                        </div>
                        
                        {gamification.streakFreezeEnabled && (
                          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <label className={`block text-sm font-medium ${textMedium} mb-2`}>
                              Maximum Streak Freezes per Month
                            </label>
                            <input
                              type="number"
                              value={gamification.streakFreezeLimit}
                              onChange={(e) => setGamification({ ...gamification, streakFreezeLimit: Math.max(0, parseInt(e.target.value) || 0) })}
                              min="0"
                              max="10"
                              className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 ${textDark} rounded-lg focus:ring-2 focus:ring-opacity-50`}
                              style={{ borderColor: primary + '80', boxShadow: `0 0 0 1px ${primary + '80'}` }}
                            />
                          </div>
                        )}
                      </div>

                      {/* Streak Rebuild */}
                      <div className={`p-4 ${bgCard} rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className={`font-medium ${textDark}`}>Streak Rebuild</div>
                            <div className={`text-sm ${textMedium}`}>Allow users to pay to restore a lost streak within a time window.</div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={gamification.streakRebuildEnabled}
                              onChange={(e) => setGamification({ ...gamification, streakRebuildEnabled: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div 
                              className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 dark:peer-focus:ring-gray-700 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
                              style={{ backgroundColor: gamification.streakRebuildEnabled ? primary : undefined, boxShadow: gamification.streakRebuildEnabled ? `0 0 0 4px ${primary}33` : undefined }}
                            />
                          </label>
                        </div>

                        {gamification.streakRebuildEnabled && (
                          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <label className={`block text-sm font-medium ${textMedium} mb-2`}>
                              Rebuild Window (days after streak is lost)
                            </label>
                            <input
                              type="number"
                              value={gamification.streakRebuildDays}
                              onChange={(e) => setGamification({ ...gamification, streakRebuildDays: Math.max(1, parseInt(e.target.value) || 1) })}
                              min="1"
                              max="30"
                              className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 ${textDark} rounded-lg focus:ring-2 focus:ring-opacity-50`}
                              style={{ borderColor: primary + '80', boxShadow: `0 0 0 1px ${primary + '80'}` }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* XP Settings */}
                  <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h3 className={`text-xl font-semibold ${textDark} mb-4 border-b pb-2 border-gray-200 dark:border-gray-700`}>XP Settings</h3>
                    
                    <div>
                      <label className={`block text-sm font-medium ${textMedium} mb-2`}>
                        Daily XP Cap
                      </label>
                      <input
                        type="number"
                        value={gamification.dailyXpCap}
                        onChange={(e) => setGamification({ ...gamification, dailyXpCap: Math.max(100, parseInt(e.target.value) || 100) })}
                        min="100"
                        step="100"
                        className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 ${textDark} rounded-lg focus:ring-2 focus:ring-opacity-50`}
                        style={{ borderColor: primary + '80', boxShadow: `0 0 0 1px ${primary + '80'}` }}
                      />
                      <p className={`text-sm ${textMedium} mt-1`}>Maximum XP a user can earn per day to prevent farming.</p>
                    </div>
                  </div>

                  {/* Badge Thresholds */}
                  <div className={`${bgCard} rounded-lg border border-gray-200 dark:border-gray-700 shadow p-6`}>
                    <h3 className={`text-xl font-semibold ${textDark} mb-4 border-b pb-2 border-gray-200 dark:border-gray-700`}>Badge Thresholds</h3>

                    <div className="space-y-3">
                      {sortedBadges.map((badge, index) => (
                        <div key={badge.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                          {/* Badge Name */}
                          <div className="flex-1 w-full sm:w-auto">
                            <label className={`block text-xs font-medium ${textLight} mb-1 sm:hidden`}>Badge Name</label>
                            <input
                              type="text"
                              value={badge.name}
                              onChange={(e) => updateBadge(badge.id, 'name', e.target.value)}
                              className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 ${textDark} rounded-lg text-sm focus:ring-2 focus:ring-opacity-50`}
                              style={{ borderColor: primary + '80', boxShadow: `0 0 0 1px ${primary + '80'}` }}
                              placeholder="Badge name"
                            />
                          </div>
                          
                          {/* XP Threshold */}
                          <div className="flex items-center gap-2 w-full sm:w-auto sm:max-w-[150px]">
                            <label className={`block text-xs font-medium ${textLight} mb-1 sm:hidden`}>XP Threshold</label>
                            <input
                              type="number"
                              value={badge.xpThreshold}
                              onChange={(e) => updateBadge(badge.id, 'xpThreshold', Math.max(0, parseInt(e.target.value) || 0))}
                              min={index > 0 ? sortedBadges[index - 1].xpThreshold + 1 : 0} 
                              step="100"
                              className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 ${textDark} rounded-lg text-sm focus:ring-2 focus:ring-opacity-50`}
                              style={{ borderColor: primary + '80', boxShadow: `0 0 0 1px ${primary + '80'}` }}
                            />
                            <span className={`${textMedium} text-sm flex-shrink-0`}>XP</span>
                          </div>

                          {/* Delete Button (only if not the first 'Novice' badge) */}
                          {index > 0 && (
                            <button
                              onClick={() => deleteBadge(badge.id)}
                              className="p-2 text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors flex-shrink-0"
                              title="Delete Badge"
                            >
                              <Trash2 size={20} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={addBadge}
                      style={{ color: primary, borderColor: primary }}
                      className="mt-4 flex items-center gap-2 px-4 py-2 border rounded-lg hover:opacity-90 transition-colors font-medium text-sm"
                    >
                      <Plus size={18} />
                      Add New Badge
                    </button>
                  </div>
                </div>
              )}

              {/* Audit Log Tab Content */}
              {activeTab === 'audit' && (
                <div>
                  <h3 className={`text-xl font-semibold ${textDark} mb-4`}>Recent Changes</h3>

                  <div className="space-y-4">
                    {auditLogs.map((log) => (
                      <div key={log.id} className={`border border-gray-200 dark:border-gray-700 rounded-lg p-4 ${bgCard} hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors`}>
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-3">
                            <History size={18} className="text-gray-500 dark:text-gray-400" />
                            <span className={`font-medium ${textDark}`}>{log.section}</span>
                            <span 
                              className="px-3 py-0.5 text-xs rounded-full font-medium"
                              style={{ backgroundColor: primary + '1A', color: primary }} // Themed badge
                            >
                              {log.action}
                            </span>
                          </div>
                          <span className={`text-sm ${textLight} flex-shrink-0`}>{log.timestamp}</span>
                        </div>
                        <p className={`text-sm ${textMedium} mb-2`}>{log.changes}</p>
                        <p className={`text-xs ${textLight}`}>By: <span className="font-medium">{log.user}</span></p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-lg flex items-start gap-3">
                    <AlertCircle className="text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" size={20} />
                    <div className="text-sm text-yellow-800 dark:text-yellow-200">
                      <p className="font-medium mb-1">Audit Log Retention Policy</p>
                      <p>Changes are logged and retained for 90 days for compliance and security purposes. Contact support for older records.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Confirmation Modal */}
          {showConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 sm:p-8 max-w-md w-full transform transition-all">
                <h3 className={`text-xl font-bold ${textDark} mb-4 flex items-center gap-2`}>
                    <AlertCircle size={24} style={{ color: primary }} /> Confirm Changes
                </h3>
                <p className={`${textMedium} mb-6`}>
                  Are you absolutely sure you want to save these **platform-wide** settings? Changes will affect all users immediately and cannot be easily reverted without another update.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className={`order-2 sm:order-1 px-4 py-2 border border-gray-300 dark:border-gray-600 ${textMedium} rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmSave}
                    style={{ backgroundColor: primary }}
                    className="order-1 sm:order-2 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity font-medium shadow-md"
                  >
                    <Save size={18} className="inline mr-2" /> Confirm & Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>

        <Nav /> 
      </div>
    </div>
  );
};

export default PlatformSettings;