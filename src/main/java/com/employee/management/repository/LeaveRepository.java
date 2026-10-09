package com.employee.management.repository;
import com.employee.management.entity.Leave;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
public interface LeaveRepository extends JpaRepository<Leave, Long> {
    List<Leave> findByEmployeeEmployeeId(Long employeeId);
    List<Leave> findByEmployeeEmployeeIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(Long employeeId, LocalDate endDate, LocalDate startDate);
}
