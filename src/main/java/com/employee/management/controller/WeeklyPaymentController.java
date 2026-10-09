package com.employee.management.controller;

import com.employee.management.entity.WeeklyPayment;
import com.employee.management.service.WeeklyPaymentService;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin
public class WeeklyPaymentController {

    private final WeeklyPaymentService paymentService;

    public WeeklyPaymentController(
            WeeklyPaymentService paymentService) {

        this.paymentService = paymentService;
    }

    @PostMapping("/calculate")
    public WeeklyPayment calculatePayment(
            @RequestParam Long employeeId,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate,
            @RequestParam(defaultValue = "0") Double bonusAmount,
            @RequestParam(defaultValue = "0") Double deductionAmount) {

        return paymentService.calculateWeeklyPayment(
                employeeId,
                startDate,
                endDate, bonusAmount, deductionAmount);
    }

    @GetMapping
    public List<WeeklyPayment> getAllPayments() {
        return paymentService.getAllPayments();
    }

    @GetMapping("/{id}")
    public WeeklyPayment getPaymentById(
            @PathVariable Long id) {

        return paymentService.getPaymentById(id);
    }

    @GetMapping("/status/{status}")
    public List<WeeklyPayment> getPaymentsByStatus(
            @PathVariable String status) {

        return paymentService.getPaymentsByStatus(status);
    }

    @GetMapping("/employee/{employeeId}")
    public List<WeeklyPayment> getPaymentsByEmployee(
            @PathVariable Long employeeId) {

        return paymentService.getPaymentsByEmployee(employeeId);
    }

    @PutMapping("/{id}/approve")
    public WeeklyPayment approve(@PathVariable Long id, @RequestParam String approvedBy) { return paymentService.approvePayment(id, approvedBy); }

    @PutMapping("/{id}/paid")
    public WeeklyPayment markPaymentAsPaid(@PathVariable Long id, @RequestParam String paymentMethod, @RequestParam(required = false) String notes) { return paymentService.markPaymentAsPaid(id, paymentMethod, notes); }

    @PutMapping("/{id}/cancel")
    public WeeklyPayment cancel(@PathVariable Long id, @RequestParam String cancelledBy, @RequestParam String reason) { return paymentService.cancelPayment(id, cancelledBy, reason); }
}
