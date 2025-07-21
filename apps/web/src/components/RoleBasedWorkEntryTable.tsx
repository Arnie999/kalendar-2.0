'use client';

import { useState, useEffect, useMemo } from 'react';
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
import { useUser } from '@/context/UserContext';
import { PermissionGate } from '@/components/PermissionGate';
import type { WorkEntry } from '@/types/payroll';

interface RoleBasedWorkEntryTableProps {
  data: WorkEntry[];
  onDataChange: (updatedData: WorkEntry[]) => void;
}

const columnHelper = createColumnHelper<WorkEntry>();

export function RoleBasedWorkEntryTable({ data, onDataChange }: RoleBasedWorkEntryTableProps) {
  const { currentUser, permissions } = useUser();
  const [workEntries, setWorkEntries] = useState<WorkEntry[]>(data);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [editingCell, setEditingCell] = useState<string | null>(null);

  // Filter data based on role
  const filteredData = useMemo(() => {
    if (!currentUser) return [];
    
    if (permissions.canViewAll) {
      return workEntries;
    }
    
    // Non-boss users see only their own data
    return workEntries.filter(entry => 
      entry.employeeName === currentUser.name || 
      entry.employeeId === currentUser.id
    );
  }, [workEntries, currentUser, permissions.canViewAll]);

  useEffect(() => {
    setWorkEntries(data);
  }, [data]);

  const updateEntry = (rowIndex: number, field: keyof WorkEntry, value: any) => {
    const actualIndex = workEntries.findIndex(entry => entry.id === filteredData[rowIndex].id);
    if (actualIndex === -1) return;
    
    const updated = [...workEntries];
    updated[actualIndex] = { ...updated[actualIndex], [field]: value };
    setWorkEntries(updated);
    onDataChange(updated);
  };

  const canEditField = (field: keyof WorkEntry): boolean => {
    switch (field) {
      case 'hours':
        return permissions.canEditHours;
      case 'tips':
        return permissions.canEditTips;
      case 'bonus':
        return permissions.canEditBonus;
      case 'employeeName':
      case 'date':
        return permissions.canEditAll;
      default:
        return false;
    }
  };

  const EditableCell = ({ 
    value, 
    field, 
    rowIndex, 
    type = 'text' 
  }: { 
    value: any; 
    field: keyof WorkEntry; 
    rowIndex: number; 
    type?: string; 
  }) => {
    const cellId = `${rowIndex}-${field}`;
    const isEditing = editingCell === cellId;
    const canEdit = canEditField(field);
    
    if (!canEdit) {
      return <span>{value}</span>;
    }
    
    return isEditing ? (
      <input
        type={type}
        step={type === 'number' ? '0.5' : undefined}
        min={type === 'number' ? '0' : undefined}
        defaultValue={value}
        onBlur={(e) => {
          const newValue = type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
          updateEntry(rowIndex, field, newValue);
          setEditingCell(null);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            const newValue = type === 'number' ? parseFloat(e.currentTarget.value) || 0 : e.currentTarget.value;
            updateEntry(rowIndex, field, newValue);
            setEditingCell(null);
          }
          if (e.key === 'Escape') {
            setEditingCell(null);
          }
        }}
        autoFocus
      />
    ) : (
      <span onClick={() => canEdit && setEditingCell(cellId)}>
        {value}
      </span>
    );
  };

  const columns = [
    columnHelper.accessor('date', {
      header: 'Datum',
      cell: ({ row, getValue }) => {
        const currentDate = getValue();
        const previousDate = row.index > 0 ? filteredData[row.index - 1]?.date : null;
        const shouldShowDate = currentDate !== previousDate;
        
        return shouldShowDate ? (
          <EditableCell 
            value={currentDate} 
            field="date" 
            rowIndex={row.index} 
            type="date"
          />
        ) : (
          <span></span>
        );
      }
    }),
    
    columnHelper.accessor('employeeName', {
      header: 'Zaměstnanec',
      cell: ({ row, getValue }) => (
        <EditableCell 
          value={getValue()} 
          field="employeeName" 
          rowIndex={row.index}
        />
      )
    }),
    
    columnHelper.accessor('hours', {
      header: 'Hodiny',
      cell: ({ row, getValue }) => (
        <EditableCell 
          value={getValue()} 
          field="hours" 
          rowIndex={row.index} 
          type="number"
        />
      )
    }),
  ];

  // Add tips column if user has permission
  if (permissions.canEditTips || permissions.canViewAll) {
    columns.push(
      columnHelper.accessor('tips', {
        header: 'Spropitné (CZK)',
        cell: ({ row, getValue }) => (
          <EditableCell 
            value={getValue()} 
            field="tips" 
            rowIndex={row.index} 
            type="number"
          />
        )
      }) as any
    );
  }

  // Add bonus column if user has permission
  if (permissions.canEditBonus || permissions.canViewAll) {
    columns.push(
      columnHelper.accessor('bonus', {
        header: 'Odměna (CZK)',
        cell: ({ row, getValue }) => (
          <EditableCell 
            value={getValue()} 
            field="bonus" 
            rowIndex={row.index} 
            type="number"
          />
        )
      }) as any
    );
  }

  const table = useReactTable({
    data: filteredData,
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
      alert('Data uložena!');
    }
  };

  return (
    <div onKeyDown={handleKeyDown} tabIndex={0}>
      <div>
        <h3>
          {permissions.canViewAll ? 'Všechny směny' : 'Moje směny'}
        </h3>
        <p>
          {permissions.canViewAll 
            ? 'Zobrazeny všechny směny všech zaměstnanců. Klikněte na buňku pro úpravu.'
            : `Zobrazeny pouze vaše směny. ${canEditField('hours') ? 'Klikněte na buňku pro úpravu.' : 'Nemáte oprávnění k úpravám.'}`
          }
        </p>
        {canEditField('hours') && <p>Stiskněte Ctrl+S pro uložení změn.</p>}
      </div>
      
      <PermissionGate permission="canViewAll">
        <div>
          <input
            placeholder="Filtrovat podle jména zaměstnance..."
            value={(table.getColumn('employeeName')?.getFilterValue() ?? '') as string}
            onChange={event =>
              table.getColumn('employeeName')?.setFilterValue(event.target.value)
            }
          />
        </div>
      </PermissionGate>

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
        <p>
          {permissions.canViewAll 
            ? `Celkem záznamů: ${table.getRowModel().rows.length}` 
            : `Vaše záznamy: ${table.getRowModel().rows.length}`
          }
        </p>
      </div>

      <PermissionGate permission="canViewAll">
        <div>
          <h4>Oprávnění současné role:</h4>
          <ul>
            <li>Zobrazení všech dat: {permissions.canViewAll ? '✅' : '❌'}</li>
            <li>Úprava hodin: {permissions.canEditHours ? '✅' : '❌'}</li>
            <li>Úprava spropitného: {permissions.canEditTips ? '✅' : '❌'}</li>
            <li>Úprava odměn: {permissions.canEditBonus ? '✅' : '❌'}</li>
            <li>Import dat: {permissions.canImportData ? '✅' : '❌'}</li>
          </ul>
        </div>
      </PermissionGate>
    </div>
  );
} 