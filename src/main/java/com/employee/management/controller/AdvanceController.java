package com.employee.management.controller;
import com.employee.management.entity.Advance;
import com.employee.management.service.AdvanceService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/advances") @CrossOrigin
public class AdvanceController {
    private final AdvanceService service; public AdvanceController(AdvanceService service) { this.service = service; }
    @PostMapping("/employee/{employeeId}") public Advance add(@PathVariable Long employeeId, @Valid @RequestBody Advance advance) { return service.add(employeeId, advance); }
    @GetMapping("/employee/{employeeId}") public List<Advance> getByEmployee(@PathVariable Long employeeId) { return service.getByEmployee(employeeId); }
    @DeleteMapping("/{advanceId}") public void delete(@PathVariable Long advanceId) { service.delete(advanceId); }
}
