package com.employee.management.repository;

import com.employee.management.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceRepository
                extends JpaRepository<Attendance, Long> {

        List<Attendance> findByEmployeeEmployeeId(Long employeeId);

        List<Attendance> findByAttendanceDate(LocalDate date);

        List<Attendance> findByEmployeeEmployeeIdAndAttendanceDateBetween(
                        Long employeeId,
                        LocalDate startDate,
                        LocalDate endDate);

        long countByAttendanceDateAndStatus(
                        LocalDate attendanceDate,
                        String status);

}