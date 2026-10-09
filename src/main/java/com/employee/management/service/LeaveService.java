package com.employee.management.service;
import com.employee.management.dto.LeaveSummaryResponse;
import com.employee.management.entity.Leave;
import java.time.LocalDate;
import java.util.List;
public interface LeaveService {
    Leave add(Long employeeId, Leave leave);
    List<Leave> getByEmployee(Long employeeId);
    LeaveSummaryResponse summary(Long employeeId, LocalDate startDate, LocalDate endDate);
    void delete(Long leaveId);
}
