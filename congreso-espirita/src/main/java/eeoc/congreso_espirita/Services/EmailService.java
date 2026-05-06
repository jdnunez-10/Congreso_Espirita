package eeoc.congreso_espirita.Services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import eeoc.congreso_espirita.Entity.Ticket;

/**
 * Módulo 4 — Envía el ticket PDF por correo electrónico.
 *
 * HU-04: "Envío automático tras confirmación del Webhook."
 *
 * El método es @Async para no bloquear el hilo del webhook/simulación.
 * El usuario recibe la confirmación de pago inmediatamente y el email
 * llega en segundo plano.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final TicketPDFService ticketPdfService;

    /**
     * Genera el PDF del ticket y lo envía al correo del asistente.
     *
     * @param ticket - debe estar en estado PAID con qrToken asignado
     */
    @Async
    public void sendTicketEmail(Ticket ticket) {
        try {
            byte[] pdfBytes = ticketPdfService.generateTicketPdf(ticket);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("noreply@congresoespirita.hn", "Congreso Espírita Hondureño");
            helper.setTo(ticket.getAttendeeEmail());
            helper.setSubject("✦ Tu ticket para el Congreso Espírita Hondureño 2026");
            helper.setText(buildEmailHtml(ticket), true); // true = html
            helper.addAttachment(
                    "ticket-congreso-espirita-2026.pdf",
                    new org.springframework.core.io.ByteArrayResource(pdfBytes),
                    "application/pdf"
            );

            mailSender.send(message);
            log.info("Email enviado a {} para ticket {}", ticket.getAttendeeEmail(), ticket.getId());

        } catch (MessagingException | java.io.UnsupportedEncodingException e) {
            // Log pero no lanzar — el pago ya fue confirmado, el email es secundario
            // TODO: implementar reintentos con cola de mensajes en producción
            log.error("Error enviando email para ticket {}: {}", ticket.getId(), e.getMessage());
        }
    }

    /** HTML del cuerpo del correo. */
    private String buildEmailHtml(Ticket ticket) {
        String nombre = ticket.getAttendeeName();
        String shortId = ticket.getId().substring(0, 8).toUpperCase();

        return """
            <!DOCTYPE html>
            <html lang="es">
            <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
            <body style="margin:0;padding:0;background:#f5f5f4;font-family:'Helvetica Neue',Arial,sans-serif;">
              <table width="100%%" cellpadding="0" cellspacing="0" style="background:#f5f5f4;padding:40px 20px;">
                <tr><td align="center">
                  <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

                    <!-- Header -->
                    <tr>
                      <td style="background:#0f172a;padding:32px 40px;text-align:center;">
                        <p style="color:#d97706;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 8px;">Escuela Espírita Orientación Cristiana</p>
                        <h1 style="color:#ffffff;font-size:24px;font-weight:900;margin:0;line-height:1.2;">
                          Congreso Espírita<br><span style="color:#fbbf24;">Hondureño 2026</span>
                        </h1>
                        <p style="color:#a8a29e;font-size:13px;margin:12px 0 0;">14 y 15 de Agosto · Tegucigalpa, Honduras</p>
                      </td>
                    </tr>

                    <!-- Saludo -->
                    <tr>
                      <td style="padding:32px 40px 0;">
                        <p style="color:#0f172a;font-size:18px;font-weight:700;margin:0 0 8px;">¡Hola, %s! 👋</p>
                        <p style="color:#78716c;font-size:14px;line-height:1.6;margin:0;">
                          Tu pago fue confirmado exitosamente. Encontrarás tu ticket digital
                          con código QR adjunto a este correo en formato PDF.
                        </p>
                      </td>
                    </tr>

                    <!-- Tarjeta de ticket -->
                    <tr>
                      <td style="padding:24px 40px;">
                        <table width="100%%" cellpadding="0" cellspacing="0"
                               style="background:#fafaf9;border:1px solid #e7e5e4;border-radius:12px;overflow:hidden;">
                          <tr>
                            <td style="background:#d97706;padding:10px 20px;">
                              <p style="color:#ffffff;font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;margin:0;">
                                ✦ Boleto General — Acceso 2 Días
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding:20px;">
                              <table width="100%%" cellpadding="0" cellspacing="0">
                                <tr>
                                  <td width="50%%" style="padding-bottom:16px;">
                                    <p style="color:#a8a29e;font-size:10px;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 4px;">Asistente</p>
                                    <p style="color:#0f172a;font-size:14px;font-weight:700;margin:0;">%s</p>
                                  </td>
                                  <td width="50%%" style="padding-bottom:16px;">
                                    <p style="color:#a8a29e;font-size:10px;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 4px;">ID de Ticket</p>
                                    <p style="color:#0f172a;font-size:14px;font-weight:700;font-family:monospace;margin:0;">%s</p>
                                  </td>
                                </tr>
                                <tr>
                                  <td width="50%%">
                                    <p style="color:#a8a29e;font-size:10px;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 4px;">Fecha</p>
                                    <p style="color:#0f172a;font-size:13px;font-weight:600;margin:0;">14-15 Ago 2026</p>
                                  </td>
                                  <td width="50%%">
                                    <p style="color:#a8a29e;font-size:10px;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 4px;">Precio pagado</p>
                                    <p style="color:#d97706;font-size:13px;font-weight:700;margin:0;">%s %s</p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    <!-- Instrucciones -->
                    <tr>
                      <td style="padding:0 40px 24px;">
                        <table width="100%%" cellpadding="0" cellspacing="0"
                               style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:16px;">
                          <tr>
                            <td>
                              <p style="color:#92400e;font-size:12px;font-weight:700;margin:0 0 8px;">📋 Instrucciones importantes</p>
                              <ul style="color:#78716c;font-size:12px;line-height:1.8;margin:0;padding-left:16px;">
                                <li>Presenta el PDF adjunto (o imprímelo) en la entrada del evento.</li>
                                <li>El QR se escanea <strong>por separado cada día</strong> del congreso.</li>
                                <li>Llega 30 minutos antes para registro y entrega de gafete.</li>
                                <li>Este boleto es personal e intransferible.</li>
                              </ul>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="background:#0f172a;padding:24px 40px;text-align:center;">
                        <p style="color:#57534e;font-size:11px;margin:0;">
                          © 2026 Escuela Espírita Orientación Cristiana · Honduras
                        </p>
                        <p style="color:#44403c;font-size:10px;margin:6px 0 0;">
                          ¿Preguntas? Escríbenos a
                          <a href="mailto:info@congresoespirita.hn" style="color:#d97706;">info@congresoespirita.hn</a>
                        </p>
                      </td>
                    </tr>

                  </table>
                </td></tr>
              </table>
            </body>
            </html>
            """.formatted(nombre, nombre, shortId, ticket.getCurrency(),
                          ticket.getPriceAtPurchase().toPlainString());
    }
}