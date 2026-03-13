package com.compia.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerDTO {

    private long id;
    private String name;
    private String email;
    private String phone;
}