package com.employee.management.service;

import com.employee.management.dto.DashboardResponse;
import com.employee.management.entity.WeeklyPayment;
import com.employee.management.repository.AttendanceRepository;
import com.employee.management.repository.EmployeeRepository;
import com.employee.management.repository.WeeklyPaymentRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class DashboardServiceImpl
                implements DashboardService {

        private final EmployeeRepository employeeRepository;
        private final AttendanceRepository attendanceRepository;
        private final WeeklyPaymentRepository paymentRepository;

        public DashboardServiceImpl(
                        EmployeeRepository employeeRepository,
                        AttendanceRepository attendanceRepository,
                        WeeklyPaymentRepository paymentRepository) {

                this.employeeRepository = employeeRepository;
                this.attendanceRepository = attendanceRepository;
                this.paymentRepository = paymentRepository;
        }

        @Override
        public DashboardResponse getDashboardData(LocalDate date) {

                long totalEmployees = employeeRepository.count();

                long activeEmployees = employeeRepository.countByStatus("ACTIVE");

                long presentToday = attendanceRepository
                                .countByAttendanceDateAndStatus(
                                                date,
                                                "PRESENT");

                long absentToday = attendanceRepository
                                .countByAttendanceDateAndStatus(
                                                date,
                                                "ABSENT");

                long halfDayToday = attendanceRepository
                                .countByAttendanceDateAndStatus(
                                                date,
                                                "HALF_DAY");

                long pendingPayments = paymentRepository
                                .countByPaymentStatus("PENDING");

                List<WeeklyPayment> paidPayments = paymentRepository
                                .findByPaymentStatus("PAID");

                List<WeeklyPayment> pendingPaymentList = paymentRepository
                                .findByPaymentStatus("PENDING");

                double totalPaidAmount = paidPayments.stream()
                                .mapToDouble(payment -> payment != null ? payment.getNetAmount() : 0)
                                .sum();

                double totalPendingAmount = pendingPaymentList.stream()
                                .mapToDouble(payment -> payment != null ? payment.getNetAmount() : 0)
                                .sum();

                return new DashboardResponse(
                                totalEmployees,
                                activeEmployees,
                                presentToday,
                                absentToday,
                                halfDayToday,
                                pendingPayments,
                                totalPaidAmount,
                                totalPendingAmount);
        }
}
