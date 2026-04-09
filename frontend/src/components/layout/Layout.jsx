import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu, X } from 'lucide-react';

const Layout = ({ children, activeTab, setActiveTab, logCount }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-white">
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div 
                    className="fixed inset-0 bg-gray-900/10 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 transition-all duration-300 ease-in-out ${
                isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            } ${
                isCollapsed ? 'lg:w-20' : 'lg:w-64'
            }`}>
                <Sidebar 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab} 
                    logCount={logCount} 
                    isCollapsed={isCollapsed}
                    onToggle={() => setIsCollapsed(!isCollapsed)}
                    onCloseMobile={() => setIsMobileOpen(false)}
                />
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-x-hidden p-4 md:p-8 relative">
                {/* Mobile Header */}
                <header className="lg:hidden flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => setIsMobileOpen(true)}
                            className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors"
                            aria-label="Open sidebar"
                        >
                            <Menu className="text-white w-5 h-5" />
                        </button>
                        <span className="font-bold text-gray-900">MailTrace</span>
                    </div>
                </header>

                <div className="max-w-5xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
