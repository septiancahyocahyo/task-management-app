package models

import (
	"time"
)

// Enum untuk Role, TaskStatus, dan TaskPriority didefinisikan sebagai string di Go.
type Role string
const (
	RoleUser  Role = "USER"
	RoleAdmin Role = "ADMIN"
)

type TaskStatus string
const (
	StatusTodo       TaskStatus = "TODO"
	StatusInProgress TaskStatus = "IN_PROGRESS"
	StatusCompleted  TaskStatus = "COMPLETED"
)

type TaskPriority string
const (
	PriorityLow    TaskPriority = "LOW"
	PriorityMedium TaskPriority = "MEDIUM"
	PriorityHigh   TaskPriority = "HIGH"
)

// User merepresentasikan tabel "User" di database
type User struct {
	ID        string    `gorm:"primaryKey" json:"id"`
	Name      string    `json:"name"`
	Email     string    `gorm:"uniqueIndex" json:"email"`
	Password  string    `json:"-"` // "json:-" agar password tidak pernah dikirim ke frontend
	Role      Role      `gorm:"default:USER" json:"role"`
	Tasks     []Task    `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE" json:"tasks,omitempty"`
	CreatedAt time.Time `gorm:"column:createdAt" json:"createdAt"`
	UpdatedAt time.Time `gorm:"column:updatedAt" json:"updatedAt"`
}

// TableName memberitahu GORM nama tabel asli di Postgres (default-nya jamak 'users')
func (User) TableName() string {
	return "User"
}

// Task merepresentasikan tabel "Task" di database
type Task struct {
	ID          string       `gorm:"primaryKey" json:"id"`
	Title       string       `json:"title"`
	Description *string      `json:"description"` // Menggunakan pointer *string karena bisa bernilai NULL
	Status      TaskStatus   `gorm:"default:TODO" json:"status"`
	Priority    TaskPriority `gorm:"default:MEDIUM" json:"priority"`
	DueDate     *time.Time   `gorm:"column:dueDate" json:"dueDate"` // Pointer ke time.Time untuk NULL
	UserID      string       `gorm:"column:userId" json:"userId"`
	CreatedAt   time.Time    `gorm:"column:createdAt" json:"createdAt"`
	UpdatedAt   time.Time    `gorm:"column:updatedAt" json:"updatedAt"`
}

// TableName memberitahu GORM nama tabel asli di Postgres (default-nya jamak 'tasks')
func (Task) TableName() string {
	return "Task"
}
