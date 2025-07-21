'use client';

import { useState, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type ColumnFiltersState
} from '@tanstack/react-table';
import type { WorkEntry } from '@/types/payroll';

interface WorkEntryTableProps {
  data: WorkEntry[];
  onDataChange: (updatedData: WorkEntry[]) => void;
}

const columnHelper = createColumnHelper<WorkEntry>();

export function WorkEntryTable({ data, onDataChange }: WorkEntryTableProps) {
  const [workEntries, setWorkEntries] = useState<WorkEntry[]>(data);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [editingCell, setEditingCell] = useState<string | null>(null);

  useEffect(() => {
    setWorkEntries(data);
  }, [data]);

  const updateEntry = (rowIndex: number, field: keyof WorkEntry, value: any) => {
    const updated = [...workEntries];
    updated[rowIndex] = { ...updated[rowIndex], [field]: value };
    setWorkEntries(updated);
    onDataChange(updated);
  };

  const columns = [
    columnHelper.accessor('date', {
      header: 'Date',
      cell: ({ row, getValue }) => {
        const cellId = `${row.index}-date`;
        const isEditing = editingCell === cellId;
        
        return isEditing ? (
          <input
            type="date"
            defaultValue={getValue()}
            className="w-full px-2 py-1 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            onBlur={(e) => {
              updateEntry(row.index, 'date', e.target.value);
              setEditingCell(null);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                updateEntry(row.index, 'date', e.currentTarget.value);
                setEditingCell(null);
              }
              if (e.key === 'Escape') {
                setEditingCell(null);
              }
            }}
            autoFocus
          />
        ) : (
          <span onClick={() => setEditingCell(cellId)} className="cursor-pointer hover:text-primary transition-colors">
            {getValue()}
          </span>
        );
      }
    }),
    
    columnHelper.accessor('employeeName', {
      header: 'Employee',
      cell: ({ row, getValue }) => {
        const cellId = `${row.index}-employeeName`;
        const isEditing = editingCell === cellId;
        
        return isEditing ? (
          <input
            type="text"
            defaultValue={getValue()}
            className="w-full px-2 py-1 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            onBlur={(e) => {
              updateEntry(row.index, 'employeeName', e.target.value);
              setEditingCell(null);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                updateEntry(row.index, 'employeeName', e.currentTarget.value);
                setEditingCell(null);
              }
              if (e.key === 'Escape') {
                setEditingCell(null);
              }
            }}
            autoFocus
          />
        ) : (
          <span onClick={() => setEditingCell(cellId)} className="cursor-pointer hover:text-primary transition-colors">
            {getValue()}
          </span>
        );
      }
    }),
    
    columnHelper.accessor('hours', {
      header: 'Hours',
      cell: ({ row, getValue }) => {
        const cellId = `${row.index}-hours`;
        const isEditing = editingCell === cellId;
        
        return isEditing ? (
          <input
            type="number"
            step="0.5"
            min="0"
            defaultValue={getValue()}
            className="w-full px-2 py-1 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            onBlur={(e) => {
              updateEntry(row.index, 'hours', parseFloat(e.target.value));
              setEditingCell(null);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                updateEntry(row.index, 'hours', parseFloat(e.currentTarget.value));
                setEditingCell(null);
              }
              if (e.key === 'Escape') {
                setEditingCell(null);
              }
            }}
            autoFocus
          />
        ) : (
          <span onClick={() => setEditingCell(cellId)} className="cursor-pointer hover:text-primary transition-colors">
            {getValue()}
          </span>
        );
      }
    }),
    
    columnHelper.accessor('tips', {
      header: 'Tips (CZK)',
      cell: ({ row, getValue }) => {
        const cellId = `${row.index}-tips`;
        const isEditing = editingCell === cellId;
        
        return isEditing ? (
          <input
            type="number"
            min="0"
            defaultValue={getValue()}
            className="w-full px-2 py-1 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            onBlur={(e) => {
              updateEntry(row.index, 'tips', parseFloat(e.target.value) || 0);
              setEditingCell(null);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                updateEntry(row.index, 'tips', parseFloat(e.currentTarget.value) || 0);
                setEditingCell(null);
              }
              if (e.key === 'Escape') {
                setEditingCell(null);
              }
            }}
            autoFocus
          />
        ) : (
          <span onClick={() => setEditingCell(cellId)} className="cursor-pointer hover:text-primary transition-colors">
            {getValue()}
          </span>
        );
      }
    }),
    
    columnHelper.accessor('bonus', {
      header: 'Bonus (CZK)',
      cell: ({ row, getValue }) => {
        const cellId = `${row.index}-bonus`;
        const isEditing = editingCell === cellId;
        
        return isEditing ? (
          <input
            type="number"
            min="0"
            defaultValue={getValue()}
            className="w-full px-2 py-1 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            onBlur={(e) => {
              updateEntry(row.index, 'bonus', parseFloat(e.target.value) || 0);
              setEditingCell(null);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                updateEntry(row.index, 'bonus', parseFloat(e.currentTarget.value) || 0);
                setEditingCell(null);
              }
              if (e.key === 'Escape') {
                setEditingCell(null);
              }
            }}
            autoFocus
          />
        ) : (
          <span onClick={() => setEditingCell(cellId)} className="cursor-pointer hover:text-primary transition-colors">
            {getValue()}
          </span>
        );
      }
    })
  ];

  const table = useReactTable({
    data: workEntries,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      onDataChange(workEntries);
      alert('Data saved!');
    }
  };

  return (
    <div onKeyDown={handleKeyDown} tabIndex={0} className="w-full">
      <div className="mb-6">
        <h3 className="text-heading mb-2">Work Entries</h3>
        <p className="text-body">Click any cell to edit. Press Ctrl+S to save changes.</p>
      </div>
      
      <div className="mb-4">
        <input
          placeholder="Filter by employee name..."
          value={(table.getColumn('employeeName')?.getFilterValue() ?? '') as string}
          onChange={event =>
            table.getColumn('employeeName')?.setFilterValue(event.target.value)
          }
          className="px-4 py-2 border border-input rounded-md w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full">
          <thead className="bg-muted/50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="px-4 py-3 text-left font-medium text-sm">
                    {header.isPlaceholder ? null : (
                      <div
                        onClick={header.column.getToggleSortingHandler()}
                        className="cursor-pointer select-none flex items-center gap-1 hover:text-primary transition-colors"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getIsSorted() ? (
                          header.column.getIsSorted() === 'desc' ? ' ↓' : ' ↑'
                        ) : null}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4">
        <p className="text-body">Total entries: {table.getRowModel().rows.length}</p>
      </div>
    </div>
  );
} 