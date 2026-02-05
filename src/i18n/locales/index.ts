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
      language: 'اللغة',
      languageDesc: 'تغيير لغة التطبيق',
      add: 'إضافة',
      pay: 'سداد الآن',
      paid: 'تم السداد',
      cancel: 'إلغاء',
      confirm: 'تأكيد',
      save: 'حفظ التغييرات',
      details: 'التفاصيل',
      export: 'تصدير إلى Excel',
      logout: 'تسجيل خروج',
      logs: 'سجل العمليات (Log)'
    },
    loans: {
      activeLoans: 'قائمة السلف النشطة',
      noActiveLoans: 'لا توجد سلف نشطة حالياً',
      employeeName: 'اسم الموظف',
      amount: 'مبلغ السلفة',
      remaining: 'الرصيد المتبقي',
      date: 'تاريخ الإضافة',
      status: 'الحالة',
      actions: 'الإجراءات',
      addLoan: 'إضافة سلفة جديدة',
      loanType: 'نوع السداد',
      onePayment: 'دفعة واحدة',
      twoPayments: 'دفعتين',
      threePayments: 'ثلاث دفعات',
      salaryAdvance: 'سلفة راتب'
    },
    status: {
      paid: 'مسددة',
      waitingPayment: 'بانتظار التسديد',
      waitingSecond: 'بانتظار الدفعة الثانية',
      waitingThird: 'بانتظار الدفعة الثالثة',
      waitingLast: 'بانتظار الدفعة الأخيرة',
      inProgress: 'جاري السداد'
    },
    notifications: {
      title: 'الإشعارات',
      new: 'جديد',
      empty: 'لا توجد إشعارات جديدة',
      dueToday: 'اليوم موعد استحقاق الدفعة {{payment}} للموظف {{employee}}',
      dueTomorrow: 'غداً موعد استحقاق الدفعة {{payment}} للموظف {{employee}}',
      dueInDays: 'باقي {{days}} أيام على استحقاق الدفعة {{payment}} للموظف {{employee}}'
    },
    modals: {
      updateFund: {
        title: 'تحديث الحد الأقصى للعهدة',
        currentFund: 'العهدة الحالية',
        usedAmount: 'المبلغ المستخدم (ديون)',
        newMax: 'الحد الأقصى الجديد',
        placeholder: 'أدخل المبلغ الجديد',
        error: 'يجب أن يكون المبلغ أكبر من المبلغ المستخدم حالياً ({{amount}})',
        newBalance: 'الرصيد المتاح الجديد سيكون'
      }
    },
    loanDetails: {
      notFound: 'السلفة غير موجودة',
      backToHome: 'العودة للرئيسية',
      dateAdded: 'تاريخ الإضافة',
      totalAmount: 'المبلغ الكلي',
      remainingBalance: 'الرصيد المتبقي للسداد',
      monthlyPayment: 'قيمة الدفعة الشهرية',
      paymentSchedule: 'جدول الدفعات',
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
      confirmPaymentMessage: 'هل أنت متأكد من رغبتك في سداد هذه الدفعة وخصمها من العهدة؟'
    },
    logs: {
      updateFund: 'تحديث الحد الأقصى للعهدة من {{old}} إلى {{new}}',
      addLoan: 'إضافة سلفة للموظف {{employee}} بقيمة {{amount}}',
      earlyPayment: 'سداد مبكر (إجباري) لدفعة بقيمة {{amount}} للموظف {{employee}}',
      regularPayment: 'سداد دفعة بقيمة {{amount}} للموظف {{employee}}'
    },
    footer: {
      rights: 'حقوق الطباعة والنشر محفوظة لصالح مجموعة بن حريز القابضة في الامارات العربية المتحدة',
      developer: 'تم الاعداد بواسطة المهندس محمد خطاب'
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
      language: 'Language',
      languageDesc: 'Change application language',
      add: 'Add',
      pay: 'Pay Now',
      paid: 'Paid',
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save Changes',
      details: 'Details',
      export: 'Export to Excel',
      logout: 'Logout',
      logs: 'Activity Log'
    },
    loans: {
      activeLoans: 'Active Loans',
      noActiveLoans: 'No active loans currently',
      employeeName: 'Employee Name',
      amount: 'Loan Amount',
      remaining: 'Remaining Balance',
      date: 'Date Added',
      status: 'Status',
      actions: 'Actions',
      addLoan: 'Add New Loan',
      loanType: 'Payment Type',
      onePayment: 'One Payment',
      twoPayments: 'Two Payments',
      threePayments: 'Three Payments',
      salaryAdvance: 'Salary Advance'
    },
    status: {
      paid: 'Paid',
      waitingPayment: 'Waiting for Payment',
      waitingSecond: 'Waiting for 2nd Payment',
      waitingThird: 'Waiting for 3rd Payment',
      waitingLast: 'Waiting for Last Payment',
      inProgress: 'In Progress'
    },
    notifications: {
      title: 'Notifications',
      new: 'New',
      empty: 'No new notifications',
      dueToday: 'Payment {{payment}} due today for {{employee}}',
      dueTomorrow: 'Payment {{payment}} due tomorrow for {{employee}}',
      dueInDays: 'Payment {{payment}} due in {{days}} days for {{employee}}'
    },
    modals: {
      updateFund: {
        title: 'Update Maximum Fund',
        currentFund: 'Current Fund',
        usedAmount: 'Used Amount (Debts)',
        newMax: 'New Maximum Limit',
        placeholder: 'Enter new amount',
        error: 'Amount must be greater than currently used amount ({{amount}})',
        newBalance: 'New available balance will be'
      }
    },
    loanDetails: {
      notFound: 'Loan not found',
      backToHome: 'Back to Home',
      dateAdded: 'Date Added',
      totalAmount: 'Total Amount',
      remainingBalance: 'Remaining Balance',
      monthlyPayment: 'Monthly Payment',
      paymentSchedule: 'Payment Schedule',
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
      confirmPaymentMessage: 'Are you sure you want to pay this installment and deduct it from the fund?'
    },
    logs: {
      updateFund: 'Updated max fund from {{old}} to {{new}}',
      addLoan: 'Added loan for {{employee}} with amount {{amount}}',
      earlyPayment: 'Early payment (Forced) of {{amount}} for {{employee}}',
      regularPayment: 'Payment of {{amount}} for {{employee}}'
    },
    footer: {
      rights: 'Copyright reserved for Bin Hareb Holding Group in UAE',
      developer: 'Developed by Eng. Mohammad Khattab'
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
      language: 'زبان',
      languageDesc: 'ایپلیکیشن کی زبان تبدیل کریں',
      add: 'شامل کریں',
      pay: 'اب ادا کریں',
      paid: 'ادا کر دیا',
      cancel: 'منسوخ کریں',
      confirm: 'تصدیق کریں',
      save: 'تبدیلیاں محفوظ کریں',
      details: 'تفصیلات',
      export: 'ایکسل میں ایکسپورٹ کریں',
      logout: 'لاگ آؤٹ',
      logs: 'سرگرمی لاگ'
    },
    loans: {
      activeLoans: 'فعال قرضے',
      noActiveLoans: 'فی الحال کوئی فعال قرض نہیں ہے',
      employeeName: 'ملازم کا نام',
      amount: 'قرض کی رقم',
      remaining: 'بقیہ رقم',
      date: 'تاریخ',
      status: 'حیثیت',
      actions: 'اعمال',
      addLoan: 'نیا قرض شامل کریں',
      loanType: 'ادائیگی کی قسم',
      onePayment: 'ایک ادائیگی',
      twoPayments: 'دو ادائیگیاں',
      threePayments: 'تین ادائیگیاں',
      salaryAdvance: 'تنخواہ پیشگی'
    },
    status: {
      paid: 'ادا شدہ',
      waitingPayment: 'ادائیگی کا انتظار',
      waitingSecond: 'دوسری ادائیگی کا انتظار',
      waitingThird: 'تیسری ادائیگی کا انتظار',
      waitingLast: 'آخری ادائیگی کا انتظار',
      inProgress: 'جاری ہے'
    },
    notifications: {
      title: 'اطلاعات',
      new: 'نیا',
      empty: 'کوئی نئی اطلاع نہیں',
      dueToday: 'ملازم {{employee}} کی قسط {{payment}} آج واجب الادا ہے',
      dueTomorrow: 'ملازم {{employee}} کی قسط {{payment}} کل واجب الادا ہے',
      dueInDays: 'ملازم {{employee}} کی قسط {{payment}} {{days}} دنوں میں واجب الادا ہے'
    },
    modals: {
      updateFund: {
        title: 'زیادہ سے زیادہ فنڈ کو اپ ڈیٹ کریں',
        currentFund: 'موجودہ فنڈ',
        usedAmount: 'استعمال شدہ رقم (قرضے)',
        newMax: 'نئی زیادہ سے زیادہ حد',
        placeholder: 'نئی رقم درج کریں',
        error: 'رقم موجودہ استعمال شدہ رقم ({{amount}}) سے زیادہ ہونی چاہیے',
        newBalance: 'نیا دستیاب بیلنس ہوگا'
      }
    },
    loanDetails: {
      notFound: 'قرض نہیں ملا',
      backToHome: 'ہوم پیج پر واپس جائیں',
      dateAdded: 'شامل کرنے کی تاریخ',
      totalAmount: 'کل رقم',
      remainingBalance: 'بقیہ رقم',
      monthlyPayment: 'ماہانہ قسط',
      paymentSchedule: 'ادائیگی کا شیڈول',
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
      confirmPaymentMessage: 'کیا آپ واقعی اس قسط کو ادا کرنا چاہتے ہیں اور اسے فنڈ سے منہا کرنا چاہتے ہیں؟'
    },
    logs: {
      updateFund: 'زیادہ سے زیادہ فنڈ {{old}} سے {{new}} تک اپ ڈیٹ کیا گیا',
      addLoan: '{{employee}} کے لیے {{amount}} کا قرض شامل کیا گیا',
      earlyPayment: '{{employee}} کے لیے {{amount}} کی جلد ادائیگی (زبردستی)',
      regularPayment: '{{employee}} کے لیے {{amount}} کی ادائیگی'
    },
    footer: {
      rights: 'کاپی رائٹ بن حارب ہولڈنگ گروپ متحدہ عرب امارات کے لیے محفوظ ہے',
      developer: 'انجینئر محمد خطاب نے تیار کیا'
    }
  }
};