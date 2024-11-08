package com.webNoter.DTO;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class JwtResponseDTO {
    private String token;
    private String email;
    private String name;
}
