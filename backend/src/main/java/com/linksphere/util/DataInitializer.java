package com.linksphere.util;

import com.linksphere.entity.*;
import com.linksphere.enums.ConnectionStatus;
import com.linksphere.enums.NotificationType;
import com.linksphere.enums.Role;
import com.linksphere.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final UserSkillRepository userSkillRepository;
    private final EducationRepository educationRepository;
    private final ExperienceRepository experienceRepository;
    private final ProjectRepository projectRepository;
    private final CertificationRepository certificationRepository;
    private final ConnectionRepository connectionRepository;
    private final PostRepository postRepository;
    private final LikeRepository likeRepository;
    private final CommentRepository commentRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already seeded. Skipping DataInitializer.");
            return;
        }

        log.info("Seeding initial development data for LinkSphere...");

        // 1. Create Skills
        List<Skill> skills = skillRepository.saveAll(Arrays.asList(
                Skill.builder().name("Java").build(),
                Skill.builder().name("Spring Boot").build(),
                Skill.builder().name("React").build(),
                Skill.builder().name("TypeScript").build(),
                Skill.builder().name("MySQL").build(),
                Skill.builder().name("Tailwind CSS").build(),
                Skill.builder().name("Docker").build(),
                Skill.builder().name("AWS").build()
        ));

        // 2. Create Users
        String encodedPassword = passwordEncoder.encode("password123");

        User admin = User.builder()
                .firstName("Admin")
                .lastName("System")
                .email("admin@linksphere.com")
                .password(encodedPassword)
                .headline("System Administrator & Lead Architect")
                .about("Platform administrator managing LinkSphere system health and operations.")
                .location("San Francisco, CA")
                .profileImage("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80")
                .role(Role.ROLE_ADMIN)
                .build();

        User alex = User.builder()
                .firstName("Alex")
                .lastName("Morgan")
                .email("alex.morgan@example.com")
                .password(encodedPassword)
                .headline("Senior Full-Stack Engineer @ TechCorp | Open Source Contributor")
                .about("Passionate software craftsman with 6+ years of experience building distributed backend APIs and responsive modern React frontends.")
                .location("New York, NY")
                .profileImage("https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80")
                .role(Role.ROLE_USER)
                .build();

        User sarah = User.builder()
                .firstName("Sarah")
                .lastName("Chen")
                .email("sarah.chen@example.com")
                .password(encodedPassword)
                .headline("Lead AI Research Engineer | Machine Learning Specialist")
                .about("Pioneering deep learning solutions, LLM architectures, and scalable data pipelines for enterprise healthcare solutions.")
                .location("Boston, MA")
                .profileImage("https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80")
                .role(Role.ROLE_USER)
                .build();

        User david = User.builder()
                .firstName("David")
                .lastName("Kowalski")
                .email("david.k@example.com")
                .password(encodedPassword)
                .headline("DevOps Specialist | Kubernetes & Cloud Architecture")
                .about("Automating infrastructure, zero-downtime CI/CD deployments, and high-availability cloud cluster orchestration.")
                .location("Seattle, WA")
                .profileImage("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80")
                .role(Role.ROLE_USER)
                .build();

        User elena = User.builder()
                .firstName("Elena")
                .lastName("Rostova")
                .email("elena.r@example.com")
                .password(encodedPassword)
                .headline("UI/UX Principal Designer & Product Strategist")
                .about("Creating intuitive human-centered design systems and delightful digital product experiences.")
                .location("Austin, TX")
                .profileImage("https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80")
                .role(Role.ROLE_USER)
                .build();

        List<User> savedUsers = userRepository.saveAll(Arrays.asList(admin, alex, sarah, david, elena));
        User uAlex = savedUsers.get(1);
        User uSarah = savedUsers.get(2);
        User uDavid = savedUsers.get(3);
        User uElena = savedUsers.get(4);

        // 3. User Skills
        for (Skill s : skills) {
            userSkillRepository.save(UserSkill.builder().user(uAlex).skill(s).build());
        }
        userSkillRepository.save(UserSkill.builder().user(uSarah).skill(skills.get(0)).build()); // Java
        userSkillRepository.save(UserSkill.builder().user(uSarah).skill(skills.get(7)).build()); // AWS

        // 4. Education & Experience for Alex
        educationRepository.save(Education.builder()
                .institution("Stanford University")
                .degree("Master of Science")
                .fieldOfStudy("Computer Science")
                .startDate(LocalDate.of(2018, 9, 1))
                .endDate(LocalDate.of(2020, 6, 1))
                .description("Graduated with Distinction. Specialized in Distributed Systems.")
                .user(uAlex)
                .build());

        experienceRepository.save(Experience.builder()
                .company("TechCorp Inc.")
                .position("Senior Full-Stack Engineer")
                .location("New York, NY")
                .startDate(LocalDate.of(2021, 1, 15))
                .endDate(null)
                .description("Leading a team of 6 engineers architecting microservice APIs and modern web clients.")
                .user(uAlex)
                .build());

        projectRepository.save(Project.builder()
                .title("LinkSphere Networking Engine")
                .description("High-performance full-stack networking platform built with Spring Boot 3 & React.")
                .technologies("Java 21, Spring Boot, React, Vite, Tailwind CSS, MySQL")
                .projectUrl("https://github.com/example/linksphere")
                .user(uAlex)
                .build());

        certificationRepository.save(Certification.builder()
                .name("AWS Certified Solutions Architect – Professional")
                .issuingOrganization("Amazon Web Services")
                .issueDate(LocalDate.of(2022, 5, 10))
                .credentialId("AWS-PAS-99201")
                .credentialUrl("https://aws.amazon.com/verification")
                .user(uAlex)
                .build());

        // 5. Connections
        connectionRepository.save(Connection.builder()
                .sender(uAlex)
                .receiver(uSarah)
                .status(ConnectionStatus.ACCEPTED)
                .build());

        connectionRepository.save(Connection.builder()
                .sender(uDavid)
                .receiver(uAlex)
                .status(ConnectionStatus.PENDING)
                .build());

        // 6. Seed Posts
        Post p1 = postRepository.save(Post.builder()
                .content("🚀 Excited to announce the launch of LinkSphere! Built with Spring Boot 3.2, Java 21, and React 18. Clean architecture, JWT authentication, and real-time networking controls.")
                .imageUrl("https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80")
                .author(uAlex)
                .build());

        Post p2 = postRepository.save(Post.builder()
                .content("Machine Learning tip of the day: When training deep neural networks, always monitor your validation loss curves closely to catch overfitting early!")
                .author(uSarah)
                .build());

        // 7. Likes & Comments
        likeRepository.save(Like.builder().post(p1).user(uSarah).build());
        commentRepository.save(Comment.builder()
                .content("Congratulations Alex! The UI looks extraordinarily sleek and clean!")
                .post(p1)
                .user(uSarah)
                .build());

        // 8. Notifications
        notificationRepository.save(Notification.builder()
                .recipient(uAlex)
                .sender(uDavid)
                .type(NotificationType.CONNECTION_REQUEST)
                .message("David Kowalski sent you a connection request")
                .isRead(false)
                .build());

        log.info("LinkSphere seed data initialization completed successfully!");
    }
}
