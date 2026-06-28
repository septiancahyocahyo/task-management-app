package controllers

import (
	"server-go/config"
	"server-go/models"
	"server-go/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

// RegisterInput mendefinisikan struktur data JSON yang dikirim oleh client
type RegisterInput struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

// RegisterUser menangani pendaftaran akun baru
func RegisterUser(c *fiber.Ctx) error {
	var input RegisterInput

	// 1. Parse JSON body request ke struct input
	//    c.BodyParser mirip dengan req.body di Express
	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"status":  "error",
			"message": "Format request tidak valid",
		})
	}

	// 2. Validasi input sederhana
	if input.Name == "" || input.Email == "" || input.Password == "" {
		return c.Status(400).JSON(fiber.Map{
			"status":  "error",
			"message": "Semua field (name, email, password) wajib diisi",
			"errors": fiber.Map{
				"name":     "Name is required",
				"email":    "Email is required",
				"password": "Password is required",
			},
		})
	}

	// 3. Cek apakah email sudah terdaftar
	var existingUser models.User
	// SELECT * FROM "User" WHERE email = ? LIMIT 1
	result := config.DB.Where("email = ?", input.Email).First(&existingUser)
	if result.Error == nil {
		// Jika tidak ada error saat query, berarti user dengan email tersebut ADA
		return c.Status(409).JSON(fiber.Map{
			"status":  "error",
			"message": "Email sudah terdaftar",
			"errors": fiber.Map{
				"email": "Email already exists",
			},
		})
	}

	// 4. Hash password user
	hashedPassword, err := utils.HashPassword(input.Password)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"status":  "error",
			"message": "Gagal memproses password",
		})
	}

	// 5. Buat model User baru
	newUser := models.User{
		ID:       uuid.New().String(), // Generate UUID v4
		Name:     input.Name,
		Email:    input.Email,
		Password: hashedPassword,
		Role:     models.RoleUser, // Default ke USER
	}

	// 6. Simpan ke database
	//    INSERT INTO "User" (...) VALUES (...)
	if err := config.DB.Create(&newUser).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"status":  "error",
			"message": "Gagal menyimpan user ke database",
		})
	}

	// 7. Kembalikan response sukses
	return c.Status(201).JSON(fiber.Map{
		"status":  "success",
		"message": "Registrasi berhasil",
		"data":    newUser, // password ter-exclude otomatis dari JSON karena tag json:"-" di struct User
	})
}
