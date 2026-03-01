# Punch-Based Attendance Calculator

## Overview
The Punch-Based Attendance Calculator is designed to efficiently calculate attendance based on punch-in and punch-out times recorded by users. It caters to various scenarios and provides accurate attendance data for individuals and groups.

## Input Format
The input must be a structured list containing entries with the following fields:
- **User ID**: Unique identifier for each user.
- **Punch In**: The timestamp when the user punches in (formatted as `YYYY-MM-DD HH:MM:SS`).
- **Punch Out**: The timestamp when the user punches out (formatted as `YYYY-MM-DD HH:MM:SS`).

### Example Input
```json
[
    {"userId": "user123", "punchIn": "2026-03-01 08:00:00", "punchOut": "2026-03-01 16:00:00"},
    {"userId": "user456", "punchIn": "2026-03-01 09:00:00", "punchOut": "2026-03-01 15:00:00"}
]
```

## Output Format
The output will be a structured report containing:
- **User ID**: The unique identifier for each user.
- **Total Hours**: The total hours worked based on punch in and punch out times.
- **Late Comings**: The number of times a user punched in later than the expected start time.
- **Early Exits**: The number of times a user punched out earlier than the expected exit time.

### Example Output
```json
[
    {"userId": "user123", "totalHours": 8, "lateComings": 0, "earlyExits": 1},
    {"userId": "user456", "totalHours": 6, "lateComings": 1, "earlyExits": 0}
]
```

## Calculation Logic
1. **Calculate total hours**: For each user, subtract the punch-in time from the punch-out time. The result is converted into hours.
2. **Identify late comings**: Compare the punch-in time with the expected start time. Increment the late coming count if the punch-in time is later.
3. **Identify early exits**: Compare the punch-out time with the expected exit time. Increment the early exit count if the punch-out time is earlier.

## Examples
- Given the input above, the calculator will analyze each entry and produce the corresponding output.
- Users can customize expected times for each employee to track punctuality more effectively.

## Troubleshooting Guide
- **Issue**: User not appearing in the report
  - **Solution**: Ensure that punch-in and punch-out times are formatted correctly and fall within the specified range.
- **Issue**: Incorrect total hours calculated
  - **Solution**: Verify that the punch-in and punch-out timestamps are accurate. Check for overlap in times if multiple entries exist.

For additional support, please refer to the documentation or contact the support team.