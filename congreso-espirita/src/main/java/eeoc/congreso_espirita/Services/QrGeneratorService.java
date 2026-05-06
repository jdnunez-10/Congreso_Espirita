package eeoc.congreso_espirita.Services;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class QrGeneratorService  {
    
    private static final int QR_SIZE = 300; // píxeles
 
    /**
     * Genera un QR como array de bytes PNG a partir del qrToken.
     *
     * @param qrToken - token único del ticket (UUID)
     * @return byte[] con la imagen PNG del QR
     */
    public byte[] generateQrPng(String qrToken) {
        try {
            QRCodeWriter writer = new QRCodeWriter();
            Map<EncodeHintType, Object> hints = Map.of(
                    EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.H, // alta tolerancia
                    EncodeHintType.MARGIN, 2
            );
 
            BitMatrix matrix = writer.encode(qrToken, BarcodeFormat.QR_CODE, QR_SIZE, QR_SIZE, hints);
 
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(matrix, "PNG", out);
            return out.toByteArray();
 
        } catch (WriterException | IOException e) {
            log.error("Error generando QR para token: {}", qrToken, e);
            throw new RuntimeException("No se pudo generar el código QR", e);
        }
    }
}
