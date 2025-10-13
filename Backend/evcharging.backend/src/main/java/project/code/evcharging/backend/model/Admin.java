package project.code.evcharging.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "admins")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, length = 50)
    private String role;

    public boolean login(String email, String password) {
        return this.email.equals(email) && this.password.equals(password);
    }

    public void monitorAllStations() {
        System.out.println("Monitoring all charging stations...");
    }

    public void manageUsers() {
        System.out.println("Managing all users...");
    }
}

