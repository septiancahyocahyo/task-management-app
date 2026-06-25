package main

import (
	"log"

	"server-go/config"

	"github.com/gofiber/fiber/v2"
)

func main() {
	// Koneksikan database PostgreSQL
	config.ConnectDB()

	// 1. Inisialisasi aplikasi Fiber (mirip const app = express() di Node.js)
	app := fiber.New()

	// 2. Definisikan route health check (GET /api/health)
	app.Get("/api/health", func(c *fiber.Ctx) error {
		// c *fiber.Ctx adalah Context yang menyimpan data request dan response.
		// c.JSON() digunakan untuk mengirim respons berupa JSON (mirip res.json() di Express).
		return c.Status(200).JSON(fiber.Map{
			"status":  "success",
			"message": "Hello Intern! Go backend is up and running!",
		})
	})

	// 3. Jalankan server pada port 8080 (mirip app.listen(8080) di Express)
	log.Fatal(app.Listen(":8080"))
}
