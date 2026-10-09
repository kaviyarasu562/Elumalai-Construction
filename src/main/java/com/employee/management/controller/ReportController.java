package com.employee.management.controller;
import com.employee.management.dto.ReportResponse;
import com.employee.management.service.ReportService;
import java.time.LocalDate;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/reports") @CrossOrigin
public class ReportController {
    private final ReportService service; public ReportController(ReportService service) { this.service = service; }
    @GetMapping public ReportResponse generate(@RequestParam(required = false) Long employeeId, @RequestParam LocalDate startDate, @RequestParam LocalDate endDate) { return service.generate(employeeId, startDate, endDate); }
}
