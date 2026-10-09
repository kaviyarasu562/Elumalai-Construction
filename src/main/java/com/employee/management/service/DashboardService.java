package com.employee.management.service;

import java.time.LocalDate;

import com.employee.management.dto.DashboardResponse;

public interface DashboardService {

    DashboardResponse getDashboardData(LocalDate date);
}