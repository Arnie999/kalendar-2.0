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
          <span onClick={() => setEditingCell(cellId)}>
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
          <span onClick={() => setEditingCell(cellId)}>
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
          <span onClick={() => setEditingCell(cellId)}>
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
          <span onClick={() => setEditingCell(cellId)}>
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
          <span onClick={() => setEditingCell(cellId)}>
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
    <div onKeyDown={handleKeyDown} tabIndex={0}>
      <div>
        <h3>Work Entries</h3>
        <p>Click any cell to edit. Press Ctrl+S to save changes.</p>
      </div>
      
      <div>
        <input
          placeholder="Filter by employee name..."
          value={(table.getColumn('employeeName')?.getFilterValue() ?? '') as string}
          onChange={event =>
            table.getColumn('employeeName')?.setFilterValue(event.target.value)
          }
        />
      </div>

      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder ? null : (
                                         <div
                       onClick={header.column.getToggleSortingHandler()}
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
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
      <div>
        <p>Total entries: {table.getRowModel().rows.length}</p>
      </div>
    </div>
  );
} 