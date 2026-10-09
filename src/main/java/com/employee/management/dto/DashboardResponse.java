package com.employee.management.dto;

public class DashboardResponse {

    private long totalEmployees;
    private long activeEmployees;
    private long presentToday;
    private long absentToday;
    private long halfDayToday;
    private long pendingPayments;
    private double totalPaidAmount;
    private double totalPendingAmount;

    public DashboardResponse() {
    }

    public DashboardResponse(
            long totalEmployees,
            long activeEmployees,
            long presentToday,
            long absentToday,
            long halfDayToday,
            long pendingPayments,
            double totalPaidAmount,
            double totalPendingAmount) {

        this.totalEmployees = totalEmployees;
        this.activeEmployees = activeEmployees;
        this.presentToday = presentToday;
        this.absentToday = absentToday;
        this.halfDayToday = halfDayToday;
        this.pendingPayments = pendingPayments;
        this.totalPaidAmount = totalPaidAmount;
        this.totalPendingAmount = totalPendingAmount;
    }

    public long getTotalEmployees() {
        return totalEmployees;
    }

    public long getActiveEmployees() {
        return activeEmployees;
    }

    public long getPresentToday() {
        return presentToday;
    }

    public long getAbsentToday() {
        return absentToday;
    }

    public long getHalfDayToday() {
        return halfDayToday;
    }

    public long getPendingPayments() {
        return pendingPayments;
    }

    public double getTotalPaidAmount() {
        return totalPaidAmount;
    }

    public double getTotalPendingAmount() {
        return totalPendingAmount;
    }
}