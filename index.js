const fs = require('fs');
const path = require('path');

// Function to process attendance data
function processAttendanceData(data) {
    const attendanceMap = {};

    // Read input CSV file (assuming it's named 'attendance.csv')
    data.forEach(record => {
        const [ID, Name, Date, Time, Status] = record.split(',');
        const key = `${Date}-${ID}`;

        if (!attendanceMap[key]) {
            attendanceMap[key] = {
                ID,
                Name,
                Date,
                Status,
                hours: 0
            };
        }

        // Assuming that Status also includes time worked in the form of 'Hours: X'
        const hoursWorked = parseFloat(Status.split(': ')[1]) || 0;
        attendanceMap[key].hours += hoursWorked;
    });

    // Create output files
    const consolidatedData = [];
    const dailySummary = {};

    // Consolidate data by day
    Object.values(attendanceMap).forEach(entry => {
        consolidatedData.push(`${entry.ID},${entry.Name},${entry.Date},${entry.hours}`);
        
        // Prepare daily summary
        if (!dailySummary[entry.Date]) {
            dailySummary[entry.Date] = { totalHours: 0 };
        }
        dailySummary[entry.Date].totalHours += entry.hours;
    });

    // Write consolidated monthly data by day
    fs.writeFileSync(path.join(__dirname, 'consolidated_monthly_data.csv'), consolidatedData.join('\n'));

    // Write daily hours summary report
    const dailyReport = Object.entries(dailySummary).map(([date, info]) => `${date},${info.totalHours}`).join('\n');
    fs.writeFileSync(path.join(__dirname, 'daily_hours_summary.csv'), dailyReport);
}

// Sample call to the function
// You would normally get this data from your own source
const sampleData = [
    "1,Alice,2026-03-01,09:00,Hours: 8",
    "1,Alice,2026-03-01,17:00,Hours: 8",
    "2,Bob,2026-03-01,10:00,Hours: 7",
    "1,Alice,2026-03-02,09:00,Hours: 7",
    "2,Bob,2026-03-02,10:00,Hours: 6",
];

processAttendanceData(sampleData);