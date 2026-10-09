package com.employee.management.service;

import com.employee.management.entity.WeeklyPayment;

import java.time.LocalDate;
import java.util.List;

public interface WeeklyPaymentService {

    List<WeeklyPayment> getAllPayments();

    List<WeeklyPayment> getPaymentsByEmployee(Long employeeId);

    List<WeeklyPayment> getPaymentsByStatus(String paymentStatus);

    WeeklyPayment getPaymentById(Long paymentId);

    WeeklyPayment approvePayment(Long paymentId, String approvedBy);

    WeeklyPayment markPaymentAsPaid(Long paymentId, String paymentMethod, String notes);

    WeeklyPayment cancelPayment(Long paymentId, String cancelledBy, String reason);

    WeeklyPayment calculateWeeklyPayment(Long employeeId, LocalDate startDate, LocalDate endDate, Double bonusAmount, Double deductionAmount);
}
