package eeoc.congreso_espirita.Services;

import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.Image;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.*;

import eeoc.congreso_espirita.Entity.Ticket;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
 
import java.awt.*;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Service
@Slf4j
@RequiredArgsConstructor
public class TicketPDFService {

    private final QrGeneratorService qrGeneratorService;
 
    // ── Paleta de colores del congreso ────────────────────────────────────────
    private static final Color DEEP_BLUE  = new Color(15, 23, 42);    // stone-900
    private static final Color GOLD       = new Color(217, 119, 6);   // amber-600
    private static final Color GOLD_LIGHT = new Color(254, 243, 199); // amber-50
    private static final Color MUTED      = new Color(120, 113, 108); // stone-500
    private static final Color WHITE      = Color.WHITE;
    private static final Color BORDER     = new Color(231, 229, 228); // stone-200
 
   private static final DateTimeFormatter DATE_FMT =
    DateTimeFormatter.ofPattern("dd 'de' MMMM, yyyy", 
        new Locale.Builder().setLanguage("es").setRegion("HN").build());
 
    /**
     * Genera el PDF del ticket como array de bytes.
     *
     * @param ticket - entidad con status PAID y qrToken ya asignado
     * @return byte[] con el PDF completo
     */
    public byte[] generateTicketPdf(Ticket ticket) {
    try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
        Rectangle pageSize = new Rectangle(595, 420);
        
        try (Document doc = new Document(pageSize, 30, 30, 30, 30)) {
            PdfWriter writer = PdfWriter.getInstance(doc, out);
            doc.open();
            
            PdfContentByte canvas = writer.getDirectContent();
            
            // Fondos
            canvas.setColorFill(DEEP_BLUE);
            canvas.rectangle(0, 0, 220, 420);
            canvas.fill();
            
            canvas.setColorFill(GOLD);
            canvas.rectangle(220, 0, 4, 420);
            canvas.fill();
            
            // Logo (con multicatch)
            try {
                ClassPathResource logoResource = new ClassPathResource("static/logo_eeoc.png");
                byte[] logoBytes = logoResource.getInputStream().readAllBytes();
                Image logo = Image.getInstance(logoBytes);
                logo.scaleToFit(100, 100);
                logo.setAbsolutePosition(60, 280);
                doc.add(logo);
            } catch (IOException | BadElementException e) {
                log.warn("No se pudo cargar el logo: {}", e.getMessage());
            }
 
            // ── Nombre del evento (lado izquierdo) ───────────────────────────
            BaseFont bf = BaseFont.createFont(BaseFont.HELVETICA_BOLD, BaseFont.WINANSI, false);
            BaseFont bfNormal = BaseFont.createFont(BaseFont.HELVETICA, BaseFont.WINANSI, false);
 
            // Título
            canvas.setColorFill(GOLD);
            canvas.setFontAndSize(bf, 11);
            canvas.beginText();
            canvas.showTextAligned(Element.ALIGN_CENTER, "CONGRESO ESPÍRITA", 110, 255, 0);
            canvas.endText();
 
            canvas.setColorFill(WHITE);
            canvas.setFontAndSize(bf, 10);
            canvas.beginText();
            canvas.showTextAligned(Element.ALIGN_CENTER, "HONDUREÑO 2026", 110, 240, 0);
            canvas.endText();
 
            // Fecha
            canvas.setColorFill(new Color(214, 211, 209)); // stone-300
            canvas.setFontAndSize(bfNormal, 8);
            canvas.beginText();
            canvas.showTextAligned(Element.ALIGN_CENTER, "14 y 15 de Agosto, 2026", 110, 220, 0);
            canvas.endText();
 
            // Lugar
            canvas.setColorFill(MUTED);
            canvas.setFontAndSize(bfNormal, 7);
            canvas.beginText();
            canvas.showTextAligned(Element.ALIGN_CENTER, "Tegucigalpa, Honduras", 110, 207, 0);
            canvas.endText();
 
            // ── Separador decorativo ─────────────────────────────────────────
            canvas.setColorStroke(new Color(63, 63, 70));
            canvas.setLineWidth(0.5f);
            canvas.moveTo(30, 195);
            canvas.lineTo(190, 195);
            canvas.stroke();
 
            // ── Tipo de boleto ───────────────────────────────────────────────
            canvas.setColorFill(GOLD_LIGHT);
            canvas.roundRectangle(40, 165, 140, 22, 5);
            canvas.fill();
 
            canvas.setColorFill(GOLD);
            canvas.setFontAndSize(bf, 8);
            canvas.beginText();
            canvas.showTextAligned(Element.ALIGN_CENTER, "✦  ACCESO GENERAL — 2 DÍAS  ✦", 110, 172, 0);
            canvas.endText();
 
            // ── ID del ticket (abreviado) ────────────────────────────────────
            String shortId = ticket.getId().substring(0, 8).toUpperCase();
            canvas.setColorFill(new Color(161, 155, 150)); // stone-400
            canvas.setFontAndSize(bfNormal, 7);
            canvas.beginText();
            canvas.showTextAligned(Element.ALIGN_CENTER, "ID: " + shortId, 110, 148, 0);
            canvas.endText();
 
            // ── Lado derecho: datos del asistente ────────────────────────────
            int rx = 245; // x inicio columna derecha
 
            // Label sección
            canvas.setColorFill(GOLD);
            canvas.setFontAndSize(bf, 7);
            canvas.beginText();
            canvas.showTextAligned(Element.ALIGN_LEFT, "ASISTENTE", rx, 375, 0);
            canvas.endText();
 
            // Nombre
            canvas.setColorFill(DEEP_BLUE);
            canvas.setFontAndSize(bf, 16);
            String nombre = ticket.getAttendeeName();
            if (nombre.length() > 28) nombre = nombre.substring(0, 25) + "...";
            canvas.beginText();
            canvas.showTextAligned(Element.ALIGN_LEFT, nombre, rx, 352, 0);
            canvas.endText();
 
            // Correo
            canvas.setColorFill(MUTED);
            canvas.setFontAndSize(bfNormal, 8);
            canvas.beginText();
            canvas.showTextAligned(Element.ALIGN_LEFT, ticket.getAttendeeEmail(), rx, 337, 0);
            canvas.endText();
 
            // ── Grid de info del evento ───────────────────────────────────────
            int gridY = 295;
            drawInfoBlock(canvas, bf, bfNormal, rx,       gridY, "FECHA",   "14-15 Ago 2026");
            drawInfoBlock(canvas, bf, bfNormal, rx + 120, gridY, "LUGAR",   "Tegucigalpa, HN");
            drawInfoBlock(canvas, bf, bfNormal, rx,       gridY - 50, "MODALIDAD", "Presencial");
            drawInfoBlock(canvas, bf, bfNormal, rx + 120, gridY - 50, "PRECIO",
                    ticket.getCurrency() + " " + ticket.getPriceAtPurchase().toPlainString());
 
            // ── Separador ────────────────────────────────────────────────────
            canvas.setColorStroke(BORDER);
            canvas.setLineWidth(0.5f);
            canvas.moveTo(rx, 228);
            canvas.lineTo(560, 228);
            canvas.stroke();
 
            // ── QR Code ──────────────────────────────────────────────────────
            byte[] qrBytes = qrGeneratorService.generateQrPng(ticket.getQrToken());
            Image qrImage = Image.getInstance(qrBytes);
            qrImage.scaleToFit(110, 110);
            qrImage.setAbsolutePosition(430, 100);
            doc.add(qrImage);
 
            // Label QR
            canvas.setColorFill(MUTED);
            canvas.setFontAndSize(bfNormal, 6);
            canvas.beginText();
            canvas.showTextAligned(Element.ALIGN_CENTER, "Presenta este QR en la entrada", 485, 90, 0);
            canvas.endText();
 
            // ── Instrucciones de acceso ───────────────────────────────────────
            canvas.setColorFill(DEEP_BLUE);
            canvas.setFontAndSize(bf, 7);
            canvas.beginText();
            canvas.showTextAligned(Element.ALIGN_LEFT, "INSTRUCCIONES DE ACCESO", rx, 210, 0);
            canvas.endText();
 
            String[] instrucciones = {
                "• Presenta este QR en la entrada cada día del evento.",
                "• Este boleto es personal e intransferible.",
                "• Llega 30 minutos antes para registro y gafete.",
                "• Conserva el PDF en tu dispositivo o imprímelo."
            };
 
            canvas.setColorFill(MUTED);
            canvas.setFontAndSize(bfNormal, 7);
            int instrY = 195;
            for (String instruccion : instrucciones) {
                canvas.beginText();
                canvas.showTextAligned(Element.ALIGN_LEFT, instruccion, rx, instrY, 0);
                canvas.endText();
                instrY -= 13;
            }
 
            // ── Footer ────────────────────────────────────────────────────────
            canvas.setColorFill(GOLD_LIGHT);
            canvas.rectangle(224, 0, 371, 28);
            canvas.fill();
 
            canvas.setColorFill(GOLD);
            canvas.setFontAndSize(bfNormal, 7);
            canvas.beginText();
            canvas.showTextAligned(Element.ALIGN_LEFT,
                    "Escuela Espírita Orientación Cristiana · info@congresoespirita.hn", rx, 10, 0);
            canvas.endText();
 
            doc.close();
            log.info("PDF generado correctamente para ticket: {}", ticket.getId());


            return out.toByteArray();

        }                
            } catch (DocumentException | IOException e) {  // 2. Multicatch
                log.error("Error generando PDF del ticket", e);
                throw new RuntimeException("Error al generar el ticket PDF", e);
            }
        }
 
    /** Dibuja un bloque label + valor en el PDF. */
    private void drawInfoBlock(PdfContentByte canvas, BaseFont bf, BaseFont bfNormal,
                                int x, int y, String label, String value) throws DocumentException, IOException {
        canvas.setColorFill(MUTED);
        canvas.setFontAndSize(bfNormal, 6.5f);
        canvas.beginText();
        canvas.showTextAligned(Element.ALIGN_LEFT, label, x, y, 0);
        canvas.endText();
 
        canvas.setColorFill(DEEP_BLUE);
        canvas.setFontAndSize(bf, 9);
        canvas.beginText();
        canvas.showTextAligned(Element.ALIGN_LEFT, value, x, y - 13, 0);
        canvas.endText();
    }
}
