package com.employee.management.service;

import com.employee.management.entity.Attendance;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceService {

    Attendance addAttendance(Long employeeId, Attendance attendance);

    List<Attendance> getAllAttendance();

    Attendance getAttendanceById(Long id);

    List<Attendance> getAttendanceByEmployee(Long employeeId);

    Attendance updateAttendance(Long id, Attendance attendance);

    void deleteAttendance(Long id);

    List<Attendance> getAttendanceByDate(LocalDate date);
}