package com.employee.management.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "weekly_payment")
public class WeeklyPayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentId;

    @ManyToOne
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    private LocalDate weekStartDate;
    private LocalDate weekEndDate;

    private Integer presentDays;
    private Integer halfDays;
    private Integer absentDays;

    private Double dailyWage;
    private Double basicSalary;
    private Double overtimeAmount;
    private Double totalSalary;

    private String paymentStatus;

    private Integer paidLeaveDays = 0;
    private Integer unpaidLeaveDays = 0;
    private Integer holidayDays = 0;
    private Double grossAmount = 0.0;
    private Double bonusAmount = 0.0;
    private Double advanceAmount = 0.0;
    private Double deductionAmount = 0.0;
    private Double netAmount = 0.0;
    private LocalDate approvedDate;
    private String approvedBy;
    private LocalDate paidDate;
    private String paymentMethod;
    @Column(length = 1000)
    private String notes;
    private String cancelledBy;
    @Column(length = 1000)
    private String cancellationReason;

    public WeeklyPayment() {
    }

    public Long getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(Long paymentId) {
        this.paymentId = paymentId;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public LocalDate getWeekStartDate() {
        return weekStartDate;
    }

    public void setWeekStartDate(LocalDate weekStartDate) {
        this.weekStartDate = weekStartDate;
    }

    public LocalDate getWeekEndDate() {
        return weekEndDate;
    }

    public void setWeekEndDate(LocalDate weekEndDate) {
        this.weekEndDate = weekEndDate;
    }

    public Integer getPresentDays() {
        return presentDays;
    }

    public void setPresentDays(Integer presentDays) {
        this.presentDays = presentDays;
    }

    public Integer getHalfDays() {
        return halfDays;
    }

    public void setHalfDays(Integer halfDays2) {
        this.halfDays = halfDays2;
    }

    public Integer getAbsentDays() {
        return absentDays;
    }

    public void setAbsentDays(Integer absentDays) {
        this.absentDays = absentDays;
    }

    public Double getDailyWage() {
        return dailyWage;
    }

    public void setDailyWage(Double dailyWage) {
        this.dailyWage = dailyWage;
    }

    public Double getBasicSalary() {
        return basicSalary;
    }

    public void setBasicSalary(Double basicSalary) {
        this.basicSalary = basicSalary;
    }

    public Double getOvertimeAmount() {
        return overtimeAmount;
    }

    public void setOvertimeAmount(Double overtimeAmount) {
        this.overtimeAmount = overtimeAmount;
    }

    public Double getTotalSalary() {
        return totalSalary;
    }

    public void setTotalSalary(Double totalSalary) {
        this.totalSalary = totalSalary;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    // Front-end contract aliases for the legacy weekly-payment columns.
    public LocalDate getStartDate() { return weekStartDate; }
    public void setStartDate(LocalDate startDate) { this.weekStartDate = startDate; }
    public LocalDate getEndDate() { return weekEndDate; }
    public void setEndDate(LocalDate endDate) { this.weekEndDate = endDate; }
    public String getStatus() { return paymentStatus; }
    public void setStatus(String status) { this.paymentStatus = status; }
    public Integer getPaidLeaveDays() { return paidLeaveDays; }
    public void setPaidLeaveDays(Integer paidLeaveDays) { this.paidLeaveDays = paidLeaveDays; }
    public Integer getUnpaidLeaveDays() { return unpaidLeaveDays; }
    public void setUnpaidLeaveDays(Integer unpaidLeaveDays) { this.unpaidLeaveDays = unpaidLeaveDays; }
    public Integer getHolidayDays() { return holidayDays; }
    public void setHolidayDays(Integer holidayDays) { this.holidayDays = holidayDays; }
    public Double getGrossAmount() { return grossAmount == null ? 0.0 : grossAmount; }
    public void setGrossAmount(Double grossAmount) { this.grossAmount = grossAmount; this.totalSalary = grossAmount; }
    public Double getBonusAmount() { return bonusAmount == null ? 0.0 : bonusAmount; }
    public void setBonusAmount(Double bonusAmount) { this.bonusAmount = bonusAmount; }
    public Double getAdvanceAmount() { return advanceAmount == null ? 0.0 : advanceAmount; }
    public void setAdvanceAmount(Double advanceAmount) { this.advanceAmount = advanceAmount; }
    public Double getDeductionAmount() { return deductionAmount == null ? 0.0 : deductionAmount; }
    public void setDeductionAmount(Double deductionAmount) { this.deductionAmount = deductionAmount; }
    public Double getNetAmount() { return netAmount == null ? 0.0 : netAmount; }
    public void setNetAmount(Double netAmount) { this.netAmount = netAmount; }
    public LocalDate getApprovedDate() { return approvedDate; }
    public void setApprovedDate(LocalDate approvedDate) { this.approvedDate = approvedDate; }
    public String getApprovedBy() { return approvedBy; }
    public void setApprovedBy(String approvedBy) { this.approvedBy = approvedBy; }
    public LocalDate getPaidDate() { return paidDate; }
    public void setPaidDate(LocalDate paidDate) { this.paidDate = paidDate; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public String getCancelledBy() { return cancelledBy; }
    public void setCancelledBy(String cancelledBy) { this.cancelledBy = cancelledBy; }
    public String getCancellationReason() { return cancellationReason; }
    public void setCancellationReason(String cancellationReason) { this.cancellationReason = cancellationReason; }

}
