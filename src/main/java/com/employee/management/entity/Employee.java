package com.employee.management.entity;

import java.time.LocalDate;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "employee")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long employeeId;

    @NotBlank(message = "Employee name is required")
    private String name;

    @Column(name = "aadhaar_number", nullable = false, unique = true, length = 12)
    private String aadhaarNumber;

    @NotBlank(message = "Phone number is required")
    private String phone;

    @NotBlank(message = "Job role is required")
    private String jobRole;

    @NotNull(message = "Daily wage is required")
    @Positive(message = "Daily wage must be greater than zero")
    private Double dailyWage;

    @NotNull(message = "Joining date is required")
    private LocalDate joiningDate;

    @NotBlank(message = "Status is required")
    private String status;

    @Column(length = 1000)
    private String address;

    public Employee() {
    }

    public Employee(String name, String aadhaarNumber, String phone, String jobRole,
            Double dailyWage, LocalDate joiningDate, String status) {
        this.name = name;
        this.aadhaarNumber = aadhaarNumber;
        this.phone = phone;
        this.jobRole = jobRole;
        this.dailyWage = dailyWage;
        this.joiningDate = joiningDate;
        this.status = status;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAadhaarNumber() {
        return aadhaarNumber;
    }

    public void setAadhaarNumber(String aadhaarNumber) {
        this.aadhaarNumber = aadhaarNumber;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getJobRole() {
        return jobRole;
    }

    public void setJobRole(String jobRole) {
        this.jobRole = jobRole;
    }

    public Double getDailyWage() {
        return dailyWage;
    }

    public void setDailyWage(Double dailyWage) {
        this.dailyWage = dailyWage;
    }

    public LocalDate getJoiningDate() {
        return joiningDate;
    }

    public void setJoiningDate(LocalDate joiningDate) {
        this.joiningDate = joiningDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}
