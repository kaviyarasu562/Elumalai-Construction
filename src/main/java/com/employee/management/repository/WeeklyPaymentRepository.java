package com.employee.management.repository;

import com.employee.management.entity.WeeklyPayment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface WeeklyPaymentRepository
                extends JpaRepository<WeeklyPayment, Long> {

        List<WeeklyPayment> findByEmployeeEmployeeId(Long employeeId);

        long countByPaymentStatus(String paymentStatus);

        List<WeeklyPayment> findByPaymentStatus(String paymentStatus);

        Optional<WeeklyPayment> findByEmployeeEmployeeIdAndWeekStartDateAndWeekEndDate(
                        Long employeeId,
                        LocalDate weekStartDate,
                        LocalDate weekEndDate);

        List<WeeklyPayment> findByEmployeeEmployeeIdAndWeekStartDateLessThanEqualAndWeekEndDateGreaterThanEqual(
                        Long employeeId, LocalDate endDate, LocalDate startDate);

}
