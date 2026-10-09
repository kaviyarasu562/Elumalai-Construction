package com.employee.management.service;
import com.employee.management.entity.Advance;
import java.time.LocalDate;
import java.util.List;
public interface AdvanceService {
    Advance add(Long employeeId, Advance advance);
    List<Advance> getByEmployee(Long employeeId);
    List<Advance> getActiveForPeriod(Long employeeId, LocalDate startDate, LocalDate endDate);
    void markDeducted(List<Advance> advances);
    void delete(Long advanceId);
}
