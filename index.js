const moment = require('moment');

function processAttendanceData(data) {
    const attendanceMap = {};

    data.forEach(entry => {
        const { ID, Name, Date, Time, Status } = entry;
        const day = moment(Date).date();
        const key = `${ID}-${Date}`;

        if (!attendanceMap[key]) {
            attendanceMap[key] = {
                ID,
                Name,
                Date,
                punches: [],
                dailyHours: 0
            };
        }

        // Add punch times and calculate daily hours
        attendanceMap[key].punches.push({ Time, Status });

        // Calculate hours based on Check in and Check out
        if (Status === "Check out") {
            const checkInTime = attendanceMap[key].punches.find(p => p.Status === "Check in" && !p.processed);
            if (checkInTime) {
                const checkOutMoment = moment(Date + ' ' + Time);
                const checkInMoment = moment(Date + ' ' + checkInTime.Time);
                const hoursWorked = checkOutMoment.diff(checkInMoment, 'hours', true);
                attendanceMap[key].dailyHours += hoursWorked;
                checkInTime.processed = true; // Avoid recalculating for the same check in
            }
        }
    });

    // Create final report structure
    const finalReport = Object.values(attendanceMap).map(entry => {
        const days = Array(31).fill(0);
        days[moment(entry.Date).date() - 1] = entry.dailyHours; // store hours worked on that day
        return {
            ID: entry.ID,
            Name: entry.Name,
            Hours: days
        };
    });

    return {
        consolidatedData: finalReport,
        summary: generateMonthlySummary(finalReport),
    };
}

function generateMonthlySummary(data) {
    const summary = {};

    data.forEach(entry => {
        if (!summary[entry.ID]) {
            summary[entry.ID] = {
                ID: entry.ID,
                totalHours: 0,
                Name: entry.Name,
                daysWorked: 0
            };
        }

        const totalHoursForEntry = entry.Hours.reduce((a, b) => a + b, 0);
        summary[entry.ID].totalHours += totalHoursForEntry;
        if (totalHoursForEntry > 0) {
            summary[entry.ID].daysWorked += 1; // Increase days worked
        }
    });

    return Object.values(summary);
}

// Example usage with mock data
const punchData = [
    { ID: '001', Name: 'Jane Doe', Date: '2026-03-01', Time: '09:00', Status: 'Check in' },
    { ID: '001', Name: 'Jane Doe', Date: '2026-03-01', Time: '17:00', Status: 'Check out' },
    { ID: '002', Name: 'John Smith', Date: '2026-03-01', Time: '09:15', Status: 'Check in' },
    { ID: '002', Name: 'John Smith', Date: '2026-03-01', Time: '18:00', Status: 'Check out' },
    // Add more punch data as needed...
];

const report = processAttendanceData(punchData);
console.log(report);
