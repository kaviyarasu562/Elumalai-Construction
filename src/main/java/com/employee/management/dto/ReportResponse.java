package com.employee.management.dto;
import java.util.List;
public record ReportResponse(List<ReportRow> rows, long totalWorkers, double totalGross, double totalPaid, double totalPending) { }
