const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Function to parse time string (HH:MM or HH:MM:SS)
function parseTime(timeStr) {
  if (!timeStr) return null;
  const parts = timeStr.toString().trim().split(':');
  if (parts.length < 2) return null;
  return {
    hours: parseInt(parts[0]),
    minutes: parseInt(parts[1]),
    seconds: parts[2] ? parseInt(parts[2]) : 0
  };
}

// Function to convert time to decimal hours
function timeToDecimal(timeObj) {
  if (!timeObj) return 0;
  return timeObj.hours + (timeObj.minutes / 60) + (timeObj.seconds / 3600);
}

// Function to calculate hours between two times
function calculateHours(checkIn, checkOut, checkInDate, checkOutDate) {
  if (!checkIn || !checkOut) {
    return { hours: 0, status: 'incomplete' };
  }

  const checkInTime = timeToDecimal(checkIn);
  const checkOutTime = timeToDecimal(checkOut);

  // If check-out date is next day (night shift)
  if (checkOutDate > checkInDate) {
    // 24 - checkInTime + checkOutTime
    const hoursWorked = (24 - checkInTime) + checkOutTime;
    return { hours: hoursWorked.toFixed(2), status: 'night-shift' };
  }

  // Same day shift
  if (checkOutTime < checkInTime) {
    return { hours: 0, status: 'invalid' };
  }

  const hoursWorked = checkOutTime - checkInTime;
  return { hours: hoursWorked.toFixed(2), status: 'same-day' };
}

// Function to extract date number from column header
function getDateNumber(header) {
  const match = header.match(/\d+/);
  return match ? parseInt(match[0]) : null;
}

// Function to process attendance data
function processAttendanceData(inputFile, outputFile) {
  try {
    // Read Excel file
    const workbook = XLSX.readFile(inputFile);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    if (data.length < 2) {
      console.error('Error: Excel file must have headers and data');
      return;
    }

    const headers = data[0];
    const rows = data.slice(1);

    // Group data by ID
    const groupedByID = {};

    rows.forEach(row => {
      const id = row[0];
      const name = row[1];

      if (!id) return;

      if (!groupedByID[id]) {
        groupedByID[id] = {
          id,
          name,
          dailyData: {}
        };
      }

      // Process each day's check-in and check-out
      for (let i = 2; i < headers.length; i += 2) {
        const dateNum = getDateNumber(headers[i]);
        if (!dateNum) continue;

        const checkInStr = row[i];
        const checkOutStr = row[i + 1];

        if (!groupedByID[id].dailyData[dateNum]) {
          groupedByID[id].dailyData[dateNum] = {};
        }

        groupedByID[id].dailyData[dateNum].checkIn = checkInStr;
        groupedByID[id].dailyData[dateNum].checkOut = checkOutStr;
      }
    });

    // Calculate hours and create output
    const outputData = [];
    const outputHeaders = ['ID', 'Name'];

    // Generate day headers (1-31)
    for (let day = 1; day <= 31; day++) {
      outputHeaders.push(`Day ${day} (Hours)`, `Day ${day} (Status)`);
    }
    outputHeaders.push('Total Hours', 'Working Days', 'Average Hours/Day');

    outputData.push(outputHeaders);

    // Process each employee
    Object.values(groupedByID).forEach(employee => {
      const row = [employee.id, employee.name];
      let totalHours = 0;
      let workingDays = 0;

      // Calculate hours for each day
      for (let day = 1; day <= 31; day++) {
        if (employee.dailyData[day]) {
          const dayData = employee.dailyData[day];
          const checkIn = parseTime(dayData.checkIn);
          const checkOut = parseTime(dayData.checkOut);

          const result = calculateHours(checkIn, checkOut, day, day);

          row.push(result.hours, result.status);

          if (result.status !== 'incomplete' && result.status !== 'invalid') {
            totalHours += parseFloat(result.hours);
            workingDays++;
          }
        } else {
          row.push('-', 'absent');
        }
      }

      // Add summary
      const avgHours = workingDays > 0 ? (totalHours / workingDays).toFixed(2) : 0;
      row.push(totalHours.toFixed(2), workingDays, avgHours);

      outputData.push(row);
    });

    // Write to Excel
    const newWorkbook = XLSX.utils.book_new();
    const newWorksheet = XLSX.utils.aoa_to_sheet(outputData);
    XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Attendance Summary');
    XLSX.writeFile(newWorkbook, outputFile);

    console.log(`✓ Attendance data processed successfully!`);
    console.log(`✓ Output saved to: ${outputFile}`);
    console.log(`✓ Total employees processed: ${Object.keys(groupedByID).length}`);

  } catch (error) {
    console.error('Error processing file:', error.message);
  }
}

// Main execution
const inputFile = process.argv[2] || 'input.xlsx';
const outputFile = process.argv[3] || 'attendance_output.xlsx';

if (!fs.existsSync(inputFile)) {
  console.error(`Error: Input file '${inputFile}' not found`);
  console.log('Usage: node index.js <input.xlsx> [output.xlsx]');
  process.exit(1);
}

processAttendanceData(inputFile, outputFile);