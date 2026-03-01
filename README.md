# Attendance Calculator

A simple JavaScript program to process and calculate attendance data from Excel files.

## Features

- ✓ Consolidates multi-row monthly attendance data into single row per employee
- ✓ Calculates working hours with intelligent shift detection:
  - **Same-day shifts**: Calculates check-in to check-out on same date
  - **Night shifts**: Detects when check-out is next day and calculates accordingly
  - **Single punch**: Marks as incomplete
- ✓ Generates summary report with:
  - Daily hours worked
  - Total monthly hours
  - Number of working days
  - Average hours per day
- ✓ Exports results to Excel

## Excel Input Format

Your input Excel file should have the following structure:

| ID  | Name      | Date 1 Check-in | Date 1 Check-out | Date 2 Check-in | Date 2 Check-out | ... |
|-----|-----------|-----------------|------------------|-----------------|------------------|-----|
| 005 | John Doe  | 09:00           | 17:30            | 09:15           | 17:45            | ... |
| 006 | Jane Smith| 08:30           | 18:00            | 22:00           | 06:30            | ... |

**Time Format**: HH:MM or HH:MM:SS

## Installation

```bash
npm install
```

## Usage

```bash
node index.js <input.xlsx> [output.xlsx]
```

### Examples

```bash
# Using default filenames (input.xlsx → attendance_output.xlsx)
node index.js

# Specify input file
node index.js myattendance.xlsx

# Specify both input and output files
node index.js myattendance.xlsx results.xlsx
```

## Output Format

The output Excel file will contain:

| ID  | Name      | Day 1 (Hours) | Day 1 (Status) | ... | Total Hours | Working Days | Average Hours/Day |
|-----|-----------|---------------|----------------|-----|-------------|--------------|-------------------|
| 005 | John Doe  | 8.5           | same-day       | ... | 248.50      | 29           | 8.57              |

### Status Values

- `same-day`: Check-in and check-out on same date
- `night-shift`: Check-out on next day (overnight shift)
- `incomplete`: Only check-in or check-out recorded
- `invalid`: Check-out time before check-in time
- `absent`: No attendance record for that day

## Calculation Logic

### Same-Day Shift
```
Hours = Check-out Time - Check-in Time
Example: 17:30 - 09:00 = 8.5 hours
```

### Night Shift (Check-out next day)
```
Hours = (24:00 - Check-in Time) + Check-out Time
Example: Check-in 22:00, Check-out 06:30 (next day)
Hours = (24 - 22) + 6.5 = 8.5 hours
```

## Requirements

- Node.js (v12 or higher)
- xlsx package (installed via npm)

## Author

youfrig

## License

ISC