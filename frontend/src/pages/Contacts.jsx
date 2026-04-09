import React, { useState } from 'react';
import { Plus, Trash2, UserPlus, Users, Mail, User } from 'lucide-react';

const Contacts = ({ contacts, setContacts, showNotification }) => {
    const [newContact, setNewContact] = useState({
        name: '',
        email: ''
    });

    const addContact = () => {
        if (!newContact.email) {
            showNotification('error', 'Email is required');
            return;
        }
        const contactToAdd = { 
            id: Date.now().toString(),
            name: newContact.name || newContact.email.split('@')[0],
            email: newContact.email
        };
        setContacts([...contacts, contactToAdd]);
        setNewContact({ name: '', email: '' });
        showNotification('success', `Contact "${contactToAdd.name}" added`);
    };

    const deleteContact = (id) => {
        setContacts(contacts.filter(c => c.id !== id));
        showNotification('info', 'Contact removed');
    };

    return (
        <div className="space-y-8 pb-12">
            <header>
                <h2 className="text-3xl font-bold text-gray-900">Contact Book</h2>
                <p className="text-gray-600 mt-2">Manage your list of frequently used test recipients.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Add Contact Card */}
                <div className="card p-6 border-dashed border-2 flex flex-col justify-center gap-4 bg-gray-50/30">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Add New Contact</h3>
                    <div className="space-y-3">
                        <input 
                            type="text" className="input text-sm" placeholder="Display Name"
                            value={newContact.name} onChange={e => setNewContact({...newContact, name: e.target.value})}
                        />
                        <input 
                            type="email" className="input text-sm" placeholder="Email Address"
                            value={newContact.email} onChange={e => setNewContact({...newContact, email: e.target.value})}
                        />
                        <button onClick={addContact} className="btn btn-primary w-full py-2 gap-2 text-sm">
                            <UserPlus className="w-4 h-4" />
                            Add Contact
                        </button>
                    </div>
                </div>

                {/* Contact Cards */}
                {contacts.map(contact => (
                    <div key={contact.id} className="card p-6 flex flex-col items-center text-center group relative border-gray-100 hover:border-blue-200 transition-all">
                        <button 
                            onClick={() => deleteContact(contact.id)}
                            className="absolute top-3 right-3 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                        
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 ring-4 ring-white shadow-sm transition-transform group-hover:scale-105">
                            <User className="w-8 h-8 text-blue-500" />
                        </div>
                        
                        <h4 className="font-bold text-gray-900 truncate w-full px-2" title={contact.name}>{contact.name}</h4>
                        <div className="flex items-center gap-1.5 mt-2 text-gray-600">
                            <Mail className="w-3 h-3" />
                            <span className="text-xs truncate max-w-[150px]" title={contact.email}>{contact.email}</span>
                        </div>
                    </div>
                ))}

                {contacts.length === 0 && (
                    <div className="lg:col-span-3 flex items-center justify-center p-12 text-gray-300 italic text-sm">
                        No contacts saved yet. Add your first testing recipient!
                    </div>
                )}
            </div>
        </div>
    );
};

export default Contacts;
