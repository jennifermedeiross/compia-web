package com.compia.controller;

import org.springframework.core.io.Resource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/download")
@CrossOrigin("*")
public class DownloadController {

    @GetMapping("/{filename}")
    public ResponseEntity<Resource> download(@PathVariable String filename) {

        try {

            Resource file = new ClassPathResource("ebooks/" + filename + ".pdf");

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename + ".pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(file);

        } catch (Exception e) {

            return ResponseEntity.notFound().build();
        }
    }
}