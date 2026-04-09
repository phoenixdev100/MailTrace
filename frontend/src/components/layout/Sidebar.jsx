import { Settings, Send, Terminal, ChevronLeft, ChevronRight, X, Layout as LayoutIcon, Users, BarChart3 } from 'lucide-react';
import heroLogo from '../../assets/logo.png';

const Sidebar = ({ activeTab, setActiveTab, logCount, isCollapsed, onToggle, onCloseMobile }) => {
    const navItems = [
        { id: 'config', label: 'SMTP Config', icon: Settings },
        { id: 'send', label: 'Send Email', icon: Send },
        { id: 'templates', label: 'Templates', icon: LayoutIcon },
        { id: 'contacts', label: 'Contacts', icon: Users },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'logs', label: 'Logs', icon: Terminal, badge: logCount },
    ];

    return (
        <aside className={`h-full bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${isCollapsed ? 'items-center' : ''}`}>
            {/* Header */}
            <div className={`p-6 border-b border-gray-200 flex items-center justify-between ${isCollapsed ? 'px-0 justify-center' : ''}`}>
                <div className="flex items-center gap-3 overflow-hidden">
                    <img src={heroLogo} alt="MailTrace" className="w-10 h-10 object-contain shrink-0" loading="lazy" decoding="async" />
                    {!isCollapsed && (
                        <div>
                            <h1 className="font-bold text-gray-900 leading-none whitespace-nowrap">MailTrace</h1>
                            <span className="text-xs text-gray-500 font-medium tracking-wide uppercase">Test. Verify. Deliver.</span>
                        </div>
                    )}
                </div>
                
                {/* Mobile Close Button */}
                <button 
                    onClick={onCloseMobile} 
                    className="lg:hidden p-2 text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label="Close sidebar"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveTab(item.id);
                                if (window.innerWidth < 1024) onCloseMobile();
                            }}
                            title={isCollapsed ? item.label : ''}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                                isActive 
                                ? 'bg-gray-100 text-gray-900 border border-gray-200' 
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-700'
                            } ${isCollapsed ? 'justify-center px-0 w-12 h-12 mx-auto' : ''}`}
                        >
                            <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-blue-600' : ''}`} />
                            {!isCollapsed && <span className="flex-1 text-left">{item.label}</span>}
                            {!isCollapsed && item.badge > 0 && (
                                <span className={`px-2 py-0.5 rounded-full text-xs ${
                                    isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                                }`}>
                                    {item.badge}
                                </span>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Footer / Toggle */}
            <div className={`p-4 border-t border-gray-200 space-y-4 ${isCollapsed ? 'px-0 items-center' : ''}`}>
                {!isCollapsed && (
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-2">Notice</p>
                        <p className="text-[11px] text-gray-600 leading-relaxed">
                            Configuration and logs are saved locally in your browser session.
                        </p>
                        <div className="mt-3 pt-3 border-t border-gray-200 flex flex-col gap-1">
                            <p className="text-[9px] font-bold text-gray-500 tracking-tight uppercase">© {new Date().getFullYear()} Deepak</p>
                            <a href="https://github.com/phoenixdev100" target="_blank" rel="noreferrer" className="text-[10px] text-blue-500 font-medium hover:underline">Made with love by Deepak</a>
                        </div>
                    </div>
                )}
                
                <button 
                    onClick={onToggle}
                    className="hidden lg:flex w-full items-center justify-center gap-2 py-2 text-gray-500 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all"
                    aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                    {!isCollapsed && <span className="text-xs font-bold uppercase tracking-wider">Collapse Menu</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
