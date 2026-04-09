import React, { useState } from 'react';
import { Plus, Trash2, Save, FileText, ChevronRight, Copy } from 'lucide-react';

const Templates = ({ templates, setTemplates, showNotification }) => {
    const [newTemplate, setNewTemplate] = useState({
        name: '',
        subject: '',
        body: ''
    });

    const addTemplate = () => {
        if (!newTemplate.name || !newTemplate.body) {
            showNotification('error', 'Template name and body are required');
            return;
        }
        const templateToAdd = { ...newTemplate, id: Date.now().toString() };
        setTemplates([...templates, templateToAdd]);
        setNewTemplate({ name: '', subject: '', body: '' });
        showNotification('success', `Template "${templateToAdd.name}" saved`);
    };

    const deleteTemplate = (id) => {
        const updatedTemplates = templates.filter(t => t.id !== id);
        setTemplates(updatedTemplates);
        showNotification('info', 'Template deleted');
    };

    return (
        <div className="space-y-8 pb-12">
            <header>
                <h2 className="text-3xl font-bold text-gray-900">Email Templates</h2>
                <p className="text-gray-600 mt-2">Create and manage reusable email drafts for standard tests.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Create Template */}
                <div className="card p-6 space-y-4 h-fit sticky top-8">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Create New Template</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Template Name</label>
                        <input 
                            type="text" className="input" placeholder="e.g., HTML Welcome Email"
                            value={newTemplate.name} onChange={e => setNewTemplate({...newTemplate, name: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Default Subject</label>
                        <input 
                            type="text" className="input" placeholder="Test Email {timestamp}"
                            value={newTemplate.subject} onChange={e => setNewTemplate({...newTemplate, subject: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Body</label>
                        <textarea 
                            className="input min-h-[200px] font-mono text-sm leading-relaxed" 
                            placeholder="Hello, this is a test email..."
                            value={newTemplate.body} onChange={e => setNewTemplate({...newTemplate, body: e.target.value})}
                        />
                    </div>
                    <button onClick={addTemplate} className="btn btn-primary w-full py-3 gap-2">
                        <Save className="w-5 h-5" />
                        Save Template
                    </button>
                </div>

                {/* Templates List */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Your Templates ({templates.length})</h3>
                    {templates.length === 0 ? (
                        <div className="card p-12 text-center text-gray-500">
                            <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <p>No templates saved yet.</p>
                        </div>
                    ) : (
                        templates.map(template => (
                            <div key={template.id} className="card p-6 group hover:border-blue-200 transition-all">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <FileText className="w-4 h-4 text-blue-500" />
                                            <h4 className="font-bold text-gray-900">{template.name}</h4>
                                        </div>
                                        <p className="text-xs text-gray-600 italic mb-3">Subject: {template.subject || '(None)'}</p>
                                        <div className="bg-gray-50 rounded-lg p-3 text-[11px] text-gray-600 font-mono whitespace-pre-wrap line-clamp-3">
                                            {template.body}
                                        </div>
                                    </div>
                                    <button onClick={() => deleteTemplate(template.id)} className="text-gray-300 hover:text-red-500 p-2">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Templates;
