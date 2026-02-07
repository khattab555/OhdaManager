import React, { useState, useEffect } from 'react';
import { useOhdaStore } from '../store/useOhdaStore';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  Trash2, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight,
  Database,
  FileText,
  Bell,
  Archive,
  Wallet,
  CheckSquare,
  Square,
  History,
  File,
  HardDrive,
  Key,
  Copy,
  Check,
  Globe,
  Lock,
  ChevronDown,
  ChevronUp,
  FolderOpen,
  Settings,
  Power,
  Download,
  FileSpreadsheet,
  FileJson
} from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';
import * as XLSX from 'xlsx';

type ResetCategory = 'activeLoans' | 'resetBalance' | 'archive' | 'logs' | 'notifications' | 'fundHistory' | 'storage' | 'api' | 'supabase' | 'system' | 'exportData' | null;

export const SystemReset: React.FC = () => {
  const { 
    currentUser, 
    loans, 
    archivedLoans, 
    logs, 
    notifications, 
    fundHistory, // Added
    totalFund, 
    remainingFund,
    deleteLoansBulk,
    deleteLogsBulk,
    deleteNotificationsBulk,
    deleteFundHistoryBulk, // Added
    resetFundToTotal,
    clearStorage, // Added
    wipeSystem, // Added
    fetchSystemStats, // Added
    systemStats, // Added
    maintenanceMode, // Added
    toggleMaintenanceMode // Added
  } = useOhdaStore();
  
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [selectedCategory, setSelectedCategory] = useState<ResetCategory>('storage');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null); // Added
  const [storageDeleteMode, setStorageDeleteMode] = useState<'filesOnly' | 'fullWipe'>('filesOnly'); // Added
  const [showStorageOptions, setShowStorageOptions] = useState(false); // Added
  const [isRecordsOpen, setIsRecordsOpen] = useState(false); // Added

  useEffect(() => {
    fetchSystemStats();
  }, []);

  // Security check
  if (currentUser?.role !== 'admin' && currentUser?.username !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800">Access Denied</h1>
        <p className="text-gray-600 mt-2">This page is restricted to administrators only.</p>
        <button 
          onClick={() => navigate('/')}
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Return Home
        </button>
      </div>
    );
  }

  const handleCategorySelect = (category: ResetCategory) => {
    setSelectedCategory(category);
    setSelectedIds(new Set());
    setSuccessMessage(null);
    setShowStorageOptions(false); // Reset
  };

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (!selectedCategory) return;
    
    let allIds: string[] = [];
    if (selectedCategory === 'activeLoans') allIds = loans.map(l => l.id);
    if (selectedCategory === 'archive') allIds = archivedLoans.map(l => l.id);
    if (selectedCategory === 'logs') allIds = logs.map(l => l.id);
    if (selectedCategory === 'notifications') allIds = notifications.map(n => n.id);
    if (selectedCategory === 'fundHistory') allIds = fundHistory.map(f => f.id); // Added

    if (selectedIds.size === allIds.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(allIds));
    }
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;

    if (selectedCategory === 'resetBalance') {
        await resetFundToTotal();
        setSuccessMessage(t('resetSystem.successReset'));
    } else if (selectedCategory === 'storage') {
        if (storageDeleteMode === 'filesOnly') {
            await clearStorage();
            setSuccessMessage(t('resetSystem.successClearStorage'));
        } else {
            await wipeSystem();
            setSuccessMessage(t('resetSystem.successWipe'));
        }
    } else {
        const ids = Array.from(selectedIds);
        if (ids.length === 0) return;

        if (selectedCategory === 'activeLoans') await deleteLoansBulk(ids); // Reusing logic for active
        if (selectedCategory === 'archive') await deleteLoansBulk(ids); // Reusing logic for archive (same table)
        if (selectedCategory === 'logs') await deleteLogsBulk(ids);
        if (selectedCategory === 'notifications') await deleteNotificationsBulk(ids);
        if (selectedCategory === 'fundHistory') await deleteFundHistoryBulk(ids); // Added
        
        setSuccessMessage(t('resetSystem.successDelete'));
        setSelectedIds(new Set());
    }
    setConfirmModalOpen(false);
    setShowStorageOptions(false); // Reset after action
    
    // Clear success message after 3 seconds
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleExport = (type: 'json' | 'excel') => {
    const exportData = {
      loans,
      archivedLoans,
      logs,
      notifications,
      fundHistory,
      systemStats
    };

    const timestamp = new Date().toISOString().split('T')[0];

    if (type === 'json') {
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `ohda_backup_${timestamp}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } else {
      // Excel Export
      const wb = XLSX.utils.book_new();
      
      // Loans Sheet
      if (loans.length > 0) {
        const loansWs = XLSX.utils.json_to_sheet(loans);
        XLSX.utils.book_append_sheet(wb, loansWs, "Active Loans");
      }
      
      // Archive Sheet
      if (archivedLoans.length > 0) {
        const archiveWs = XLSX.utils.json_to_sheet(archivedLoans);
        XLSX.utils.book_append_sheet(wb, archiveWs, "Archive");
      }
      
      // Fund History
      if (fundHistory.length > 0) {
        const fundWs = XLSX.utils.json_to_sheet(fundHistory);
        XLSX.utils.book_append_sheet(wb, fundWs, "Fund History");
      }

      // Logs
      if (logs.length > 0) {
        const logsWs = XLSX.utils.json_to_sheet(logs);
        XLSX.utils.book_append_sheet(wb, logsWs, "Logs");
      }

      XLSX.writeFile(wb, `ohda_backup_${timestamp}.xlsx`);
    }
  };

  const renderContent = () => {
    if (!selectedCategory) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <Database className="w-16 h-16 mb-4 opacity-20" />
          <p>{t('resetSystem.selectCategory')}</p>
        </div>
      );
    }

    if (selectedCategory === 'resetBalance') {
        const usagePercentage = Math.round(((totalFund - remainingFund) / totalFund) * 100);
        
        return (
            <div className="h-full w-full flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white relative flex-shrink-0">
                    <div className="absolute top-0 right-0 p-2 opacity-10">
                        <RotateCcw className="w-24 h-24 transform -rotate-12" />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm shadow-inner border border-white/10">
                            <RotateCcw className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold tracking-tight">{t('resetSystem.resetBalance')}</h3>
                            <p className="text-blue-100 text-sm mt-1 font-medium opacity-90">{t('resetSystem.currentBalance')}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Total Fund Card */}
                        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 flex flex-col items-center justify-center text-center group hover:shadow-md transition-all">
                            <div className="p-3 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                                <Wallet className="w-6 h-6 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-500 mb-1">{t('resetSystem.totalFund')}</span>
                            <span className="text-2xl font-bold text-gray-800">{totalFund.toLocaleString()}</span>
                        </div>

                        {/* Remaining Fund Card */}
                        <div className={`rounded-2xl p-6 border flex flex-col items-center justify-center text-center group hover:shadow-md transition-all ${
                            remainingFund < 0 ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'
                        }`}>
                            <div className="p-3 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                                <Database className={`w-6 h-6 ${remainingFund < 0 ? 'text-red-600' : 'text-emerald-600'}`} />
                            </div>
                            <span className="text-sm font-medium text-gray-500 mb-1">{t('balance.remaining')}</span>
                            <span className={`text-2xl font-bold ${remainingFund < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                                {remainingFund.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    {/* Usage Bar */}
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                        <div className="flex justify-between items-center mb-3">
                            <span className="font-bold text-gray-700 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-gray-400" />
                                {t('balance.used')}
                            </span>
                            <span className="text-sm font-mono bg-white px-3 py-1 rounded-lg border border-gray-200 text-gray-600 font-bold shadow-sm">{usagePercentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                            <div 
                                className={`h-full rounded-full transition-all duration-1000 ease-out shadow-sm ${
                                    usagePercentage > 90 ? 'bg-red-500' : usagePercentage > 75 ? 'bg-orange-500' : 'bg-emerald-500'
                                }`}
                                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-center pt-4">
                        <button
                            onClick={() => setConfirmModalOpen(true)}
                            className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-xl font-bold flex items-center justify-center gap-3 transition-all hover:shadow-lg active:scale-95 shadow-red-200 group text-base"
                        >
                            <RotateCcw className="w-5 h-5 group-hover:-rotate-180 transition-transform duration-500" />
                            {t('resetSystem.resetFundBtn')}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (selectedCategory === 'storage') {
        return (
            <div className="h-full w-full flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-6 text-white relative flex-shrink-0">
                    <div className="absolute top-0 right-0 p-2 opacity-10">
                        <HardDrive className="w-24 h-24 transform rotate-12" />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm shadow-inner border border-white/10">
                            <HardDrive className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold tracking-tight">{t('resetSystem.storageTitle')}</h3>
                            <p className="text-orange-100 text-sm mt-1 font-medium opacity-90">{t('resetSystem.storageDesc')}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
                    {/* Storage Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Database Stats */}
                        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 hover:border-blue-200 transition-all group">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-xl">
                                        <Database className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <span className="font-bold text-gray-700">{t('resetSystem.dbSize')}</span>
                                </div>
                                <span className="text-xs font-mono bg-white px-2 py-1 rounded-lg border border-gray-200 text-gray-500">500MB Limit</span>
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <span className="text-2xl font-bold text-gray-800">{systemStats?.dbSize || '...'}</span>
                                    <span className="text-xs text-gray-500 mb-1">{Math.round(((systemStats?.dbBytes || 0) / (500 * 1024 * 1024)) * 100)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                    <div 
                                        className="bg-blue-500 h-full rounded-full transition-all duration-1000 ease-out" 
                                        style={{ width: `${Math.min(((systemStats?.dbBytes || 0) / (500 * 1024 * 1024)) * 100, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        {/* Files Stats */}
                        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 hover:border-orange-200 transition-all group">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-orange-100 rounded-xl">
                                        <File className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <span className="font-bold text-gray-700">{t('resetSystem.filesSize')}</span>
                                </div>
                                <span className="text-xs font-mono bg-white px-2 py-1 rounded-lg border border-gray-200 text-gray-500">1GB Limit</span>
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <span className="text-2xl font-bold text-gray-800">{systemStats?.storageSize || '...'}</span>
                                    <span className="text-xs text-gray-500 mb-1">{Math.round(((systemStats?.storageBytes || 0) / (1024 * 1024 * 1024)) * 100)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                    <div 
                                        className="bg-orange-500 h-full rounded-full transition-all duration-1000 ease-out" 
                                        style={{ width: `${Math.min(((systemStats?.storageBytes || 0) / (1024 * 1024 * 1024)) * 100, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-4 pt-4 border-t border-gray-100 w-full transition-all duration-300">
                        {!showStorageOptions ? (
                            <div className="flex justify-center w-full">
                                <button
                                    onClick={() => setShowStorageOptions(true)}
                                    className="px-8 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl border border-gray-200 font-bold flex items-center justify-center gap-2 transition-all hover:shadow-sm text-base"
                                >
                                    <Trash2 className="w-5 h-5 text-gray-500" />
                                    {t('resetSystem.startDeletion')}
                                </button>
                            </div>
                        ) : (
                            <div className="w-full space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                {/* Delete Mode Selection */}
                                <div className="bg-white p-4 rounded-2xl border border-gray-200 w-full shadow-sm">
                                    <label className="block text-sm font-bold text-gray-700 mb-3 text-right">{t('resetSystem.deleteMode')}</label>
                                    <div className="flex flex-col gap-3">
                                        <div 
                                            onClick={() => setStorageDeleteMode('filesOnly')}
                                            className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${storageDeleteMode === 'filesOnly' ? 'bg-orange-50 border-orange-200 ring-1 ring-orange-300' : 'hover:bg-gray-50 border-gray-200'}`}
                                        >
                                            <div className={`mt-1 w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${storageDeleteMode === 'filesOnly' ? 'border-orange-500' : 'border-gray-300'}`}>
                                                {storageDeleteMode === 'filesOnly' && <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />}
                                            </div>
                                            <div className="text-right flex-1">
                                                <span className="font-bold text-base text-gray-800 block">{t('resetSystem.deleteFilesOnly')}</span>
                                                <span className="text-xs text-gray-500">{t('resetSystem.storageDesc')}</span>
                                            </div>
                                        </div>

                                        <div 
                                            onClick={() => setStorageDeleteMode('fullWipe')}
                                            className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${storageDeleteMode === 'fullWipe' ? 'bg-red-50 border-red-200 ring-1 ring-red-300' : 'hover:bg-gray-50 border-gray-200'}`}
                                        >
                                            <div className={`mt-1 w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${storageDeleteMode === 'fullWipe' ? 'border-red-500' : 'border-gray-300'}`}>
                                                {storageDeleteMode === 'fullWipe' && <div className="w-2.5 h-2.5 rounded-full bg-red-500" />}
                                            </div>
                                            <div className="text-right flex-1">
                                                <span className="font-bold text-base text-red-800 block">{t('resetSystem.deleteFullSystem')}</span>
                                                <span className="text-xs text-red-600 font-medium">{t('resetSystem.deleteFullSystemDesc')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-center w-full gap-4 mt-4">
                                    <button 
                                        onClick={() => setShowStorageOptions(false)}
                                        className="px-6 py-3 text-gray-500 hover:bg-gray-100 rounded-xl font-medium text-base transition-colors"
                                    >
                                        {t('common.cancel')}
                                    </button>
                                    
                                    <button
                                        onClick={() => setConfirmModalOpen(true)}
                                        className={`px-8 py-3 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:shadow-md active:scale-95 text-base whitespace-nowrap ${
                                            storageDeleteMode === 'fullWipe' 
                                            ? 'bg-red-600 hover:bg-red-700 shadow-red-200' 
                                            : 'bg-orange-500 hover:bg-orange-600 shadow-orange-200'
                                        }`}
                                    >
                                        <Trash2 className="w-5 h-5" />
                                        {t('resetSystem.clearStorageBtn')}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (selectedCategory === 'system') {
        return (
            <div className="h-full w-full flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-6 text-white relative overflow-hidden flex-shrink-0">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Settings className="w-32 h-32 transform rotate-12" />
                    </div>
                    <div className="flex items-center gap-5 relative z-10">
                        <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm shadow-inner border border-white/10">
                            <Settings className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold tracking-tight">{t('resetSystem.systemSettings')}</h3>
                            <p className="text-slate-300 text-sm mt-1 font-medium opacity-90">{t('resetSystem.systemDesc')}</p>
                        </div>
                    </div>
                </div>

                <div className="p-8 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
                    {/* Maintenance Mode Card */}
                    <div className={`rounded-2xl border p-6 transition-all duration-300 ${maintenanceMode ? 'bg-red-50 border-red-200 shadow-md' : 'bg-white border-gray-200 shadow-sm hover:shadow-md'}`}>
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`p-2 rounded-xl ${maintenanceMode ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                                        <Power className="w-6 h-6" />
                                    </div>
                                    <h4 className={`text-lg font-bold ${maintenanceMode ? 'text-red-800' : 'text-gray-800'}`}>
                                        {t('resetSystem.maintenanceMode')}
                                    </h4>
                                </div>
                                <p className={`text-sm leading-relaxed ${maintenanceMode ? 'text-red-700' : 'text-gray-500'}`}>
                                    {t('resetSystem.maintenanceModeDesc')}
                                </p>
                            </div>
                            
                            <div className="flex flex-col items-center gap-2">
                                <button
                                    onClick={() => toggleMaintenanceMode(!maintenanceMode)}
                                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                        maintenanceMode ? 'bg-red-600 focus:ring-red-500' : 'bg-gray-200 focus:ring-gray-400'
                                    }`}
                                >
                                    <span
                                        className={`${
                                            maintenanceMode ? 'translate-x-1' : 'translate-x-7'
                                        } inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-sm`}
                                    />
                                </button>
                                <span className={`text-xs font-bold ${maintenanceMode ? 'text-red-600' : 'text-gray-400'}`}>
                                    {maintenanceMode ? t('resetSystem.maintenanceActive') : t('resetSystem.maintenanceInactive')}
                                </span>
                            </div>
                        </div>
                        
                        {maintenanceMode && (
                            <div className="mt-4 p-3 bg-red-100/50 rounded-xl border border-red-100 flex items-start gap-3 animate-in fade-in slide-in-from-top-1">
                                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-red-700 font-medium">
                                    {t('resetSystem.maintenanceModeDesc')}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (selectedCategory === 'api') {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

        return (
            <div className="h-full w-full flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6 text-white relative overflow-hidden flex-shrink-0">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Key className="w-32 h-32 transform rotate-12" />
                    </div>
                    <div className="flex items-center gap-5 relative z-10">
                        <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm shadow-inner border border-white/10">
                            <Key className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold tracking-tight">{t('resetSystem.apiTitle')}</h3>
                            <p className="text-indigo-100 text-sm mt-1 font-medium opacity-90">{t('resetSystem.apiDesc')}</p>
                        </div>
                    </div>
                </div>

                <div className="p-8 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
                    {/* Project URL */}
                    <div className="group">
                        <label className="block text-sm font-bold text-gray-700 mb-3 ml-1 flex items-center gap-2">
                            <Globe className="w-4 h-4 text-blue-500" />
                            {t('resetSystem.projectUrl')}
                        </label>
                        <div className="relative">
                            <div className="w-full p-4 pl-14 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono text-gray-600 transition-all group-hover:border-indigo-300 group-hover:bg-white group-hover:shadow-md flex items-center">
                                <span className="truncate w-full">{supabaseUrl}</span>
                            </div>
                            <div className="absolute left-2 top-1/2 -translate-y-1/2">
                                <button 
                                    onClick={() => handleCopy(supabaseUrl, 'url')}
                                    className={`p-2 rounded-lg transition-all shadow-sm border ${
                                        copiedField === 'url' 
                                        ? 'bg-green-100 text-green-700 border-green-200' 
                                        : 'bg-white text-gray-500 hover:text-indigo-600 border-gray-200 hover:border-indigo-200'
                                    }`}
                                    title={t('resetSystem.copy')}
                                >
                                    {copiedField === 'url' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Anon Key */}
                    <div className="group">
                        <label className="block text-sm font-bold text-gray-700 mb-3 ml-1 flex items-center gap-2">
                            <Lock className="w-4 h-4 text-orange-500" />
                            {t('resetSystem.anonKey')}
                        </label>
                        <div className="relative">
                            <div className="w-full p-6 pl-16 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-green-400 leading-relaxed break-all shadow-inner relative transition-all group-hover:shadow-lg group-hover:border-slate-700">
                                {supabaseAnonKey}
                            </div>
                            <div className="absolute left-3 top-3">
                                <button 
                                    onClick={() => handleCopy(supabaseAnonKey, 'key')}
                                    className={`p-2 rounded-lg transition-all shadow-lg border ${
                                        copiedField === 'key' 
                                        ? 'bg-green-500/20 text-green-400 border-green-500/50' 
                                        : 'bg-slate-800 text-slate-400 hover:text-white border-slate-700 hover:bg-slate-700'
                                    }`}
                                    title={t('resetSystem.copy')}
                                >
                                    {copiedField === 'key' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (selectedCategory === 'supabase') {
        return (
            <div className="h-full w-full flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white relative overflow-hidden flex-shrink-0">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Database className="w-32 h-32 transform -rotate-12" />
                    </div>
                    <div className="flex items-center gap-5 relative z-10">
                        <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm shadow-inner border border-white/10">
                            <Database className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold tracking-tight">{t('resetSystem.supabaseAccount')}</h3>
                            <p className="text-emerald-100 text-sm mt-1 font-medium opacity-90">{t('resetSystem.supabaseDesc')}</p>
                        </div>
                    </div>
                </div>

                <div className="p-8 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
                    {/* Email */}
                    <div className="group">
                        <label className="block text-sm font-bold text-gray-700 mb-3 ml-1 flex items-center gap-2">
                            <Globe className="w-4 h-4 text-emerald-500" />
                            {t('resetSystem.email')}
                        </label>
                        <div className="relative">
                            <div className="w-full p-4 pl-14 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono text-gray-600 transition-all group-hover:border-emerald-300 group-hover:bg-white group-hover:shadow-md flex items-center">
                                <span className="truncate w-full">mohamadkhattab55@gmail.com</span>
                            </div>
                            <div className="absolute left-2 top-1/2 -translate-y-1/2">
                                <button 
                                    onClick={() => handleCopy('mohamadkhattab55@gmail.com', 'email')}
                                    className={`p-2 rounded-lg transition-all shadow-sm border ${
                                        copiedField === 'email' 
                                        ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                                        : 'bg-white text-gray-500 hover:text-emerald-600 border-gray-200 hover:border-emerald-200'
                                    }`}
                                    title={t('resetSystem.copy')}
                                >
                                    {copiedField === 'email' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Password */}
                    <div className="group">
                        <label className="block text-sm font-bold text-gray-700 mb-3 ml-1 flex items-center gap-2">
                            <Lock className="w-4 h-4 text-rose-500" />
                            {t('resetSystem.password')}
                        </label>
                        <div className="relative">
                            <div className="w-full p-4 pl-14 bg-slate-900 border border-slate-800 rounded-xl text-sm font-mono text-emerald-400 shadow-inner relative transition-all group-hover:shadow-lg group-hover:border-slate-700 flex items-center">
                                <span className="truncate w-full">Asdzxc54321@</span>
                            </div>
                            <div className="absolute left-2 top-1/2 -translate-y-1/2">
                                <button 
                                    onClick={() => handleCopy('Asdzxc54321@', 'password')}
                                    className={`p-2 rounded-lg transition-all shadow-lg border ${
                                        copiedField === 'password' 
                                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' 
                                        : 'bg-slate-800 text-slate-400 hover:text-white border-slate-700 hover:bg-slate-700'
                                    }`}
                                    title={t('resetSystem.copy')}
                                >
                                    {copiedField === 'password' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Subscription */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3 ml-1 flex items-center gap-2">
                            <Wallet className="w-4 h-4 text-purple-500" />
                            {t('resetSystem.subscription')}
                        </label>
                        <div className="w-full p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl text-sm font-bold text-emerald-800 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                {t('resetSystem.freePlan')}
                            </div>
                            <span className="bg-white px-3 py-1 rounded-full text-xs border border-emerald-100 text-emerald-600 font-normal">Active</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (selectedCategory === 'exportData') {
        return (
            <div className="h-full w-full flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-600 to-green-700 p-6 text-white relative overflow-hidden flex-shrink-0">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Download className="w-32 h-32 transform -rotate-12" />
                    </div>
                    <div className="flex items-center gap-5 relative z-10">
                        <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm shadow-inner border border-white/10">
                            <Download className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold tracking-tight">{t('resetSystem.exportTitle')}</h3>
                            <p className="text-emerald-100 text-sm mt-1 font-medium opacity-90">{t('resetSystem.exportDesc')}</p>
                        </div>
                    </div>
                </div>

                <div className="p-8 flex-1 overflow-y-auto custom-scrollbar flex items-center justify-center">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
                        {/* Excel Export */}
                        <button
                            onClick={() => handleExport('excel')}
                            className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-sm hover:shadow-lg transition-all group flex flex-col items-center justify-center gap-4 hover:-translate-y-1 duration-300"
                        >
                            <div className="p-4 bg-emerald-50 rounded-2xl group-hover:bg-emerald-100 transition-colors">
                                <FileSpreadsheet className="w-12 h-12 text-emerald-600" />
                            </div>
                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-bold text-gray-800">{t('resetSystem.exportExcel')}</h3>
                                <p className="text-gray-500 text-sm">.xlsx format</p>
                            </div>
                        </button>

                        {/* JSON Export */}
                        <button
                            onClick={() => handleExport('json')}
                            className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all group flex flex-col items-center justify-center gap-4 hover:-translate-y-1 duration-300"
                        >
                            <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-gray-100 transition-colors">
                                <FileJson className="w-12 h-12 text-gray-600" />
                            </div>
                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-bold text-gray-800">{t('resetSystem.exportJson')}</h3>
                                <p className="text-gray-500 text-sm">.json format</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // List View for other categories
    let data: any[] = [];
    let titleKey = '';
    let renderItem = (item: any) => <></>;

    if (selectedCategory === 'activeLoans') {
        data = loans;
        titleKey = 'resetSystem.activeLoans';
        renderItem = (item) => (
            <div className="flex justify-between items-center w-full">
                <div className="flex flex-col">
                    <span className="font-bold text-gray-800">{item.employeeName}</span>
                    <span className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString('ar-AE')}</span>
                </div>
                <span className="font-bold text-blue-600">{item.amount.toLocaleString()}</span>
            </div>
        );
    } else if (selectedCategory === 'archive') {
        data = archivedLoans;
        titleKey = 'resetSystem.archive';
        renderItem = (item) => (
            <div className="flex justify-between items-center w-full">
                <div className="flex flex-col">
                    <span className="font-bold text-gray-800">{item.employeeName}</span>
                    <span className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString('ar-AE')}</span>
                </div>
                <span className="font-bold text-gray-600">{item.amount.toLocaleString()}</span>
            </div>
        );
    } else if (selectedCategory === 'logs') {
        data = logs;
        titleKey = 'resetSystem.logs';
        renderItem = (item) => (
            <div className="flex flex-col w-full">
                <span className="text-sm text-gray-800 mb-1">{item.action}</span>
                <div className="flex justify-between text-xs text-gray-500">
                    <span>{item.username}</span>
                    <span>{new Date(item.timestamp).toLocaleString('ar-AE')}</span>
                </div>
            </div>
        );
    } else if (selectedCategory === 'notifications') {
        data = notifications;
        titleKey = 'resetSystem.notifications';
        renderItem = (item) => (
            <div className="flex flex-col w-full">
                <span className="text-sm text-gray-800 mb-1">{item.message}</span>
                <span className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleString('ar-AE')}</span>
            </div>
        );
    } else if (selectedCategory === 'fundHistory') {
        data = fundHistory;
        titleKey = 'resetSystem.fundHistory';
        renderItem = (item) => (
            <div className="flex justify-between items-center w-full">
                <div className="flex flex-col">
                    <span className="font-bold text-gray-800">{item.amount.toLocaleString()} د.إ</span>
                    <span className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString('ar-AE')}</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                        item.status === 'approved' ? 'bg-green-100 text-green-700' : 
                        item.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                        'bg-yellow-100 text-yellow-700'
                    }`}>
                        {item.status === 'approved' ? t('actions.confirm') : 
                         item.status === 'rejected' ? t('actions.cancel') : 
                         t('loanDetails.pending')}
                    </span>
                    <span className="text-xs text-gray-400 mt-1">{item.requestedBy}</span>
                </div>
            </div>
        );
    }

    const allSelected = data.length > 0 && selectedIds.size === data.length;

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <div className="flex items-center gap-2">
                    <button 
                        onClick={toggleSelectAll}
                        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                        disabled={data.length === 0}
                    >
                        {allSelected ? <CheckSquare className="w-5 h-5 text-blue-600" /> : <Square className="w-5 h-5" />}
                        <span className="text-sm font-medium">{t('resetSystem.deleteAll')} ({data.length})</span>
                    </button>
                </div>
                {selectedIds.size > 0 && (
                    <button 
                        onClick={() => setConfirmModalOpen(true)}
                        className="bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors flex items-center gap-2"
                    >
                        <Trash2 className="w-4 h-4" />
                        {t('resetSystem.deleteSelected')} ({selectedIds.size})
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {data.length === 0 ? (
                    <div className="text-center text-gray-500 py-12">
                        {t('resetSystem.noRecords')}
                    </div>
                ) : (
                    <div className="space-y-2">
                        {data.map((item) => (
                            <div 
                                key={item.id} 
                                onClick={() => toggleSelection(item.id)}
                                className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all ${
                                    selectedIds.has(item.id) 
                                        ? 'bg-blue-50 border-blue-200 shadow-sm' 
                                        : 'bg-white border-gray-100 hover:border-blue-100 hover:bg-gray-50'
                                }`}
                            >
                                <div className={`flex-shrink-0 ${selectedIds.has(item.id) ? 'text-blue-600' : 'text-gray-300'}`}>
                                    {selectedIds.has(item.id) ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                                </div>
                                {renderItem(item)}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-[95%] h-[calc(100vh-80px)]">
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <button 
                    onClick={() => navigate('/')}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowRight className={`w-6 h-6 text-gray-600 ${t('dir') === 'ltr' ? 'rotate-180' : ''}`} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <AlertTriangle className="w-8 h-8 text-red-600" />
                        {t('resetSystem.title')}
                    </h1>
                    <p className="text-gray-500 text-sm">{t('resetSystem.subtitle')}</p>
                </div>
            </div>
        </div>

        {successMessage && (
            <div className="mb-6 bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                <CheckCircle className="w-5 h-5" />
                {successMessage}
            </div>
        )}

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col md:flex-row h-full">
            {/* Sidebar */}
            <div className="w-full md:w-64 bg-gray-50 border-l border-gray-200 flex-shrink-0 overflow-y-auto">
                <div className="p-4 space-y-2">
                    <button
                        onClick={() => handleCategorySelect('storage')}
                        className={`w-full text-right px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${selectedCategory === 'storage' ? 'bg-white shadow-sm text-blue-700 border border-blue-100 font-bold' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <HardDrive className="w-5 h-5" />
                        {t('resetSystem.storage')}
                    </button>

                    <button
                        onClick={() => handleCategorySelect('resetBalance')}
                        className={`w-full text-right px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${selectedCategory === 'resetBalance' ? 'bg-white shadow-sm text-blue-700 border border-blue-100 font-bold' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <RotateCcw className="w-5 h-5" />
                        {t('resetSystem.resetBalance')}
                    </button>

                    <button
                        onClick={() => handleCategorySelect('supabase')}
                        className={`w-full text-right px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${selectedCategory === 'supabase' ? 'bg-white shadow-sm text-blue-700 border border-blue-100 font-bold' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <Database className="w-5 h-5" />
                        {t('resetSystem.supabaseAccount')}
                    </button>

                    <button
                        onClick={() => handleCategorySelect('api')}
                        className={`w-full text-right px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${selectedCategory === 'api' ? 'bg-white shadow-sm text-blue-700 border border-blue-100 font-bold' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <Key className="w-5 h-5" />
                        {t('resetSystem.api')}
                    </button>

                    <button
                        onClick={() => handleCategorySelect('system')}
                        className={`w-full text-right px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${selectedCategory === 'system' ? 'bg-white shadow-sm text-blue-700 border border-blue-100 font-bold' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <Settings className="w-5 h-5" />
                        {t('resetSystem.systemSettings')}
                    </button>

                    <button
                        onClick={() => handleCategorySelect('exportData')}
                        className={`w-full text-right px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${selectedCategory === 'exportData' ? 'bg-white shadow-sm text-blue-700 border border-blue-100 font-bold' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <Download className="w-5 h-5" />
                        {t('resetSystem.exportData')}
                    </button>

                    {/* System Records Group */}
                    <div className="space-y-1 pt-2 border-t border-gray-200">
                        <button
                            onClick={() => setIsRecordsOpen(!isRecordsOpen)}
                            className="w-full text-right px-4 py-3 rounded-lg flex items-center justify-between gap-3 text-gray-600 hover:bg-gray-100 transition-all bg-gray-100/50"
                        >
                            <div className="flex items-center gap-3">
                                <FolderOpen className="w-5 h-5 text-gray-500" />
                                <span>{t('resetSystem.systemRecords')}</span>
                            </div>
                            {isRecordsOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                        </button>

                        {isRecordsOpen && (
                            <div className={`space-y-1 ${t('dir') === 'ltr' ? 'pl-4 border-l-2' : 'pr-4 border-r-2'} border-gray-100 mr-2 ml-2 transition-all duration-300`}>
                                <button
                                    onClick={() => handleCategorySelect('activeLoans')}
                                    className={`w-full text-right px-3 py-2.5 rounded-lg flex items-center gap-3 transition-all text-sm ${selectedCategory === 'activeLoans' ? 'bg-white shadow-sm text-blue-700 border border-blue-100 font-bold' : 'text-gray-600 hover:bg-gray-100'}`}
                                >
                                    <Wallet className="w-4 h-4" />
                                    {t('resetSystem.activeLoans')}
                                    <span className="mr-auto bg-gray-200 text-gray-600 text-[10px] px-2 py-0.5 rounded-full">{loans.length}</span>
                                </button>

                                <button
                                    onClick={() => handleCategorySelect('archive')}
                                    className={`w-full text-right px-3 py-2.5 rounded-lg flex items-center gap-3 transition-all text-sm ${selectedCategory === 'archive' ? 'bg-white shadow-sm text-blue-700 border border-blue-100 font-bold' : 'text-gray-600 hover:bg-gray-100'}`}
                                >
                                    <Archive className="w-4 h-4" />
                                    {t('resetSystem.archive')}
                                    <span className="mr-auto bg-gray-200 text-gray-600 text-[10px] px-2 py-0.5 rounded-full">{archivedLoans.length}</span>
                                </button>

                                <button
                                    onClick={() => handleCategorySelect('logs')}
                                    className={`w-full text-right px-3 py-2.5 rounded-lg flex items-center gap-3 transition-all text-sm ${selectedCategory === 'logs' ? 'bg-white shadow-sm text-blue-700 border border-blue-100 font-bold' : 'text-gray-600 hover:bg-gray-100'}`}
                                >
                                    <FileText className="w-4 h-4" />
                                    {t('resetSystem.logs')}
                                    <span className="mr-auto bg-gray-200 text-gray-600 text-[10px] px-2 py-0.5 rounded-full">{logs.length}</span>
                                </button>

                                <button
                                    onClick={() => handleCategorySelect('fundHistory')}
                                    className={`w-full text-right px-3 py-2.5 rounded-lg flex items-center gap-3 transition-all text-sm ${selectedCategory === 'fundHistory' ? 'bg-white shadow-sm text-blue-700 border border-blue-100 font-bold' : 'text-gray-600 hover:bg-gray-100'}`}
                                >
                                    <History className="w-4 h-4" />
                                    {t('resetSystem.fundHistory')}
                                    <span className="mr-auto bg-gray-200 text-gray-600 text-[10px] px-2 py-0.5 rounded-full">{fundHistory.length}</span>
                                </button>

                                <button
                                    onClick={() => handleCategorySelect('notifications')}
                                    className={`w-full text-right px-3 py-2.5 rounded-lg flex items-center gap-3 transition-all text-sm ${selectedCategory === 'notifications' ? 'bg-white shadow-sm text-blue-700 border border-blue-100 font-bold' : 'text-gray-600 hover:bg-gray-100'}`}
                                >
                                    <Bell className="w-4 h-4" />
                                    {t('resetSystem.notifications')}
                                    <span className="mr-auto bg-gray-200 text-gray-600 text-[10px] px-2 py-0.5 rounded-full">{notifications.length}</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-white overflow-hidden">
                {renderContent()}
            </div>
        </div>

        <ConfirmModal
            isOpen={confirmModalOpen}
            onClose={() => setConfirmModalOpen(false)}
            onConfirm={handleDelete}
            title={selectedCategory === 'resetBalance' ? t('resetSystem.resetBalance') : selectedCategory === 'storage' ? t('resetSystem.clearStorageTitle') : t('resetSystem.confirmDeleteTitle')}
            message={
                selectedCategory === 'resetBalance' ? t('resetSystem.resetFundConfirm') : 
                selectedCategory === 'storage' ? (storageDeleteMode === 'fullWipe' ? t('resetSystem.wipeSystemConfirm') : t('resetSystem.clearStorageConfirm')) : 
                t('resetSystem.confirmDeleteMessage')
            }
            variant="danger"
            showFileUpload={false}
            isArchiveMode={false} // Use normal mode but with danger variant
            requiresAdminCode={true} // High security action
        />
    </div>
  );
};
