import React from 'react';
import { BarChart3, CheckCircle, AlertCircle, TrendingUp, Clock, Zap } from 'lucide-react';

const Analytics = ({ logs }) => {
    const total = logs.length;
    const successes = logs.filter(l => l.type === 'success').length;
    const errors = logs.filter(l => l.type === 'error').length;
    const infos = logs.filter(l => l.type === 'info').length;
    
    const successRate = total > 0 ? ((successes / (successes + errors)) * 100).toFixed(1) : 0;

    const stats = [
        { label: 'Total Operations', value: total, icon: BarChart3, color: 'text-gray-900', bg: 'bg-gray-50' },
        { label: 'Successful Sends', value: successes, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Delivery Failures', value: errors, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
        { label: 'Success Rate', value: `${successRate}%`, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
    ];

    return (
        <div className="space-y-8 pb-12">
            <header>
                <h2 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h2>
                <p className="text-gray-600 mt-2">Historical performance metrics based on your current session logs.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <div key={idx} className="card p-6 flex items-center gap-4 hover:shadow-md transition-all">
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} shrink-0`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{stat.label}</p>
                                <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Visual Indicators */}
                <div className="lg:col-span-2 card p-8 flex flex-col items-center justify-center min-h-[400px]">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-12 self-start">Success Distribution</h3>
                    
                    <div className="flex items-end gap-12 w-full max-w-md h-64 border-b border-gray-100 pb-2 relative">
                        {/* Fake Bars representing distribution */}
                        <div className="flex-1 bg-green-500 rounded-t-lg transition-all duration-1000" style={{ height: `${total > 0 ? (successes / total) * 100 : 0}%` }}>
                            <div className="absolute -bottom-8 left-1/4 -translate-x-1/2 text-[10px] font-bold text-gray-500">SUCCESS</div>
                        </div>
                        <div className="flex-1 bg-red-400 rounded-t-lg transition-all duration-1000" style={{ height: `${total > 0 ? (errors / total) * 100 : 0}%` }}>
                            <div className="absolute -bottom-8 left-3/4 -translate-x-1/2 text-[10px] font-bold text-gray-500">FAILURE</div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 w-full max-w-md mt-16 gap-8">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-gray-900">{successes}</p>
                            <p className="text-xs text-gray-500 font-bold uppercase mt-1">Total Wins</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-gray-900">{errors}</p>
                            <p className="text-xs text-gray-500 font-bold uppercase mt-1">Total Losses</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="card p-6 bg-white border border-gray-100 overflow-hidden relative">
                        <Zap className="absolute -right-4 -bottom-4 w-32 h-32 text-blue-500/5 rotate-12" />
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Quick Insights</h4>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Clock className="w-5 h-5 text-blue-500 shrink-0" />
                                <p className="text-xs text-gray-600 leading-relaxed">
                                    Your sessions average about <strong>{total > 0 ? (total / Math.max(1, logs.length / 5)).toFixed(0) : 0} operations</strong> per minute.
                                </p>
                            </div>
                            <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-100/50">
                                <p className="text-[10px] font-bold text-blue-600/60 mb-1 uppercase">Recommendation</p>
                                <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
                                    {errors > 0 ? 'Review your error logs to identify server-side timeout patterns.' : 'Your SMTP connection health is currently optimal. Maintain existing settings.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
