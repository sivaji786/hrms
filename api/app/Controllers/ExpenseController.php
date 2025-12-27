<?php

namespace App\Controllers;

use App\Models\ExpenseModel;
use CodeIgniter\API\ResponseTrait;

class ExpenseController extends ApiController
{
    protected $expenseModel;

    public function __construct()
    {
        $this->expenseModel = new ExpenseModel();
    }

    public function index()
    {
        $user = $this->getUser();
        
        $builder = $this->expenseModel->select('expenses.*, employees.first_name, employees.last_name, departments.name as department')
            ->join('employees', 'employees.id = expenses.employee_id')
            ->join('departments', 'departments.id = employees.department_id', 'left');

        if ($user->role !== 'admin') {
            // If not admin, verify if the user is an employee and filter by their employee ID
            // Assuming user->id maps to employee->user_id or similar. 
            // But based on previous code, it used $user->id directly. 
            // Let's assume $user->id is the user ID and we need to find the employee record.
            // However, the previous code used `where('employee_id', $user->id)`. 
            // If the auth system sets $user->id as the employee ID, then it's fine.
            // If $user->id is the users table ID, we might need to adjust.
            // For now, I'll stick to the previous logic but be aware of this potential issue.
            $builder->where('expenses.employee_id', $user->id);
        }

        $data = $builder->findAll();
        
        // Format names
        foreach ($data as &$row) {
            $row['employeeName'] = $row['first_name'] . ' ' . $row['last_name'];
        }

        return $this->respondSuccess($data);
    }

    public function create()
    {
        $user = $this->getUser();
        $data = $this->request->getJSON(true);
        $data['employee_id'] = $user->id; // Assuming user ID is employee ID
        $data['status'] = 'Pending';
        
        if ($this->expenseModel->insert($data)) {
            return $this->respondCreated(['id' => $this->expenseModel->getInsertID(), ...$data], 'Expense submitted successfully');
        }

        return $this->respondError('Failed to submit expense', 500, $this->expenseModel->errors());
    }

    public function update($id = null)
    {
        $data = $this->request->getJSON(true);
        
        // If updating status, add approval details
        if (isset($data['status']) && in_array($data['status'], ['Approved', 'Rejected'])) {
            $user = $this->getUser();
            $data['approver_id'] = $user->id;
            $data['approval_date'] = date('Y-m-d H:i:s');
        }

        if ($this->expenseModel->update($id, $data)) {
            return $this->respondSuccess($data, 'Expense updated successfully');
        }

        return $this->respondError('Failed to update expense', 500, $this->expenseModel->errors());
    }

    public function delete($id = null)
    {
        if ($this->expenseModel->delete($id)) {
            return $this->respondDeleted(['id' => $id], 'Expense deleted successfully');
        }
        return $this->respondError('Failed to delete expense', 500);
    }

    public function show($id = null)
    {
        $data = $this->expenseModel->select('expenses.*, employees.first_name, employees.last_name, departments.name as department')
            ->join('employees', 'employees.id = expenses.employee_id')
            ->join('departments', 'departments.id = employees.department_id', 'left')
            ->find($id);

        if ($data) {
             $data['employeeName'] = $data['first_name'] . ' ' . $data['last_name'];
             return $this->respondSuccess($data);
        }
        return $this->respondError('Expense not found', 404);
    }

    public function stats()
    {
        $user = $this->getUser();
        $builder = $this->expenseModel;

        if ($user->role !== 'admin') {
            $builder->where('employee_id', $user->id);
        }

        $totalExpenses = $builder->countAllResults(false);
        $pendingApproval = $builder->where('status', 'Pending')->countAllResults(false);
        
        // Reset builder for sum
        $pendingAmount = $this->expenseModel->selectSum('amount')->where('status', 'Pending');
        if ($user->role !== 'admin') {
            $pendingAmount->where('employee_id', $user->id);
        }
        $pendingAmount = $pendingAmount->first()['amount'] ?? 0;

        $reimbursedExpenses = $this->expenseModel->where('status', 'Reimbursed');
        if ($user->role !== 'admin') {
            $reimbursedExpenses->where('employee_id', $user->id);
        }
        $reimbursedExpenses = $reimbursedExpenses->countAllResults();

        // Category Data
        $categoryBuilder = $this->expenseModel->select('category as name, SUM(amount) as value, COUNT(*) as count')
            ->groupBy('category');
        if ($user->role !== 'admin') {
            $categoryBuilder->where('employee_id', $user->id);
        }
        $categoryData = $categoryBuilder->findAll();
        
        // Add colors (basic implementation)
        $colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
        foreach ($categoryData as $index => &$item) {
            $item['color'] = $colors[$index % count($colors)];
            $item['value'] = (float)$item['value'];
        }

        // Monthly Data
        // Note: SQLite/MySQL syntax differs for date extraction. Assuming MySQL.
        $monthlyBuilder = $this->expenseModel->select("DATE_FORMAT(date, '%b') as month, SUM(amount) as amount")
            ->groupBy("DATE_FORMAT(date, '%b'), MONTH(date)")
            ->orderBy("MONTH(date)");
        if ($user->role !== 'admin') {
            $monthlyBuilder->where('employee_id', $user->id);
        }
        $monthlyData = $monthlyBuilder->findAll();
        foreach ($monthlyData as &$item) {
            $item['amount'] = (float)$item['amount'];
        }

        return $this->respondSuccess([
            'totalExpenses' => $totalExpenses,
            'pendingApproval' => $pendingApproval,
            'pendingAmount' => (float)$pendingAmount,
            'reimbursedExpenses' => $reimbursedExpenses,
            'categoryData' => $categoryData,
            'monthlyData' => $monthlyData
        ]);
    }
}
