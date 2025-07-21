'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { parseShiftSheet } from '@/utils/shiftParser';
import type { ImportPreviewData, ShiftImportData, WorkEntry } from '@/types/payroll';

interface ShiftImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (entries: WorkEntry[]) => void;
}

export function ShiftImportDialog({ isOpen, onClose, onImport }: ShiftImportDialogProps) {
  const [previewData, setPreviewData] = useState<ImportPreviewData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const result = await parseShiftSheet(file);
      setPreviewData(result);
    } catch (error) {
      setPreviewData({
        isValid: false,
        data: [],
        errors: [`Failed to process file: ${error instanceof Error ? error.message : 'Unknown error'}`],
        unknownEmployees: []
      });
    }
    setIsProcessing(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false
  });

  const upload = async (entries: ShiftImportData[]) => {
    await fetch('/api/import-shifts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entries.map(e => ({
        empName: e.employee,
        date: e.date,
        hours: e.hours,
        tips: e.tips,
        bonus: e.bonus
      })))
    });
  };

  const convertToWorkEntries = (entries: ShiftImportData[]): WorkEntry[] =>
    entries.map((shift, idx) => ({
      id: `import-${Date.now()}-${idx}`,
      date: shift.date,
      employeeId: `emp-${shift.employee.toLowerCase().replace(/\s+/g, '-')}`,
      employeeName: shift.employee,
      hours: shift.hours,
      tips: shift.tips,
      bonus: shift.bonus
    }));

  const handleImport = async () => {
    if (!previewData?.isValid || previewData.data.length === 0) return;

    try {
      await upload(previewData.data);
      const workEntries = convertToWorkEntries(previewData.data);
      onImport(workEntries);
      setPreviewData(null);
      onClose();
    } catch (error) {
      alert(`Failed to upload: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleClose = () => {
    setPreviewData(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <dialog open>
      <div>
        <header>
          <h2>Import Shift Data</h2>
          <button onClick={handleClose}>✕</button>
        </header>

        {!previewData && (
          <div>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <div>
                {isProcessing ? (
                  <p>Processing file...</p>
                ) : isDragActive ? (
                  <p>Drop the file here</p>
                ) : (
                  <div>
                    <p>Drag and drop a shift file here, or click to select</p>
                    <p>Supported formats: .xlsx, .xls, .csv</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {previewData && (
          <div>
            <h3>Import Preview</h3>
            
            {previewData.errors.length > 0 && (
              <div>
                <h4>Errors:</h4>
                <ul>
                  {previewData.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {previewData.unknownEmployees.length > 0 && (
              <div>
                <h4>Unknown Employees:</h4>
                <ul>
                  {previewData.unknownEmployees.map((employee, index) => (
                    <li key={index}>{employee}</li>
                  ))}
                </ul>
                <p>These employees will be created automatically.</p>
              </div>
            )}

            {previewData.data.length > 0 && (
              <div>
                <h4>Data Preview ({previewData.data.length} entries):</h4>
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Employee</th>
                      <th>Hours</th>
                      <th>Tips (CZK)</th>
                      <th>Bonus (CZK)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.data.slice(0, 10).map((item, index) => (
                      <tr key={index}>
                        <td>{item.date}</td>
                        <td>{item.employee}</td>
                        <td>{item.hours}</td>
                        <td>{item.tips}</td>
                        <td>{item.bonus}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {previewData.data.length > 10 && (
                  <p>... and {previewData.data.length - 10} more entries</p>
                )}
              </div>
            )}

            <div>
              <button onClick={handleClose}>Cancel</button>
              <button 
                onClick={handleImport}
                disabled={!previewData.isValid || previewData.data.length === 0}
              >
                Import {previewData.data.length} Entries
              </button>
            </div>
          </div>
        )}
      </div>
    </dialog>
  );
} 