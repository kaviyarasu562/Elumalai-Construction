package com.employee.management.dto;
public record ReportRow(String employeeName, long present, long halfDay, long absent, long paidLeave, long unpaidLeave, long holiday, double gross, double paid, double pending) { }
