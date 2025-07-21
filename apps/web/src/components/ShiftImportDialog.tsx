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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={handleClose} />
      
      {/* Dialog */}
      <div className="relative z-50 w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-background rounded-lg shadow-lg m-4">
        <header className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-heading">Import Shift Data</h2>
          <button 
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ✕
          </button>
        </header>

        <div className="p-6">
          {!previewData && (
            <div {...getRootProps()} className="cursor-pointer">
              <input {...getInputProps()} />
              <div className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
              }`}>
                {isProcessing ? (
                  <p className="text-body">Processing file...</p>
                ) : isDragActive ? (
                  <p className="text-body">Drop the file here</p>
                ) : (
                  <div className="space-y-2">
                    <p className="text-body">Drag and drop a shift file here, or click to select</p>
                    <p className="text-sm text-muted-foreground">Supported formats: .xlsx, .xls, .csv</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {previewData && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Import Preview</h3>
              
              {previewData.errors.length > 0 && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                  <h4 className="font-medium text-destructive mb-2">Errors:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {previewData.errors.map((error, index) => (
                      <li key={index} className="text-sm text-destructive">{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {previewData.unknownEmployees.length > 0 && (
                <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                  <h4 className="font-medium text-accent-foreground mb-2">Unknown Employees:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {previewData.unknownEmployees.map((employee, index) => (
                      <li key={index} className="text-sm">{employee}</li>
                    ))}
                  </ul>
                  <p className="text-sm text-muted-foreground mt-2">These employees will be created automatically.</p>
                </div>
              )}

              {previewData.data.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Data Preview ({previewData.data.length} entries):</h4>
                  <div className="overflow-x-auto rounded-lg border border-border">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Employee</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Hours</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Tips (CZK)</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Bonus (CZK)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.data.slice(0, 10).map((item, index) => (
                          <tr key={index} className="border-b border-border">
                            <td className="px-4 py-3 text-sm">{item.date}</td>
                            <td className="px-4 py-3 text-sm">{item.employee}</td>
                            <td className="px-4 py-3 text-sm">{item.hours}</td>
                            <td className="px-4 py-3 text-sm">{item.tips}</td>
                            <td className="px-4 py-3 text-sm">{item.bonus}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {previewData.data.length > 10 && (
                    <p className="text-sm text-muted-foreground mt-2">... and {previewData.data.length - 10} more entries</p>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button 
                  onClick={handleClose}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleImport}
                  disabled={!previewData.isValid || previewData.data.length === 0}
                  className={`btn-primary ${
                    (!previewData.isValid || previewData.data.length === 0) 
                      ? 'opacity-50 cursor-not-allowed' 
                      : ''
                  }`}
                >
                  Import {previewData.data.length} Entries
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 