# 🏥 PH Healthcare System Backend

# 🏥 Live URL

------------link here

A scalable healthcare platform that connects **Patients** and **Doctors** through secure online consultations. Patients can search for doctors, book appointments, make online payments, attend video consultations, and receive digital prescriptions. Administrators manage users, approve doctors, and maintain the overall platform.

---

# Table of Contents

- Overview
- Features
- User Roles
- Authentication & Authorization
- Account Management
- Doctor Application Workflow
- Doctor Schedule Management
- Appointment Booking
- Appointment Lifecycle
- Prescription Management
- Cancellation & Refund Policy
- Email Notifications
- Business Rules
- Conceptual Data Models
- Future Scope

---

# Overview

PH Healthcare System is a role-based healthcare platform designed for online medical consultation.

The platform enables:

- Patients to register, search doctors, book appointments, pay online, attend consultations, and receive prescriptions.
- Doctors to publish schedules, manage appointments, conduct consultations, and issue digital prescriptions.
- Admins to manage doctors and patients.
- Super Admins to manage the entire platform, including other administrators.

The backend is designed using a modular architecture with clear separation of authentication, appointment management, scheduling, payments, and administration.

---

# Features

## Authentication

- Email & Password Login
- Google Login (Patients Only)
- JWT Authentication
- Access Token
- Refresh Token
- Cookie-based Authentication
- Email OTP Verification
- Forgot Password
- Reset Password
- Change Password
- Set Password (Google Patients)

---

## Patient Features

- Register using Email
- Register using Google
- Update Profile
- Browse Today's Available Doctors
- Book Appointment
- Online Payment
- Download Invoice
- Join Video Consultation
- Cancel Appointment
- Receive Refund (when eligible)
- Receive Prescription PDF

---

## Doctor Features

- Apply as Doctor
- Email OTP Verification
- Wait for Approval
- Login after Approval
- Manage Profile
- Create Schedule
- Publish Schedule
- Edit Schedule
- View Bookings
- Start Consultation
- Complete Consultation
- Generate Prescription

---

## Admin Features

- Doctor Approval
- Doctor Rejection
- Block Doctor
- Unblock Doctor
- Block Patient
- Unblock Patient
- Create Admin
- Dashboard & Monitoring

---

## Super Admin Features

Everything an Admin can do, plus:

- Create Super Admin
- Block Admin
- Unblock Admin
- Block Super Admin
- Unblock Super Admin

---

# User Roles

There are four system roles.

| Role        | Registration                 | Login                   |
| ----------- | ---------------------------- | ----------------------- |
| Patient     | Self Registration            | Email/Password & Google |
| Doctor      | Doctor Application           | Email/Password          |
| Admin       | Created by Admin/Super Admin | Email/Password          |
| Super Admin | Created by Super Admin       | Email/Password          |

---

# Authentication & Authorization

## Patient

Supports:

- Email Registration
- Google Registration
- Email Login
- Google Login

Google and Email accounts sharing the same email address are treated as one account.

---

## Doctor

- Email Registration
- OTP Verification
- Requires Admin Approval
- Email Login Only

---

## Admin

- Created internally
- Email Login Only

---

## Super Admin

- Created internally
- Email Login Only

---

# Account Management

## Email Verification

OTP verification is required for:

- Patient Registration
- Doctor Application

OTP verification is NOT required for:

- Google Registration
- Admin Creation
- Super Admin Creation

---

## Password Management

Supported features:

- Forgot Password
- Reset Password
- Change Password
- Set Password (Google Patients)

---

## Session Management

Every successful authentication returns:

- Access Token
- Refresh Token

Both are stored securely in HTTP-only cookies.

---

# Doctor Application Workflow

```
Apply
      │
      ▼
OTP Verification
      │
      ▼
Pending Review
      │
      ├────────► Rejected
      │
      ▼
Approved
      │
      ▼
Doctor Account Activated
      │
      ▼
Welcome Email
      │
      ▼
Doctor Login
```

Only approved doctors can access the platform.

---

# Doctor Schedule Management

Each doctor can publish daily schedules.

## Schedule Rules

- One schedule per doctor per calendar day
- Minimum duration: **3 hours**
- Maximum duration: **8 hours**
- Must remain within the same calendar day
- Doctor provides one Meet/Zoom/Video Call link
- Starts as Draft
- Must be Published before patients can view it

---

## Slot Generation

Slots are automatically generated.

```
Slot Length = 20 Minutes
```

Example

```
3 PM → 9 PM

6 Hours

360 Minutes

360 / 20 = 18 Slots
```

## Editing Rules

| Field             | Editable            |
| ----------------- | ------------------- |
| Date              | ❌ After Publish    |
| Time Range        | Until First Booking |
| Meet Link         | ✅                  |
| Status            | ✅                  |
| Other Information | ✅                  |

---

# Appointment Booking

Patients can only book:

- Today's schedules
- Published schedules
- Available schedules
- Before schedule start time

Hidden schedules:

- Future schedules
- Past schedules
- Started schedules
- Fully booked schedules

---

## Booking Flow

```
Patient
     │
     ▼
Choose Slot
     │
     ▼
Payment
     │
     ▼
Appointment Created
     │
     ▼
Serial Number Assigned
     │
     ▼
Invoice PDF Generated
     │
     ▼
Invoice Email Sent
```

---

## Appointment Serial

Appointments receive sequential serial numbers.

Example

| Booking Order | Serial |
| ------------- | ------ |
| First         | 1      |
| Second        | 2      |
| Third         | 3      |

---

# Appointment Lifecycle

```
Booked
   │
   ▼
Ongoing
   │
   ▼
Completed
```

Status updates:

| Status    | Updated By |
| --------- | ---------- |
| Booked    | System     |
| Ongoing   | Doctor     |
| Completed | Doctor     |

---

# Prescription Management

A prescription can only be created when:

- Appointment Status = Completed

Prescription contains:

- Findings
- Medicines
- Notes

After submission:

- PDF generated
- Email sent to patient

---

# Cancellation & Refund Policy

Refund depends on cancellation timing.

| Cancellation Time             | Refund         |
| ----------------------------- | -------------- |
| More than 1 Hour Before Start | ✅ Full Refund |
| Within 1 Hour Before Start    | ❌ No Refund   |
| During Consultation Time      | ❌ No Refund   |
| After Consultation Ends       | ❌ No Refund   |

Appointments remain cancellable even after the consultation period has ended, but refunds are no longer available once the refund window has passed.

---

# Email Notifications

## Patient Registration

- Welcome Email

---

## Doctor Approval

- Welcome Email

---

## Appointment Booking

- Invoice PDF

---

## Prescription

- Prescription PDF

---

## Admin Creation

Sent to Personal Email:

- Organization Email
- Generated Password
- Login Instructions
- Change Password Reminder

---

# Business Rules

## Registration

- Only Patients may self-register.
- Doctors must apply and be approved.
- Admins cannot self-register.
- Super Admins cannot self-register.

---

## Google Authentication

Supported only for Patients.

---

## Doctor Approval

Doctors cannot log in until approved.

---

## Schedule Rules

- One schedule per day.
- 3–8 hours only.
- Same-day time range.
- 20-minute slots.

---

## Booking Rules

Patients may only book:

- Today's schedules
- Published schedules
- Before schedule start time
- Available slots

---

## Appointment Rules

Payment is mandatory before appointment creation.

---

## Prescription Rules

Only completed appointments may receive prescriptions.

---

## Refund Rules

Refund available only when cancellation occurs more than one hour before the schedule start time.

---

# Conceptual Data Models

## User

Shared identity for all roles.

Contains:

- Email
- Password (nullable)
- Google Account
- Role
- Account Status
- Email Verified
- Must Change Password

Roles:

- SUPER_ADMIN
- ADMIN
- DOCTOR
- PATIENT

---

## Patient Profile

Contains:

- Personal Information
- Medical Information

---

## Doctor Profile

Contains:

- Personal Information
- Professional Information
- Specialization
- Experience

---

## Admin Profile

Contains:

- Personal Information
- Organization Email

Used by:

- Admin
- Super Admin

---

# Future Scope

The architecture is designed to support future enhancements, including:

- Multiple payment gateways
- Real-time chat
- Push notifications
- SMS OTP
- Electronic Health Records (EHR)
- Lab report management
- Pharmacy integration
- AI-assisted symptom analysis
- Analytics dashboard
- Multi-language support
- Multi-hospital support
- Mobile applications (Android & iOS)

---

# License

This project is intended for educational and production-ready healthcare platform development. All business rules and workflows described in this document represent the functional specification of the PH Healthcare System.

## ERD Relation Link:
------link here

## ERD Design Screenshot:

<p align="center">
  <img src="./assets/images/RentNest.png" alt="ERD Diagram" width="100%">
</p>
