package com.employee.management.service;
import com.employee.management.dto.ReportResponse;
import java.time.LocalDate;
public interface ReportService { ReportResponse generate(Long employeeId, LocalDate startDate, LocalDate endDate); }
