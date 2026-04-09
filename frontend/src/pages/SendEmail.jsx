import React, { useState, useRef } from 'react';
import { Send, Plus, Trash2, X, Paperclip, AlertCircle, Info, Zap, Terminal, Clock, Settings2, Bold, Italic, Underline, Code, Link as LinkIcon, List, Eye, Layout as LayoutIcon, User } from 'lucide-react';
import axios from 'axios';
import CustomSelect from '../components/common/CustomSelect';

const LANGUAGES = [
    'Plain Text', 'HTML', 'JSON', 'XML', 'YAML', 'Markdown', 
    'MySQL', 'PostgreSQL', 'SQLite', 'SQL', 
    'JavaScript', 'TypeScript', 'Vue', 'React (JSX)', 
    'PHP', 'Python', 'Ruby', 'Rust', 'Go', 'Shell', 
    'Nginx', 'Apache', 'Properties', 'TOML', 'Pug',
    'CSS', 'Sass', 'SCSS', 'Less',
    'Java', 'C#', 'C++', 'Swift', 'Kotlin'
];

const SendEmail = ({ activeConfig, addLog, showNotification, templates = [], contacts = [] }) => {
    const [emailData, setEmailData] = useState({
        from: '',
        to: '',
        cc: '',
        bcc: '',
        subject: '',
        body: '',
        isHtml: false,
        language: 'Plain Text',
        headers: []
    });
    const [attachments, setAttachments] = useState([]);
    const [advanced, setAdvanced] = useState({
        bulkCount: 1,
        delay: 500,
        timeout: 30000,
        debug: false
    });
    const [isSending, setIsSending] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const textAreaRef = useRef(null);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setAttachments(prev => [...prev, ...files]);
    };

    const removeAttachment = (index) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const addHeader = () => {
        setEmailData(prev => ({
            ...prev,
            headers: [...prev.headers, { key: '', value: '' }]
        }));
    };

    const updateHeader = (index, field, value) => {
        const newHeaders = [...emailData.headers];
        newHeaders[index][field] = value;
        setEmailData(prev => ({ ...prev, headers: newHeaders }));
    };

    const removeHeader = (index) => {
        setEmailData(prev => ({
            ...prev,
            headers: prev.headers.filter((_, i) => i !== index)
        }));
    };

    const wrapSelectedText = (tagOpen, tagClose) => {
        if (!textAreaRef.current) return;
        
        const start = textAreaRef.current.selectionStart;
        const end = textAreaRef.current.selectionEnd;
        const text = emailData.body;
        const selected = text.substring(start, end);
        const newText = text.substring(0, start) + tagOpen + selected + tagClose + text.substring(end);
        
        setEmailData({ ...emailData, body: newText, isHtml: true });
        
        // Refocus and set selection (approximate)
        setTimeout(() => {
            textAreaRef.current.focus();
            textAreaRef.current.setSelectionRange(start + tagOpen.length, end + tagOpen.length);
        }, 0);
    };

    const sendSingleEmail = async (count = 1) => {
        if (!activeConfig) {
            addLog('error', 'No SMTP configuration selected.');
            showNotification('error', 'Please select an SMTP configuration first');
            return;
        }

        setIsSending(true);
        addLog('info', `Attempting to send ${count > 1 ? count + ' emails' : 'email'} via ${activeConfig.host}...`);

        try {
            const headersObj = {};
            emailData.headers.forEach(h => {
                if (h.key.trim()) headersObj[h.key] = h.value;
            });

            for (let i = 0; i < count; i++) {
                if (i > 0) {
                    addLog('info', `Waiting ${advanced.delay}ms before next send...`);
                    await new Promise(resolve => setTimeout(resolve, advanced.delay));
                }

                const currentEmailData = { ...emailData, headers: headersObj, attachments: undefined };
                if (count > 1) currentEmailData.subject += ` [Test ${i + 1}/${count}]`;

                const tempFormData = new FormData();
                tempFormData.append('config', JSON.stringify({ ...activeConfig, timeout: advanced.timeout }));
                tempFormData.append('emailData', JSON.stringify(currentEmailData));
                attachments.forEach(file => {
                    tempFormData.append('attachments', file);
                });

                addLog('info', `Sending email ${i + 1} of ${count}...`);
                const response = await axios.post('http://localhost:3001/api/send-email', tempFormData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                if (response.data.success) {
                    addLog('success', `Email ${i + 1} sent successfully!`, response.data);
                    if (count === 1) showNotification('success', 'Email sent successfully');
                } else {
                    addLog('error', `Failed to send email ${i + 1}: ${response.data.message}`, response.data);
                    showNotification('error', `Failed to send email: ${response.data.message}`);
                }
            }
            if (count > 1) showNotification('success', `Bulk task completed: ${count} emails sent`);
        } catch (error) {
            addLog('error', `API Error: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="space-y-8 pb-12">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Send Test Email</h2>
                    <p className="text-gray-600 mt-2">Draft and send emails to verify your SMTP delivery.</p>
                </div>
                {!activeConfig && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg border border-red-100 text-sm font-medium animate-pulse">
                        <AlertCircle className="w-4 h-4" />
                        No Config Selected
                    </div>
                )}
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Email Form */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <CustomSelect 
                            placeholder="Quick Load Template..."
                            icon={LayoutIcon}
                            options={templates.map(t => ({ value: t.id, label: t.name }))}
                            onChange={(id) => {
                                const template = templates.find(t => t.id === id);
                                if (template) {
                                    setEmailData({
                                        ...emailData,
                                        subject: template.subject,
                                        body: template.body,
                                        isHtml: template.body.includes('<')
                                    });
                                    showNotification('info', `Loaded template: ${template.name}`);
                                }
                            }}
                        />

                        <CustomSelect 
                            placeholder="Select Contact..."
                            icon={User}
                            options={contacts.map(c => ({ value: c.email, label: `${c.name} (${c.email})` }))}
                            onChange={(email) => {
                                setEmailData({ ...emailData, to: email });
                                showNotification('info', `Selected contact: ${email}`);
                            }}
                        />
                    </div>

                    <div className="card p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                                <input 
                                    type="email" className="input" placeholder="sender@example.com"
                                    value={emailData.from} onChange={e => setEmailData({...emailData, from: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                                <input 
                                    type="email" className="input" placeholder="recipient@example.com"
                                    value={emailData.to} onChange={e => setEmailData({...emailData, to: e.target.value})}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                            <input 
                                type="text" className="input" placeholder="SMTP Connection Test"
                                value={emailData.subject} onChange={e => setEmailData({...emailData, subject: e.target.value})}
                            />
                        </div>

                        <div className="pt-4 border-t border-gray-100">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
                                <div className="flex items-center gap-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-tight">Format</label>
                                    <div className="w-32">
                                        <CustomSelect 
                                            value={emailData.language}
                                            options={LANGUAGES.map(l => ({ value: l, label: l }))}
                                            onChange={(lang) => {
                                                setEmailData({
                                                    ...emailData, 
                                                    language: lang, 
                                                    isHtml: lang === 'HTML' || lang === 'Markdown'
                                                });
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="flex bg-gray-100 p-1 rounded-lg">
                                    <button 
                                        onClick={() => setEmailData({...emailData, isHtml: false})}
                                        className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${!emailData.isHtml ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'}`}
                                    >
                                        PLAIN TEXT
                                    </button>
                                    <button 
                                        onClick={() => setEmailData({...emailData, isHtml: true})}
                                        className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${emailData.isHtml ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'}`}
                                    >
                                        RICH / HTML
                                    </button>
                                </div>
                            </div>

                            {/* Rich Text Toolbar */}
                            <div className="flex items-center gap-1 mb-2 p-1.5 bg-gray-50 border border-gray-200 rounded-t-lg border-b-0 overflow-x-auto no-scrollbar">
                                <button onClick={() => wrapSelectedText('<b>', '</b>')} className="p-1.5 hover:bg-white hover:shadow-sm rounded transition-all text-gray-600" title="Bold"><Bold className="w-4 h-4" /></button>
                                <button onClick={() => wrapSelectedText('<i>', '</i>')} className="p-1.5 hover:bg-white hover:shadow-sm rounded transition-all text-gray-600" title="Italic"><Italic className="w-4 h-4" /></button>
                                <button onClick={() => wrapSelectedText('<u>', '</u>')} className="p-1.5 hover:bg-white hover:shadow-sm rounded transition-all text-gray-600" title="Underline"><Underline className="w-4 h-4" /></button>
                                <div className="w-px h-4 bg-gray-200 mx-1" />
                                <button onClick={() => wrapSelectedText('<pre><code>', '</code></pre>')} className="p-1.5 hover:bg-white hover:shadow-sm rounded transition-all text-gray-600" title="Code Block"><Code className="w-4 h-4" /></button>
                                <button onClick={() => wrapSelectedText('<a href="#">', '</a>')} className="p-1.5 hover:bg-white hover:shadow-sm rounded transition-all text-gray-600" title="Link"><LinkIcon className="w-4 h-4" /></button>
                                <button onClick={() => wrapSelectedText('<ul>\n  <li>', '</li>\n</ul>')} className="p-1.5 hover:bg-white hover:shadow-sm rounded transition-all text-gray-600" title="List"><List className="w-4 h-4" /></button>
                                <div className="w-px h-4 bg-gray-200 mx-1" />
                                <button onClick={() => wrapSelectedText('<p>', '</p>')} className="px-2 py-1 text-[10px] font-bold text-gray-500 hover:text-gray-600 uppercase">Paragraph</button>
                                <button onClick={() => wrapSelectedText('<h1>', '</h1>')} className="px-2 py-1 text-[10px] font-bold text-gray-500 hover:text-gray-600 uppercase">H1</button>
                                <button onClick={() => wrapSelectedText('<br/>', '')} className="px-2 py-1 text-[10px] font-bold text-gray-500 hover:text-gray-600 uppercase">Break</button>
                            </div>

                            <textarea 
                                ref={textAreaRef}
                                className="input min-h-[300px] font-mono text-sm leading-relaxed rounded-t-none border-t-0 focus:ring-0" 
                                placeholder={`Enter your ${emailData.language} content here...`}
                                value={emailData.body} onChange={e => setEmailData({...emailData, body: e.target.value})}
                            />
                            <div className="mt-2 text-[10px] text-gray-500 font-medium flex items-center gap-2">
                                <Terminal className="w-3 h-3" />
                                Highlight Mode: {emailData.language}
                            </div>
                        </div>
                    </div>

                    {/* Attachments */}
                    <div className="card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Attachments</h3>
                            <label className="btn btn-outline py-1 px-3 text-xs cursor-pointer gap-2">
                                <Plus className="w-3 h-3" />
                                Add File
                                <input type="file" multiple className="hidden" onChange={handleFileChange} />
                            </label>
                        </div>
                        {attachments.length === 0 ? (
                            <p className="text-sm text-gray-500 text-center py-4 bg-gray-50/50 rounded-lg border border-dashed border-gray-200">
                                No files attached
                            </p>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {attachments.map((file, idx) => (
                                    <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg group">
                                        <Paperclip className="w-4 h-4 text-gray-500" />
                                        <span className="text-xs font-medium text-gray-700 max-w-[150px] truncate">{file.name}</span>
                                        <button onClick={() => removeAttachment(idx)} className="text-gray-500 hover:text-red-500 ml-2">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Controls */}
                <div className="space-y-6">
                    <div className="card p-6 sticky top-8 space-y-6">
                        <button 
                            disabled={isSending || !activeConfig}
                            onClick={() => sendSingleEmail(advanced.bulkCount)}
                            className="btn btn-primary w-full py-4 gap-3 text-lg"
                        >
                            <Send className="w-6 h-6" />
                            {isSending ? 'Sending...' : advanced.bulkCount > 1 ? `Send ${advanced.bulkCount} Emails` : 'Send Email'}
                        </button>

                        <div className="pt-4 border-t border-gray-100">
                            <button 
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                className="flex items-center justify-between w-full text-sm font-semibold text-gray-900 group"
                            >
                                <span className="flex items-center gap-2">
                                    <Settings2 className="w-4 h-4 text-gray-500 group-hover:text-blue-500 transition-colors" />
                                    Advanced Test Settings
                                </span>
                                <Plus className={`w-4 h-4 text-gray-500 transition-transform ${showAdvanced ? 'rotate-45' : ''}`} />
                            </button>

                            {showAdvanced && (
                                <div className="mt-6 space-y-6 animate-in slide-in-from-top-2 duration-200">
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex items-center justify-between mb-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase">Bulk Count</label>
                                                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{advanced.bulkCount}x</span>
                                            </div>
                                            <input 
                                                type="range" min="1" max="100" 
                                                value={advanced.bulkCount} onChange={e => setAdvanced({...advanced, bulkCount: parseInt(e.target.value)})}
                                                className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Delay (ms)</label>
                                                <input 
                                                    type="number" className="input py-1 text-sm"
                                                    value={advanced.delay} onChange={e => setAdvanced({...advanced, delay: parseInt(e.target.value)})}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Timeout (ms)</label>
                                                <input 
                                                    type="number" className="input py-1 text-sm"
                                                    value={advanced.timeout} onChange={e => setAdvanced({...advanced, timeout: parseInt(e.target.value)})}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-4 border-t border-gray-100">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-xs font-bold text-gray-500 uppercase">Custom Header Pairs</h4>
                                            <button onClick={addHeader} className="text-blue-600 hover:text-blue-700 font-bold text-[10px] uppercase">Add</button>
                                        </div>
                                        {emailData.headers.map((header, idx) => (
                                            <div key={idx} className="flex gap-1 animate-in slide-in-from-left-2 duration-200">
                                                <input 
                                                    type="text" className="input text-[10px] py-1 px-2 border-dashed" placeholder="Key"
                                                    value={header.key} onChange={e => updateHeader(idx, 'key', e.target.value)}
                                                />
                                                <input 
                                                    type="text" className="input text-[10px] py-1 px-2 border-dashed" placeholder="Value"
                                                    value={header.value} onChange={e => updateHeader(idx, 'value', e.target.value)}
                                                />
                                                <button onClick={() => removeHeader(idx)} className="text-gray-500 p-1 hover:text-red-500"><X className="w-3 h-3" /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex gap-3">
                            <Eye className="w-5 h-5 text-gray-500 shrink-0" />
                            <p className="text-[11px] text-gray-600 leading-relaxed">
                                Use the toolbar to wrap text in <strong>HTML tags</strong>. The selected "Format" dropdown helps organize your test payloads.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SendEmail;
