package com.fitflow.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/db")
@CrossOrigin(origins = "*")
public class DatabaseViewerController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/tables")
    public List<String> getTables() {
        // Query to get all tables in the public schema for PostgreSQL
        String sql = "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE' ORDER BY table_name";
        return jdbcTemplate.queryForList(sql, String.class);
    }

    @GetMapping("/tables/{tableName}")
    public List<Map<String, Object>> getTableData(@PathVariable String tableName) {
        // Basic SQL injection prevention: Ensure table name contains only alphanumeric characters and underscores
        if (!tableName.matches("^[a-zA-Z0-9_]+$")) {
            throw new IllegalArgumentException("Invalid table name");
        }
        // Fetch up to 100 rows for preview
        String sql = "SELECT * FROM " + tableName + " LIMIT 100";
        return jdbcTemplate.queryForList(sql);
    }
}
