import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Trash2, Download, Search, Info, CheckCircle, AlertCircle, Clock, ChevronDown, ChevronRight } from 'lucide-react';

const Logs = ({ logs, clearLogs }) => {
    const [filter, setFilter] = useState('all'); // 'all', 'success', 'error', 'info'
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedLogs, setExpandedLogs] = useState(new Set());
    const scrollRef = useRef(null);

    const filteredLogs = logs.filter(log => {
        const matchesType = filter === 'all' || log.type === filter;
        const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             (log.details && JSON.stringify(log.details).toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesType && matchesSearch;
    });

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0; // Since logs are prepended (newest on top)
        }
    }, [logs]);

    const toggleExpand = (id) => {
        const newExpanded = new Set(expandedLogs);
        if (newExpanded.has(id)) newExpanded.delete(id);
        else newExpanded.add(id);
        setExpandedLogs(newExpanded);
    };

    const downloadLogs = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `smtp_logs_${new Date().toISOString().slice(0, 10)}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const getTypeStyles = (type) => {
        switch (type) {
            case 'success': return { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' };
            case 'error': return { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' };
            default: return { icon: Info, color: 'text-blue-500', bg: 'bg-blue-50' };
        }
    };

    return (
        <div className="flex flex-col h-full lg:h-[calc(100vh-8rem)] min-h-[500px]">
            <header className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Activity Logs</h2>
                    <p className="text-gray-600 mt-2 text-sm">Real-time session history of SMTP operations.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={downloadLogs} className="btn btn-outline py-2 px-3 md:px-4 gap-2 text-xs md:text-sm">
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Export JSON</span>
                        <span className="sm:hidden">Export</span>
                    </button>
                    <button onClick={clearLogs} className="btn btn-outline py-2 px-3 md:px-4 gap-2 text-xs md:text-sm text-red-600 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Clear</span>
                    </button>
                </div>
            </header>

            <div className="card flex-1 flex flex-col overflow-hidden min-h-0">
                {/* Toolbar */}
                <div className="p-3 md:p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row gap-3 md:gap-4 items-stretch md:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input 
                            type="text" className="input pl-10 py-1.5 text-sm" placeholder="Search logs..."
                            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex bg-white p-1 rounded-lg border border-gray-200 overflow-x-auto no-scrollbar">
                        {['all', 'info', 'success', 'error'].map(type => (
                            <button
                                key={type}
                                onClick={() => setFilter(type)}
                                className={`px-3 md:px-4 py-1 text-[10px] md:text-xs font-bold uppercase rounded-md transition-all whitespace-nowrap ${
                                    filter === type ? 'bg-gray-900 text-white' : 'text-gray-600 hover:text-gray-700'
                                }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Logs List */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto font-mono text-[11px] md:text-sm no-scrollbar">
                    {filteredLogs.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500 p-8">
                            <Terminal className="w-12 h-12 mb-4 opacity-20" />
                            <p>No logs matching filters</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {filteredLogs.map(log => {
                                const styles = getTypeStyles(log.type);
                                const Icon = styles.icon;
                                const isExpanded = expandedLogs.has(log.id);
                                return (
                                    <div key={log.id} className={`group ${isExpanded ? 'bg-gray-50/50' : ''}`}>
                                        <div 
                                            className="p-3 md:p-4 flex items-start gap-3 md:gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
                                            onClick={() => log.details && toggleExpand(log.id)}
                                        >
                                            <div className="flex items-center gap-2 md:gap-3 shrink-0 pt-0.5">
                                                <span className="text-[9px] md:text-[10px] font-bold text-gray-500 w-12 md:w-16">{log.timestamp}</span>
                                                <Icon className={`w-3.5 h-3.5 md:w-4 md:h-4 ${styles.color}`} />
                                            </div>
                                            <div className="flex-1 leading-relaxed text-gray-700 break-words overflow-hidden">
                                                {log.message}
                                            </div>
                                            {log.details && (
                                                <div className="shrink-0 text-gray-500">
                                                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                                </div>
                                            )}
                                        </div>
                                        {isExpanded && log.details && (
                                            <div className="px-10 md:px-14 pb-4 animate-in fade-in slide-in-from-top-1 duration-200">
                                                <div className="bg-white border border-gray-200 rounded-lg p-3 text-[10px] md:text-[11px] overflow-auto max-h-64 shadow-inner">
                                                    <pre className="text-gray-600">{JSON.stringify(log.details, null, 2)}</pre>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="p-2 md:p-3 border-t border-gray-100 bg-white text-[9px] md:text-[10px] font-bold text-gray-500 uppercase tracking-widest flex justify-between items-center">
                    <span className="truncate mr-2">Showing {filteredLogs.length} of {logs.length} logs</span>
                    <span className="flex items-center gap-2 shrink-0">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                        Live
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Logs;
