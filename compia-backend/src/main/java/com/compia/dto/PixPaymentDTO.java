package com.compia.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PixPaymentDTO {

    private String id;
    private String qrCode;
    private String copyPasteCode;
    private String expiresAt;
}