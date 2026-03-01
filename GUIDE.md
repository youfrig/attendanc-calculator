# GUIDE.md

## Prerequisites
- Ensure you have Python version X.X or higher installed.
- Have pip installed to manage your Python packages.

## Installation
1. Clone the repository:
   ```
   git clone https://github.com/youfrig/attendanc-calculator.git
   cd attendanc-calculator
   ```
2. Install the required packages:
   ```
   pip install -r requirements.txt
   ```

## Data Preparation
- Prepare your attendance data in CSV format. Ensure it includes columns for dates, names, and presence indicators.

## Running the Program
- Execute the script:
   ```
   python attendance_calculator.py path/to/your/data.csv
   ```

## Understanding Output
- The program will generate a report (`attendance_report.txt`) summarizing the attendance data. Look for the following:
  - Total classes held
  - Attendance percentage per student

## Example Walkthrough
1. **Data input**: Create a `data.csv` file with your attendance data.
2. **Run the script**: Use the command given in 'Running the Program'.
3. **Review output**: Open the `attendance_report.txt` to view the results.

## Troubleshooting
- If the program fails to execute, check for missing dependencies as indicated in the console output.
- Ensure your input CSV file follows the expected format.

## Quick Reference Commands
- Clone Repository: `git clone https://github.com/youfrig/attendanc-calculator.git`
- Install Requirements: `pip install -r requirements.txt`
- Run Program: `python attendance_calculator.py path/to/your/data.csv`