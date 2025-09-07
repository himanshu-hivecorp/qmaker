import React from 'react';
import { FileText, File } from 'lucide-react';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import { getOptionLabel, getQuestionPrefix } from '../utils/languageOptions';

function ExportButtons({ questions, optionLayout, paperName, layoutSettings = {} }) {
  const formatOptionsForExport = (options, layout, language = 'english') => {
    if (layout === 'horizontal') {
      return options.map((opt, i) => `(${getOptionLabel(i, language)}) ${opt}`).join('    ');
    }
    return options.map((opt, i) => `   (${getOptionLabel(i, language)}) ${opt}`).join('\n');
  };

  const exportToPDF = () => {
    const pdf = new jsPDF();
    const pageHeight = pdf.internal.pageSize.height;
    const pageWidth = pdf.internal.pageSize.width;
    const margin = parseInt(layoutSettings.marginSize || 32) / 2;
    const lineHeight = layoutSettings.lineSpacing ? 7 * parseFloat(layoutSettings.lineSpacing) : 7;
    const questionGap = parseInt(layoutSettings.questionSpacing || 24) / 3;
    let yPosition = margin;

    // Set font family based on settings
    const fontMap = {
      'serif': 'times',
      'sans-serif': 'helvetica',
      'system-ui': 'helvetica',
      'Georgia, serif': 'times',
      "'Courier New', monospace": 'courier',
      'Verdana, sans-serif': 'helvetica',
      "'Trebuchet MS', sans-serif": 'helvetica'
    };
    const selectedFont = fontMap[layoutSettings.fontFamily] || 'times';
    
    pdf.setFont(selectedFont, 'bold');
    pdf.setFontSize(parseInt(layoutSettings.questionSize || 16) + 4);
    pdf.text(paperName || 'QUESTION PAPER', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.text(`Total Questions: ${questions.length}`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    pdf.setFontSize(parseInt(layoutSettings.questionSize || 16) - 2);

    questions.forEach((q, index) => {
      const questionText = `${getQuestionPrefix(q.language)}${index + 1}. ${q.question}`;
      const lines = pdf.splitTextToSize(questionText, pageWidth - 2 * margin);
      
      if (yPosition + lines.length * lineHeight + 40 > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }

      pdf.setFont(selectedFont, 'bold');
      lines.forEach((line) => {
        pdf.text(line, margin, yPosition);
        yPosition += lineHeight;
      });

      pdf.setFont(selectedFont, 'normal');
      pdf.setFontSize(parseInt(layoutSettings.optionSize || 14) - 2);
      yPosition += 3;

      if (optionLayout === 'horizontal') {
        const optionsText = formatOptionsForExport(q.options, optionLayout, q.language);
        const optionLines = pdf.splitTextToSize(optionsText, pageWidth - 2 * margin);
        optionLines.forEach((line) => {
          pdf.text(line, margin + 5, yPosition);
          yPosition += lineHeight;
        });
      } else if (optionLayout === 'grid') {
        for (let i = 0; i < q.options.length; i += 2) {
          const leftOption = `(${getOptionLabel(i, q.language)}) ${q.options[i]}`;
          const rightOption = i + 1 < q.options.length ? `(${getOptionLabel(i + 1, q.language)}) ${q.options[i + 1]}` : '';
          
          pdf.text(leftOption, margin + 5, yPosition);
          if (rightOption) {
            pdf.text(rightOption, pageWidth / 2, yPosition);
          }
          yPosition += lineHeight;
        }
      } else {
        q.options.forEach((option, optIndex) => {
          const optionText = `   (${getOptionLabel(optIndex, q.language)}) ${option}`;
          const optionLines = pdf.splitTextToSize(optionText, pageWidth - 2 * margin - 10);
          optionLines.forEach((line) => {
            pdf.text(line, margin + 5, yPosition);
            yPosition += lineHeight;
          });
        });
      }

      yPosition += questionGap;
    });

    if (yPosition + 20 > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
    }
    
    pdf.setFont(selectedFont, 'italic');
    pdf.setFontSize(10);
    pdf.text('*** End of Question Paper ***', pageWidth / 2, yPosition + 10, { align: 'center' });

    const filename = paperName ? `${paperName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf` : 'question-paper.pdf';
    pdf.save(filename);
  };

  const exportToWord = async () => {
    const children = [];

    children.push(
      new Paragraph({
        text: paperName || 'QUESTION PAPER',
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      })
    );

    children.push(
      new Paragraph({
        text: `Total Questions: ${questions.length}`,
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      })
    );

    questions.forEach((q, index) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${getQuestionPrefix(q.language)}${index + 1}. ${q.question}`,
              bold: true,
            }),
          ],
          spacing: { before: 200, after: 200 },
        })
      );

      if (optionLayout === 'horizontal') {
        children.push(
          new Paragraph({
            text: q.options.map((opt, i) => `(${getOptionLabel(i, q.language)}) ${opt}`).join('    '),
            indent: { left: 360 },
            spacing: { after: 200 },
          })
        );
      } else if (optionLayout === 'grid') {
        for (let i = 0; i < q.options.length; i += 2) {
          const rowText = `(${getOptionLabel(i, q.language)}) ${q.options[i]}` +
            (i + 1 < q.options.length ? `        (${getOptionLabel(i + 1, q.language)}) ${q.options[i + 1]}` : '');
          children.push(
            new Paragraph({
              text: rowText,
              indent: { left: 360 },
              spacing: { after: 100 },
            })
          );
        }
        children.push(new Paragraph({ text: '', spacing: { after: 100 } }));
      } else {
        q.options.forEach((option, optIndex) => {
          children.push(
            new Paragraph({
              text: `(${getOptionLabel(optIndex, q.language)}) ${option}`,
              indent: { left: 360 },
              spacing: { after: 100 },
            })
          );
        });
        children.push(new Paragraph({ text: '', spacing: { after: 100 } }));
      }
    });

    children.push(
      new Paragraph({
        text: '*** End of Question Paper ***',
        alignment: AlignmentType.CENTER,
        spacing: { before: 600 },
      })
    );

    const doc = new Document({
      sections: [{
        properties: {},
        children: children,
      }],
    });

    const blob = await Packer.toBlob(doc);
    const filename = paperName ? `${paperName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.docx` : 'question-paper.docx';
    saveAs(blob, filename);
  };

  return (
    <div className="flex space-x-2">
      <button
        onClick={exportToPDF}
        className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
      >
        <FileText className="h-4 w-4" />
        <span>Export PDF</span>
      </button>
      <button
        onClick={exportToWord}
        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        <File className="h-4 w-4" />
        <span>Export Word</span>
      </button>
    </div>
  );
}

export default ExportButtons;