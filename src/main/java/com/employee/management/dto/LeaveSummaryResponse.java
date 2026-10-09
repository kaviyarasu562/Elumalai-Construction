package com.employee.management.dto;
public record LeaveSummaryResponse(long paidLeaveDays, long unpaidLeaveDays, long holidayDays, long totalLeaveDays) { }
