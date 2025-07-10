import Excel from 'exceljs';
import { Project } from '@shared/schema';
import fs from 'fs';
import path from 'path';
import os from 'os';

/**
 * Creates an Excel file from a list of projects
 * @param projects List of projects to export
 * @returns Buffer containing the Excel file
 */
export async function createProjectsExcel(projects: Project[]): Promise<Buffer> {
  // Create a new workbook
  const workbook = new Excel.Workbook();
  const worksheet = workbook.addWorksheet('Projects');

  // Add headers with styling
  worksheet.columns = [
    { header: 'Name', key: 'name', width: 30 },
    { header: 'Owner', key: 'owner', width: 25 },
    { header: 'Energy Type', key: 'energyType', width: 15 },
    { header: 'Capacity (MW)', key: 'capacity', width: 15 },
    { header: 'Location', key: 'location', width: 25 },
    { header: 'Status', key: 'status', width: 15 },
    { header: 'Year', key: 'year', width: 10 },
    { header: 'Latitude', key: 'latitude', width: 15 },
    { header: 'Longitude', key: 'longitude', width: 15 },
  ];

  // Style the header row
  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true, size: 12 };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFD3D3D3' } // Light gray
  };
  headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

  // Add data rows
  projects.forEach((project) => {
    worksheet.addRow({
      name: project.name,
      owner: project.owner,
      energyType: project.energyType,
      capacity: project.capacity,
      location: project.location,
      status: project.status,
      year: project.year,
      latitude: project.latitude,
      longitude: project.longitude,
    });
  });

  // Apply conditional formatting for different energy types
  const energyTypeColors: { [key: string]: string } = {
    'Solar': 'FFFFCC00', // Yellow
    'Wind': 'FF87CEEB',  // Sky Blue
    'Hydro': 'FF00BFFF', // Deep Sky Blue
    'Biomass': 'FF90EE90', // Light Green
    'Geothermal': 'FFE6E6FA', // Lavender
  };

  // Iterate through rows to apply conditional formatting for energy type
  for (let i = 2; i <= projects.length + 1; i++) {
    const row = worksheet.getRow(i);
    const energyType = row.getCell(3).value?.toString() || '';
    
    if (energyTypeColors[energyType]) {
      row.getCell(3).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: energyTypeColors[energyType] }
      };
    }
  }

  // Add borders to all cells
  for (let i = 1; i <= projects.length + 1; i++) {
    worksheet.getRow(i).eachCell({ includeEmpty: true }, function(cell) {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
  }

  // Create a buffer to store the Excel file
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
}
