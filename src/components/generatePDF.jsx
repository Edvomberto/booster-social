import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

const generatePDF = async () => {
  try {
    const doc = new jsPDF();
    console.log('Generating PDF...');

    for (const [index, item] of carouselItems.entries()) {
      const element = previewBack.current;
      if (element) {
        console.log(`Rendering item ${index}...`);
        setCurrentPageIndex(index);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for rendering

        const imgData = await toPng(element, { quality: 1 });
        if (index > 0) doc.addPage();
        doc.addImage(imgData, 'PNG', 10, 10, 190, 270);
      }
    }
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    console.log('PDF generated:', pdfUrl);

    setPdf(pdfUrl);
    setShowPreviewModal(true);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};

export default generatePDF;
