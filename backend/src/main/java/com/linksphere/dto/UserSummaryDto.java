package com.linksphere.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserSummaryDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String headline;
    private String location;
    private String profileImage;
    private String connectionStatus; // PENDING, ACCEPTED, REJECTED, NONE, SELF
    private Long connectionId;
}
