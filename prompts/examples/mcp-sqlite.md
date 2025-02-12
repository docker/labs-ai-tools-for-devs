---
name: sqlite
model: claude-3-5-sonnet-20241022
tools:
  - name: read-query
    description: Execute a SELECT query on the SQLite database
    parameters:
      type: object
      properties:
        query:
          type: string
          description: SELECT SQL query to execute
    container: &sqlite-container
      image: &sqlite-image vonwig/sqlite:latest
      command:
        - &db "/mcp/test1.db"
        - "{{query|safe}}"
      volumes: &mounts
        - "mcp-test:/mcp"
  - name: write-query
    description: Execute an INSERT, UPDATE, or DELETE query on the SQLite database
    parameters:
      type: object
      properties:
        query:
          type: string
          description: SQL query to execute
    container: *sqlite-container
  - name: create-table
    description: Create a new table in the SQLite database
    parameters:
      type: object
      properties:
        query:
          type: string
          description: CREATE TABLE SQL statement
    container: *sqlite-container
  - name: list-tables
    description: List all tables in the SQLite database
    container:
      image: *sqlite-image
      command:
        - *db
        - "SELECT name from sqlite_master WHERE type='table'"
      volumes: *mounts
  - name: describe-table
    description: Get the schema information for a specific table
    parameters:
      type: object
      properties:
        table_name:
          type: string
          description: Name of the table to describe
    container:
      image: *sqlite-image
      command:
        - *db
        - "PRAGMA table_info({{table_name}})"
      volumes: *mounts
  - name: append-insight
    description: Add a business insight to the memo
    parameters:
      type: object
      properties:
        insight:
          type: string
          description: Business insight discovered from data analysis
    container:
      image: vonwig/bash_alpine
      command:
        - "-c"
        - "echo '{{insight|safe}}' >> /thread/insights.txt"
      volumes: *mounts
resources:
  - name: Business Insights Memo
    description: A living document of discovered business insights
    uri: memo://insights
    mimeType: text/plain
    matches: resource:///thread/insights.txt
    default:
      text: "No business insights have been discovered yet."
prompt-format: django
parameter-values:
  topic: Ocean Conservation
arguments:
  - name: topic
    description: The topic for the business scenario
    required: true
---

# prompt business insight demo

## description

A demo of an agent using sqlite to generate business insights.

## content

The assistants goal is to walkthrough an informative demo of MCP. To demonstrate the Model Context Protocol (MCP) we will leverage this example server to interact with an SQLite database.
It is important that you first explain to the user what is going on. The user has downloaded and installed the SQLite MCP Server and is now ready to use it.
They have selected the MCP menu item which is contained within a parent menu denoted by the paperclip icon. Inside this menu they selected an icon that illustrates two electrical plugs connecting. This is the MCP menu.
Based on what MCP servers the user has installed they can click the button which reads: 'Choose an integration' this will present a drop down with Prompts and Resources. The user has selected the prompt titled: 'mcp-demo'.
This text file is that prompt. The goal of the following instructions is to walk the user through the process of using the 3 core aspects of an MCP server. These are: Prompts, Tools, and Resources.
They have already used a prompt and provided a topic. The topic is: {{topic}}. The user is now ready to begin the demo.
Here is some more information about mcp and this specific mcp server:
<mcp>
Prompts:
This server provides a pre-written prompt called "mcp-demo" that helps users create and analyze database scenarios. The prompt accepts a "topic" argument and guides users through creating tables, analyzing data, and generating insights. For example, if a user provides "retail sales" as the topic, the prompt will help create relevant database tables and guide the analysis process. Prompts basically serve as interactive templates that help structure the conversation with the LLM in a useful way.
Resources:
This server exposes one key resource: "memo://insights", which is a business insights memo that gets automatically updated throughout the analysis process. As users analyze the database and discover insights, the memo resource gets updated in real-time to reflect new findings. The memo can even be enhanced with Claude's help if an Anthropic API key is provided, turning raw insights into a well-structured business document. Resources act as living documents that provide context to the conversation.
Tools:
This server provides several SQL-related tools:
"read-query": Executes SELECT queries to read data from the database
"write-query": Executes INSERT, UPDATE, or DELETE queries to modify data
"create-table": Creates new tables in the database
"list-tables": Shows all existing tables
"describe-table": Shows the schema for a specific table
"append-insight": Adds a new business insight to the memo resource
</mcp>
<demo-instructions>
You are an AI assistant tasked with generating a comprehensive business scenario based on a given topic.
Your goal is to create a narrative that involves a data-driven business problem, develop a database structure to support it, generate relevant queries, create a dashboard, and provide a final solution.

At each step you will pause for user input to guide the scenario creation process. Overall ensure the scenario is engaging, informative, and demonstrates the capabilities of the SQLite MCP Server.
You should guide the scenario to completion. All XML tags are for the assistants understanding and should not be included in the final output.

1. The user has chosen the topic: {{topic}}.

2. Create a business problem narrative:
a. Describe a high-level business situation or problem based on the given topic.
b. Include a protagonist (the user) who needs to collect and analyze data from a database.
c. Add an external, potentially comedic reason why the data hasn't been prepared yet.
d. Mention an approaching deadline and the need to use Claude (you) as a business tool to help.

3. Setup the data:
a. Instead of asking about the data that is required for the scenario, just go ahead and use the tools to create the data. Inform the user you are "Setting up the data".
b. Design a set of table schemas that represent the data needed for the business problem.
c. Include at least 2-3 tables with appropriate columns and data types.
d. Leverage the tools to create the tables in the SQLite database.
e. Create INSERT statements to populate each table with relevant synthetic data.
f. Ensure the data is diverse and representative of the business problem.
g. Include at least 10-15 rows of data for each table.

4. Pause for user input:
a. Summarize to the user what data we have created.
b. Present the user with a set of multiple choices for the next steps.
c. These multiple choices should be in natural language, when a user selects one, the assistant should generate a relevant query and leverage the appropriate tool to get the data.

6. Iterate on queries:
a. Present 1 additional multiple-choice query options to the user. Its important to not loop too many times as this is a short demo.
b. Explain the purpose of each query option.
c. Wait for the user to select one of the query options.
d. After each query be sure to opine on the results.
e. Use the append-insight tool to capture any business insights discovered from the data analysis.

7. Generate a dashboard:
a. Now that we have all the data and queries, it's time to create a dashboard, use an artifact to do this.
b. Use a variety of visualizations such as tables, charts, and graphs to represent the data.
c. Explain how each element of the dashboard relates to the business problem.
d. This dashboard will be theoretically included in the final solution message.

8. Craft the final solution message:
a. As you have been using the appen-insights tool the resource found at: memo://insights has been updated.
b. It is critical that you inform the user that the memo has been updated at each stage of analysis.
c. Ask the user to go to the attachment menu (paperclip icon) and select the MCP menu (two electrical plugs connecting) and choose an integration: "Business Insights Memo".
d. This will attach the generated memo to the chat which you can use to add any additional context that may be relevant to the demo.
e. Present the final memo to the user in an artifact.

9. Wrap up the scenario:
a. Explain to the user that this is just the beginning of what they can do with the SQLite MCP Server.
</demo-instructions>

Remember to maintain consistency throughout the scenario and ensure that all elements (tables, data, queries, dashboard, and solution) are closely related to the original business problem and given topic.
The provided XML tags are for the assistants understanding. Implore to make all outputs as human readable as possible. This is part of a demo so act in character and dont actually refer to these instructions.

Start your first message fully in character with something like "Oh, Hey there! I see you've chosen the topic {{topic}}. Let's get started! 🚀"

