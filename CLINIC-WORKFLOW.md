# Clinic workflow

1. In Settings, save the clinic information and default consultation fee.
2. Add your medicines and their prices under Medicines.
3. Find or register a patient, then choose **Start new visit**.
4. Record symptoms, OD/OS SPH, CYL, AXIS, ADD, VA, PD, examination remarks, doctor notes, follow-up date, and any medicines. Blank eye fields remain unspecified; enter 0 explicitly for plano.
5. Save the visit. On the patient profile, use **Create spectacle order** if needed. The latest examination is prefilled; review the final prescription, frame, lens, prices, discount and delivery date before saving. After saving, you are redirected to the spectacle orders listing. Use **Manage order / record payment** on the order to return to the patient profile.
6. Under **Record received payment**, select the visit or order bill, enter the amount actually received, and select Cash or UPI / QR. UPI must be verified manually in the clinic's existing payment app. A payment never triggers a charge or contacts a payment provider.
7. Record an advance and subsequent balance payments against the same bill. A combined receipt covering both a visit and spectacles must be split into two bill allocations; the two amounts must add up to the actual receipt.
8. Progress orders through In process → Ready → Delivered. Unpaid orders can be cancelled. Paid orders cannot be cancelled because refunds are not implemented.
9. Dashboard and Reports show completed payment records, not billed revenue. Reports use India time and allow a custom date range.

Patient history retains prescriptions and medicine instructions. Loading failures show retry controls instead of demo records. Lists load all API pages; very large clinics may eventually need server-side search and pagination in these views.

## Verification

- Frontend: `npm run build`, `npx tsc --noEmit`.
- Backend: `npm test` (uses a separate temporary MongoDB), `npm run lint`.
- API workflow tests cover saved prescriptions, order pricing, partial and final payment, dues, collection breakdown, ownership validation, cancelled orders and invalid axis values.

## Receipts and printing

- **Payments → View receipt** opens the receipt for that individual cash/UPI payment.
- **Spectacle orders → View receipt** opens the order's frame/lens bill, prescription, delivery details and payment record.
- **Visits → Bill / prescription** opens consultation charges, medicine charges, examination readings, medicine instructions and follow-up date.
- The same links are available in each patient's order, payment and examination history.
- Choose **Print / Save PDF** to print an A4 patient copy or save it as a PDF using the browser print dialog. Navigation and action buttons are excluded from printing.
- Clinic name, doctor, contact and registration details come from Settings. Receipt numbers use the saved payment, order or visit number.
- An individual payment receipt always shows that payment's amount. The separate balance summary is current at viewing time and includes subsequent payments. Unpaid bills are labelled unpaid, and cancelled orders are explicitly marked.
- Receipt views use current clinic/patient information; they are not immutable archived PDFs. Save a PDF when a fixed copy is needed.
