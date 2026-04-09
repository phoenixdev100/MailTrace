import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle, AlertCircle, Play, Save } from 'lucide-react';
import axios from 'axios';

const SMTPConfig = ({ configs, setConfigs, activeConfigId, setActiveConfigId, addLog, showNotification }) => {
    const [newConfig, setNewConfig] = useState({
        name: '',
        host: '',
        port: 587,
        encryption: 'tls', // 'none', 'ssl', 'tls'
        user: '',
        pass: ''
    });
    const [isTesting, setIsTesting] = useState(false);

    const handleAdd = (e) => {
        e.preventDefault();
        const id = Date.now().toString();
        const configToAdd = { ...newConfig, id };
        const updatedConfigs = [...configs, configToAdd];
        setConfigs(updatedConfigs);
        if (configs.length === 0) setActiveConfigId(id);
        setNewConfig({ name: '', host: '', port: 587, encryption: 'tls', user: '', pass: '' });
        addLog('info', `Added configuration: ${configToAdd.name}`);
        showNotification('success', `Configuration "${configToAdd.name}" added`);
    };

    const handleDelete = (id) => {
        const updatedConfigs = configs.filter(c => c.id !== id);
        const deletedConfig = configs.find(c => c.id === id);
        setConfigs(updatedConfigs);
        if (activeConfigId === id) {
            setActiveConfigId(updatedConfigs.length > 0 ? updatedConfigs[0].id : '');
        }
        showNotification('info', `Configuration "${deletedConfig?.name}" deleted`);
    };

    const testConnection = async (config) => {
        setIsTesting(true);
        addLog('info', `Testing connection to ${config.host}:${config.port}...`);
        try {
            const response = await axios.post('http://localhost:3001/api/test-connection', { config });
            if (response.data.success) {
                addLog('success', `Connection to ${config.host} successful!`, response.data);
                showNotification('success', `Connection to ${config.host} successful`);
            } else {
                addLog('error', `Connection to ${config.host} failed: ${response.data.message}`, response.data);
                showNotification('error', `Connection failed: ${response.data.message}`);
            }
        } catch (error) {
            addLog('error', `API Error: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsTesting(false);
        }
    };

    return (
        <div className="space-y-8">
            <header className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900">SMTP Configuration</h2>
                <p className="text-gray-600 mt-2">Manage your SMTP servers and test connectivity.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Active Configurations */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Saved Configurations</h3>
                    {configs.length === 0 ? (
                        <div className="card p-8 border-dashed flex flex-col items-center justify-center text-center">
                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <Plus className="text-gray-500" />
                            </div>
                            <p className="text-gray-600 text-sm">No configurations saved yet.<br/>Add one to get started.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {configs.map(config => (
                                <div 
                                    key={config.id}
                                    className={`card p-4 flex items-center gap-4 transition-all cursor-pointer ${activeConfigId === config.id ? 'border-blue-500 ring-1 ring-blue-500' : 'hover:border-gray-300'}`}
                                    onClick={() => setActiveConfigId(config.id)}
                                >
                                    <div className={`p-2 rounded-lg ${activeConfigId === config.id ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-500'}`}>
                                        <CheckCircle className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900">{config.name}</h4>
                                        <p className="text-xs text-gray-600">{config.host}:{config.port} • {config.encryption.toUpperCase()}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); testConnection(config); }}
                                            disabled={isTesting}
                                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Test Connection"
                                            aria-label={`Test connection for ${config.name}`}
                                        >
                                            <Play className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleDelete(config.id); }}
                                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete"
                                            aria-label={`Delete configuration ${config.name}`}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Add New Configuration */}
                <div className="card p-6 h-fit sticky top-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Add New Config</h3>
                    <form onSubmit={handleAdd} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Friendly Name</label>
                            <input 
                                type="text" required className="input" placeholder="e.g. Development Server"
                                value={newConfig.name} onChange={e => setNewConfig({...newConfig, name: e.target.value})}
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Host</label>
                                <input 
                                    type="text" required className="input" placeholder="smtp.example.com"
                                    value={newConfig.host} onChange={e => setNewConfig({...newConfig, host: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Port</label>
                                <input 
                                    type="number" required className="input" placeholder="587"
                                    value={newConfig.port} onChange={e => setNewConfig({...newConfig, port: parseInt(e.target.value)})}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Username (Optional)</label>
                                <input 
                                    type="text" className="input text-sm" placeholder="user@domain.com"
                                    value={newConfig.user} onChange={e => setNewConfig({...newConfig, user: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password (Optional)</label>
                                <input 
                                    type="password" className="input text-sm" placeholder="••••••••"
                                    value={newConfig.pass} onChange={e => setNewConfig({...newConfig, pass: e.target.value})}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Encryption</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['none', 'ssl', 'tls'].map(type => (
                                    <button
                                        key={type} type="button"
                                        onClick={() => setNewConfig({...newConfig, encryption: type})}
                                        className={`px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border transition-all ${
                                            newConfig.encryption === type 
                                            ? 'bg-gray-900 text-white border-gray-900' 
                                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                                        }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary w-full mt-4 gap-2">
                            <Plus className="w-4 h-4" />
                            Save Configuration
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SMTPConfig;
