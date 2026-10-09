package com.employee.management.entity;

import java.time.LocalDate;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "employee_leave")
public class Leave {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long leaveId;
    @ManyToOne @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;
    @NotNull private LocalDate startDate;
    @NotNull private LocalDate endDate;
    @NotBlank private String leaveType;
    @NotBlank private String status = "APPROVED";
    @Column(length = 1000) private String reason;
    public Long getLeaveId() { return leaveId; }
    public void setLeaveId(Long leaveId) { this.leaveId = leaveId; }
    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public String getLeaveType() { return leaveType; }
    public void setLeaveType(String leaveType) { this.leaveType = leaveType; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
