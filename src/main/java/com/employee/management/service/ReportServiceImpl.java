package com.employee.management.service;
import com.employee.management.dto.*;
import com.employee.management.entity.Attendance;
import com.employee.management.entity.Employee;
import com.employee.management.entity.WeeklyPayment;
import com.employee.management.repository.AttendanceRepository;
import com.employee.management.repository.EmployeeRepository;
import com.employee.management.repository.WeeklyPaymentRepository;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;
@Service
public class ReportServiceImpl implements ReportService {
    private final EmployeeRepository employees; private final AttendanceRepository attendance; private final WeeklyPaymentRepository payments; private final LeaveService leaves;
    public ReportServiceImpl(EmployeeRepository employees, AttendanceRepository attendance, WeeklyPaymentRepository payments, LeaveService leaves) { this.employees = employees; this.attendance = attendance; this.payments = payments; this.leaves = leaves; }
    public ReportResponse generate(Long employeeId, LocalDate startDate, LocalDate endDate) {
        if (startDate.isAfter(endDate)) throw new IllegalArgumentException("Start date cannot be after end date");
        List<Employee> selected = employeeId == null ? employees.findAll() : List.of(employees.findById(employeeId).orElseThrow(() -> new IllegalArgumentException("Employee not found with ID: " + employeeId)));
        List<ReportRow> rows = new ArrayList<>(); double totalGross = 0, totalPaid = 0, totalPending = 0;
        for (Employee employee : selected) {
            long present = 0, halfDay = 0, absent = 0;
            for (Attendance record : attendance.findByEmployeeEmployeeIdAndAttendanceDateBetween(employee.getEmployeeId(), startDate, endDate)) {
                if ("PRESENT".equalsIgnoreCase(record.getStatus())) present++; else if ("HALF_DAY".equalsIgnoreCase(record.getStatus())) halfDay++; else if ("ABSENT".equalsIgnoreCase(record.getStatus())) absent++;
            }
            LeaveSummaryResponse leave = leaves.summary(employee.getEmployeeId(), startDate, endDate);
            double gross = 0, paid = 0, pending = 0;
            for (WeeklyPayment payment : payments.findByEmployeeEmployeeIdAndWeekStartDateLessThanEqualAndWeekEndDateGreaterThanEqual(employee.getEmployeeId(), endDate, startDate)) {
                if ("CANCELLED".equalsIgnoreCase(payment.getStatus())) continue;
                gross += payment.getGrossAmount();
                if ("PAID".equalsIgnoreCase(payment.getStatus())) paid += payment.getNetAmount(); else pending += payment.getNetAmount();
            }
            rows.add(new ReportRow(employee.getName(), present, halfDay, absent, leave.paidLeaveDays(), leave.unpaidLeaveDays(), leave.holidayDays(), gross, paid, pending));
            totalGross += gross; totalPaid += paid; totalPending += pending;
        }
        return new ReportResponse(rows, rows.size(), totalGross, totalPaid, totalPending);
    }
}
