package com.example.demo.service;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.Base64;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Esegue l'OCR invocando direttamente il binario a riga di comando di
 * Tesseract, invece del wrapper Java tess4j/lept4j: quest'ultimo, su questa
 * JDK, ha un bug nella conversione dell'immagine (IndexOutOfBoundsException
 * in lept4j.LeptUtils.convertImageToPix) che il binario nativo non ha.
 */
@Service
public class OcrService {

    private final String binaryPath;
    private final String tessdataPath;
    private final String language;

    public OcrService(@Value("${ocr.binary-path}") String binaryPath,
                       @Value("${ocr.tessdata-path}") String tessdataPath,
                       @Value("${ocr.language}") String language) {
        this.binaryPath = binaryPath;
        this.tessdataPath = tessdataPath;
        this.language = language;
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
            return eseguiTesseract(tempFile);
        } finally {
            tempFile.delete();
        }
    }

    private String eseguiTesseract(File imageFile) {
        ProcessBuilder processBuilder = new ProcessBuilder(
                binaryPath,
                imageFile.getAbsolutePath(),
                "stdout",
                "-l", language,
                "--tessdata-dir", tessdataPath);

        try {
            Process process = processBuilder.start();

            String output;
            String errorOutput;
            try (var stdout = process.getInputStream(); var stderr = process.getErrorStream()) {
                output = new String(stdout.readAllBytes(), StandardCharsets.UTF_8);
                errorOutput = new String(stderr.readAllBytes(), StandardCharsets.UTF_8);
            }

            int exitCode = process.waitFor();
            if (exitCode != 0) {
                throw new IllegalStateException("Errore durante l'elaborazione OCR: " + errorOutput.trim());
            }

            return output.trim();
        } catch (IOException e) {
            throw new IllegalStateException("Impossibile avviare Tesseract: verificare 'ocr.binary-path'", e);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("Elaborazione OCR interrotta", e);
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
