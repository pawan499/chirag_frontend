# OptiFlow Manager

Build a Production-Ready Frontend — Eye Care & Spectacle Shop Management System

1. Project Objective

Build a complete, production-ready frontend for a small eye-care and spectacle shop management system.

This application is primarily used by one doctor/shop owner to manage:

Patients

Patient visits

Eye examination

Machine readings / eye power

Medicines given to patients

Spectacle requirements and orders

Payments

Pending/due amounts

Daily collection

Weekly collection

Monthly collection

Revenue/collection analytics

This is NOT a hospital management system.

This is NOT a patient portal.

This is NOT a large enterprise medical system.

The UI should be:

Simple

Professional

Clean

Fast

Friendly

Easy to understand

Mobile responsive

Desktop responsive

Touch friendly

Optimized for daily doctor/shop use

The doctor should be able to complete a patient visit with minimum clicks.

2. Technology Requirements

Use:

React

TypeScript

Vite

React Router

Material UI (MUI)

MUI Icons

React Hook Form

Zod for validation

TanStack Query / React Query for API state management

Axios for API communication

Recharts or an equivalent lightweight charting library

Use TypeScript strictly.

Avoid unnecessary libraries.

Do not use JavaScript files where TypeScript is appropriate.

Prefer:

.ts
.tsx


throughout the application.

3. Design Direction

Create a modern medical/business dashboard, but keep it lightweight.

The design should feel like:

Professional
+
Clean
+
Trustworthy
+
Simple
+
Fast


Avoid:

Overly colorful UI

Excessive gradients

Huge cards

Excessive animations

Complicated navigation

Hospital-like complexity

Too many tables

Too many popups

Use a restrained professional color palette.

Recommended visual direction:

White/light background

Dark blue primary color

Soft gray surfaces

Green for successful/completed states

Orange/yellow for pending states

Red only for errors/danger

Maintain strong contrast and accessibility.

4. Responsive Requirement

The application MUST be fully responsive.

It must work properly on:

Desktop

Laptop

Tablet

Mobile

Small mobile screens

Do not simply shrink desktop UI.

Create proper responsive layouts.

Example:

Desktop

┌──────────────┬────────────────────────────────────┐
│              │                                    │
│   Sidebar    │             Main Content           │
│              │                                    │
└──────────────┴────────────────────────────────────┘


Mobile

┌──────────────────────────────┐
│ Header                  ☰   │
├──────────────────────────────┤
│                              │
│       Main Content           │
│                              │
├──────────────────────────────┤
│ Dashboard Patients + More    │
└──────────────────────────────┘


On mobile:

Sidebar should become a drawer

Tables should become cards or horizontally scrollable containers where appropriate

Buttons should be touch-friendly

Forms should use one-column layouts

Avoid tiny text

Avoid horizontal page overflow

Important actions should remain easy to reach

5. Main Application Structure

Create:

Login
   ↓
Dashboard
   ├── Patients
   ├── Eye Examination
   ├── Medicines
   ├── Spectacle Orders
   ├── Payments
   ├── Reports
   └── Settings


6. Navigation

Desktop sidebar:

Dashboard
Patients
Appointments / Today's Visits
Medicines
Spectacle Orders
Payments
Reports
Settings


However, do NOT build a complex appointment booking system.

The "Today's Visits" section can simply show today's patient visits.

Sidebar footer:

Doctor / Shop Owner
Settings
Logout


Mobile:

Use a hamburger menu/drawer.

Keep navigation simple.

7. Login Screen

Create a professional login screen.

Fields:

Email
Password


Actions:

Login


States:

Loading
Success
Invalid credentials
Server error


Do NOT show:

Register
Create account
Staff registration


There is no public registration.

Add "Show/Hide Password".

8. Dashboard

Dashboard is the first screen after login.

The dashboard must immediately communicate the business status.

Top Section

Show:

Good Morning, Doctor

Today's Date

+ New Patient


9. Dashboard KPI Cards

Create cards for:

Today's Patients
Today's Collection
This Week's Collection
This Month's Collection
Total Pending/Due


Example:

┌──────────────────┐
│ Today's Patients │
│       24         │
│ ↑ 12%            │
└──────────────────┘

┌──────────────────┐
│ Today's Collection│
│     ₹8,450       │
└──────────────────┘


Do not create fake percentage growth unless backend data actually supports it.

10. Dashboard Revenue Chart

Create a clean collection chart.

Allow:

Today
This Week
This Month


Example:

Collection

₹
│             ●
│       ●     │
│   ●   │  ●  │
│ ● │   │  │  │
└────────────────
  Mon Tue Wed Thu


Use backend report data.

Do NOT use fake static data when API integration is available.

11. Payment Method Breakdown

Show:

Cash
UPI
Card
Other


Example:

Today's Collection

Cash        ₹5,000
UPI         ₹3,200
Card          ₹500
Other           ₹0
-------------------
Total       ₹8,700


Use a clean donut/pie chart if useful.

12. Spectacle Order Summary

Show:

Ordered
In Process
Ready
Delivered


Example:

Spectacle Orders

Ordered       4
In Process    3
Ready         5
Delivered    12


Clicking a status should navigate to filtered orders.

13. Recent Patients

Dashboard should show recent patients.

Columns:

Patient
Mobile
Visit Date
Amount
Payment Status
Action


Mobile should convert this into cards.

Example:

Raj Kumar
98XXXXXXXX
Today

₹1,500
Paid

View →


14. Quick Actions

Dashboard should provide:

+ New Patient
+ New Visit
+ Add Payment
View Today's Patients


These should be easily accessible.

15. Patient Module

Create a patient list page.

Features:

Search

Add patient

Pagination

View patient

Edit patient

Soft delete

Mobile responsive

Search by:

Patient ID
Name
Mobile


16. Patient List UI

Desktop:

┌───────────────────────────────────────────────┐
│ Patients                    + New Patient     │
├───────────────────────────────────────────────┤
│ Search patients...                            │
├───────────────────────────────────────────────┤
│ ID | Name | Mobile | Last Visit | Action      │
└───────────────────────────────────────────────┘


Mobile:

Use patient cards.

17. Add Patient

Create a clean form.

Fields:

Name *
Mobile
Age
Date of Birth
Gender
Address
Blood Group
Allergies
Medical Notes


Do not make unnecessary fields mandatory.

Use React Hook Form + Zod validation.

Show inline validation errors.

After successful creation:

Patient created successfully


Then provide:

Start Visit


18. Patient Profile

Patient profile should be one of the most useful screens.

Header:

Raj Kumar
Patient ID: P-000123
Mobile: 98XXXXXXXX

[Start New Visit]


Show summary cards:

Last Visit
Latest Eye Power
Current Due
Active Spectacle Order


19. Patient Timeline

Create a visual timeline.

Example:

06 Sep 2026
● Eye Examination
  OD: -2.00 / -0.50 × 90
  OS: -1.50 / -0.75 × 80

  Medicine Given
  Eye Drop A

  Spectacle Ordered

  Payment ₹1,500 UPI

26 Aug 2026
● Follow-up Visit
  ...


The doctor should quickly understand the patient's complete history.

Do not make the timeline overly complicated.

20. Patient Detail Tabs

Use tabs or sections:

Overview
Visits
Eye Examinations
Medicines
Spectacles
Payments
Documents (if implemented)


Keep navigation simple.

21. New Visit / Consultation

This is the MOST IMPORTANT screen.

The doctor should be able to complete the entire patient workflow from one screen.

Suggested layout:

Patient Information
        ↓
Eye Examination
        ↓
Medicine
        ↓
Spectacle
        ↓
Charges
        ↓
Payment
        ↓
Save Visit


Do not force the doctor to navigate through many pages.

22. New Visit — Patient Header

Show:

Patient Name
Patient ID
Age
Mobile
Last Visit


Also provide:

View Previous History


This should open the patient's previous timeline/history.

23. Eye Examination UI

Create a professional eye-power form.

Desktop:

                 Right Eye        Left Eye

SPH              [       ]        [       ]

CYL              [       ]        [       ]

AXIS             [       ]        [       ]

VA               [       ]        [       ]

ADD              [       ]        [       ]


Below:

PD: [       ]

Examination Notes
[                                    ]


Support:

Positive values

Negative values

Decimal values

Use numeric inputs where appropriate.

Do not automatically diagnose anything.

24. Eye Examination UX

Make data entry extremely fast.

Features:

Keyboard-friendly

Proper tab order

Clear labels

Input validation

Easy cursor movement

Mobile-friendly fields

On mobile:

Right Eye
SPH
CYL
AXIS
VA
ADD

Left Eye
SPH
CYL
AXIS
VA
ADD


Do not squeeze both eyes into tiny columns on mobile.

25. Medicine Section

Allow the doctor to add multiple medicines.

Example:

Medicine
[ Search medicine... ]

Quantity
[ 1 ]

Dosage
[ 1 drop ]

Frequency
[ 3 times a day ]

Duration
[ 7 days ]

Instructions
[ After cleaning eyes ]

[ + Add Medicine ]


Added medicines should appear as a list/table.

Desktop:

Medicine | Qty | Dosage | Frequency | Duration | Price | Remove


Mobile:

Medicine cards.

26. Medicine Search

When typing:

Eye...


show medicine suggestions.

Use backend API.

Do not load the entire medicine database unnecessarily.

Allow selecting a medicine and automatically use its default price.

The doctor/operator must still be able to adjust values where appropriate.

27. Spectacle Section

Provide a simple toggle:

☐ Spectacles Required


When enabled, show:

Prescription

Right Eye
SPH
CYL
AXIS
ADD

Left Eye
SPH
CYL
AXIS
ADD


Allow copying eye examination values into spectacle prescription when appropriate.

Do NOT overwrite data unexpectedly.

28. Spectacle Order

Fields:

Frame Name
Frame Price

Lens Type
Lens Price

Other Charges
Discount


Automatically calculate:

Total


Allow:

Advance Payment


Show:

Total
Paid
Remaining


29. Spectacle Status

Provide a status selector:

Ordered
In Process
Ready
Delivered
Cancelled


Use clear status chips.

Example:

Ordered       blue/neutral
In Process    orange
Ready         green
Delivered     green
Cancelled     red


Use accessible contrast.

30. Charges Section

Show a clear billing summary.

Example:

Eye Test                  ₹200
Medicines                 ₹150
Spectacles              ₹2,500
Other                       ₹0
Discount                  ₹100
--------------------------------
Total                   ₹2,750


Never rely blindly on frontend calculations.

The backend remains the source of truth.

31. Payment Section

Keep payment UI extremely simple.

Payment methods:

Cash
UPI
Card
Other


Most payments will be CASH.

For UPI:

Show an informational note:

UPI payment is verified manually.
Send your existing QR to the patient externally,
then record the confirmed payment here.


Do NOT create:

Razorpay UI

Online payment button

Payment gateway UI

Automatic UPI verification

QR generation

WhatsApp integration

32. Add Payment UI

Allow:

Amount
Payment Method
Payment Date
Reference Number (optional)
Notes (optional)


For UPI:

Reference Number (optional)


Do not force it.

33. Multiple Payments

The UI must support multiple payments.

Example:

Bill Total: ₹3,000

Payments

₹1,000   Cash
₹2,000   UPI

Total Paid: ₹3,000
Due: ₹0


If partially paid:

Total: ₹5,000
Paid: ₹2,000
Due: ₹3,000


Provide:

+ Add Payment


34. Payment History

Create a payment history section.

Columns:

Date
Payment ID
Patient
Amount
Method
Reference
Notes


Mobile should use cards.

35. Collection / Reports Page

Create a dedicated Reports page.

Top filters:

Today
This Week
This Month
Custom Range


Show:

Total Collection
Cash
UPI
Card
Other


36. Collection Charts

Show:

Collection Trend

Line/bar chart.

Payment Method

Donut chart or clean horizontal breakdown.

Revenue Category

Show:

Eye Test
Medicine
Spectacles
Other


Remember:

Collection means actual received payments.

Do not show unpaid bills as collected revenue.

37. Daily Collection

Example:

06 Sep 2026

Patients: 24

Collection:
Cash       ₹5,000
UPI        ₹3,200
Card         ₹500
Other          ₹0

Total      ₹8,700


38. Weekly Collection

Show:

Mon ₹5,200
Tue ₹7,100
Wed ₹4,800
Thu ₹8,200
Fri ₹6,500
Sat ₹7,400


Use backend data.

39. Monthly Collection

Show:

September 2026

Total Collection
₹1,85,600


And chart:

01 Sep
02 Sep
03 Sep
...
30 Sep


40. Due / Pending Payments

Create a useful section for pending payments.

Show:

Patient
Bill Total
Paid
Due
Last Payment


Example:

Raj Kumar
Total: ₹5,000
Paid: ₹2,000
Due: ₹3,000

[Add Payment]


This should help the shop owner quickly collect pending amounts.

41. Spectacle Orders Page

Create a dedicated page.

Filters:

All
Ordered
In Process
Ready
Delivered
Cancelled


Search by:

Order ID
Patient Name
Mobile


Columns:

Order ID
Patient
Date
Amount
Paid
Due
Status
Action


Mobile → cards.

42. Medicine Management Page

Simple master management.

Features:

Search medicines

+ Add Medicine


Table:

Medicine
Generic Name
Unit
Default Price
Status
Action


Actions:

Edit
Deactivate


Do NOT build stock/inventory functionality.

43. Settings Page

Keep settings simple.

Sections:

Shop Information

Doctor Name
Shop Name
Mobile
Email
Address
Registration Number (optional)


Default Settings

Default Consultation/Eye Test Fee


Do not create staff settings.

Do not create role management.

44. Toast Notifications

Use clean toast/snackbar notifications for:

Patient created
Patient updated
Visit saved
Medicine added
Spectacle order created
Payment added
Settings updated


Errors should clearly explain what went wrong.

45. Loading States

Every API-driven page must have proper loading states.

Use:

Skeletons

Spinners for buttons

Disabled submit buttons during requests

Do not show blank screens while data is loading.

46. Empty States

Create friendly empty states.

Example:

No patients found

Add your first patient to get started.

[+ Add Patient]


Similarly:

No spectacle orders
No payments
No medicines
No visits


47. Error States

Show useful error UI.

Example:

Something went wrong.

We couldn't load patient data.

[Try Again]


Do not expose raw backend errors to users.

48. Confirmation Dialogs

For destructive actions:

Delete Patient?


Explain that important historical records should be protected.

Prefer deactivation/soft deletion where appropriate.

49. Form UX

Forms should:

Have clear labels

Show required fields

Show validation immediately or on blur

Preserve user input after validation errors

Disable submit while saving

Show success feedback

Scroll/focus to first validation error where useful

Avoid huge forms when possible.

50. Accessibility

Follow good WCAG practices.

Use:

Semantic HTML

Proper labels

Keyboard navigation

Visible focus states

Accessible buttons

ARIA only when necessary

Proper color contrast

Accessible error messages

Accessible dialogs

Accessible form controls

Logical heading hierarchy

Do not rely only on color to communicate status.

Example:

Instead of only red:

🔴 Cancelled


Use text + visual indicator.

51. Mobile UX

This application must work especially well on mobile.

Important screens:

Dashboard

Patient search

Patient profile

New visit

Eye examination

Medicine entry

Payment

Spectacle order

On mobile:

Use sticky action buttons where helpful

Keep Save button accessible

Avoid very wide tables

Use cards

Use bottom action areas when appropriate

Use full-width inputs

Maintain comfortable touch targets

52. API Integration

Create a clean API layer.

Example:

src/
├── api/
│   ├── client.ts
│   ├── auth.api.ts
│   ├── patients.api.ts
│   ├── visits.api.ts
│   ├── medicines.api.ts
│   ├── spectacles.api.ts
│   ├── payments.api.ts
│   ├── reports.api.ts
│   ├── dashboard.api.ts
│   └── settings.api.ts


Use Axios.

API base URL must come from environment variables.

Example:

VITE_API_BASE_URL


Do not hard-code backend URLs.

53. React Query

Use TanStack Query for:

Patients

Patient details

Visits

Medicines

Spectacle orders

Payments

Dashboard

Reports

Handle:

Loading

Error

Refetch

Cache invalidation

Mutations

After mutations, invalidate the correct queries.

Example:

After adding payment:

Invalidate:
patient details
patient payments
dashboard
collection reports


54. Authentication State

Implement:

Login
Store token securely according to frontend architecture
Attach token to API requests
Handle 401
Logout
Redirect to login


Do not expose tokens unnecessarily.

If possible, design authentication so sensitive tokens are not stored insecurely in plain localStorage without considering the security tradeoff.

55. Protected Routes

Create protected routes for:

Dashboard
Patients
Visits
Medicines
Spectacles
Payments
Reports
Settings


If unauthenticated:

/login


56. Routing

Use React Router.

Suggested routes:

/login
/dashboard

/patients
/patients/new
/patients/:id
/patients/:id/edit

/patients/:id/visits/new
/visits/:id

/medicines

/spectacles
/spectacles/:id

/payments

/reports

/settings


Use route-level organization.

57. Reusable Components

Create reusable components such as:

AppLayout
Sidebar
MobileDrawer
TopBar
PageHeader
StatCard
SearchBar
DataTable
MobileCardList
StatusChip
ConfirmDialog
FormField
CurrencyDisplay
LoadingState
EmptyState
ErrorState
PatientCard
PaymentSummary
EyePowerForm
MedicineSelector
PaymentForm


Do not duplicate UI logic.

58. Currency

Use Indian Rupee formatting.

Example:

₹1,850
₹12,500
₹1,85,600


Use a reusable currency formatter.

Do not manually format currency differently on every page.

59. Date Formatting

Use Indian-friendly date formatting.

Example:

06 Sep 2026


Do not display confusing raw ISO dates to users.

Handle timezone consistently with backend.

60. API Error Handling

Create a central Axios/API error handler.

Handle:

401
403
404
422
429
500
network error


Show user-friendly messages.

61. Performance

The UI should be fast.

Implement:

Lazy loading for routes where appropriate

Pagination

Debounced patient/medicine search

Avoid unnecessary API requests

React Query caching

Optimized images/assets

Avoid unnecessary re-renders

Do not fetch the entire patient database.

62. Design System

Create a consistent design system.

Define:

Typography

Spacing

Border radius

Shadows

Buttons

Form fields

Cards

Tables

Status chips

Dialogs

Responsive breakpoints

Use MUI theme.

Do not scatter arbitrary styles throughout components.

63. Theme

Create a professional light theme.

Primary:

Dark / Professional Blue


Background:

Very Light Gray / White


Cards:

White


Success:

Green


Warning:

Orange


Danger:

Red


Maintain WCAG-friendly contrast.

Optional dark mode can be architecturally possible but is NOT required now.

Do not spend development time on dark mode unless the core application is complete.

64. No Fake Data in Production UI

During initial development, mock data can be used temporarily if backend APIs are not yet available.

But once API integration is implemented:

Use real backend data.

Do not leave fake dashboard numbers, fake patients, fake payments, or fake reports in the final production UI.

Clearly separate mock/dev data from production API data.

65. Important Payment UI Restrictions

Remember:

There is NO payment gateway.

Do NOT create UI such as:

Pay Online
Pay Now
Razorpay Checkout
UPI Intent
Payment Gateway
Verify Payment Automatically


Instead:

Payment Received

Method:
Cash / UPI / Card / Other

Reference Number:
Optional

Notes:
Optional


For UPI, show:

Payment was received externally and verified manually.


66. No Staff UI

Do NOT create:

Staff
Team
Employees
Roles
Permissions
Invite Staff
Staff Registration


There is currently only one doctor/shop owner.

67. No Patient Portal UI

Do NOT create:

Patient Login
Patient Registration
Patient Portal
Patient Dashboard
Patient Self Booking


This will be added later.

68. No Complex Appointment System

Do not build a complete appointment scheduling module.

The current requirement is simply:

Today's Patients / Visits


The doctor should be able to see today's patients and start a visit.

69. Important User Flow

The most important flow must be extremely smooth:

Dashboard
    ↓
+ New Patient
    ↓
Patient Details
    ↓
Start Visit
    ↓
Eye Examination
    ↓
Add Medicine (optional)
    ↓
Add Spectacle Order (optional)
    ↓
Billing
    ↓
Payment
    ↓
Save
    ↓
Patient Summary


The doctor should be able to complete this flow quickly.

70. Patient Existing Flow

For an existing patient:

Search Patient
    ↓
Open Patient
    ↓
View Previous History
    ↓
Start New Visit
    ↓
Enter New Eye Examination
    ↓
Medicine / Spectacles
    ↓
Payment
    ↓
Save


Do not require creating a duplicate patient.

71. Important UX Rule

The application is for a small shop with a simple workflow.

Do not make the doctor feel like they are using hospital software.

The UI should feel:

"Open patient → check history → enter power → add medicine/spectacle → collect payment → done."


This is the primary UX goal.

72. Project Structure

Use a scalable React + TypeScript structure:

src/
├── api/
├── assets/
├── components/
├── features/
│   ├── auth/
│   ├── dashboard/
│   ├── patients/
│   ├── visits/
│   ├── medicines/
│   ├── spectacles/
│   ├── payments/
│   ├── reports/
│   └── settings/
│
├── hooks/
├── layouts/
├── pages/
├── routes/
├── theme/
├── types/
├── utils/
├── App.tsx
└── main.tsx


Organize code by feature where practical.

73. TypeScript

Use proper TypeScript types.

Create types/interfaces for:

User
Patient
Visit
EyeExamination
Medicine
VisitMedicine
SpectacleOrder
Payment
DashboardSummary
CollectionReport
ShopSettings


Do not use any unnecessarily.

Use API response types.

74. Form Types

Use strongly typed forms.

React Hook Form should integrate with Zod.

Example:

PatientFormSchema
EyeExaminationSchema
MedicineSchema
SpectacleOrderSchema
PaymentSchema
SettingsSchema


75. State Management

Do not use Redux unless genuinely required.

Prefer:

TanStack Query
+
React local state
+
Context only where appropriate


Keep state simple.

76. Responsive Tables

For desktop use tables.

For mobile:

Prefer cards for complex rows.

For example:

┌────────────────────────────┐
│ Raj Kumar                  │
│ P-000123                   │
│ 98XXXXXXXX                 │
│                            │
│ Visit: 06 Sep 2026         │
│ Amount: ₹1,500             │
│ Status: Paid               │
│                            │
│ View Patient →             │
└────────────────────────────┘


Do not force users to zoom or horizontally scroll the entire application.

77. Mobile Navigation

On mobile use:

Top App Bar
☰ Menu


Optionally provide a bottom navigation for the most important actions:

Dashboard
Patients
Visits
More


Do not duplicate navigation unnecessarily.

78. Accessibility

Ensure:

Keyboard navigation

Focus management

Form labels

Error announcements where appropriate

Accessible dialogs

Accessible tables

Accessible icons

Tooltips for icon-only buttons

Minimum comfortable touch targets

No color-only information

All interactive elements must be keyboard accessible.

79. Security

Frontend must:

Never expose environment secrets

Never store passwords

Never log tokens

Handle expired sessions

Avoid rendering sensitive information unnecessarily

Use HTTPS in production

Keep API base URL configurable

Remember that frontend validation is not a security boundary.

Backend remains authoritative.

80. Production Build

The application must work with:

npm install
npm run dev
npm run build
npm run preview


Build must complete without TypeScript errors.

No broken imports.

No console errors in normal usage.

81. Environment Variables

Create:

.env.example


Example:

VITE_API_BASE_URL=http://localhost:5000/api/v1


Do not hard-code API URLs.

82. Error Boundary

Implement a React error boundary for unexpected UI errors.

Show:

Something went wrong.

Please refresh the page or try again.


Do not expose technical stack traces to the user.

83. Confirmation & Unsaved Changes

For important forms such as New Visit:

If the user has entered data and tries to leave, consider warning about unsaved changes.

Do not annoy the user with unnecessary confirmations.

84. Accessibility Button

If an accessibility control is present, make it functional or do not display it.

Do not create decorative accessibility buttons that do nothing.

85. Print-Friendly Design

Prepare the frontend architecture so the following can later be printed:

Prescription

Payment receipt

Spectacle order receipt

Printing is useful, but do not build a large printing subsystem unless required.

At minimum, structure the components so print styles can be added cleanly.

86. Final UI Pages

The final frontend should contain at minimum:

1. Login

2. Dashboard

3. Patients
   - Patient List
   - Add Patient
   - Edit Patient
   - Patient Details
   - Patient Timeline
   - New Visit

4. Today's Visits

5. Medicines
   - Medicine List
   - Add Medicine
   - Edit Medicine

6. Spectacle Orders
   - Order List
   - Order Details

7. Payments
   - Payment List
   - Payment Details

8. Reports
   - Daily
   - Weekly
   - Monthly
   - Custom Range

9. Settings
   - Shop/Doctor Information


87. Final UX Acceptance Criteria

A doctor should be able to:

New Patient

Dashboard
→ New Patient
→ Enter details
→ Save
→ Start Visit


Existing Patient

Search
→ Open patient
→ See complete history
→ Start visit


Eye Examination

Enter OD
Enter OS
Enter PD
Save


Medicine

Search medicine
→ Select
→ Enter dosage
→ Enter frequency
→ Enter duration
→ Add


Spectacle

Enable spectacles
→ Prescription
→ Frame
→ Lens
→ Charges
→ Save


Payment

Select Cash/UPI/Card/Other
→ Enter amount
→ Optional reference
→ Save


Revenue

Dashboard
→ See today/week/month collection


Everything should require as few clicks as reasonably possible.

88. Important Business Rules

Follow these frontend rules:

Patient

One patient can have many visits.

Visits

Never overwrite previous visits.

Eye Power

Every visit has its own examination.

Medicines

Historical medicine price must remain unchanged.

Spectacles

Patient can have multiple orders.

Payments

Patient/order can have multiple payments.

Due

Due = Total Bill - Total Completed Payments


Revenue

Revenue/collection is based on actual received payments.

UPI

UPI payments are manually verified and recorded.

89. Do Not Invent Backend APIs

The backend API is expected to follow this general structure:

/api/v1/auth
/api/v1/patients
/api/v1/visits
/api/v1/medicines
/api/v1/spectacles
/api/v1/payments
/api/v1/dashboard
/api/v1/reports
/api/v1/settings


If the existing backend provides exact endpoint names, inspect and use those exact endpoints.

Do NOT invent different endpoint structures unnecessarily.

Create a clean API service layer so endpoint changes can be made in one place.

90. If Backend Is Available

If the repository already contains the Node/Express/MongoDB backend:

Inspect the backend API.

Understand request/response formats.

Generate matching TypeScript types.

Integrate the frontend with the real API.

Do not create duplicate backend logic.

Do not mock production data.

Do not modify backend functionality unless necessary.

Do not break existing backend APIs.

91. If Backend Is Not Available

If the backend is not available yet:

Create a clean API abstraction.

Use temporary mock services only during UI development.

Keep all mock data isolated.

Make replacing mocks with real API calls straightforward.

Do not hard-code mock data inside UI components.

92. Final Quality Requirements

Before considering the frontend complete:

TypeScript has no errors

Build succeeds

No broken imports

No unnecessary any

All routes work

Login works

Protected routes work

Patient CRUD UI works

Patient search works

Patient history works

New visit works

Eye examination works

Medicine selection works

Spectacle order works

Payment works

Multiple payments work

Due calculation displays correctly

Dashboard uses real API data

Daily collection works

Weekly collection works

Monthly collection works

Custom reports work

Mobile responsive

Tablet responsive

Desktop responsive

Loading states work

Empty states work

Error states work

Toast notifications work

Accessibility basics work

No payment gateway UI

No staff UI

No patient portal UI

No WhatsApp integration

No unnecessary enterprise features

93. FINAL INSTRUCTION

Do not build a generic admin dashboard.

Build a purpose-built Eye Care & Spectacle Shop Management UI.

The most important experience is:

PATIENT
   ↓
EYE TEST
   ↓
POWER / MACHINE READING
   ↓
MEDICINE / SPECTACLE
   ↓
PAYMENT
   ↓
COLLECTION


The doctor should be able to manage a patient from arrival to payment without unnecessary navigation.

The UI must be:

Professional + Simple + Fast + Mobile Responsive + Accessible + Production Ready

Do not add unnecessary features.

Do not create fake business functionality.

Do not create payment gateway functionality.

Do not create staff management.

Do not create patient portal.

Do not create complex appointment scheduling.

Focus on the actual small-shop workflow.

After implementation, provide a concise summary of:

Files created/modified

Pages created

Components created

API integrations

Environment variables

Commands to run

Build/test results

Any remaining issues

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f3aac447-2942-4842-88e0-ccd0f24c0a8d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
