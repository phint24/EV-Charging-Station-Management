package project.code.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "payment_methods")
public class PaymentMethod {
    @Id
    @Column(name = "method_id", nullable = false, length = 50)
    private String methodId;

    @Column(name = "user_id", nullable = false, length = 50)
    private String userId;

    @Column(name = "type", nullable = false, length = 50)
    private String type;

    @Column(name = "provider", nullable = false, length = 100)
    private String provider;

    @Column(name = "is_default", nullable = false)
    private boolean isDefault;

    public PaymentMethod() {
    }

    public PaymentMethod(String methodId, String userId, String type, String provider, boolean isDefault) {
        this.methodId = methodId;
        this.userId = userId;
        this.type = type;
        this.provider = provider;
        this.isDefault = isDefault;
    }

    public void addMethod() {
        // Logic to add payment method (to be implemented in service layer)
    }

    public void removeMethod() {
        // Logic to remove payment method (to be implemented in service layer)
    }

    public void setDefault() {
        this.isDefault = true;
    }

    public String getMethodId() {
        return methodId;
    }

    public void setMethodId(String methodId) {
        this.methodId = methodId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public boolean isDefault() {
        return isDefault;
    }

    public void setDefault(boolean isDefault) {
        this.isDefault = isDefault;
    }

    @Override
    public String toString() {
        return "PaymentMethod(methodId=" + methodId + ", userId=" + userId + ", type=" + type + 
               ", provider=" + provider + ", isDefault=" + isDefault + ")";
    }
}