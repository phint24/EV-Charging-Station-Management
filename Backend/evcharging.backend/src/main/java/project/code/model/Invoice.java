package project.code.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "invoices")
public class Invoice {
    @Id
    @Column(name = "invoice_id", nullable = false, length = 50)
    private String invoiceId;

    @Column(name = "session_id", nullable = false, length = 50)
    private String sessionId;

    @Column(name = "driver_id", nullable = false, length = 50)
    private String driverId;

    @Column(name = "issue_date", nullable = false)
    private LocalDateTime issueDate;

    @Column(name = "total_energy", nullable = false)
    private double totalEnergy;

    @Column(name = "amount", nullable = false)
    private double amount;

    @Column(name = "payment_method", length = 50)
    private String paymentMethod;

    @Column(name = "status", nullable = false, length = 50)
    private String status;

    public Invoice() {
    }

    public Invoice(String invoiceId, String sessionId, String driverId, LocalDateTime issueDate, 
                   double totalEnergy, double amount, String paymentMethod, String status) {
        this.invoiceId = invoiceId;
        this.sessionId = sessionId;
        this.driverId = driverId;
        this.issueDate = issueDate;
        this.totalEnergy = totalEnergy;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.status = status;
    }

    public void generateInvoice(String session, ChargeSession chargeSession) {
        // Logic to generate invoice (to be implemented in service layer)
    }

    public String getInvoiceInfo() {
        return "Invoice ID: " + invoiceId + ", Amount: " + amount + ", Status: " + status;
    }

    public String getInvoiceId() {
        return invoiceId;
    }

    public void setInvoiceId(String invoiceId) {
        this.invoiceId = invoiceId;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getDriverId() {
        return driverId;
    }

    public void setDriverId(String driverId) {
        this.driverId = driverId;
    }

    public LocalDateTime getIssueDate() {
        return issueDate;
    }

    public void setIssueDate(LocalDateTime issueDate) {
        this.issueDate = issueDate;
    }

    public double getTotalEnergy() {
        return totalEnergy;
    }

    public void setTotalEnergy(double totalEnergy) {
        this.totalEnergy = totalEnergy;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "Invoice(invoiceId=" + invoiceId + ", sessionId=" + sessionId + ", driverId=" + driverId + 
               ", issueDate=" + issueDate + ", totalEnergy=" + totalEnergy + ", amount=" + amount + 
               ", paymentMethod=" + paymentMethod + ", status=" + status + ")";
    }
}