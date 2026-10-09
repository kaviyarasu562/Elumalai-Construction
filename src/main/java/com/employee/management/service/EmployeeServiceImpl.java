package com.employee.management.service;

import com.employee.management.entity.Employee;
import com.employee.management.repository.EmployeeRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeServiceImpl(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Override
    public Employee addEmployee(Employee employee) {
        return employeeRepository.save(employee);
    }

    @Override
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    @Override
    public Employee getEmployeeById(Long id) {

        return employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with ID: " + id));
    }

    @Override
    public Employee updateEmployee(Long id, Employee employeeDetails) {

        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with ID: " + id));

        employee.setName(employeeDetails.getName());
        employee.setAadhaarNumber(employeeDetails.getAadhaarNumber());
        employee.setPhone(employeeDetails.getPhone());
        employee.setJobRole(employeeDetails.getJobRole());
        employee.setDailyWage(employeeDetails.getDailyWage());
        employee.setJoiningDate(employeeDetails.getJoiningDate());
        employee.setStatus(employeeDetails.getStatus());
        employee.setAddress(employeeDetails.getAddress());

        return employeeRepository.save(employee);
    }

    @Override
    public void deleteEmployee(Long id) {

        if (!employeeRepository.existsById(id)) {
            throw new RuntimeException("Employee not found with ID: " + id);
        }

        employeeRepository.deleteById(id);
    }

    @Override
    public List<Employee> searchEmployees(String keyword) {

        return employeeRepository
                .findByNameContainingIgnoreCase(keyword);
    }

    @Override
    public List<Employee> getEmployeesByStatus(String status) {

        return employeeRepository.findByStatus(status);
    }
}
