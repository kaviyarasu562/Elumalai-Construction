package com.employee.management.controller;
import com.employee.management.dto.LeaveSummaryResponse;
import com.employee.management.entity.Leave;
import com.employee.management.service.LeaveService;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/leaves") @CrossOrigin
public class LeaveController {
    private final LeaveService service; public LeaveController(LeaveService service) { this.service = service; }
    @PostMapping("/employee/{employeeId}") public Leave add(@PathVariable Long employeeId, @Valid @RequestBody Leave leave) { return service.add(employeeId, leave); }
    @GetMapping("/employee/{employeeId}") public List<Leave> getByEmployee(@PathVariable Long employeeId) { return service.getByEmployee(employeeId); }
    @GetMapping("/employee/{employeeId}/summary") public LeaveSummaryResponse summary(@PathVariable Long employeeId, @RequestParam LocalDate startDate, @RequestParam LocalDate endDate) { return service.summary(employeeId, startDate, endDate); }
    @DeleteMapping("/{leaveId}") public void delete(@PathVariable Long leaveId) { service.delete(leaveId); }
}
