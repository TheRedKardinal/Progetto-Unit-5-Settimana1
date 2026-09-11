package com.example.demo.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Base64;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import net.sourceforge.tess4j.ITesseract;
import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;

@Service
public class OcrService {

    private final ITesseract tesseract;

    public OcrService(@Value("${ocr.tessdata-path}") String tessdataPath,
                       @Value("${ocr.language}") String language,
                       @Value("${ocr.native-library-path}") String nativeLibraryPath) {
        System.setProperty("jna.library.path", nativeLibraryPath);
        this.tesseract = new Tesseract();
        this.tesseract.setDatapath(tessdataPath);
        this.tesseract.setLanguage(language);
    }

    public String estraiTesto(String contenutoBase64) {
        byte[] immagine = decodeBase64(contenutoBase64);

        File tempFile;
        try {
            tempFile = File.createTempFile("ocr-", ".png");
            Files.write(tempFile.toPath(), immagine);
        } catch (IOException e) {
            throw new IllegalArgumentException("Impossibile leggere l'immagine fornita", e);
        }

        try {
            return tesseract.doOCR(tempFile).trim();
        } catch (TesseractException e) {
            throw new IllegalStateException("Errore durante l'elaborazione OCR", e);
        } finally {
            tempFile.delete();
        }
    }

    private byte[] decodeBase64(String contenuto) {
        String base64 = contenuto;
        int comma = contenuto.indexOf(',');
        if (contenuto.startsWith("data:") && comma != -1) {
            base64 = contenuto.substring(comma + 1);
        }
        try {
            return Base64.getDecoder().decode(base64);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Contenuto non è un'immagine Base64 valida", e);
        }
    }
}
