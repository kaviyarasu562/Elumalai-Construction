package com.employee.management.service;

import com.employee.management.entity.Attendance;
import com.employee.management.entity.Employee;
import com.employee.management.entity.WeeklyPayment;
import com.employee.management.repository.AttendanceRepository;
import com.employee.management.repository.EmployeeRepository;
import com.employee.management.repository.WeeklyPaymentRepository;
import com.employee.management.dto.LeaveSummaryResponse;
import com.employee.management.entity.Advance;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class WeeklyPaymentServiceImpl implements WeeklyPaymentService {

    private final WeeklyPaymentRepository paymentRepository;
    private final EmployeeRepository employeeRepository;
    private final AttendanceRepository attendanceRepository;
    private final LeaveService leaveService;
    private final AdvanceService advanceService;

    private static final double OVERTIME_RATE_PER_HOUR = 100.0;

    public WeeklyPaymentServiceImpl(
            WeeklyPaymentRepository paymentRepository,
            EmployeeRepository employeeRepository,
            AttendanceRepository attendanceRepository,
            LeaveService leaveService,
            AdvanceService advanceService) {

        this.paymentRepository = paymentRepository;
        this.employeeRepository = employeeRepository;
        this.attendanceRepository = attendanceRepository;
        this.leaveService = leaveService;
        this.advanceService = advanceService;
    }

    @Override
    @Transactional
    public WeeklyPayment calculateWeeklyPayment(
            Long employeeId,
            LocalDate startDate,
            LocalDate endDate, Double bonusAmount, Double deductionAmount) {

        if (startDate == null) {
            throw new RuntimeException("Start date is required");
        }

        if (endDate == null) {
            throw new RuntimeException("End date is required");
        }

        if (startDate.isAfter(endDate)) {
            throw new RuntimeException(
                    "Start date cannot be after end date");
        }

        if (bonusAmount == null || bonusAmount < 0 || deductionAmount == null || deductionAmount < 0) {
            throw new IllegalArgumentException("Bonus and deduction cannot be negative");
        }

        Optional<WeeklyPayment> existingPayment = paymentRepository
                .findByEmployeeEmployeeIdAndWeekStartDateAndWeekEndDate(
                        employeeId,
                        startDate,
                        endDate);

        if (existingPayment.isPresent()) {
            throw new RuntimeException(
                    "Payment already calculated for this employee and week");
        }

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException(
                        "Employee not found with ID: " + employeeId));

        List<Attendance> attendanceList = attendanceRepository
                .findByEmployeeEmployeeIdAndAttendanceDateBetween(
                        employeeId,
                        startDate,
                        endDate);

        // Attendance counts must be INTEGER
        int presentDays = 0;
        int halfDays = 0;
        int absentDays = 0;

        // Overtime can contain decimal values
        double overtimeHours = 0.0;

        for (Attendance attendance : attendanceList) {

            String status = attendance.getStatus();

            if ("PRESENT".equalsIgnoreCase(status)) {

                presentDays++;

            } else if ("HALF_DAY".equalsIgnoreCase(status)) {

                halfDays++;

            } else if ("ABSENT".equalsIgnoreCase(status)) {

                absentDays++;
            }

            if (attendance.getOvertimeHours() != null) {
                overtimeHours += attendance.getOvertimeHours();
            }
        }

        double dailyWage = employee.getDailyWage();

        double presentSalary = presentDays * dailyWage;

        double halfDaySalary = halfDays * (dailyWage / 2);

        double basicSalary = presentSalary + halfDaySalary;

        double overtimeAmount = overtimeHours * OVERTIME_RATE_PER_HOUR;

        double totalSalary = basicSalary + overtimeAmount;

        LeaveSummaryResponse leaveSummary = leaveService.summary(employeeId, startDate, endDate);
        List<Advance> activeAdvances = advanceService.getActiveForPeriod(employeeId, startDate, endDate);
        double advanceAmount = activeAdvances.stream().mapToDouble(Advance::getAmount).sum();
        double grossAmount = totalSalary + (leaveSummary.paidLeaveDays() + leaveSummary.holidayDays()) * dailyWage;
        double netAmount = Math.max(0, grossAmount + bonusAmount - advanceAmount - deductionAmount);

        WeeklyPayment payment = new WeeklyPayment();

        payment.setEmployee(employee);
        payment.setWeekStartDate(startDate);
        payment.setWeekEndDate(endDate);

        // These three fields are Integer in WeeklyPayment.java
        payment.setPresentDays(presentDays);
        payment.setHalfDays(halfDays);
        payment.setAbsentDays(absentDays);

        payment.setDailyWage(dailyWage);
        payment.setBasicSalary(basicSalary);
        payment.setOvertimeAmount(overtimeAmount);
        payment.setTotalSalary(totalSalary);
        payment.setPaidLeaveDays((int) leaveSummary.paidLeaveDays());
        payment.setUnpaidLeaveDays((int) leaveSummary.unpaidLeaveDays());
        payment.setHolidayDays((int) leaveSummary.holidayDays());
        payment.setGrossAmount(grossAmount);
        payment.setBonusAmount(bonusAmount);
        payment.setAdvanceAmount(advanceAmount);
        payment.setDeductionAmount(deductionAmount);
        payment.setNetAmount(netAmount);
        payment.setStatus("PENDING");

        return paymentRepository.save(payment);
    }

    @Override
    public List<WeeklyPayment> getAllPayments() {
        return paymentRepository.findAll();
    }

    @Override
    public List<WeeklyPayment> getPaymentsByEmployee(
            Long employeeId) {

        return paymentRepository
                .findByEmployeeEmployeeId(employeeId);
    }

    @Override
    public List<WeeklyPayment> getPaymentsByStatus(
            String paymentStatus) {

        return paymentRepository
                .findByPaymentStatus(paymentStatus);
    }

    @Override
    public WeeklyPayment getPaymentById(Long paymentId) {

        return paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException(
                        "Payment not found with ID: " + paymentId));
    }

    @Override
    public WeeklyPayment approvePayment(Long paymentId, String approvedBy) {
        WeeklyPayment payment = getPaymentById(paymentId);
        if (!"PENDING".equalsIgnoreCase(payment.getStatus())) throw new IllegalStateException("Only pending payments can be approved");
        if (approvedBy == null || approvedBy.isBlank()) throw new IllegalArgumentException("Approved by is required");
        payment.setStatus("APPROVED"); payment.setApprovedBy(approvedBy.trim()); payment.setApprovedDate(LocalDate.now()); return paymentRepository.save(payment);
    }

    @Override
    @Transactional
    public WeeklyPayment markPaymentAsPaid(Long paymentId, String paymentMethod, String notes) {
        WeeklyPayment payment = getPaymentById(paymentId);
        if (!"APPROVED".equalsIgnoreCase(payment.getStatus())) throw new IllegalStateException("Only approved payments can be marked as paid");
        payment.setStatus("PAID"); payment.setPaymentMethod(paymentMethod); payment.setNotes(notes); payment.setPaidDate(LocalDate.now());
        advanceService.markDeducted(advanceService.getActiveForPeriod(payment.getEmployee().getEmployeeId(), payment.getStartDate(), payment.getEndDate()));
        return paymentRepository.save(payment);
    }

    @Override
    public WeeklyPayment cancelPayment(Long paymentId, String cancelledBy, String reason) {
        WeeklyPayment payment = getPaymentById(paymentId);
        if ("PAID".equalsIgnoreCase(payment.getStatus())) throw new IllegalStateException("A paid payment cannot be cancelled");
        if (cancelledBy == null || cancelledBy.isBlank() || reason == null || reason.isBlank()) throw new IllegalArgumentException("Cancelled by and reason are required");
        payment.setStatus("CANCELLED"); payment.setCancelledBy(cancelledBy.trim()); payment.setCancellationReason(reason.trim()); return paymentRepository.save(payment);
    }

}
