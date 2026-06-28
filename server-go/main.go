package main

import (
	"log"

	"server-go/config"
	"server-go/controllers"

	"github.com/gofiber/fiber/v2"
)

func main() {
	// Koneksikan database PostgreSQL
	config.ConnectDB()

	// 1. Inisialisasi aplikasi Fiber (mirip const app = express() di Node.js)
	app := fiber.New()

	// 2. Routing Group / Routing Biasa
	app.Get("/api/health", func(c *fiber.Ctx) error {
		return c.Status(200).JSON(fiber.Map{
			"status":  "success",
			"message": "Hello Intern! Go backend is up and running!",
		})
	})

	// Route Auth
	app.Post("/api/auth/register", controllers.RegisterUser)

	// 3. Jalankan server pada port 8080 (mirip app.listen(8080) di Express)
	log.Fatal(app.Listen(":8080"))
}
