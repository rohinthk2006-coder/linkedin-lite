package com.linksphere.service.impl;

import com.linksphere.dto.CertificationDto;
import com.linksphere.dto.CertificationRequest;
import com.linksphere.entity.Certification;
import com.linksphere.entity.User;
import com.linksphere.exception.ResourceNotFoundException;
import com.linksphere.exception.UnauthorizedException;
import com.linksphere.mapper.EntityDtoMapper;
import com.linksphere.repository.CertificationRepository;
import com.linksphere.repository.UserRepository;
import com.linksphere.service.CertificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CertificationServiceImpl implements CertificationService {

    private final CertificationRepository certificationRepository;
    private final UserRepository userRepository;
    private final EntityDtoMapper mapper;

    @Override
    @Transactional(readOnly = true)
    public List<CertificationDto> getCertificationsByUserId(Long userId) {
        return certificationRepository.findByUserIdOrderByIssueDateDesc(userId).stream()
                .map(mapper::toCertificationDto).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CertificationDto addCertification(Long userId, CertificationRequest request, User currentUser) {
        if (!currentUser.getId().equals(userId)) {
            throw new UnauthorizedException("You cannot add certifications to another user's profile");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Certification certification = Certification.builder()
                .name(request.getName())
                .issuingOrganization(request.getIssuingOrganization())
                .issueDate(request.getIssueDate())
                .credentialId(request.getCredentialId())
                .credentialUrl(request.getCredentialUrl())
                .user(user)
                .build();

        return mapper.toCertificationDto(certificationRepository.save(certification));
    }

    @Override
    @Transactional
    public CertificationDto updateCertification(Long id, CertificationRequest request, User currentUser) {
        Certification certification = certificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Certification not found"));

        if (!certification.getUser().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You cannot modify another user's certification");
        }

        certification.setName(request.getName());
        certification.setIssuingOrganization(request.getIssuingOrganization());
        certification.setIssueDate(request.getIssueDate());
        certification.setCredentialId(request.getCredentialId());
        certification.setCredentialUrl(request.getCredentialUrl());

        return mapper.toCertificationDto(certificationRepository.save(certification));
    }

    @Override
    @Transactional
    public void deleteCertification(Long id, User currentUser) {
        Certification certification = certificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Certification not found"));

        if (!certification.getUser().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You cannot delete another user's certification");
        }

        certificationRepository.delete(certification);
    }
}
