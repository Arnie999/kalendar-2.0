'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { WorkEntry, EmployeeSummary } from '@/types/payroll';

interface EmployeeBarChartProps {
  workEntries: WorkEntry[];
}

export function EmployeeBarChart({ workEntries }: EmployeeBarChartProps) {
  // Group data by employee
  const employeeData = workEntries.reduce((acc, entry) => {
    const existing = acc.find(emp => emp.employeeName === entry.employeeName);
    if (existing) {
      existing.totalHours += entry.hours;
      existing.totalTips += entry.tips;
      existing.totalBonus += entry.bonus;
      existing.totalCost = existing.totalTips + existing.totalBonus;
    } else {
      acc.push({
        employeeId: entry.employeeId,
        employeeName: entry.employeeName,
        totalHours: entry.hours,
        totalTips: entry.tips,
        totalBonus: entry.bonus,
        totalCost: entry.tips + entry.bonus
      });
    }
    return acc;
  }, [] as EmployeeSummary[]);

  // Sort by total cost (descending)
  const sortedData = employeeData.sort((a, b) => b.totalCost - a.totalCost);

  return (
    <section>
      <h3>Cost per Employee</h3>
      
      <div>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={sortedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="employeeName" 
              angle={-45}
              textAnchor="end"
              height={100}
            />
            <YAxis 
              label={{ value: 'Cost (CZK)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value, name) => [value, name]}
              labelFormatter={(label) => `Employee: ${label}`}
            />
            <Bar dataKey="totalTips" stackId="cost" fill="#8884d8" name="Tips" />
            <Bar dataKey="totalBonus" stackId="cost" fill="#82ca9d" name="Bonus" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h4>Employee Details</h4>
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Hours</th>
              <th>Tips (CZK)</th>
              <th>Bonus (CZK)</th>
              <th>Total Cost (CZK)</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((employee) => (
              <tr key={employee.employeeId}>
                <td>{employee.employeeName}</td>
                <td>{employee.totalHours}</td>
                <td>{employee.totalTips}</td>
                <td>{employee.totalBonus}</td>
                <td>{employee.totalCost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
} 