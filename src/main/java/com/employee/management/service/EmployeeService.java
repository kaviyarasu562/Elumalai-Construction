package com.employee.management.service;

import com.employee.management.entity.Employee;

import java.util.List;

public interface EmployeeService {

    Employee addEmployee(Employee employee);

    List<Employee> getAllEmployees();

    Employee getEmployeeById(Long id);

    Employee updateEmployee(Long id, Employee employee);

    void deleteEmployee(Long id);

    List<Employee> searchEmployees(String keyword);

    List<Employee> getEmployeesByStatus(String status);
}