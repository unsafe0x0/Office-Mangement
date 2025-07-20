import React, { useState } from 'react';

interface SidebarProps {
    userName: string;
    email: string;
    profilePicture: string;
    activeComponent: string;
    setActiveComponent: (component: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    userName,
    email,
    profilePicture,
    activeComponent,
    setActiveComponent
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'users', label: 'Users', icon: '👥' },
        { id: 'settings', label: 'Settings', icon: '⚙️' },
        { id: 'analytics', label: 'Analytics', icon: '📈' },
        { id: 'reports', label: 'Reports', icon: '📄' }
    ];

    return (
        <>
            {/* Mobile menu button */}
            <button
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-white"
                onClick={() => setIsOpen(!isOpen)}
            >
                ☰
            </button>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-800 transform transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}
            >
                <div className="flex flex-col h-full">
                    {/* User Profile Section */}
                    <div className="p-6 border-b border-gray-700">
                        <div className="flex items-center space-x-3">
                            <img
                                src={profilePicture}
                                alt="Profile"
                                className="w-12 h-12 rounded-full object-cover"
                            />
                            <div className="flex-1 min-w-0">
                                <h3 className="text-white font-medium truncate">{userName}</h3>
                                <p className="text-gray-400 text-sm truncate">{email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="flex-1 px-4 py-6 space-y-2">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveComponent(item.id);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors duration-200 ${
                                    activeComponent === item.id
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                }`}
                            >
                                <span className="mr-3 text-lg">{item.icon}</span>
                                <span className="font-medium">{item.label}</span>
                            </button>
                        ))}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-700">
                        <button className="w-full flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors duration-200">
                            <span className="mr-3 text-lg">🚪</span>
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;