package com.employee.management.service;
import com.employee.management.dto.LeaveSummaryResponse;
import com.employee.management.entity.Employee;
import com.employee.management.entity.Leave;
import com.employee.management.repository.EmployeeRepository;
import com.employee.management.repository.LeaveRepository;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import org.springframework.stereotype.Service;
@Service
public class LeaveServiceImpl implements LeaveService {
    private final LeaveRepository leaveRepository; private final EmployeeRepository employeeRepository;
    public LeaveServiceImpl(LeaveRepository leaveRepository, EmployeeRepository employeeRepository) { this.leaveRepository = leaveRepository; this.employeeRepository = employeeRepository; }
    public Leave add(Long employeeId, Leave leave) {
        if (leave.getStartDate().isAfter(leave.getEndDate())) throw new IllegalArgumentException("Start date cannot be after end date");
        Employee employee = employeeRepository.findById(employeeId).orElseThrow(() -> new IllegalArgumentException("Employee not found with ID: " + employeeId));
        leave.setEmployee(employee); return leaveRepository.save(leave);
    }
    public List<Leave> getByEmployee(Long employeeId) { return leaveRepository.findByEmployeeEmployeeId(employeeId); }
    public LeaveSummaryResponse summary(Long employeeId, LocalDate startDate, LocalDate endDate) {
        if (startDate.isAfter(endDate)) throw new IllegalArgumentException("Start date cannot be after end date");
        long paid = 0, unpaid = 0, holiday = 0;
        for (Leave leave : leaveRepository.findByEmployeeEmployeeIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(employeeId, endDate, startDate)) {
            if (!"APPROVED".equalsIgnoreCase(leave.getStatus())) continue;
            LocalDate from = leave.getStartDate().isBefore(startDate) ? startDate : leave.getStartDate();
            LocalDate to = leave.getEndDate().isAfter(endDate) ? endDate : leave.getEndDate();
            long days = ChronoUnit.DAYS.between(from, to) + 1;
            if ("PAID_LEAVE".equalsIgnoreCase(leave.getLeaveType())) paid += days;
            else if ("UNPAID_LEAVE".equalsIgnoreCase(leave.getLeaveType())) unpaid += days;
            else if ("HOLIDAY".equalsIgnoreCase(leave.getLeaveType())) holiday += days;
        }
        return new LeaveSummaryResponse(paid, unpaid, holiday, paid + unpaid + holiday);
    }
    public void delete(Long leaveId) { if (!leaveRepository.existsById(leaveId)) throw new IllegalArgumentException("Leave not found with ID: " + leaveId); leaveRepository.deleteById(leaveId); }
}
