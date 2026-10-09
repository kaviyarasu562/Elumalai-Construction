package com.employee.management.repository;

import com.employee.management.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmployeeRepository
        extends JpaRepository<Employee, Long> {

    long countByStatus(String status);

    List<Employee> findByNameContainingIgnoreCase(String name);

    List<Employee> findByJobRoleContainingIgnoreCase(String jobRole);

    List<Employee> findByStatus(String status);
}