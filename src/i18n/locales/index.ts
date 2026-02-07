export const ar = {
  translation: {
    appTitle: 'نظام إدارة العهدة',
    appSubtitle: 'إدارة سلف الموظفين وتتبع الدفعات',
    welcome: 'مرحباً',
    dashboard: 'لوحة التحكم',
    balance: {
      total: 'الرصيد الكلي',
      remaining: 'الرصيد المتبقي',
      used: 'المبلغ المستخدم'
    },
    actions: {
      action: 'إجراء',
      maxFund: 'الحد الأقصى للعهدة',
      maxFundDesc: 'تعديل قيمة العهدة الأساسية',
      reports: 'التقارير',
      reportsDesc: 'عرض وتصدير التقارير',
      archive: 'الأرشيف',
      archiveDesc: 'عرض السلف المنتهية والمؤرشفة',
      language: 'اللغة',
      languageDesc: 'تغيير لغة التطبيق',
      add: 'إضافة',
      edit: 'تعديل', // Added
      pay: 'سداد الآن',
      paid: 'تم السداد',
      cancel: 'إلغاء',
      confirm: 'تأكيد',
      save: 'حفظ التغييرات',
      details: 'التفاصيل',
      delete: 'حذف',
      export: 'تصدير إلى Excel',
      logout: 'تسجيل خروج',
      logs: 'سجل العمليات (Log)',
      fundSettings: 'إعدادات العهدة',
      resetSystem: 'تهيئة النظام',
      users: 'المستخدمون',
      usersDesc: 'إدارة المستخدمين والصلاحيات',
      dataCorrection: 'تعديل البيانات',
      dataCorrectionDesc: 'تعديل التواريخ والبيانات الحساسة'
    },
    common: {
        date: 'التاريخ',
        accessDenied: 'تم رفض الوصول',
        adminOnly: 'هذه الصفحة مخصصة للمسؤولين فقط',
        items: 'عنصر',
        noData: 'لا توجد بيانات',
        cancel: 'إلغاء',
        save: 'حفظ',
        error: 'حدث خطأ أثناء حفظ البيانات', // Added
        maintenanceMode: 'عذراً، النظام في وضع الصيانة حالياً. لا يمكن إجراء أي تعديلات.' // Added
    },
    dataCorrection: {
        title: 'تعديل البيانات',
        editDates: 'تعديل التواريخ',
        warning: 'تحذير: تعديل التواريخ قد يؤثر على ترتيب السجلات والحسابات المالية. يرجى توخي الحذر.',
    },
    users: {
        title: 'إدارة المستخدمين',
        subtitle: 'إدارة حسابات المستخدمين وصلاحياتهم',
        add: 'إضافة مستخدم',
        edit: 'تعديل',
        delete: 'حذف',
        username: 'اسم المستخدم',
        password: 'كلمة المرور',
        role: 'الصلاحية',
        status: 'الحالة',
        active: 'نشط',
        inactive: 'غير نشط',
        admin: 'مدير (Admin)',
        user: 'مستخدم (User)',
        viewer: 'متابع (Viewer)',
        confirmDelete: 'هل أنت متأكد من حذف هذا المستخدم؟',
        confirmDisable: 'هل أنت متأكد من تعطيل هذا المستخدم؟ سيتم منعه من الدخول للنظام.',
        confirmEnable: 'هل أنت متأكد من تفعيل هذا المستخدم؟',
        disable: 'تعطيل',
        enable: 'تفعيل',
        save: 'حفظ',
        cancel: 'إلغاء',
        successAdd: 'تم إضافة المستخدم بنجاح',
        successDelete: 'تم حذف المستخدم بنجاح',
        successUpdate: 'تم تحديث بيانات المستخدم بنجاح',
        passwordsDoNotMatch: 'كلمات المرور غير متطابقة',
        passwordUpdated: 'تم تحديث كلمة المرور بنجاح',
        changePassword: 'تغيير كلمة المرور',
        leaveBlankToKeepSame: 'اترك الحقل فارغاً للإبقاء على كلمة المرور الحالية',
        newPassword: 'كلمة المرور الجديدة',
        confirmNewPassword: 'تأكيد كلمة المرور',
        updatePassword: 'تحديث كلمة المرور'
    },
    confirm: {
        archive: 'سيتم نقل هذه السلفة الى الارشيف',
        restore: 'هل تريد ارجاع الارشيف الى قائمة السلف الرئيسية ..',
        deleteLoan: 'هل أنت متأكد من حذف هذه السلفة نهائياً؟ هذا الإجراء لا يمكن التراجع عنه.'
    },
    loans: {
      archiveLoan: 'نقل الى الأرشيف',
      activeLoans: 'قائمة السلف النشطة',
      noActiveLoans: 'لا توجد سلف نشطة حالياً',
      employeeName: 'اسم الموظف',
      amount: 'مبلغ السلفة',
      remaining: 'الرصيد المتبقي',
      date: 'تاريخ الإضافة',
      completedDate: 'تاريخ التسديد',
      installments: 'عدد الدفعات',
      status: 'الحالة',
      actions: 'الإجراءات',
      addLoan: 'إضافة سلفة جديدة',
      loanType: 'طريقة السداد',
      onePayment: 'دفعة واحدة (سلفة راتب)', // Updated
      twoPayments: 'دفعتين',
      threePayments: 'ثلاث دفعات',
      flexiblePayments: 'دفعات مرنة', // Added
      monthsCount: 'عدد الأشهر', // Added
      salaryAdvance: 'سلفة راتب',
    },
    status: {
      paid: 'مسددة',
      waitingPayment: 'بانتظار التسديد',
      waitingSecond: 'بانتظار الدفعة الثانية',
      waitingThird: 'بانتظار الدفعة الثالثة',
      waitingLast: 'بانتظار الدفعة الأخيرة',
      inProgress: 'جاري السداد',
      waitingFlexible: 'بانتظار تسديد دفعة مرنة'
    },
    notifications: {
      title: 'الإشعارات',
      new: 'جديد',
      empty: 'لا توجد إشعارات جديدة',
      dueToday: 'اليوم موعد استحقاق الدفعة {{payment}} للموظف {{employee}}',
      dueTomorrow: 'غداً موعد استحقاق الدفعة {{payment}} للموظف {{employee}}',
      dueInDays: 'باقي {{days}} أيام على استحقاق الدفعة {{payment}} للموظف {{employee}}'
    },
    fundSettings: {
        title: 'إدارة العهدة المالية',
        subtitle: 'عرض وتعديل تفاصيل العهدة والحد الأقصى للصرف',
        totalFund: 'إجمالي العهدة',
        usageStatus: 'حالة استهلاك العهدة',
        usageDesc: 'تظهر النسبة المئوية للمبالغ المصروفة مقارنة بإجمالي العهدة المتاحة.',
        updateLimitTitle: 'تحديث الحد الأقصى',
        updateLimitDesc: 'يمكنك تغيير قيمة الحد الأقصى للعهدة، سيطلب النظام كود المدير.',
        updateLimitBtn: 'الحد الأقصى للعهدة'
    },
    modals: {
      archiveConfirm: 'هل تريد القيام بأرشفة هذه السلفة؟',
      updateFund: {
        title: 'تحديث الحد الأقصى للعهدة',
        currentFund: 'العهدة الحالية',
        usedAmount: 'المبلغ المستخدم (ديون)',
        newMax: 'الحد الأقصى الجديد',
        placeholder: 'أدخل المبلغ الجديد',
        error: 'يجب أن يكون المبلغ أكبر من المبلغ المستخدم حالياً ({{amount}})',
        receiptRequired: 'يجب إرفاق سند القبض (PDF)',
        newBalance: 'الرصيد المتاح الجديد سيكون'
      }
    },
    loanDetails: {
      notFound: 'السلفة غير موجودة',
      backToHome: 'العودة للرئيسية',
      backToArchive: 'الرجوع للأرشيف', // Added
      dateAdded: 'تاريخ الإضافة',
      totalAmount: 'المبلغ الكلي',
      remainingBalance: 'الرصيد المتبقي للسداد',
      monthlyPayment: 'قيمة الدفعة الشهرية',
      paymentSchedule: 'جدول الدفعات',
      paymentHistory: 'سجل الدفعات', // Added
      payment: 'الدفعة',
      dueDate: 'تاريخ الاستحقاق',
      paidAt: 'تم السداد في',
      paid: 'مدفوعة',
      pending: 'مستحقة',
      payNow: 'سداد الآن',
      payPreviousFirst: 'يجب سداد الدفعة السابقة أولاً',
      earlyPaymentTitle: 'تنبيه: سداد مبكر',
      earlyPaymentMessage: 'لم يحن موعد استحقاق هذه الدفعة بعد. إذا كنت تريد الاستمرار في هذا الإجراء الحساس، يرجى إدخال كود مدير النظام.',
      confirmPaymentTitle: 'تأكيد سداد الدفعة',
      confirmPaymentMessage: 'هل أنت متأكد من رغبتك في سداد هذه الدفعة وخصمها من العهدة؟',
      uploadReceipt: 'إرفاق سند الدفع (PDF)',
      viewReceipt: 'عرض سند الدفع',
      receiptRequired: 'يجب إرفاق ملف PDF قبل السداد'
    },
    logs: {
      updateFund: 'تحديث الحد الأقصى للعهدة من {{old}} إلى {{new}}',
      addLoan: 'إضافة سلفة للموظف {{employee}} بقيمة {{amount}}',
      earlyPayment: 'سداد مبكر (إجباري) لدفعة بقيمة {{amount}} للموظف {{employee}}',
      regularPayment: 'سداد دفعة بقيمة {{amount}} للموظف {{employee}}',
      archiveLoan: 'أرشفة سلفة الموظف {{employee}}',
      unarchiveLoan: 'استعادة سلفة الموظف {{employee}} من الأرشيف'
    },
    archive: {
      title: 'أرشيف السلف',
      subtitle: 'السلف المنتهية والمدفوعة بالكامل',
      empty: 'الأرشيف فارغ',
      restore: 'استعادة',
      restoreDesc: 'إعادة السلفة للقائمة النشطة',
      searchPlaceholder: 'بحث باسم الموظف...',
      archivedDate: 'تاريخ الأرشفة'
    },
    footer: {
      rights: 'حقوق الطباعة والنشر محفوظة لصالح مجموعة بن حريز القابضة في الامارات العربية المتحدة',
      developer: 'تم الاعداد بواسطة المهندس محمد خطاب'
    },
    resetSystem: {
        title: 'تهيئة النظام',
        systemRecords: 'سجلات النظام',
        subtitle: 'حذف البيانات وإعادة ضبط النظام',
        activeLoans: 'قائمة السلف النشطة',
        resetBalance: 'تصفير الرصيد الحالي',
        archive: 'الأرشيف',
        logs: 'سجل العمليات',
        fundHistory: 'سجل حركات العهدة', // Added
        storage: 'ملفات التخزين', // Added
        storageTitle: 'إدارة ملفات التخزين',
        storageDesc: 'يمكنك حذف جميع الملفات (مثل صور الإيصالات وملفات PDF) لتوفير المساحة على الخادم. يرجى العلم أن هذا الإجراء سيجعل روابط الملفات في السجلات القديمة غير صالحة.',
        dbSize: 'حجم قاعدة البيانات', // Added
        filesSize: 'حجم الملفات (التخزين)', // Added
        deleteMode: 'نوع الحذف', // Added
        deleteFilesOnly: 'حذف ملفات التخزين فقط', // Added
        deleteFullSystem: 'حذف شامل (قواعد البيانات + الملفات)', // Added
        deleteFullSystemDesc: 'تحذير: سيتم حذف جميع السجلات (القروض، الأرشيف، السجلات، الإشعارات) بالإضافة إلى الملفات. سيعود النظام كما كان عند التثبيت الأول.', // Added
        clearStorageBtn: 'تنفيذ الحذف', // Changed generic
        clearStorageTitle: 'تأكيد الحذف',
        clearStorageConfirm: 'هل أنت متأكد من حذف جميع الملفات المخزنة؟ هذا الإجراء سيحذف كافة الإيصالات المرفقة ولا يمكن التراجع عنه.',
        wipeSystemConfirm: 'تحذير نهائي: هل أنت متأكد تماماً من رغبتك في حذف كل شيء؟ سيتم تصفير النظام بالكامل ولن تتمكن من استرجاع أي بيانات.', // Added
        startDeletion: 'بدء عملية التهيئة', // Added
        cancel: 'إلغاء', // Added
        successClearStorage: 'تم حذف الملفات بنجاح',
        successWipe: 'تمت تهيئة النظام بالكامل بنجاح', // Added
        limitNote: 'الحدود الموضحة بناءً على الخطة المجانية (Free Tier)',
        notifications: 'الإشعارات',
        selectCategory: 'الرجاء اختيار عنصر للتهيئة',
        deleteAll: 'حذف الكل',
        deleteSelected: 'حذف المحدد',
        noRecords: 'لا توجد سجلات',
        resetFundBtn: 'تصفير الرصيد (إعادة تعيين إلى الإجمالي)',
        resetFundConfirm: 'هل أنت متأكد من تصفير الرصيد؟ سيتم إعادة الرصيد المتبقي ليساوي إجمالي العهدة.',
        currentBalance: 'الرصيد المتبقي الحالي',
        totalFund: 'إجمالي العهدة',
        confirmDeleteTitle: 'تأكيد الحذف',
        confirmDeleteMessage: 'هل أنت متأكد من حذف السجلات المحددة؟ لا يمكن التراجع عن هذا الإجراء.',
        successReset: 'تم تصفير الرصيد بنجاح',
        successDelete: 'تم حذف السجلات بنجاح',
        api: 'إعدادات API', // Added
        apiTitle: 'مفاتيح الربط (API Keys)',
        apiDesc: 'هذه المفاتيح تستخدم لربط التطبيق بقاعدة البيانات (Supabase). يرجى عدم مشاركتها مع أي شخص غير مصرح له.',
        systemSettings: 'إعدادات النظام', // Added
        systemDesc: 'التحكم في حالة النظام والصيانة', // Added
        maintenanceMode: 'وضع الصيانة', // Added
        maintenanceModeDesc: 'عند تفعيل وضع الصيانة، سيتم منع جميع الموظفين (ما عدا المدير) من الدخول للنظام أو إجراء أي تعديلات. يستخدم هذا الوضع عند إجراء تحديثات أو تهيئة للنظام.', // Added
        maintenanceActive: 'نشط', // Added
        maintenanceInactive: 'غير نشط', // Added
        projectUrl: 'رابط المشروع (Project URL)',
        anonKey: 'المفتاح العام (Anon Key)',
        copy: 'نسخ',
        copied: 'تم النسخ!',
        supabaseAccount: 'حساب Supabase', // Added
        supabaseDesc: 'معلومات تسجيل الدخول لمنصة قاعدة البيانات',
        email: 'البريد الإلكتروني',
        password: 'كلمة المرور',
        subscription: 'نوع الاشتراك',
        freePlan: 'مجاني (Free Tier)',
        exportData: 'مركز النسخ الاحتياطي',
        exportTitle: 'تصدير البيانات والنسخ الاحتياطي',
        exportDesc: 'قم بتحميل نسخة من بيانات النظام للاحتفاظ بها أو نقلها.',
        exportJson: 'تصدير كامل (JSON)',
        exportExcel: 'تصدير جداول (Excel)',
        downloading: 'جاري التحميل...'
    }
  }
};

export const en = {
  translation: {
    appTitle: 'Ohda Management System',
    appSubtitle: 'Manage employee loans and track payments',
    welcome: 'Welcome',
    dashboard: 'Dashboard',
    balance: {
      total: 'Total Fund',
      remaining: 'Remaining Balance',
      used: 'Used Amount'
    },
    actions: {
      action: 'Action',
      maxFund: 'Maximum Fund',
      maxFundDesc: 'Modify base fund value',
      reports: 'Reports',
      reportsDesc: 'View and export reports',
      archive: 'Archive',
      archiveDesc: 'View completed and archived loans',
      language: 'Language',
      languageDesc: 'Change application language',
      add: 'Add Loan',
      edit: 'Edit', // Added
      pay: 'Pay Now',
      paid: 'Paid',
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save Changes',
      details: 'Details',
      delete: 'Delete Permanently',
      export: 'Export to Excel',
      logout: 'Logout',
      logs: 'Activity Log',
      fundSettings: 'Fund Settings',
      resetSystem: 'System Initialization',
      users: 'Users Management',
      usersDesc: 'Manage users and permissions',
      dataCorrection: 'Data Correction',
      dataCorrectionDesc: 'Modify dates and sensitive data'
    },
    common: {
        date: 'Date',
        accessDenied: 'Access Denied',
        adminOnly: 'This page is restricted to administrators',
        items: 'items',
        noData: 'No data found',
        cancel: 'Cancel',
        save: 'Save',
        error: 'An error occurred while saving data', // Added
        maintenanceMode: 'Sorry, the system is currently in maintenance mode. No changes allowed.' // Added
    },
    dataCorrection: {
        title: 'Data Correction',
        editDates: 'Edit Dates',
        warning: 'Warning: Modifying dates may affect record sorting and financial calculations. Please be careful.',
    },
    users: {
        title: 'Users Management',
        subtitle: 'Manage user accounts and permissions',
        add: 'Add User',
        edit: 'Edit',
        delete: 'Delete',
        username: 'Username',
        password: 'Password',
        role: 'Role',
        status: 'Status',
        active: 'Active',
        inactive: 'Inactive',
        admin: 'Admin',
        user: 'User',
        viewer: 'Viewer',
        confirmDelete: 'Are you sure you want to delete this user?',
        confirmDisable: 'Are you sure you want to disable this user?',
        confirmEnable: 'Are you sure you want to enable this user?',
        disable: 'Disable',
        enable: 'Enable',
        save: 'Save',
        cancel: 'Cancel',
        successAdd: 'User added successfully',
        successDelete: 'User deleted successfully',
        successUpdate: 'User updated successfully',
        passwordsDoNotMatch: 'Passwords do not match',
        passwordUpdated: 'Password updated successfully',
        changePassword: 'Change Password',
        leaveBlankToKeepSame: 'Leave blank to keep current password',
        newPassword: 'New Password',
        confirmNewPassword: 'Confirm Password',
        updatePassword: 'Update Password'
    },
    confirm: {
        archive: 'This loan will be moved to the archive',
        restore: 'Do you want to restore this loan to the main list?',
        deleteLoan: 'Are you sure you want to permanently delete this loan? This action cannot be undone.'
    },
    loans: {
      activeLoans: 'Active Loans',
      noActiveLoans: 'No active loans currently',
      employeeName: 'Employee Name',
      amount: 'Loan Amount',
      remaining: 'Remaining Balance',
      date: 'Date Added',
      completedDate: 'Completion Date',
      installments: 'Installments',
      status: 'Status',
      actions: 'Actions',
      addLoan: 'Add New Loan',
      loanType: 'Payment Type',
      onePayment: 'One Payment (Salary Advance)', // Updated
      twoPayments: 'Two Payments',
      threePayments: 'Three Payments',
      flexiblePayments: 'Flexible Payments', // Added
      monthsCount: 'Number of Months', // Added
      salaryAdvance: 'Salary Advance',
      archiveLoan: 'Move to Archive'
    },
    status: {
      paid: 'Paid',
      waitingPayment: 'Waiting for Payment',
      waitingSecond: 'Waiting for 2nd Payment',
      waitingThird: 'Waiting for 3rd Payment',
      waitingLast: 'Waiting for Last Payment',
      inProgress: 'In Progress',
      waitingFlexible: 'Waiting for Flexible Payment'
    },
    notifications: {
      title: 'Notifications',
      new: 'New',
      empty: 'No new notifications',
      dueToday: 'Payment {{payment}} due today for {{employee}}',
      dueTomorrow: 'Payment {{payment}} due tomorrow for {{employee}}',
      dueInDays: 'Payment {{payment}} due in {{days}} days for {{employee}}'
    },
    fundSettings: {
        title: 'Fund Management',
        subtitle: 'View and update fund details and limits',
        totalFund: 'Total Fund',
        usageStatus: 'Fund Usage Status',
        usageDesc: 'Shows the percentage of funds used compared to the total available fund.',
        updateLimitTitle: 'Update Fund Limit',
        updateLimitDesc: 'Change the maximum fund limit. Admin code required.',
        updateLimitBtn: 'Max Fund Limit'
    },
    modals: {
      archiveConfirm: 'Are you sure you want to archive this loan?',
      updateFund: {
        title: 'Update Maximum Fund',
        currentFund: 'Current Fund',
        usedAmount: 'Used Amount (Debts)',
        newMax: 'New Maximum Limit',
        placeholder: 'Enter new amount',
        error: 'Amount must be greater than currently used amount ({{amount}})',
        receiptRequired: 'Receipt (PDF) is required',
        newBalance: 'New available balance will be'
      }
    },
    loanDetails: {
      notFound: 'Loan not found',
      backToHome: 'Back to Home',
      backToArchive: 'Back to Archive', // Added
      dateAdded: 'Date Added',
      totalAmount: 'Total Amount',
      remainingBalance: 'Remaining Balance',
      monthlyPayment: 'Monthly Payment',
      paymentSchedule: 'Payment Schedule',
      paymentHistory: 'Payment History', // Added
      payment: 'Payment',
      dueDate: 'Due Date',
      paidAt: 'Paid at',
      paid: 'Paid',
      pending: 'Pending',
      payNow: 'Pay Now',
      payPreviousFirst: 'Previous payment must be paid first',
      earlyPaymentTitle: 'Warning: Early Payment',
      earlyPaymentMessage: 'This payment is not due yet. If you want to proceed with this sensitive action, please enter the system admin code.',
      confirmPaymentTitle: 'Confirm Payment',
      confirmPaymentMessage: 'Are you sure you want to pay this installment and deduct it from the fund?',
      uploadReceipt: 'Upload Receipt (PDF)',
      viewReceipt: 'View Receipt',
      receiptRequired: 'You must upload a PDF file before paying'
    },
    logs: {
      updateFund: 'Updated max fund from {{old}} to {{new}}',
      addLoan: 'Added loan for {{employee}} with amount {{amount}}',
      earlyPayment: 'Early payment (Forced) of {{amount}} for {{employee}}',
      regularPayment: 'Payment of {{amount}} for {{employee}}',
      archiveLoan: 'Archived loan for {{employee}}',
      unarchiveLoan: 'Restored loan for {{employee}} from archive'
    },
    archive: {
      title: 'Loans Archive',
      subtitle: 'Completed and fully paid loans',
      empty: 'Archive is empty',
      restore: 'Restore',
      restoreDesc: 'Move loan back to active list',
      searchPlaceholder: 'Search by employee name...',
      archivedDate: 'Archived Date'
    },
    footer: {
      rights: 'Copyright reserved for Bin Hareb Holding Group in UAE',
      developer: 'Developed by Eng. Mohammad Khattab'
    },
    resetSystem: {
        title: 'System Initialization',
        systemRecords: 'System Records',
        subtitle: 'Delete data and reset system',
        activeLoans: 'Active Loans',
        resetBalance: 'Reset Current Balance',
        archive: 'Archive',
        logs: 'Operation Logs',
        fundHistory: 'Fund History Logs', // Added
        storage: 'Storage Files', // Added
        storageTitle: 'Manage Storage Files',
        storageDesc: 'You can delete all stored files (like receipts and PDFs) to free up server space. Please note that this will make file links in old records invalid.',
        dbSize: 'Database Size', // Added
        filesSize: 'Files Size (Storage)', // Added
        deleteMode: 'Deletion Mode', // Added
        deleteFilesOnly: 'Delete Storage Files Only', // Added
        deleteFullSystem: 'Full Wipe (Database + Files)', // Added
        deleteFullSystemDesc: 'Warning: This will delete ALL records (Loans, Archive, Logs, Notifications) along with the files. The system will be reset to factory state.', // Added
        clearStorageBtn: 'Execute Deletion', // Changed generic
        clearStorageTitle: 'Confirm Deletion',
        clearStorageConfirm: 'Are you sure you want to delete all stored files? This will remove all attached receipts and cannot be undone.',
        wipeSystemConfirm: 'Final Warning: Are you absolutely sure you want to delete EVERYTHING? The system will be fully reset and data cannot be recovered.', // Added
        startDeletion: 'Start Deletion Process', // Added
        cancel: 'Cancel', // Added
        successClearStorage: 'Files deleted successfully',
        successWipe: 'System fully wiped successfully', // Added
        limitNote: 'Limits shown are based on Free Tier plan',
        notifications: 'Notifications',
        selectCategory: 'Please select a category to initialize',
        deleteAll: 'Delete All',
        deleteSelected: 'Delete Selected',
        noRecords: 'No records found',
        resetFundBtn: 'Reset Balance (Set to Total)',
        resetFundConfirm: 'Are you sure you want to reset the balance? This will set remaining balance equal to total fund.',
        currentBalance: 'Current Remaining Balance',
        totalFund: 'Total Fund',
        confirmDeleteTitle: 'Confirm Deletion',
        confirmDeleteMessage: 'Are you sure you want to delete the selected records? This action cannot be undone.',
        successReset: 'Balance reset successfully',
        successDelete: 'Records deleted successfully',
        api: 'API Settings', // Added
        apiTitle: 'Connection Keys (API Keys)',
        apiDesc: 'These keys are used to connect the app to the database (Supabase). Please do not share them with unauthorized persons.',
        systemSettings: 'System Settings', // Added
        systemDesc: 'Control system status and maintenance', // Added
        maintenanceMode: 'Maintenance Mode', // Added
        maintenanceModeDesc: 'When enabled, all employees (except admin) will be blocked from accessing or modifying the system. Use this when performing updates or resets.', // Added
        maintenanceActive: 'Active', // Added
        maintenanceInactive: 'Inactive', // Added
        projectUrl: 'Project URL',
        anonKey: 'Anon Key',
        copy: 'Copy',
        copied: 'Copied!',
        supabaseAccount: 'Supabase Account', // Added
        supabaseDesc: 'Login information for the database platform',
        email: 'Email',
        password: 'Password',
        subscription: 'Subscription Type',
        freePlan: 'Free Tier',
        exportData: 'Backup Center',
        exportTitle: 'Data Export & Backup',
        exportDesc: 'Download a copy of system data for safekeeping or transfer.',
        exportJson: 'Full Export (JSON)',
        exportExcel: 'Table Export (Excel)',
        downloading: 'Downloading...'
    }
  }
};

export const ur = {
  translation: {
    appTitle: 'عہدہ مینجمنٹ سسٹم',
    appSubtitle: 'ملازمین کے قرضوں اور ادائیگیوں کا انتظام',
    welcome: 'خوش آمدید',
    dashboard: 'ڈیش بورڈ',
    balance: {
      total: 'کل فنڈ',
      remaining: 'بقیہ رقم',
      used: 'استعمال شدہ رقم'
    },
    actions: {
      action: 'عمل',
      maxFund: 'زیادہ سے زیادہ فنڈ',
      maxFundDesc: 'بنیادی فنڈ کی قدر میں ترمیم کریں',
      reports: 'رپورٹس',
      reportsDesc: 'رپورٹس دیکھیں اور ایکسپورٹ کریں',
      archive: 'آرکائیو',
      archiveDesc: 'مکمل اور آرکائیو شدہ قرضے دیکھیں',
      language: 'زبان',
      languageDesc: 'ایپلیکیشن کی زبان تبدیل کریں',
      add: 'شامل کریں',
      edit: 'ترمیم کریں', // Added
      pay: 'اب ادا کریں',
      paid: 'ادا کر دیا',
      cancel: 'منسوخ کریں',
      confirm: 'تصدیق کریں',
      save: 'تبدیلیاں محفوظ کریں',
      details: 'تفصیلات',
      delete: 'مستقل طور پر حذف کریں',
      export: 'ایکسل میں ایکسپورٹ کریں',
      logout: 'لاگ آؤٹ',
      logs: 'سرگرمی لاگ',
      fundSettings: 'فنڈ کی ترتیبات',
      resetSystem: 'سسٹم کی ابتداء',
      users: 'صارفین کا انتظام',
      usersDesc: 'صارفین اور اجازتوں کا انتظام',
      dataCorrection: 'ڈیٹا کی اصلاح',
      dataCorrectionDesc: 'تاریخوں اور حساس ڈیٹا میں ترمیم کریں'
    },
    common: {
        date: 'تاریخ',
        accessDenied: 'رسائی مسترد',
        adminOnly: 'یہ صفحہ صرف ایڈمنسٹریٹرز کے لیے مختص ہے',
        items: 'آئٹمز',
        noData: 'کوئی ڈیٹا نہیں ملا',
        cancel: 'منسوخ کریں',
        save: 'محفوظ کریں',
        error: 'ڈیٹا محفوظ کرتے وقت ایک خرابی پیش آگئی', // Added
        maintenanceMode: 'معذرت، سسٹم فی الحال دیکھ بھال کے موڈ میں ہے۔ کوئی تبدیلی کی اجازت نہیں ہے۔' // Added
    },
    dataCorrection: {
        title: 'ڈیٹا کی اصلاح',
        editDates: 'تاریخوں میں ترمیم کریں',
        warning: 'انتباہ: تاریخوں میں ترمیم کرنے سے ریکارڈ کی ترتیب اور مالی حسابات متاثر ہو سکتے ہیں۔ براہ کرم محتاط رہیں۔',
    },
    users: {
        title: 'صارفین کا انتظام',
        subtitle: 'صارف اکاؤنٹس اور اجازتوں کا انتظام',
        add: 'صارف شامل کریں',
        edit: 'ترمیم کریں',
        delete: 'حذف کریں',
        username: 'صارف کا نام',
        password: 'پاس ورڈ',
        role: 'کردار',
        status: 'حیثیت',
        active: 'فعال',
        inactive: 'غیر فعال',
        admin: 'ایڈمن',
        user: 'صارف',
        viewer: 'دیکھنے والا',
        confirmDelete: 'کیا آپ واقعی اس صارف کو حذف کرنا چاہتے ہیں؟',
        confirmDisable: 'کیا آپ واقعی اس صارف کو غیر فعال کرنا چاہتے ہیں؟',
        confirmEnable: 'کیا آپ واقعی اس صارف کو فعال کرنا چاہتے ہیں؟',
        disable: 'غیر فعال کریں',
        enable: 'فعال کریں',
        save: 'محفوظ کریں',
        cancel: 'منسوخ کریں',
        successAdd: 'صارف کامیابی سے شامل ہو گیا',
        successDelete: 'صارف کامیابی سے حذف ہو گیا',
        successUpdate: 'صارف کامیابی سے اپ ڈیٹ ہو گیا',
        passwordsDoNotMatch: 'پاس ورڈ مماثل نہیں ہیں',
        passwordUpdated: 'پاس ورڈ کامیابی سے اپ ڈیٹ ہو گیا',
        changePassword: 'پاس ورڈ تبدیل کریں',
        leaveBlankToKeepSame: 'موجودہ پاس ورڈ رکھنے کے لیے خالی چھوڑ دیں',
        newPassword: 'نیا پاس ورڈ',
        confirmNewPassword: 'پاس ورڈ کی تصدیق کریں',
        updatePassword: 'پاس ورڈ اپ ڈیٹ کریں'
    },
    confirm: {
        archive: 'اس قرض کو آرکائیو میں منتقل کر دیا جائے گا',
        restore: 'کیا آپ اس قرض کو مرکزی فہرست میں بحال کرنا چاہتے ہیں؟',
        deleteLoan: 'کیا آپ واقعی اس قرض کو مستقل طور پر حذف کرنا چاہتے ہیں؟ اس عمل کو واپس نہیں کیا جا سکتا۔'
    },
    loans: {
      activeLoans: 'فعال قرضے',
      noActiveLoans: 'فی الحال کوئی فعال قرض نہیں ہے',
      employeeName: 'ملازم کا نام',
      amount: 'قرض کی رقم',
      remaining: 'بقیہ رقم',
      date: 'تاریخ',
      completedDate: 'تکمیل کی تاریخ',
      installments: 'اقساط کی تعداد',
      status: 'حیثیت',
      actions: 'اعمال',
      addLoan: 'نیا قرض شامل کریں',
      loanType: 'ادائیگی کی قسم',
      onePayment: 'ایک ادائیگی (تنخواہ پیشگی)', // Updated
      twoPayments: 'دو ادائیگیاں',
      threePayments: 'تین ادائیگیاں',
      flexiblePayments: 'لچکدار ادائیگیاں', // Added
      monthsCount: 'مہینوں کی تعداد', // Added
      salaryAdvance: 'تنخواہ پیشگی',
      archiveLoan: 'آرکائیو میں منتقل کریں'
    },
    status: {
      paid: 'ادا شدہ',
      waitingPayment: 'ادائیگی کا انتظار',
      waitingSecond: 'دوسری ادائیگی کا انتظار',
      waitingThird: 'تیسری ادائیگی کا انتظار',
      waitingLast: 'آخری ادائیگی کا انتظار',
      inProgress: 'جاری ہے',
      waitingFlexible: 'لچکدار ادائیگی کا انتظار ہے'
    },
    notifications: {
      title: 'اطلاعات',
      new: 'نیا',
      empty: 'کوئی نئی اطلاع نہیں',
      dueToday: 'ملازم {{employee}} کی قسط {{payment}} آج واجب الادا ہے',
      dueTomorrow: 'ملازم {{employee}} کی قسط {{payment}} کل واجب الادا ہے',
      dueInDays: 'ملازم {{employee}} کی قسط {{payment}} {{days}} دنوں میں واجب الادا ہے'
    },
    fundSettings: {
        title: 'فنڈ کا انتظام',
        subtitle: 'فنڈ کی تفصیلات اور حدود دیکھیں اور اپ ڈیٹ کریں',
        totalFund: 'کل فنڈ',
        usageStatus: 'فنڈ کے استعمال کی حیثیت',
        usageDesc: 'کل دستیاب فنڈ کے مقابلے میں استعمال شدہ فنڈز کا فیصد دکھاتا ہے۔',
        updateLimitTitle: 'فنڈ کی حد کو اپ ڈیٹ کریں',
        updateLimitDesc: 'زیادہ سے زیادہ فنڈ کی حد تبدیل کریں۔ ایڈمن کوڈ درکار ہے۔',
        updateLimitBtn: 'زیادہ سے زیادہ فنڈ کی حد'
    },
    modals: {
      archiveConfirm: 'کیا آپ واقعی اس قرض کو آرکائیو کرنا چاہتے ہیں؟',
      updateFund: {
        title: 'زیادہ سے زیادہ فنڈ کو اپ ڈیٹ کریں',
        currentFund: 'موجودہ فنڈ',
        usedAmount: 'استعمال شدہ رقم (قرضے)',
        newMax: 'نئی زیادہ سے زیادہ حد',
        placeholder: 'نئی رقم درج کریں',
        error: 'رقم موجودہ استعمال شدہ رقم ({{amount}}) سے زیادہ ہونی چاہیے',
        receiptRequired: 'رسید (PDF) درکار ہے',
        newBalance: 'نیا دستیاب بیلنس ہوگا'
      }
    },
    loanDetails: {
      notFound: 'قرض نہیں ملا',
      backToHome: 'ہوم پیج پر واپس جائیں',
      backToArchive: 'آرکائیو میں واپس جائیں', // Added
      dateAdded: 'شامل کرنے کی تاریخ',
      totalAmount: 'کل رقم',
      remainingBalance: 'بقیہ رقم',
      monthlyPayment: 'ماہانہ قسط',
      paymentSchedule: 'ادائیگی کا شیڈول',
      paymentHistory: 'ادائیگی کی تاریخ', // Added
      payment: 'قسط',
      dueDate: 'آخری تاریخ',
      paidAt: 'ادا کیا گیا',
      paid: 'ادا شدہ',
      pending: 'زیر التواء',
      payNow: 'اب ادا کریں',
      payPreviousFirst: 'پہلے پچھلی قسط ادا کرنی ہوگی',
      earlyPaymentTitle: 'انتباہ: جلد ادائیگی',
      earlyPaymentMessage: 'اس قسط کی ادائیگی ابھی واجب نہیں ہے۔ اگر آپ اس حساس عمل کو جاری رکھنا چاہتے ہیں تو براہ کرم سسٹم ایڈمن کوڈ درج کریں۔',
      confirmPaymentTitle: 'ادائیگی کی تصدیق کریں',
      confirmPaymentMessage: 'کیا آپ واقعی اس قسط کو ادا کرنا چاہتے ہیں اور اسے فنڈ سے منہا کرنا چاہتے ہیں؟',
      uploadReceipt: 'رسید اپ لوڈ کریں (PDF)',
      viewReceipt: 'رسید دیکھیں',
      receiptRequired: 'ادائیگی سے پہلے پی ڈی ایف فائل اپ لوڈ کرنا ضروری ہے'
    },
    logs: {
      updateFund: 'زیادہ سے زیادہ فنڈ {{old}} سے {{new}} تک اپ ڈیٹ کیا گیا',
      addLoan: '{{employee}} کے لیے {{amount}} کا قرض شامل کیا گیا',
      earlyPayment: '{{employee}} کے لیے {{amount}} کی جلد ادائیگی (زبردستی)',
      regularPayment: '{{employee}} کے لیے {{amount}} کی ادائیگی',
      archiveLoan: '{{employee}} کے قرض کو آرکائیو کر دیا گیا',
      unarchiveLoan: 'آرکائیو سے {{employee}} کا قرض بحال کر دیا گیا'
    },
    archive: {
      title: 'قرضوں کا آرکائیو',
      subtitle: 'مکمل اور مکمل ادا شدہ قرضے',
      empty: 'آرکائیو خالی ہے',
      restore: 'بحال کریں',
      restoreDesc: 'قرض کو فعال فہرست میں واپس منتقل کریں',
      searchPlaceholder: 'ملازم کے نام سے تلاش کریں...',
      archivedDate: 'آرکائیو کی تاریخ'
    },
    footer: {
      rights: 'کاپی رائٹ بن حارب ہولڈنگ گروپ متحدہ عرب امارات کے لیے محفوظ ہے',
      developer: 'انجینئر محمد خطاب نے تیار کیا'
    },
    resetSystem: {
        title: 'سسٹم کی ابتداء',
        systemRecords: 'سسٹم ریکارڈز',
        subtitle: 'ڈیٹا حذف کریں اور سسٹم کو دوبارہ ترتیب دیں',
        activeLoans: 'فعال قرضے',
        resetBalance: 'موجودہ بیلنس کو دوبارہ ترتیب دیں',
        archive: 'آرکائیو',
        logs: 'آپریشن لاگز',
        fundHistory: 'فنڈ ہسٹری لاگز', // Added
        storage: 'اسٹوریج فائلیں', // Added
        storageTitle: 'اسٹوریج فائلوں کا انتظام',
        storageDesc: 'آپ سرور کی جگہ خالی کرنے کے لیے تمام محفوظ شدہ فائلیں (جیسے رسیدیں اور پی ڈی ایف) حذف کر سکتے ہیں۔ براہ کرم نوٹ کریں کہ اس سے پرانے ریکارڈز میں فائل لنکس غلط ہو جائیں گے۔',
        dbSize: 'ڈیٹا بیس کا سائز', // Added
        filesSize: 'فائلوں کا سائز (اسٹوریج)', // Added
        deleteMode: 'حذف کا طریقہ', // Added
        deleteFilesOnly: 'صرف اسٹوریج فائلیں حذف کریں', // Added
        deleteFullSystem: 'مکمل صفائی (ڈیٹا بیس + فائلیں)', // Added
        deleteFullSystemDesc: 'انتباہ: یہ تمام ریکارڈز (قرضے، آرکائیو، لاگز، اطلاعات) اور فائلوں کو حذف کر دے گا۔ سسٹم فیکٹری حالت میں واپس آ جائے گا۔', // Added
        clearStorageBtn: 'حذف پر عمل کریں', // Changed generic
        clearStorageTitle: 'فائل حذف کرنے کی تصدیق',
        clearStorageConfirm: 'کیا آپ واقعی تمام محفوظ شدہ فائلوں کو حذف کرنا چاہتے ہیں؟ اس سے تمام منسلک رسیدیں ہٹ جائیں گی اور اسے واپس نہیں کیا جا سکتا۔',
        wipeSystemConfirm: 'حتمی انتباہ: کیا آپ واقعی سب کچھ حذف کرنا چاہتے ہیں؟ سسٹم مکمل طور پر دوبارہ ترتیب دیا جائے گا اور ڈیٹا واپس نہیں لایا جا سکتا۔', // Added
        startDeletion: 'حذف کا عمل شروع کریں', // Added
        cancel: 'منسوخ کریں', // Added
        successClearStorage: 'فائلیں کامیابی سے حذف ہوگئیں',
        successWipe: 'سسٹم کامیابی سے صاف ہو گیا', // Added
        limitNote: 'دکھائی گئی حدود مفت درجے (Free Tier) پر مبنی ہیں',
        notifications: 'اطلاعات',
        selectCategory: 'براہ کرم شروع کرنے کے لیے ایک زمرہ منتخب کریں',
        deleteAll: 'سب حذف کریں',
        deleteSelected: 'منتخب کردہ حذف کریں',
        noRecords: 'کوئی ریکارڈ نہیں ملا',
        resetFundBtn: 'بیلنس ری سیٹ کریں (کل پر سیٹ کریں)',
        resetFundConfirm: 'کیا آپ واقعی بیلنس کو دوبارہ ترتیب دینا چاہتے ہیں؟ یہ بقیہ بیلنس کو کل فنڈ کے برابر کر دے گا۔',
        currentBalance: 'موجودہ بقیہ بیلنس',
        totalFund: 'کل فنڈ',
        confirmDeleteTitle: 'حذف کرنے کی تصدیق کریں',
        confirmDeleteMessage: 'کیا آپ واقعی منتخب ریکارڈز کو حذف کرنا چاہتے ہیں؟ اس عمل کو واپس نہیں کیا جا سکتا۔',
        successReset: 'بیلنس کامیابی کے ساتھ دوبارہ ترتیب دیا گیا',
        successDelete: 'ریکارڈز کامیابی کے ساتھ حذف ہو گئے',
        api: 'API کی ترتیبات', // Added
        apiTitle: 'کنکشن کیز (API Keys)',
        apiDesc: 'یہ کیز ایپ کو ڈیٹا بیس (Supabase) سے جوڑنے کے لیے استعمال ہوتی ہیں۔ براہ کرم انہیں غیر مجاز افراد کے ساتھ شیئر نہ کریں۔',
        systemSettings: 'سسٹم کی ترتیبات', // Added
        systemDesc: 'سسٹم کی حیثیت اور دیکھ بھال کو کنٹرول کریں', // Added
        maintenanceMode: 'دیکھ بھال کا موڈ', // Added
        maintenanceModeDesc: 'فعال ہونے پر، تمام ملازمین (سوائے ایڈمن) کو سسٹم تک رسائی یا ترمیم کرنے سے روک دیا جائے گا۔ اسے اپ ڈیٹس یا ری سیٹ کرتے وقت استعمال کریں۔', // Added
        maintenanceActive: 'فعال', // Added
        maintenanceInactive: 'غیر فعال', // Added
        projectUrl: 'پروجیکٹ URL',
        anonKey: 'عوامی کلید (Anon Key)',
        copy: 'کاپی',
        copied: 'کاپی ہو گیا!',
        supabaseAccount: 'Supabase اکاؤنٹ', // Added
        supabaseDesc: 'ڈیٹا بیس پلیٹ فارم کے لیے لاگ ان کی معلومات',
        email: 'ای میل',
        password: 'پاس ورڈ',
        subscription: 'سبسکرپشن کی قسم',
        freePlan: 'مفت (Free Tier)',
        exportData: 'بیک اپ سینٹر',
        exportTitle: 'ڈیٹا ایکسپورٹ اور بیک اپ',
        exportDesc: 'حفاظت یا منتقلی کے لیے سسٹم ڈیٹا کی کاپی ڈاؤن لوڈ کریں۔',
        exportJson: 'مکمل ایکسپورٹ (JSON)',
        exportExcel: 'ٹیبل ایکسپورٹ (Excel)',
        downloading: 'ڈاؤن لوڈ ہو رہا ہے...'
    }
  }
};