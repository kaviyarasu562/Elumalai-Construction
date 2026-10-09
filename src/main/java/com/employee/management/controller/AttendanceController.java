package com.employee.management.controller;

import com.employee.management.entity.Attendance;
import com.employee.management.service.AttendanceService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    // CREATE attendance for employee
    @PostMapping("/employee/{employeeId}")
    public Attendance addAttendance(
            @PathVariable Long employeeId,
            @Valid @RequestBody Attendance attendance) {

        return attendanceService.addAttendance(employeeId, attendance);
    }

    // READ all attendance
    @GetMapping
    public List<Attendance> getAllAttendance() {
        return attendanceService.getAllAttendance();
    }

    // READ attendance by ID
    @GetMapping("/{id}")
    public Attendance getAttendanceById(@PathVariable Long id) {
        return attendanceService.getAttendanceById(id);
    }

    // READ attendance by employee
    @GetMapping("/employee/{employeeId}")
    public List<Attendance> getAttendanceByEmployee(
            @PathVariable Long employeeId) {

        return attendanceService.getAttendanceByEmployee(employeeId);
    }

    // READ attendance by date
    @GetMapping("/date/{date}")
    public List<Attendance> getAttendanceByDate(
            @PathVariable LocalDate date) {

        return attendanceService.getAttendanceByDate(date);
    }

    // UPDATE attendance
    @PutMapping("/{id}")
    public Attendance updateAttendance(
            @PathVariable Long id,
            @Valid @RequestBody Attendance attendance) {

        return attendanceService.updateAttendance(id, attendance);
    }

    // DELETE attendance
    @DeleteMapping("/{id}")
    public String deleteAttendance(@PathVariable Long id) {

        attendanceService.deleteAttendance(id);

        return "Attendance deleted successfully";
    }
}