package lsp

import (
	"encoding/json"
	"fmt"
	"io"
	"net"
	"sync"
	"sync/atomic"
)

// Client represents a JSON-RPC 2.0 LSP client
type Client struct {
	conn         io.ReadWriteCloser
	nextID       int64
	pending      map[int64]chan<- json.RawMessage
	pendingMu    sync.Mutex
	notifications chan<- json.RawMessage
	done         chan struct{}
}

// Message represents a JSON-RPC 2.0 message
type Message struct {
	JSONRPC string          `json:"jsonrpc"`
	ID      int64           `json:"id,omitempty"`
	Method  string          `json:"method,omitempty"`
	Params  json.RawMessage `json:"params,omitempty"`
	Result  json.RawMessage `json:"result,omitempty"`
	Error   *Error          `json:"error,omitempty"`
}

// Error represents a JSON-RPC 2.0 error
type Error struct {
	Code    int             `json:"code"`
	Message string          `json:"message"`
	Data    json.RawMessage `json:"data,omitempty"`
}

// NewClient creates a new LSP client
func NewClient(conn io.ReadWriteCloser) *Client {
	c := &Client{
		conn:    conn,
		pending: make(map[int64]chan<- json.RawMessage),
		done:    make(chan struct{}),
	}
	go c.read()
	return c
}

// Call sends a request to the LSP server and waits for the response
func (c *Client) Call(method string, params interface{}) (json.RawMessage, error) {
	id := atomic.AddInt64(&c.nextID, 1)
	
	msg := Message{
		JSONRPC: "2.0",
		ID:      id,
		Method:  method,
	}
	
	if params != nil {
		data, err := json.Marshal(params)
		if err != nil {
			return nil, fmt.Errorf("failed to marshal params: %w", err)
		}
		msg.Params = data
	}

	resp := make(chan json.RawMessage, 1)
	c.pendingMu.Lock()
	c.pending[id] = resp
	c.pendingMu.Unlock()

	data, err := json.Marshal(msg)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal message: %w", err)
	}

	if _, err := c.conn.Write(data); err != nil {
		return nil, fmt.Errorf("failed to write message: %w", err)
	}

	select {
	case result := <-resp:
		return result, nil
	case <-c.done:
		return nil, fmt.Errorf("client closed")
	}
}

// Notify sends a notification to the LSP server
func (c *Client) Notify(method string, params interface{}) error {
	msg := Message{
		JSONRPC: "2.0",
		Method:  method,
	}

	if params != nil {
		data, err := json.Marshal(params)
		if err != nil {
			return fmt.Errorf("failed to marshal params: %w", err)
		}
		msg.Params = data
	}

	data, err := json.Marshal(msg)
	if err != nil {
		return fmt.Errorf("failed to marshal message: %w", err)
	}

	if _, err := c.conn.Write(data); err != nil {
		return fmt.Errorf("failed to write message: %w", err)
	}

	return nil
}

// Close closes the client connection
func (c *Client) Close() error {
	close(c.done)
	return c.conn.Close()
}

// read continuously reads messages from the connection
func (c *Client) read() {
	decoder := json.NewDecoder(c.conn)
	for {
		var msg Message
		if err := decoder.Decode(&msg); err != nil {
			if err != io.EOF {
				// Handle error
			}
			return
		}

		// Handle response
		if msg.ID != 0 {
			c.pendingMu.Lock()
			if ch, ok := c.pending[msg.ID]; ok {
				delete(c.pending, msg.ID)
				ch <- msg.Result
			}
			c.pendingMu.Unlock()
		}

		// Handle notification
		if msg.ID == 0 && msg.Method != "" && c.notifications != nil {
			c.notifications <- msg.Params
		}
	}
}

// Example usage
func main() {
	// Create connection (e.g., TCP or stdio)
	conn, err := net.Dial("tcp", "localhost:8080")
	if err != nil {
		log.Fatal(err)
	}

	// Create client
	client := NewClient(conn)
	defer client.Close()

	// Make a request
	params := map[string]interface{}{
		"textDocument": map[string]interface{}{
			"uri": "file:///path/to/file.go",
		},
	}
	
	result, err := client.Call("textDocument/definition", params)
	if err != nil {
		log.Fatal(err)
	}

	// Handle result...
} 