import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { tasksData } from './tasksData';

const router = express.Router(); 

router.get('/', (req, res) => {
    res.json(tasksData);
});
// Get task details
router.get('/:id', (req, res) => {
    const { id } = req.params
    const task = tasksData.tasks.find(task => task.id === id);
    if (!task) {
        return res.status(404).json({ status: 404, message: 'Task not found' });
    }
    return res.status(200).json(task);
});
//creat task
router.post('/', (req, res) => {
    const { title, description, deadline, priority, done } = req.body;
    const now = new Date().toISOString(); // 获取当前时间

    const newTask = {
        id: uuidv4(), // 生成唯一 ID
        title,
        description,
        deadline,
        priority,
        done,
        created_at: now, // 设置创建时间
        updated_at: now  // 设置更新时间
    };

    tasksData.tasks.push(newTask); // 将新任务添加到任务列表
    res.status(201).json(newTask); // 返回新创建的任务
    tasksData.total_results++; // 更新总任务数
});
//Update an existing task
router.put('/:id', (req, res) => {
    const { id } = req.params; // 获取 URL 参数中的 id
    const taskIndex = tasksData.tasks.findIndex(task => task.id === id); // 查找任务索引

    if (taskIndex === -1) {
        // 如果任务未找到，返回 404
        return res.status(404).json({ status: 404, message: 'Task not found' });
    }

    // 获取当前时间，用于更新 `updated_at`
    const now = new Date().toISOString();

    // 合并现有任务数据与请求体中的新数据，同时保留原始 id 和更新 `updated_at`
    const updatedTask = { 
        ...tasksData.tasks[taskIndex], 
        ...req.body, 
        id: id, 
        updated_at: now 
    };

    // 更新任务列表中的任务
    tasksData.tasks[taskIndex] = updatedTask;

    // 返回更新后的任务
    res.json(updatedTask);
});
//Delete a task
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const taskIndex = tasksData.tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) return res.status(404).json({status:404,message:'Task not found'});
    tasksData.tasks.splice(taskIndex, 1);
    res.status(204).send();
    tasksData.total_results--;
});
export default router;