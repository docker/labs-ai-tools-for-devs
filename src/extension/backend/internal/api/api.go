package api

import (
	"bytes"
	"encoding/json"
	"net"
	"net/http"
	"os"

	"github.com/docker/dait/internal/models"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/sirupsen/logrus"
)

var (
	dataPath = "/data"
	logger   = logrus.New()
)

func Run(socketPath string) error {

	logger.SetOutput(os.Stdout)

	logMiddleware := middleware.LoggerWithConfig(middleware.LoggerConfig{
		Skipper: middleware.DefaultSkipper,
		Format: `{"time":"${time_rfc3339_nano}","id":"${id}",` +
			`"method":"${method}","uri":"${uri}",` +
			`"status":${status},"error":"${error}"` +
			`}` + "\n",
		CustomTimeFormat: "2006-01-02 15:04:05.00000",
		Output:           logger.Writer(),
	})

	logger.Infof("Starting listening on %s\n", socketPath)
	router := echo.New()
	router.HideBanner = true
	router.Use(logMiddleware)
	startURL := ""

	ln, err := listen(socketPath)
	if err != nil {
		return err
	}
	router.Listener = ln

	router.GET("/catalog", catalog)
	router.GET("/newcatalog", newCatalog)
	router.GET("/config", config)
	router.POST("/events", events)
	router.POST("/refresh", refresh)
	router.GET("/assets/*", func(ctx echo.Context) error {
		return asset(ctx, ctx.Param("*"))
	})
	router.GET("/clients", clients)

	routes := router.Routes()
	for _, route := range routes {
		logger.Infof("Registered route: %s %s", route.Method, route.Path)
	}

	return router.Start(startURL)
}

func listen(path string) (net.Listener, error) {
	return net.Listen("unix", path)
}

func asset(ctx echo.Context, path string) error {
	return ctx.File(dataPath + "/assets/" + path)
}

func newCatalog(ctx echo.Context) error {
	_, err := os.Stat(dataPath + "/catalog.json")
	if err != nil {
		return ctx.JSON(http.StatusNotFound, map[string]string{"error": "catalog.json does not exist"})
	}
	return ctx.File(dataPath + "/catalog.json")
}

func catalog(ctx echo.Context) error {
	_, err := os.Stat(dataPath + "/catalog.yaml")
	if err != nil {
		return ctx.JSON(http.StatusNotFound, map[string]string{"error": "catalog.yaml does not exist"})
	}
	return ctx.File(dataPath + "/catalog.yaml")
}

func config(ctx echo.Context) error {
	_, err := os.Stat(dataPath + "/config.json")
	if err != nil {
		return ctx.JSON(http.StatusNotFound, map[string]string{"error": "config.json does not exist"})
	}
	return ctx.File(dataPath + "/config.json")
}

func clients(ctx echo.Context) error {
	_, err := os.Stat(dataPath + "/clients.json")
	if err != nil {
		return ctx.JSON(http.StatusNotFound, map[string]string{"error": "clients.json does not exist"})
	}
	return ctx.File(dataPath + "/clients.json")
}

func events(ctx echo.Context) error {
	// Send events to Docker API
	url := "https://api.docker.com/events/v1/track"
	apiKey := "3EEvlMngcn3meCbpuYoyC4k8TSF0dYcB5XIVix		lt"

	var records []models.Record
	if err := ctx.Bind(&records); err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	client := &http.Client{}
	jsonData, err := json.Marshal(records)
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("x-api-key", apiKey)
	req.Header.Set("x-test-key", "test")

	resp, err := client.Do(req)
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	defer resp.Body.Close()

	return ctx.JSON(resp.StatusCode, map[string]string{"status": "success"})
}

func init() {
	// Skip initialization during tests
	if os.Getenv("GO_TEST") == "1" {
		return
	}
	if os.Getenv("DATA_PATH") != "" {
		dataPath = os.Getenv("DATA_PATH")
	}
	catalogURL := os.Getenv("CATALOG_URL")
	if catalogURL == "" {
		catalogURL = "https://raw.githubusercontent.com/docker/labs-ai-tools-for-devs/refs/heads/main/prompts/catalog.yaml"
	}

	err := initVolume()
	if err != nil {
		logger.Fatal(err)
	}
	// check if catalog.json exists
	_, err = os.Stat(dataPath + "/catalog.json")
	if err != nil {
		logger.Info("catalog.json does not exist, creating it")
		// load catalog.json
		err := models.RefreshCatalog(catalogURL, dataPath)
		if err != nil {
			logger.Fatal(err)
		}
		// refresh catalog.json
		tiles, err := models.ParseCatalog(dataPath)
		if err != nil {
			logger.Fatal(err)
		}
		// write catalog.json
		catalog, err := json.Marshal(tiles)
		if err != nil {
			logger.Fatal(err)
		}
		err = os.WriteFile(dataPath+"/catalog.json", catalog, 0644)
		if err != nil {
			logger.Fatal(err)
		}
	}

}

func refresh(ctx echo.Context) error {

	logger.Info("Refreshing catalog")
	catalogURL := os.Getenv("CATALOG_URL")
	if catalogURL == "" {
		catalogURL = "https://raw.githubusercontent.com/docker/labs-ai-tools-for-devs/refs/heads/main/prompts/catalog.yaml"
	}

	err := models.RefreshCatalog(catalogURL, dataPath)
	if err != nil {
		logger.Error(err)
		return ctx.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	// refresh catalog.json
	tiles, err := models.ParseCatalog(dataPath)
	if err != nil {
		logger.Error(err)
		return ctx.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	// write catalog.json
	catalog, err := json.Marshal(tiles)
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	err = os.WriteFile(dataPath+"/catalog.json", catalog, 0644)
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	return ctx.JSON(http.StatusOK, map[string]string{"status": "success"})
}

type HTTPMessageBody struct {
	Message string
}

func initVolume() error {
	// check if /data/assets exists
	_, err := os.Stat(dataPath + "/assets")
	if err != nil {
		logger.Info("Creating /data/assets")
		err := os.MkdirAll(dataPath+"/assets", 0755)
		if err != nil {
			return err
		}
	}
	return nil
}
