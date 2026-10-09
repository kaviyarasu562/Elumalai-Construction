package com.employee.management.service;
import com.employee.management.entity.Advance;
import com.employee.management.entity.Employee;
import com.employee.management.repository.AdvanceRepository;
import com.employee.management.repository.EmployeeRepository;
import java.time.LocalDate;
import java.util.List;
import org.springframework.stereotype.Service;
@Service
public class AdvanceServiceImpl implements AdvanceService {
    private final AdvanceRepository advanceRepository; private final EmployeeRepository employeeRepository;
    public AdvanceServiceImpl(AdvanceRepository advanceRepository, EmployeeRepository employeeRepository) { this.advanceRepository = advanceRepository; this.employeeRepository = employeeRepository; }
    public Advance add(Long employeeId, Advance advance) {
        Employee employee = employeeRepository.findById(employeeId).orElseThrow(() -> new IllegalArgumentException("Employee not found with ID: " + employeeId));
        advance.setEmployee(employee); if (advance.getStatus() == null || advance.getStatus().isBlank()) advance.setStatus("ACTIVE"); return advanceRepository.save(advance);
    }
    public List<Advance> getByEmployee(Long employeeId) { return advanceRepository.findByEmployeeEmployeeId(employeeId); }
    public List<Advance> getActiveForPeriod(Long employeeId, LocalDate startDate, LocalDate endDate) { return advanceRepository.findByEmployeeEmployeeIdAndStatusAndAdvanceDateBetween(employeeId, "ACTIVE", startDate, endDate); }
    public void markDeducted(List<Advance> advances) { advances.forEach(advance -> advance.setStatus("DEDUCTED")); advanceRepository.saveAll(advances); }
    public void delete(Long advanceId) { Advance advance = advanceRepository.findById(advanceId).orElseThrow(() -> new IllegalArgumentException("Advance not found with ID: " + advanceId)); if ("DEDUCTED".equalsIgnoreCase(advance.getStatus())) throw new IllegalStateException("A deducted advance cannot be deleted"); advanceRepository.delete(advance); }
}
