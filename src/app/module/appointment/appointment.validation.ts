import z from 'zod';

// ============================================
// BOOK APPOINTMENT VALIDATION
// ============================================

export const BookAppointmentValidationZodSchema = z.object({
    scheduleId: z.string().min(1, 'Schedule Id Is Required'),
});

// ============================================
// UPDATE APPOINTMENT STATUS VALIDATION
// ============================================

export const UpdateAppointmentStatusValidationZodSchema = z.object({
    status: z.enum(
        ['ONGOING', 'COMPLETED'],
        'Status Must Be Either ONGOING Or COMPLETED',
    ),
});

// ============================================
// BKASH PAYMENT RESPONSE VALIDATION
// ============================================

export const BkashPaymentResponseValidationZodSchema = z
    .object({
        paymentID: z.string().optional(),
        trxID: z.string().optional(),
        transactionStatus: z.string().optional(),

        amount: z.union([z.string(), z.number()]).optional(),

        currency: z.string().optional(),
        intent: z.string().optional(),
        paymentExecuteTime: z.string().optional(),
        merchantInvoiceNumber: z.string().optional(),
        statusCode: z.string().optional(),
        statusMessage: z.string().optional(),
    })
    .passthrough();

// ============================================
// BKASH PAYMENT RESPONSE TYPE
// ============================================

export type IBkashPaymentResponse = z.infer<
    typeof BkashPaymentResponseValidationZodSchema
>;
