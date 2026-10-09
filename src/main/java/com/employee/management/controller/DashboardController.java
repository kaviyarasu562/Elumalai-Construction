package com.employee.management.controller;

import com.employee.management.dto.DashboardResponse;
import com.employee.management.service.DashboardService;

import java.time.LocalDate;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(
            DashboardService dashboardService) {

        this.dashboardService = dashboardService;
    }

    @GetMapping
    public DashboardResponse getDashboard(
            @RequestParam LocalDate date) {

        return dashboardService.getDashboardData(date);
    }
}