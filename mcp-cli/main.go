package main

import (
	"fmt"
	"os"

	"github.com/charmbracelet/bubbles/help"
	"github.com/charmbracelet/bubbles/key"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"

	"docker.com/mcp/internal"
)

// Define styles
var (
	titleStyle = lipgloss.NewStyle().
		Bold(true).
		Foreground(lipgloss.Color("#FF75B7"))

	selectedStyle = lipgloss.NewStyle().
		Foreground(lipgloss.Color("#FF75B7")).
		Bold(true)

	messageStyle = lipgloss.NewStyle().
		Foreground(lipgloss.Color("#FFFFFF"))

	toolCallStyle = lipgloss.NewStyle().
		Foreground(lipgloss.Color("#04B575")).
		Italic(true)

	toolOutputStyle = lipgloss.NewStyle().
		Foreground(lipgloss.Color("#04D9FF")).
		Italic(true)

	debugStyle = lipgloss.NewStyle().
		Foreground(lipgloss.Color("#FFA500")).
		Italic(true)

	helpStyle = lipgloss.NewStyle().
		Foreground(lipgloss.Color("#626262"))
)

// Turn represents a single interaction in the conversation
type Turn struct {
	message    string
	toolCall   *string
	toolOutput *string
	debug      *string
}

// KeyMap defines the keybindings for the application
type KeyMap struct {
	Up      key.Binding
	Down    key.Binding
	Add     key.Binding
	Quit    key.Binding
}

// ShortHelp returns keybinding help.
func (k KeyMap) ShortHelp() []key.Binding {
	return []key.Binding{k.Up, k.Down, k.Add, k.Quit}
}

// FullHelp returns the full help listing.
func (k KeyMap) FullHelp() [][]key.Binding {
	return [][]key.Binding{
		{k.Up, k.Down, k.Add, k.Quit},
	}
}

var keys = KeyMap{
	Up: key.NewBinding(
		key.WithKeys("up", "k"),
		key.WithHelp("↑/k", "move up"),
	),
	Down: key.NewBinding(
		key.WithKeys("down", "j"),
		key.WithHelp("↓/j", "move down"),
	),
	Add: key.NewBinding(
		key.WithKeys("a"),
		key.WithHelp("a", "add turn"),
	),
	Quit: key.NewBinding(
		key.WithKeys("q", "ctrl+c"),
		key.WithHelp("q", "quit"),
	),
}

// Model represents the application state
type model struct {
	turns    []Turn
	cursor   int
	done     bool
	counter  int
	help     help.Model
	keys     KeyMap
}

// Init is the first function that will be called
func (m model) Init() tea.Cmd {
	return nil
}

// Update handles all the application logic and events
func (m model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case tea.KeyMsg:
		switch {
		case key.Matches(msg, m.keys.Quit):
			m.done = true
			return m, tea.Quit
		case key.Matches(msg, m.keys.Up):
			if m.cursor > 0 {
				m.cursor--
			}
		case key.Matches(msg, m.keys.Down):
			if m.cursor < len(m.turns)-1 {
				m.cursor++
			}
		case key.Matches(msg, m.keys.Add):
			m.counter++
			newTurn := Turn{
				message: fmt.Sprintf("turn %d", m.counter),
			}
			m.turns = append(m.turns, newTurn)
			m.cursor = len(m.turns) - 1
		}
	}
	return m, nil
}

// View renders the application UI
func (m model) View() string {
	if m.done {
		return titleStyle.Render("Goodbye!\n")
	}

	var output string
	if len(m.turns) == 0 {
		output = titleStyle.Render("No turns yet\n")
	} else {
		for i, turn := range m.turns {
			cursor := " "
			if i == m.cursor {
				cursor = ">"
			}
			
			turnLine := fmt.Sprintf("%s %d: %s\n", cursor, i+1, turn.message)
			if i == m.cursor {
				turnLine = selectedStyle.Render(turnLine)
			} else {
				turnLine = messageStyle.Render(turnLine)
			}
			output += turnLine

			if turn.toolCall != nil {
				output += toolCallStyle.Render(fmt.Sprintf("   Tool Call: %s\n", *turn.toolCall))
			}
			if turn.toolOutput != nil {
				output += toolOutputStyle.Render(fmt.Sprintf("   Tool Output: %s\n", *turn.toolOutput))
			}
			if turn.debug != nil {
				output += debugStyle.Render(fmt.Sprintf("   Debug: %s\n", *turn.debug))
			}
			output += "\n"
		}
	}

	// Add help view at the bottom
	output += "\n" + helpStyle.Render(m.help.View(m.keys))

	return output
}

func main() {
	// Check if Docker command is specified
	if len(os.Args) > 1 && os.Args[1] == "docker" {
		docker.Main()
		return
	}

	// Original TUI logic
	initialModel := model{
		turns:   make([]Turn, 0),
		cursor:  0,
		counter: 0,
		help:    help.New(),
		keys:    keys,
	}
	p := tea.NewProgram(initialModel)
	if _, err := p.Run(); err != nil {
		fmt.Printf("Error running program: %v", err)
		os.Exit(1)
	}
} 
