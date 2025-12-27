# Quick Start Guide

Get up and running with the HR Management System in 5 minutes.

## 🚀 Installation & Setup

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
http://localhost:5173
```

## 🔐 Login

**Default Credentials:**
- Username: `admin`
- Password: `admin123`

## 🌍 Change Language

1. Click the language button in the top-right corner (shows flag + language name)
2. Select your preferred language
3. Interface updates immediately

**Available Languages:**
- 🇬🇧 English
- 🇸🇦 Arabic (RTL)
- 🇳🇱 Dutch
- 🇫🇷 French
- 🇵🇱 Polish

## 📋 Common Tasks

### Add an Employee

1. Click **"Employee Management"** in sidebar
2. Click **"Add Employee"** button
3. Fill in the form
4. Click **"Save"**

### View Attendance

1. Click **"Employee Management"** in sidebar
2. Click **"Attendance"** tab
3. Choose view:
   - **Today**: Current day attendance
   - **Calendar**: Monthly view with stats
   - **Analytics**: Charts and trends

### Apply for Leave

1. Click **"Leave Management"** in sidebar
2. Click **"My Leaves"** tab
3. Click **"Apply Leave"**
4. Fill in dates and reason
5. Click **"Submit"**

### Generate Payroll

1. Click **"Employee Management"** in sidebar
2. Click **"Payroll"** tab
3. Select month
4. Click **"Generate Payroll"**
5. Review and confirm

### Post a Job

1. Click **"Recruitment"** in sidebar
2. Click **"Post Job"**
3. Fill in job details
4. Click **"Publish"**

## 🎯 Key Features

### Dashboard
- **Location Filter**: View stats by location
- **Quick Actions**: Common tasks at your fingertips
- **Real-time Stats**: Live employee metrics
- **Charts**: Visual data representation

### Navigation
- **Sidebar**: Main module navigation
- **Tabs**: Sub-sections within modules
- **Breadcrumbs**: Track your location
- **Back Button**: Returns to previous view

### Lists & Tables
- **Search**: Type to filter results
- **Filters**: Advanced filtering options
- **Pagination**: Navigate through pages
- **Actions**: View, Edit, Delete per row

## 💡 Tips

### Search
- Works across multiple fields (name, ID, department)
- Updates results in real-time
- Case-insensitive

### Filters
- Click "Filter" button
- Select criteria
- Click "Apply"
- Clear with "Clear Filters"

### Export Data
- Click "Export" button
- Choose format (Excel, CSV, PDF)
- File downloads automatically

### Responsive Design
- Works on mobile devices
- Tap menu icon (☰) to open sidebar on mobile
- Tables scroll horizontally on small screens

## 🎨 Interface Overview

```
┌─────────────────────────────────────────────────────┐
│  HR System                    🔔  🌐 EN 🇬🇧         │ Header
├──────────┬──────────────────────────────────────────┤
│          │                                           │
│  Sidebar │          Main Content Area               │
│          │                                           │
│  📊 Dash │  ┌────────────────────────────────────┐  │
│  👥 Emp  │  │  Stats Cards                       │  │
│  🕐 Att  │  └────────────────────────────────────┘  │
│  📅 Lea  │                                           │
│  💰 Pay  │  ┌────────────────────────────────────┐  │
│  📋 Rec  │  │  Lists / Tables                    │  │
│  ...     │  │  with Search & Filters             │  │
│          │  └────────────────────────────────────┘  │
│          │                                           │
│  🚪 Logo │  [Pagination]                            │
└──────────┴──────────────────────────────────────────┘
```

## 📚 Module Overview

| Module | What It Does |
|--------|--------------|
| 📊 **Dashboard** | Overview of all HR metrics |
| 👥 **Employees** | Manage employee information |
| 🕐 **Shifts** | Schedule and manage shifts |
| 📅 **Leave** | Handle leave requests |
| 📋 **Recruitment** | Job postings and hiring |
| 🎫 **Tickets** | Internal support system |
| 📄 **Documents** | Policy and document management |
| 🔔 **Notifications** | Alerts and updates |
| 📊 **Reports** | Analytics and insights |
| ⚙️ **Admin** | User and role management |

## 🔧 Development

### Run in Development

```bash
npm run dev
```

### Build for Production

```bash
npm run build
npm run preview
```

### Project Structure

```
/
├── components/       # React components
├── contexts/        # React contexts
├── translations/    # Language files
├── data/           # Mock data
├── docs/           # Documentation (you are here!)
└── styles/         # Global styles
```

## 📖 Documentation

- **[README.md](./README.md)** - Project overview
- **[USER_GUIDE.md](./USER_GUIDE.md)** - Complete user manual
- **[DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)** - Developer guide
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Technical details
- **[MULTI_LANGUAGE_GUIDE.md](./MULTI_LANGUAGE_GUIDE.md)** - i18n guide
- **[COMPONENTS_GUIDE.md](./COMPONENTS_GUIDE.md)** - Component reference

## ❓ Troubleshooting

### Can't login?
Use default credentials: `admin` / `admin123`

### Language not changing?
Clear browser cache and refresh

### Data not loading?
Refresh the page or clear browser cache

### Page looks broken?
Try a different browser or clear cache

## 🆘 Need Help?

1. Check the **[USER_GUIDE.md](./USER_GUIDE.md)** for detailed instructions
2. Review **[COMPONENTS_GUIDE.md](./COMPONENTS_GUIDE.md)** for component usage
3. See **[DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)** for technical issues
4. Check **[CHANGELOG.md](./CHANGELOG.md)** for recent updates

## 🎉 You're Ready!

You now have everything you need to start using the HR Management System.

**Next Steps:**
1. Explore the dashboard
2. Try adding an employee
3. Check out the attendance calendar
4. Switch languages to test i18n
5. Review the documentation for advanced features

---

**Happy HR Managing! 🚀**
