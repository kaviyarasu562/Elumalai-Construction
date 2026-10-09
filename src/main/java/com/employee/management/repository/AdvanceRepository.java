package com.employee.management.repository;
import com.employee.management.entity.Advance;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
public interface AdvanceRepository extends JpaRepository<Advance, Long> {
    List<Advance> findByEmployeeEmployeeId(Long employeeId);
    List<Advance> findByEmployeeEmployeeIdAndStatusAndAdvanceDateBetween(Long employeeId, String status, LocalDate startDate, LocalDate endDate);
}
