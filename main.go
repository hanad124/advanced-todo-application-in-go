package main

import (
	"log"

	"github.com/devsmranjan/golang-fiber-basic-todo-app/config"
	"github.com/devsmranjan/golang-fiber-basic-todo-app/routes"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/joho/godotenv"
)

func setupRoutes(app *fiber.App) {
	// give response when at /
	app.Get("/", func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"success": true,
			"message": "You are at the endpoint ",
		})
	})

	// api group
	api := app.Group("/api")

	// give response when at /api
	api.Get("", func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"success": true,
			"message": "You are at the api endpoint ",
		})
	})

	// send todos route group to TodoRoutes of routes package
	routes.TodoRoute(api.Group("/todos"))
}

func main() {
	app := fiber.New()
	
	// Add CORS middleware with more permissive configuration
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:3002",
		AllowMethods:     "GET,POST,PUT,DELETE,OPTIONS",
		AllowHeaders:     "Origin,Content-Type,Accept,Content-Length,Accept-Language,Accept-Encoding,Connection,Access-Control-Allow-Origin",
		AllowCredentials: true,
		ExposeHeaders:    "Content-Length",
		MaxAge:           86400, // 24 hours
	}))
	
	app.Use(logger.New())

	// dotenv
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// config db
	config.ConnectDB()

	// setup routes
	setupRoutes(app)

	err = app.Listen(":8080")

	// handle error
	if err != nil {
		panic(err)
	}
}
