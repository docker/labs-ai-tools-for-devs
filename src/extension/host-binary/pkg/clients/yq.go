package clients

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/mikefarah/yq/v4/pkg/yqlib"
	"gopkg.in/op/go-logging.v1"
)

type YQ struct {
	List string `yaml:"list"`
	Set  string `yaml:"set"`
	Del  string `yaml:"del"`
}

type yqProcessor struct {
	YQ
	decoder yqlib.Decoder
	encoder yqlib.Encoder
}

func newYQProcessor(yq YQ, path string) (*yqProcessor, error) {
	decoder, encoder, err := inferEncoding(path)
	if err != nil {
		return nil, err
	}
	return &yqProcessor{
		YQ:      yq,
		decoder: decoder,
		encoder: encoder,
	}, nil
}

func (c *yqProcessor) Parse(data []byte) (*MCPJSONLists, error) {
	tmpJSON, err := Evaluate(c.YQ.List, data, c.decoder, NewJSONEncoder())
	if err != nil {
		return nil, err
	}
	return UnmarshalMCPJSONList(tmpJSON)
}

func inferEncoding(path string) (yqlib.Decoder, yqlib.Encoder, error) {
	switch filepath.Ext(path) {
	case ".json":
		return yqlib.NewJSONDecoder(), NewJSONEncoder(), nil
	case ".yaml", ".yml":
		return NewYamlDecoder(), NewYamlEncoder(), nil
	default:
		return nil, nil, errors.New("unsupported file type")
	}
}

func (c *yqProcessor) Del(data []byte, key string) ([]byte, error) {
	return Evaluate(os.Expand(c.YQ.Del, func(s string) string { return expandDelQuery(s, key) }), data, c.decoder, c.encoder)
}

func expandDelQuery(name string, key string) string {
	switch name {
	case "NAME":
		return stringEscape(key)
	default:
		fmt.Printf("Unknown variable: %s\n", name)
		return ""
	}
}

func (c *yqProcessor) Add(data []byte, server MCPServerSTDIO) ([]byte, error) {
	if len(data) == 0 {
		data = []byte("null")
	}
	expression := os.Expand(c.YQ.Set, func(s string) string { return expandSetQuery(s, server) })
	return Evaluate(expression, data, c.decoder, c.encoder)
}

func stringEscape(s string) string {
	return `"` + s + `"`
}

func expandSetQuery(name string, server MCPServerSTDIO) string {
	temp := struct {
		Command string            `json:"command"`
		Args    []string          `json:"args,omitempty"`
		Env     map[string]string `json:"env,omitempty"`
	}{
		Command: server.Command,
		Args:    server.Args,
		Env:     server.Env,
	}
	switch name {
	case "NAME":
		return stringEscape(server.Name)
	case "JSON":
		result, err := json.Marshal(temp)
		if err != nil {
			fmt.Printf("Failed to marshal arguments: %s\n", err)
			return ""
		}
		return string(result)
	default:
		fmt.Printf("Unknown variable: %s\n", name)
		return ""
	}
}

var (
	yamlPref = yqlib.YamlPreferences{
		Indent:                      2,
		ColorsEnabled:               false,
		LeadingContentPreProcessing: true,
		PrintDocSeparators:          true,
		UnwrapScalar:                true,
		EvaluateTogether:            false,
	}
)

type logBackend struct{}

func (n logBackend) Log(logging.Level, int, *logging.Record) error {
	return nil
}

func (n logBackend) GetLevel(string) logging.Level {
	return logging.ERROR
}

func (n logBackend) SetLevel(logging.Level, string) {
}

func (n logBackend) IsEnabledFor(logging.Level, string) bool {
	return false
}

func silenceYqLogger() {
	// Don't use the default (chatty) logger
	logger := yqlib.GetLogger()
	backend := logBackend{}
	logger.SetBackend(backend)
}

func NewYamlDecoder() yqlib.Decoder {
	return yqlib.NewYamlDecoder(yamlPref)
}

func NewYamlEncoder() yqlib.Encoder {
	return yqlib.NewYamlEncoder(yamlPref)
}

func NewJSONEncoder() yqlib.Encoder {
	pref := yqlib.JsonPreferences{
		Indent:        0,
		ColorsEnabled: false,
		UnwrapScalar:  true,
	}
	return yqlib.NewJSONEncoder(pref)
}

func Evaluate(yqExpr string, content []byte, decoder yqlib.Decoder, encoder yqlib.Encoder) ([]byte, error) {
	silenceYqLogger()
	evaluator := yqlib.NewStringEvaluator()
	result, err := evaluator.EvaluateAll(yqExpr, string(content), encoder, decoder)
	if err != nil {
		return nil, fmt.Errorf("EvaluateYqExpression: failed to evaluate YQ expression '%s': %w", yqExpr, err)
	}
	result = strings.TrimSpace(result)
	return []byte(result), nil
}
