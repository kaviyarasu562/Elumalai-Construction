package com.employee.management.entity;

import java.time.LocalDate;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Entity
@Table(name = "salary_advance")
public class Advance {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long advanceId;
    @ManyToOne @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;
    @NotNull private LocalDate advanceDate;
    @NotNull @Positive private Double amount;
    private String paymentMethod = "CASH";
    private String status = "ACTIVE";
    @Column(length = 1000) private String notes;
    public Long getAdvanceId() { return advanceId; }
    public void setAdvanceId(Long advanceId) { this.advanceId = advanceId; }
    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }
    public LocalDate getAdvanceDate() { return advanceDate; }
    public void setAdvanceDate(LocalDate advanceDate) { this.advanceDate = advanceDate; }
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
