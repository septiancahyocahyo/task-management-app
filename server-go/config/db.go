package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// DB adalah instance database global yang bisa diakses dari package lain
var DB *gorm.DB

// ConnectDB bertugas menginisialisasi koneksi ke database PostgreSQL
func ConnectDB() {
	// 1. Load file .env terlebih dahulu
	err := godotenv.Load()
	if err != nil {
		log.Println("Warning: Tidak dapat menemukan file .env, menggunakan OS environment variables.")
	}

	// 2. Ambil string koneksi database dari env
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		log.Fatal("Error: Environment variable DATABASE_URL tidak diset.")
	}

	// 3. Buka koneksi database dengan GORM menggunakan driver postgres
	db, err := gorm.Open(postgres.Open(dbURL), &gorm.Config{})
	if err != nil {
		log.Fatal("Gagal terhubung ke database:", err)
	}

	log.Println("Berhasil terhubung ke database PostgreSQL!")

	// 4. Masukkan ke variabel global
	DB = db
}
