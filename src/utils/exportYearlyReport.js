import jsPDF from "jspdf";
import "jspdf-autotable";

export const exportYearlyReportPDF = (yearlySales) => {
  const doc = new jsPDF();
  doc.text("Yearly Sales Report", 14, 15);

  const tableData = yearlySales.map((item) => [item._id, item.total]);

  doc.autoTable({
    head: [["Year", "Total Sales"]],
    body: tableData,
    startY: 25,
  });

  doc.save("yearly-sales-report.pdf");
};
