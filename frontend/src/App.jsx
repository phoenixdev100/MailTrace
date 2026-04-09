import React, { useState, useEffect } from 'react';
import { Mail, Settings, List, Play, Send, Shield, Zap, Terminal, Plus, Trash2, Copy, Download, X, Search, Info, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import SMTPConfig from './pages/SMTPConfig';
import SendEmail from './pages/SendEmail';
import Logs from './pages/Logs';
import Layout from './components/layout/Layout';

import Templates from './pages/Templates';
import Contacts from './pages/Contacts';
import Analytics from './pages/Analytics';

const App = () => {
    // ... state declarations ...
    const [activeTab, setActiveTab] = useState('config'); // 'config', 'send', 'templates', 'contacts', 'logs', 'analytics'
    const [configs, setConfigs] = useState(() => {
        const saved = localStorage.getItem('smtp_configs');
        return saved ? JSON.parse(saved) : [];
    });
    const [templates, setTemplates] = useState(() => {
        const saved = localStorage.getItem('smtp_templates');
        return saved ? JSON.parse(saved) : [];
    });
    const [contacts, setContacts] = useState(() => {
        const saved = localStorage.getItem('smtp_contacts');
        return saved ? JSON.parse(saved) : [];
    });
    const [activeConfigId, setActiveConfigId] = useState(() => {
        return localStorage.getItem('active_config_id') || '';
    });
    const [logs, setLogs] = useState(() => {
        const saved = localStorage.getItem('smtp_logs');
        return saved ? JSON.parse(saved) : [];
    });
    const [notifications, setNotifications] = useState([]);

    const showNotification = (type, message) => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, type, message }]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 5000);
    };

    // Persistence
    useEffect(() => {
        localStorage.setItem('smtp_configs', JSON.stringify(configs));
    }, [configs]);

    useEffect(() => {
        localStorage.setItem('smtp_templates', JSON.stringify(templates));
    }, [templates]);

    useEffect(() => {
        localStorage.setItem('smtp_contacts', JSON.stringify(contacts));
    }, [contacts]);

    useEffect(() => {
        localStorage.setItem('active_config_id', activeConfigId);
    }, [activeConfigId]);

    useEffect(() => {
        localStorage.setItem('smtp_logs', JSON.stringify(logs));
    }, [logs]);

    const activeConfig = configs.find(c => c.id === activeConfigId);

    const addLog = (type, message, details = null) => {
        const newLog = {
            id: Date.now(),
            timestamp: new Date().toLocaleTimeString(),
            type, // 'info', 'success', 'error'
            message,
            details
        };
        setLogs(prev => [newLog, ...prev]);
    };

    const clearLogs = () => setLogs([]);

    const renderContent = () => {
        switch (activeTab) {
            case 'config':
                return (
                    <SMTPConfig 
                        configs={configs} 
                        setConfigs={setConfigs} 
                        activeConfigId={activeConfigId} 
                        setActiveConfigId={setActiveConfigId}
                        addLog={addLog}
                        showNotification={showNotification}
                    />
                );
            case 'send':
                return (
                    <SendEmail 
                        activeConfig={activeConfig}
                        addLog={addLog}
                        showNotification={showNotification}
                        templates={templates}
                        contacts={contacts}
                    />
                );
            case 'templates':
                return (
                    <Templates 
                        templates={templates}
                        setTemplates={setTemplates}
                        showNotification={showNotification}
                    />
                );
            case 'contacts':
                return (
                    <Contacts 
                        contacts={contacts}
                        setContacts={setContacts}
                        showNotification={showNotification}
                    />
                );
            case 'analytics':
                return (
                    <Analytics 
                        logs={logs}
                    />
                );
            case 'logs':
                return (
                    <Logs 
                        logs={logs} 
                        clearLogs={clearLogs}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <Layout activeTab={activeTab} setActiveTab={setActiveTab} logCount={logs.length}>
            {renderContent()}

            {/* Toaster */}
            <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-3 pointer-events-none">
                {notifications.map(n => (
                    <div 
                        key={n.id} 
                        className={`pointer-events-auto flex items-center gap-3 px-6 py-4 rounded-xl shadow-soft border animate-in slide-in-from-right-8 duration-300 ${
                            n.type === 'success' ? 'bg-white border-green-100 text-gray-900' : 
                            n.type === 'error' ? 'bg-white border-red-100 text-gray-900' : 
                            'bg-white border-blue-100 text-gray-900'
                        }`}
                    >
                        {n.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
                        {n.type === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
                        {n.type === 'info' && <Info className="w-5 h-5 text-blue-500" />}
                        <p className="text-sm font-semibold">{n.message}</p>
                    </div>
                ))}
            </div>
        </Layout>
    );
};

export default App;
