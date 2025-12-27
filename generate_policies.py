import os

output_dir = "api/writable/uploads/policies"
os.makedirs(output_dir, exist_ok=True)

policies = {
    "Code_of_Conduct.txt": """CODE OF CONDUCT AND ETHICS
Effective Date: 2024-01-01

1. PURPOSE
This Code of Conduct outlines the standards of behavior expected from all employees. We are committed to conducting business with integrity and in compliance with all applicable laws.

2. PROFESSIONAL BEHAVIOR
Employees must treat colleagues, clients, and partners with respect. Discrimination, harassment, or bullying of any kind will not be tolerated.

3. CONFLICT OF INTEREST
Employees must avoid situations where personal interests conflict with company interests. Any potential conflict must be disclosed to HR immediately.

4. CONFIDENTIALITY
Employees must protect the company's confidential information and intellectual property. This obligation continues even after employment ends.

5. COMPLIANCE
All employees are required to comply with local, state, and federal laws.
""",
    "Leave_Policy.txt": """LEAVE POLICY
Effective Date: 2024-01-01

1. OVERVIEW
This policy describes the types of leave available to employees to ensure work-life balance.

2. ANNUAL LEAVE
Full-time employees are entitled to 20 days of paid annual leave per year. Leave needs to be requested 2 weeks in advance.

3. SICK LEAVE
Employees receive 10 days of paid sick leave per year. A medical certificate is required for absences exceeding 2 consecutive days.

4. PARENTAL LEAVE
We offer paid maternity and paternity leave in accordance with statutory requirements and company benefits.

5. UNPAID LEAVE
Unpaid leave may be granted at the discretion of management for personal reasons.
""",
    "Remote_Work_Policy.txt": """REMOTE WORK POLICY
Effective Date: 2024-03-01

1. ELIGIBILITY
Remote work is available to employees whose roles allow for off-site duties, subject to manager approval.

2. WORK HOURS
Remote employees are expected to be available during core business hours (10 AM - 4 PM) and work a standard 8-hour day.

3. EQUIPMENT
The company will provide a laptop and necessary software. Employees must ensure they have a stable internet connection.

4. COMMUNICATION
Regular check-ins via video calls and prompt response to emails/messages are required.

5. SECURITY
Employees must follow IT security protocols, including using VPNs and securing devices.
""",
    "Data_Security_Policy.txt": """DATA SECURITY POLICY
Effective Date: 2024-01-01

1. PASSWORD MANAGEMENT
Passwords must be at least 12 characters long and changed every 90 days. Sharing passwords is strictly prohibited.

2. ACCESS CONTROL
Access to data is granted on a need-to-know basis.

3. DEVICE SECURITY
Unattended devices must be locked. Lost or stolen devices must be reported to IT immediately.

4. PHISHING AWARENESS
Employees should be vigilant against suspicious emails and report them to the security team.

5. DATA CLASSIFICATION
Data must be handled according to its sensitivity level: Public, Internal, Confidential, or Restricted.
""",
    "Travel_Expense_Policy.txt": """TRAVEL & EXPENSE POLICY
Effective Date: 2024-01-01

1. TRAVEL APPROVAL
All business travel must be approved by a department head at least 2 weeks in advance.

2. ACCOMMODATION
Employees should book standard hotel rooms within the company's preferred rate cap ($150/night).

3. MEALS
Daily meal allowance is capped at $75. Receipts must be provided for all expenses over $25.

4. TRANSPORTATION
Economy class is the standard for air travel. Public transport or ride-sharing is encouraged for ground travel.

5. REIMBURSEMENT
Expense reports must be submitted within 30 days of trip completion.
""",
    "Performance_Review_Policy.txt": """PERFORMANCE REVIEW POLICY
Effective Date: 2024-02-01

1. CYCLE
Performance reviews are conducted bi-annually (mid-year and year-end).

2. RATINGS
Performance is rated on a 5-point scale:
5 - Exceeds Expectations
4 - Meets Expectations
3 - Needs Improvement
2 - Unsatisfactory
1 - Not Rated

3. GOAL SETTING
Employees and managers will set SMART goals at the beginning of each cycle.

4. FEEDBACK
Continuous feedback is encouraged. Official feedback sessions are mandatory during review periods.
""",
    "Anti_Harassment_Policy.txt": """ANTI-HARASSMENT POLICY
Effective Date: 2024-01-01

1. ZERO TOLERANCE
The company has a zero-tolerance policy for harassment based on race, gender, religion, age, or any other protected characteristic.

2. REPORTING
Victims or witnesses should report incidents to HR or via the anonymous hotline.

3. INVESTIGATION
All complaints will be investigated promptly and confidentially.

4. NON-RETALIATION
Retaliation against anyone filing a complaint is strictly prohibited and grounds for immediate termination.
""",
    "Equipment_Usage_Policy.txt": """EQUIPMENT USAGE POLICY
Effective Date: 2024-01-01

1. ASSET ASSIGNMENT
Company devices remain the property of the company and must be returned upon termination of employment.

2. ACCEPTABLE USE
Equipment is for business use. Limited personal use is permitted provided it does not interfere with work or violate policies.

3. MAINTENANCE
Employees are responsible for the physical care of their devices.

4. PROHIBITED ACTIVITIES
Installing unauthorized software or accessing illegal content is strictly prohibited.
""",
    "Overtime_Policy.txt": """OVERTIME POLICY
Effective Date: 2024-02-01

1. ELIGIBILITY
Non-exempt employees are eligible for overtime pay. Exempt employees are not.

2. APPROVAL
All overtime must be approved in advance by a supervisor.

3. COMPENSATION
Overtime is paid at 1.5x the regular hourly rate for hours worked beyond 40 hours in a workweek.

4. LIMITS
To prevent burnout, overtime is generally limited to 10 hours per week unless there is a critical business need.
""",
    "Social_Media_Policy.txt": """SOCIAL MEDIA POLICY
Effective Date: 2024-01-01

1. REPRESENTATION
Employees must not speak on behalf of the company unless authorized.

2. PERSONAL USE
Personal social media use should not interfere with work duties.

3. CONFIDENTIALITY
Do not share confidential company information on social media.

4. CONDUCT
Employees are expected to be respectful online. Hate speech or harassment related to colleagues or the company is prohibited.
"""
}

for filename, content in policies.items():
    path = os.path.join(output_dir, filename)
    with open(path, "w") as f:
        f.write(content)
    print(f"Generated {filename}")
