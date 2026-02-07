import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useOhdaStore } from '../store/useOhdaStore';
import { 
  Users, 
  UserPlus, 
  Trash2, 
  Edit, 
  CheckCircle, 
  XCircle, 
  Shield, 
  User, 
  ArrowRight,
  Eye,
  EyeOff,
  Power,
  Key
} from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';

export const UsersManagement: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { appUsers, currentUser, addAppUser, deleteAppUser, updateAppUser } = useOhdaStore();
  
  const sortedUsers = [...appUsers].sort((a, b) => {
    if (a.username === 'admin') return -1;
    if (b.username === 'admin') return 1;
    return 0;
  });
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [confirmStatusOpen, setConfirmStatusOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());
  
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Form State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'user' | 'viewer'>('user');
  const [isActive, setIsActive] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Security Check
  useEffect(() => {
    if (currentUser?.role !== 'admin' && currentUser?.username !== 'admin') {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setRole('user');
    setIsActive(true);
    setShowPassword(false);
    setSelectedUser(null);
    setIsSubmitting(false);
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    
    setIsSubmitting(true);
    const success = await addAppUser({
        username,
        password,
        role,
        isActive
    });
    
    if (success) {
        setIsAddModalOpen(false);
        resetForm();
    } else {
        alert('Failed to add user. Username might be taken.');
    }
    setIsSubmitting(false);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !username) return; // Removed !password check for update
    
    setIsSubmitting(true);
    const updates: any = {
        username,
        role,
        isActive
    };
    
    if (password) {
        updates.password = password;
    }

    const success = await updateAppUser(selectedUser.id, updates);
    
    if (success) {
        setIsEditModalOpen(false);
        resetForm();
    } else {
        alert('Failed to update user.');
    }
    setIsSubmitting(false);
  };

  const handleDeleteClick = (user: any) => {
    setSelectedUser(user);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedUser && selectedUser.username !== 'admin') {
        await deleteAppUser(selectedUser.id);
        setConfirmDeleteOpen(false);
        setSelectedUser(null);
    }
  };

  const handleToggleStatus = (user: any) => {
    setSelectedUser(user);
    setConfirmStatusOpen(true);
  };

  const handleConfirmToggleStatus = async () => {
    if (selectedUser) {
        const success = await updateAppUser(selectedUser.id, { isActive: !selectedUser.isActive });
        if (!success) alert('Failed to update status');
        setConfirmStatusOpen(false);
        setSelectedUser(null);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
        alert(t('users.passwordsDoNotMatch'));
        return;
    }
    
    setIsSubmitting(true);
    const success = await updateAppUser(selectedUser.id, { password: newPassword });
    
    if (success) {
        setIsChangePasswordModalOpen(false);
        setNewPassword('');
        setConfirmPassword('');
        alert(t('users.passwordUpdated'));
    } else {
        alert('Failed to update password');
    }
    setIsSubmitting(false);
  };

  const openEditModal = (user: any) => {
    setSelectedUser(user);
    setUsername(user.username);
    setPassword(user.password || '');
    setRole(user.role);
    setIsActive(user.isActive);
    setIsEditModalOpen(true);
    setNewPassword('');
    setConfirmPassword('');
  };

  const togglePasswordVisibility = (userId: string) => {
    const newVisible = new Set(visiblePasswords);
    if (newVisible.has(userId)) {
        newVisible.delete(userId);
    } else {
        newVisible.add(userId);
    }
    setVisiblePasswords(newVisible);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
            <button 
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
                <ArrowRight className={`w-6 h-6 text-gray-600 ${t('dir') === 'ltr' ? 'rotate-180' : ''}`} />
            </button>
            <div>
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Users className="w-8 h-8 text-blue-600" />
                    {t('users.title')}
                </h1>
                <p className="text-gray-500 text-sm">{t('users.subtitle')}</p>
            </div>
        </div>
        
        <button
            onClick={() => { resetForm(); setIsAddModalOpen(true); }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
            <UserPlus className="w-5 h-5" />
            {t('users.add')}
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-right">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="p-4 text-sm font-semibold text-gray-600">{t('users.username')}</th>
                        <th className="p-4 text-sm font-semibold text-gray-600">{t('users.role')}</th>
                        <th className="p-4 text-sm font-semibold text-gray-600">{t('users.status')}</th>
                        <th className="p-4 text-sm font-semibold text-gray-600">{t('users.password')}</th>
                        <th className="p-4 text-sm font-semibold text-gray-600">{t('loans.actions')}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {sortedUsers.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="p-8 text-center text-gray-500">
                                لا يوجد مستخدمين مضافين (يتم استخدام المستخدمين الافتراضيين حالياً)
                            </td>
                        </tr>
                    ) : (
                        sortedUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 font-medium text-gray-800 flex items-center gap-2">
                                    <div className={`p-1.5 rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}>
                                        {user.role === 'admin' ? <Shield className="w-4 h-4" /> : <User className="w-4 h-4" />}
                                    </div>
                                    {user.username}
                                </td>
                                <td className="p-4">
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                        user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 
                                        user.role === 'viewer' ? 'bg-gray-100 text-gray-700' : 'bg-blue-100 text-blue-700'
                                    }`}>
                                        {user.role === 'admin' ? t('users.admin') : user.role === 'viewer' ? t('users.viewer') : t('users.user')}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 w-fit ${
                                        user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                        {user.isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                        {user.isActive ? t('users.active') : t('users.inactive')}
                                    </span>
                                </td>
                                <td className="p-4 font-mono text-gray-500 text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="min-w-[80px]">
                                            {visiblePasswords.has(user.id) ? user.password : '••••••••'}
                                        </span>
                                        <button 
                                            onClick={() => togglePasswordVisibility(user.id)}
                                            className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-blue-600 transition-colors"
                                            title={visiblePasswords.has(user.id) ? "إخفاء" : "إظهار"}
                                        >
                                            {visiblePasswords.has(user.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => openEditModal(user)}
                                            className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-md transition-colors"
                                            title={t('users.edit')}
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        {user.username !== 'admin' && (
                                            <>
                                                <button 
                                                    onClick={() => handleToggleStatus(user)}
                                                    className={`p-1.5 rounded-md transition-colors ${
                                                        user.isActive 
                                                            ? 'hover:bg-red-50 text-red-600' 
                                                            : 'hover:bg-green-50 text-green-600'
                                                    }`}
                                                    title={user.isActive ? t('users.disable') : t('users.enable')}
                                                >
                                                    <Power className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteClick(user)}
                                                    className="p-1.5 hover:bg-red-50 text-red-600 rounded-md transition-colors"
                                                    title={t('users.delete')}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800">
                        {isAddModalOpen ? t('users.add') : t('users.edit')}
                    </h3>
                    <button onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} className="text-gray-400 hover:text-gray-600">
                        <XCircle className="w-5 h-5" />
                    </button>
                </div>
                
                <form onSubmit={isAddModalOpen ? handleAddUser : handleUpdateUser} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('users.username')}</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className={`w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                isEditModalOpen && selectedUser?.username === 'admin' ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''
                            }`}
                            required
                            disabled={isEditModalOpen && selectedUser?.username === 'admin'}
                        />
                    </div>
                    
                    {isEditModalOpen && selectedUser?.username === 'admin' ? (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('users.password')}</label>
                            <div className="flex gap-2">
                                <input 
                                    type="password" 
                                    value="********" 
                                    disabled 
                                    className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed" 
                                />
                                <button
                                    type="button"
                                    onClick={() => setIsChangePasswordModalOpen(true)}
                                    className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2 whitespace-nowrap"
                                >
                                    <Key className="w-4 h-4" />
                                    {t('users.changePassword')}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('users.password')}</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder={isEditModalOpen ? t('users.leaveBlankToKeepSame') : ''}
                                    required={!isEditModalOpen}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('users.role')}</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value as 'admin' | 'user' | 'viewer')}
                            className={`w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                isEditModalOpen && selectedUser?.username === 'admin' ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''
                            }`}
                            disabled={isEditModalOpen && selectedUser?.username === 'admin'}
                        >
                            <option value="user">{t('users.user')}</option>
                            <option value="viewer">{t('users.viewer')}</option>
                            <option value="admin">{t('users.admin')}</option>
                        </select>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                            type="button"
                            onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
                            className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                        >
                            {t('users.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isSubmitting ? '...' : t('users.save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {isChangePasswordModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800">
                        {t('users.changePassword')}
                    </h3>
                    <button onClick={() => setIsChangePasswordModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                        <XCircle className="w-5 h-5" />
                    </button>
                </div>
                
                <form onSubmit={handleChangePassword} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('users.newPassword')}</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('users.confirmNewPassword')}</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                            type="button"
                            onClick={() => setIsChangePasswordModalOpen(false)}
                            className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                        >
                            {t('users.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isSubmitting ? '...' : t('users.updatePassword')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title={t('users.delete')}
        message={t('users.confirmDelete')}
        variant="danger"
        showFileUpload={false}
      />

      <ConfirmModal
        isOpen={confirmStatusOpen}
        onClose={() => setConfirmStatusOpen(false)}
        onConfirm={handleConfirmToggleStatus}
        title={selectedUser?.isActive ? t('users.disable') : t('users.enable')}
        message={selectedUser?.isActive ? t('users.confirmDisable') : t('users.confirmEnable')}
        variant={selectedUser?.isActive ? "danger" : "success"}
        showFileUpload={false}
      />
    </div>
  );
};
