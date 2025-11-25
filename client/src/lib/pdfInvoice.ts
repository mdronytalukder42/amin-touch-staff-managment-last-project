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
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Set font
  doc.setFont('helvetica');
  
  // Add decorative header background
  doc.setFillColor(25, 118, 210); // Professional blue
  doc.rect(0, 0, pageWidth, 50, 'F');
  
  // Add company logo (if available)
  let logoLoaded = false;
  try {
    const logoImg = new Image();
    logoImg.src = '/logo.png';
    await new Promise((resolve, reject) => {
      logoImg.onload = resolve;
      logoImg.onerror = reject;
      setTimeout(reject, 1000);
    });
    doc.addImage(logoImg, 'PNG', 15, 8, 20, 20);
    logoLoaded = true;
  } catch (error) {
    console.log('Logo not available for PDF');
  }
  
  // Company header text
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('AMIN TOUCH', logoLoaded ? 40 : 15, 20);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(220, 220, 220);
  doc.text('TRADING CONTRACTING & HOSPITALITY SERVICES', logoLoaded ? 40 : 15, 28);
  
  // Add logo watermark in middle (low opacity)
  try {
    const watermarkImg = new Image();
    watermarkImg.src = '/logo.png';
    await new Promise((resolve, reject) => {
      watermarkImg.onload = resolve;
      watermarkImg.onerror = reject;
      setTimeout(reject, 1000);
    });
    // Add watermark with reduced visibility
    doc.addImage(watermarkImg, 'PNG', pageWidth / 2 - 30, pageHeight / 2 - 40, 60, 60);
  } catch (error) {
    console.log('Watermark logo not available');
  }
  
  // Invoice title with line
  doc.setFontSize(16);
  doc.setTextColor(25, 118, 210);
  doc.setFont('helvetica', 'bold');
  doc.text('STAFF REPORT', 15, 65);
  
  // Decorative line under title
  doc.setDrawColor(25, 118, 210);
  doc.setLineWidth(0.5);
  doc.line(15, 68, 60, 68);
  
  // Staff info section with background
  doc.setFillColor(240, 245, 250);
  doc.rect(15, 75, pageWidth - 30, 25, 'F');
  
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  doc.setFont('helvetica', 'normal');
  doc.text(`Staff Name: ${data.staffName}`, 20, 83);
  doc.text(`Period: ${data.period}`, 20, 90);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 97);
  
  // Summary section
  doc.setFontSize(13);
  doc.setTextColor(25, 118, 210);
  doc.setFont('helvetica', 'bold');
  doc.text('Summary', 15, 115);
  
  // Summary box
  doc.setFillColor(245, 250, 255);
  doc.rect(15, 120, pageWidth - 30, 22, 'F');
  doc.setDrawColor(25, 118, 210);
  doc.setLineWidth(0.3);
  doc.rect(15, 120, pageWidth - 30, 22);
  
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  doc.setFont('helvetica', 'normal');
  const summaryX = 20;
  const colWidth = (pageWidth - 50) / 3;
  
  doc.text(`Total Income`, summaryX, 127);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 128, 0);
  doc.text(`QR ${data.totalIncome.toFixed(2)}`, summaryX, 133);
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(40, 40, 40);
  doc.text(`Total OTP`, summaryX + colWidth, 127);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 128, 0);
  doc.text(`QR ${data.totalOTP.toFixed(2)}`, summaryX + colWidth, 133);
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(40, 40, 40);
  doc.text(`Total Tickets`, summaryX + colWidth * 2, 127);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 128, 0);
  doc.text(`${data.totalTickets}`, summaryX + colWidth * 2, 133);
  
  let yPos = 150;
  
  // Income entries
  if (data.incomeEntries.length > 0) {
    doc.setFontSize(12);
    doc.setTextColor(25, 118, 210);
    doc.setFont('helvetica', 'bold');
    doc.text('Income Entries', 15, yPos);
    yPos += 8;
    
    // Table header with background
    doc.setFillColor(25, 118, 210);
    doc.rect(15, yPos - 4, pageWidth - 30, 6, 'F');
    
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('Date', 18, yPos);
    doc.text('Type', 50, yPos);
    doc.text('Description', 90, yPos);
    doc.text('Amount (QR)', 160, yPos);
    yPos += 8;
    
    // Table rows
    doc.setFontSize(9);
    doc.setTextColor(40, 40, 40);
    doc.setFont('helvetica', 'normal');
    
    let rowCount = 0;
    data.incomeEntries.forEach((entry) => {
      if (yPos > 260) {
        doc.addPage();
        yPos = 20;
        
        // Repeat header on new page
        doc.setFillColor(25, 118, 210);
        doc.rect(15, yPos - 4, pageWidth - 30, 6, 'F');
        doc.setFontSize(9);
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.text('Date', 18, yPos);
        doc.text('Type', 50, yPos);
        doc.text('Description', 90, yPos);
        doc.text('Amount (QR)', 160, yPos);
        yPos += 8;
        doc.setTextColor(40, 40, 40);
        doc.setFont('helvetica', 'normal');
      }
      
      // Alternating row colors
      if (rowCount % 2 === 0) {
        doc.setFillColor(245, 250, 255);
        doc.rect(15, yPos - 4, pageWidth - 30, 6, 'F');
      }
      
      doc.text(entry.date, 18, yPos);
      doc.text(entry.type, 50, yPos);
      doc.text(entry.description.substring(0, 25), 90, yPos);
      doc.text(entry.amount.toFixed(2), 160, yPos);
      yPos += 6;
      rowCount++;
    });
    
    // Bottom border for table
    doc.setDrawColor(25, 118, 210);
    doc.setLineWidth(0.5);
    doc.line(15, yPos - 2, pageWidth - 15, yPos - 2);
    
    yPos += 10;
  }
  
  // Ticket entries
  if (data.ticketEntries.length > 0) {
    if (yPos > 200) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFontSize(12);
    doc.setTextColor(25, 118, 210);
    doc.setFont('helvetica', 'bold');
    doc.text('Ticket Entries', 15, yPos);
    yPos += 8;
    
    // Table header with background
    doc.setFillColor(25, 118, 210);
    doc.rect(15, yPos - 4, pageWidth - 30, 6, 'F');
    
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('Date', 18, yPos);
    doc.text('Passenger', 40, yPos);
    doc.text('PNR', 80, yPos);
    doc.text('Flight', 110, yPos);
    doc.text('Route', 145, yPos);
    yPos += 8;
    
    // Table rows
    doc.setFontSize(9);
    doc.setTextColor(40, 40, 40);
    doc.setFont('helvetica', 'normal');
    
    let rowCount = 0;
    data.ticketEntries.forEach((entry) => {
      if (yPos > 260) {
        doc.addPage();
        yPos = 20;
        
        // Repeat header on new page
        doc.setFillColor(25, 118, 210);
        doc.rect(15, yPos - 4, pageWidth - 30, 6, 'F');
        doc.setFontSize(9);
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.text('Date', 18, yPos);
        doc.text('Passenger', 40, yPos);
        doc.text('PNR', 80, yPos);
        doc.text('Flight', 110, yPos);
        doc.text('Route', 145, yPos);
        yPos += 8;
        doc.setTextColor(40, 40, 40);
        doc.setFont('helvetica', 'normal');
      }
      
      // Alternating row colors
      if (rowCount % 2 === 0) {
        doc.setFillColor(245, 250, 255);
        doc.rect(15, yPos - 4, pageWidth - 30, 6, 'F');
      }
      
      doc.text(entry.date, 18, yPos);
      doc.text(entry.passengerName.substring(0, 15), 40, yPos);
      doc.text(entry.pnr, 80, yPos);
      doc.text(entry.flightName.substring(0, 12), 110, yPos);
      doc.text(`${entry.from}-${entry.to}`, 145, yPos);
      yPos += 6;
      rowCount++;
    });
    
    // Bottom border for table
    doc.setDrawColor(25, 118, 210);
    doc.setLineWidth(0.5);
    doc.line(15, yPos - 2, pageWidth - 15, yPos - 2);
  }
  
  // Footer on all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Footer background
    doc.setFillColor(240, 245, 250);
    doc.rect(0, pageHeight - 15, pageWidth, 15, 'F');
    
    // Footer border
    doc.setDrawColor(25, 118, 210);
    doc.setLineWidth(0.5);
    doc.line(0, pageHeight - 15, pageWidth, pageHeight - 15);
    
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
    doc.text(
      '© 2025 AMIN TOUCH. All rights reserved.',
      pageWidth / 2,
      pageHeight - 4,
      { align: 'center' }
    );
  }
  
  // Save the PDF
  const fileName = `${data.staffName.replace(/\s+/g, '_')}_Report_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}
