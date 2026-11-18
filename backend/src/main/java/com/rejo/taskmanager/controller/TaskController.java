package com.rejo.taskmanager.controller;

import com.rejo.taskmanager.model.Task;
import com.rejo.taskmanager.model.TaskStatus;
import com.rejo.taskmanager.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:3000")
public class TaskController {

    private final TaskService taskService;

    @Autowired
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    // GET /api/tasks              -> all tasks
    // GET /api/tasks?status=DONE  -> filter by status
    // GET /api/tasks?search=abc   -> search by title
    @GetMapping
    public ResponseEntity<List<Task>> getTasks(
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) String search) {

        if (status != null) {
            return ResponseEntity.ok(taskService.getTasksByStatus(status));
        }
        if (search != null && !search.isBlank()) {
            return ResponseEntity.ok(taskService.searchTasks(search));
        }
        return ResponseEntity.ok(taskService.getAllTasks());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.getTaskById(id));
    }

    @PostMapping
    public ResponseEntity<Task> createTask(@Valid @RequestBody Task task) {
        Task created = taskService.createTask(task);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @Valid @RequestBody Task task) {
        return ResponseEntity.ok(taskService.updateTask(id, task));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
}
