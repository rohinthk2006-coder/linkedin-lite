package com.linksphere.service;

import com.linksphere.dto.CertificationDto;
import com.linksphere.dto.CertificationRequest;
import com.linksphere.entity.User;

import java.util.List;

public interface CertificationService {
    List<CertificationDto> getCertificationsByUserId(Long userId);
    CertificationDto addCertification(Long userId, CertificationRequest request, User currentUser);
    CertificationDto updateCertification(Long id, CertificationRequest request, User currentUser);
    void deleteCertification(Long id, User currentUser);
}
