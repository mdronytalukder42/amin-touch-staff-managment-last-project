import jsPDF from 'jspdf';

interface InvoiceData {
  staffName: string;
  period: string;
  incomeEntries: Array<{
    date: string;
    type: string;
    description: string;
    amount: number;
  }>;
  ticketEntries: Array<{
    date: string;
    passengerName: string;
    pnr: string;
    flightName: string;
    from: string;
    to: string;
  }>;
  totalIncome: number;
  totalOTP: number;
  totalTickets: number;
}

export async function generateInvoicePDF(data: InvoiceData) {
  const doc = new jsPDF();
  
  // Set font
  doc.setFont('helvetica');
  
  // Add company logo (if available)
  try {
    const logoImg = new Image();
    logoImg.src = '/logo.png';
    await new Promise((resolve, reject) => {
      logoImg.onload = resolve;
      logoImg.onerror = reject;
      setTimeout(reject, 1000); // Timeout after 1 second
    });
    doc.addImage(logoImg, 'PNG', 15, 10, 30, 30);
  } catch (error) {
    // Logo not available, skip
    console.log('Logo not available for PDF');
  }
  
  // Company header
  doc.setFontSize(20);
  doc.setTextColor(0, 0, 139); // Dark blue
  doc.text('AMIN TOUCH', 50, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text('TRADING CONTRACTING & HOSPITALITY SERVICES', 50, 27);
  
  // Invoice title
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('STAFF REPORT', 15, 50);
  
  // Staff info
  doc.setFontSize(11);
  doc.text(`Staff Name: ${data.staffName}`, 15, 60);
  doc.text(`Period: ${data.period}`, 15, 67);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 15, 74);
  
  // Summary section
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 139);
  doc.text('Summary', 15, 90);
  
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text(`Total Income: QR ${data.totalIncome.toFixed(2)}`, 15, 100);
  doc.text(`Total OTP: QR ${data.totalOTP.toFixed(2)}`, 15, 107);
  doc.text(`Total Tickets: ${data.totalTickets}`, 15, 114);
  
  let yPos = 130;
  
  // Income entries
  if (data.incomeEntries.length > 0) {
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 139);
    doc.text('Income Entries', 15, yPos);
    yPos += 10;
    
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    
    // Table header
    doc.text('Date', 15, yPos);
    doc.text('Type', 50, yPos);
    doc.text('Description', 90, yPos);
    doc.text('Amount (QR)', 160, yPos);
    yPos += 7;
    
    // Draw line
    doc.line(15, yPos - 2, 195, yPos - 2);
    
    // Table rows
    data.incomeEntries.forEach((entry) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.text(entry.date, 15, yPos);
      doc.text(entry.type, 50, yPos);
      doc.text(entry.description.substring(0, 30), 90, yPos);
      doc.text(entry.amount.toFixed(2), 160, yPos);
      yPos += 7;
    });
    
    yPos += 10;
  }
  
  // Ticket entries
  if (data.ticketEntries.length > 0) {
    if (yPos > 200) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 139);
    doc.text('Ticket Entries', 15, yPos);
    yPos += 10;
    
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    
    // Table header
    doc.text('Date', 15, yPos);
    doc.text('Passenger', 40, yPos);
    doc.text('PNR', 80, yPos);
    doc.text('Flight', 110, yPos);
    doc.text('Route', 145, yPos);
    yPos += 7;
    
    // Draw line
    doc.line(15, yPos - 2, 195, yPos - 2);
    
    // Table rows
    data.ticketEntries.forEach((entry) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.text(entry.date, 15, yPos);
      doc.text(entry.passengerName.substring(0, 15), 40, yPos);
      doc.text(entry.pnr, 80, yPos);
      doc.text(entry.flightName.substring(0, 12), 110, yPos);
      doc.text(`${entry.from}-${entry.to}`, 145, yPos);
      yPos += 7;
    });
  }
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
    doc.text(
      '© 2025 AMIN TOUCH. All rights reserved.',
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 5,
      { align: 'center' }
    );
  }
  
  // Save the PDF
  const fileName = `${data.staffName.replace(/\s+/g, '_')}_Report_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}
