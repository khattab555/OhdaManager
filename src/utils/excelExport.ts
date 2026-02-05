import { utils, writeFile } from 'xlsx';
import { Loan, LogEntry } from '../types';

export const exportToExcel = (
  loans: Loan[],
  logs: LogEntry[],
  reportType: 'general' | 'employee',
  startDate: string,
  endDate: string,
  employeeName?: string
) => {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  let data: any[] = [];
  let fileName = '';

  if (reportType === 'general') {
    fileName = `General_Report_${startDate}_to_${endDate}.xlsx`;
    
    // Filter loans within date range
    const filteredLoans = loans.filter(loan => {
      const loanDate = new Date(loan.createdAt);
      return loanDate >= start && loanDate <= end;
    });

    data = filteredLoans.map(loan => ({
      'اسم الموظف': loan.employeeName,
      'تاريخ السلفة': new Date(loan.createdAt).toLocaleDateString('ar-AE'),
      'المبلغ الكلي': loan.amount,
      'الرصيد المتبقي': loan.remainingBalance,
      'قيمة القسط': loan.monthlyPayment,
      'عدد الدفعات': loan.installmentsCount || 3,
      'نوع السلفة': loan.loanType === 'salary_advance' ? 'سلفة راتب' : 'عادية',
      'حالة السداد': loan.remainingBalance === 0 ? 'مسددة بالكامل' : 'قائمة'
    }));

  } else {
    fileName = `Employee_Report_${employeeName || 'All'}_${startDate}_to_${endDate}.xlsx`;
    
    // Filter loans for specific employee and date range
    const filteredLoans = loans.filter(loan => {
      const loanDate = new Date(loan.createdAt);
      const nameMatch = !employeeName || loan.employeeName.toLowerCase().includes(employeeName.toLowerCase());
      return nameMatch && loanDate >= start && loanDate <= end;
    });

    // Create detailed rows for each payment
    filteredLoans.forEach(loan => {
      loan.payments.forEach((payment, index) => {
        data.push({
          'اسم الموظف': loan.employeeName,
          'رقم السلفة': loan.id.substring(0, 8),
          'تاريخ السلفة': new Date(loan.createdAt).toLocaleDateString('ar-AE'),
          'الدفعة': index + 1,
          'تاريخ الاستحقاق': new Date(payment.dueDate).toLocaleDateString('ar-AE'),
          'المبلغ': payment.amount,
          'الحالة': payment.status === 'paid' ? 'مدفوعة' : 'مستحقة',
          'تاريخ السداد الفعلي': payment.paidAt ? new Date(payment.paidAt).toLocaleDateString('ar-AE') : '-'
        });
      });
    });
  }

  // Create workbook and worksheet
  const ws = utils.json_to_sheet(data);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, "Report");

  // Adjust column widths
  const wscols = Object.keys(data[0] || {}).map(() => ({ wch: 20 }));
  ws['!cols'] = wscols;

  // Save file
  writeFile(wb, fileName);
};