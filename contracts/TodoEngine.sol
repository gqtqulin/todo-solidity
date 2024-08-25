// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

struct Task {
    string title;
    string description;
    bool completed;
    uint256 deadline;
}

contract TodoEngine is Ownable {
    
    constructor() Ownable(msg.sender) { }

    Task[] public tasks;

    function addTask(string calldata _title, string calldata _description,
        uint256 _deadline) external onlyOwner {
        tasks.push(Task(
            _title, 
            _description,
            false,
            _deadline
        ));
    }

    function changeTaskTitle(string calldata _title, uint256 index) external onlyOwner {
        tasks[index].title = _title; 
    }

    function changeTaskDescription(string calldata _desc, uint256 index) external onlyOwner {
        tasks[index].description = _desc;
    }

    function changeTaskStatus(uint256 index) external onlyOwner {
        tasks[index].completed = !tasks[index].completed;
    }

    function changeTaskDeadline(uint256 _dl, uint256 index) external onlyOwner {
        tasks[index].deadline = _dl;
    }

    function getTask(uint256 index) external view onlyOwner
        returns (string memory, string memory, bool, uint256)
    {
        Task storage task = tasks[index];
        return (
            task.title,
            task.description,
            task.completed,
            task.deadline
        );
    }

    function getAllTasks() external view onlyOwner returns (Task[] memory) {
        uint total = tasks.length;
        Task[] memory copy = new Task[](total);

        for (uint256 i = 0; i < total; i++) {
            copy[i] = tasks[i];
        }

        return copy;
    }
}