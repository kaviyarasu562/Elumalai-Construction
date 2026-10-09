package com.employee.management.service;

import com.employee.management.entity.Attendance;
import com.employee.management.entity.Employee;
import com.employee.management.repository.AttendanceRepository;
import com.employee.management.repository.EmployeeRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class AttendanceServiceImpl implements AttendanceService {

        private final AttendanceRepository attendanceRepository;
        private final EmployeeRepository employeeRepository;

        public AttendanceServiceImpl(
                        AttendanceRepository attendanceRepository,
                        EmployeeRepository employeeRepository) {

                this.attendanceRepository = attendanceRepository;
                this.employeeRepository = employeeRepository;
        }

        @Override
        public Attendance addAttendance(
                        Long employeeId,
                        Attendance attendance) {

                Employee employee = employeeRepository.findById(employeeId)
                                .orElseThrow(() -> new RuntimeException(
                                                "Employee not found with ID: " + employeeId));

                attendance.setEmployee(employee);

                return attendanceRepository.save(attendance);
        }

        @Override
        public List<Attendance> getAllAttendance() {
                return attendanceRepository.findAll();
        }

        @Override
        public Attendance getAttendanceById(Long id) {

                return attendanceRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException(
                                                "Attendance not found with ID: " + id));
        }

        @Override
        public List<Attendance> getAttendanceByEmployee(Long employeeId) {

                return attendanceRepository
                                .findByEmployeeEmployeeId(employeeId);
        }

        @Override
        public List<Attendance> getAttendanceByDate(LocalDate date) {

                return attendanceRepository
                                .findByAttendanceDate(date);
        }

        @Override
        public Attendance updateAttendance(
                        Long id,
                        Attendance attendanceDetails) {

                Attendance attendance = attendanceRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException(
                                                "Attendance not found with ID: " + id));

                attendance.setAttendanceDate(
                                attendanceDetails.getAttendanceDate());

                attendance.setStatus(
                                attendanceDetails.getStatus());

                attendance.setOvertimeHours(
                                attendanceDetails.getOvertimeHours());

                attendance.setRemarks(
                                attendanceDetails.getRemarks());

                return attendanceRepository.save(attendance);
        }

        @Override
        public void deleteAttendance(Long id) {

                if (!attendanceRepository.existsById(id)) {
                        throw new RuntimeException(
                                        "Attendance not found with ID: " + id);
                }

                attendanceRepository.deleteById(id);
        }
}
