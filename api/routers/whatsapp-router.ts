/**
 * ============================================================
 * WHATSAPP NOTIFICATION ROUTER
 * ============================================================
 * Webhook endpoints for WhatsApp Business API integration.
 * Receives status callbacks. Sends outbound notifications
 * via Twilio-compatible API.
 * ============================================================
 */

import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { safeOperation } from "../lib/levav-errors";

interface WhatsAppPayload {
  to: string;
  body: string;
  template?: string;
  variables?: Record<string, string>;
}

/**
 * Send a WhatsApp message via Twilio-compatible API.
 * Requires TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and
 * TWILIO_WHATSAPP_NUMBER in environment variables.
 */
async function sendWhatsAppMessage(payload: WhatsAppPayload): Promise<boolean> {
  const { to, body } = payload;

  /* Format phone number for Zambia */
  const formattedPhone = to.startsWith("+") ? to : `+260${to.replace(/^0/, "")}`;

  try {
    /* Try Twilio if credentials are configured */
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER;

    if (accountSid && authToken && fromNumber) {
      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Basic " + btoa(`${accountSid}:${authToken}`),
          },
          body: new URLSearchParams({
            From: `whatsapp:${fromNumber}`,
            To: `whatsapp:${formattedPhone}`,
            Body: body,
          }),
        },
      );
      return response.ok;
    }

    /* Fallback: log the message for manual sending */
    if (!env.isProduction) console.log(`[WhatsApp] To: ${formattedPhone} | ${body}`);
    return true;
  } catch {
    return false;
  }
}

export const whatsappRouter = createRouter({
  /* ─── Send notification (admin/system use) ─── */
  send: publicQuery
    .input(
      z.object({
        phone: z.string().min(9).max(15),
        message: z.string().min(1).max(1600),
        template: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      return safeOperation(async () => {
        const sent = await sendWhatsAppMessage({
          to: input.phone,
          body: input.message,
          template: input.template,
        });
        return { sent, timestamp: new Date().toISOString() };
      }, "INTERNAL_ERROR");
    }),

  /* ─── Webhook: Receive WhatsApp messages ─── */
  webhook: publicQuery
    .input(
      z.object({
        From: z.string(),
        Body: z.string(),
        MessageSid: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      /* Handle incoming WhatsApp messages */
      if (!env.isProduction) console.log(`[WhatsApp Inbound] From: ${input.From} | ${input.Body}`);
      return { status: "received" };
    }),

  /* ─── Webhook: Status callbacks ─── */
  status: publicQuery
    .input(
      z.object({
        MessageSid: z.string(),
        MessageStatus: z.string(),
        To: z.string(),
      }),
    )
    .query(async ({ input }) => {
      if (!env.isProduction) console.log(`[WhatsApp Status] ${input.MessageSid}: ${input.MessageStatus} → ${input.To}`);
      return { status: "logged" };
    }),
});
