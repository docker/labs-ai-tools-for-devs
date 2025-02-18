---
name: mcp-memory
description: Create a memory system for conversational agents
model: claude-3-5-sonnet-20241022
defs:
  - memory: &memory
      image: vonwig/memory:latest 
      volumes:
        - "mcp-memory:/memory"
tools:
  - name: "create_entities"
    description: "Create multiple new entities in the knowledge graph"
    parameters:
      type: "object"
      properties:
        entities:
          type: "array"
          items:
            type: "object"
            properties:
              name: { type: "string", description: "The name of the entity" }
              entityType: { type: "string", description: "The type of the entity" }
              observations:
                type: "array" 
                items: { type: "string" }
                description: "An array of observation contents associated with the entity"
            required: ["name", "entityType", "observations"]
      required: ["entities"]
    container:
      <<: [*memory]
      command:
        - create-entities
        - "{{raw|safe}}"
  - name: "create_relations"
    description: "Create multiple new relations between entities in the knowledge graph. Relations should be in active voice"
    parameters:
      type: "object"
      properties:
        relations:
          type: "array"
          items:
            type: "object"
            properties:
              from: { type: "string", description: "The name of the entity where the relation starts" }
              to: { type: "string", description: "The name of the entity where the relation ends" }
              relationType: { type: "string", description: "The type of the relation" }
            required: ["from", "to", "relationType"]
      required: ["relations"]
    container:
      <<: [*memory]
      command:
        - create-relations
        - "{{raw|safe}}"
  - name: "add_observations"
    description: "Add new observations to existing entities in the knowledge graph"
    parameters:
      type: "object"
      properties:
        observations:
          type: "array"
          items:
            type: "object"
            properties:
              entityName: { type: "string", description: "The name of the entity to add the observations to" }
              contents:
                type: "array"
                items: 
                  type: "string"
                description: "An array of observation contents to add"
            required: ["entityName", "contents"]
      required: ["observations"]
    container:
      <<: [*memory]
      command:
        - add-observations
        - "{{raw|safe}}"
  - name: "delete_entities"
    description: "Delete multiple entities and their associated relations from the knowledge graph"
    parameters:
      type: "object"
      properties:
        entityNames:
          type: "array" 
          items: 
            type: "string"
          description: "An array of entity names to delete"
      required: ["entityNames"]
    container:
      <<: [*memory]
      command:
        - delete-entities
        - "{{raw|safe}}"
  - name: "delete_observations"
    description: "Delete specific observations from entities in the knowledge graph"
    parameters:
      type: "object"
      properties:
        deletions:
          type: "array"
          items:
            type: "object"
            properties:
              entityName: { type: "string", description: "The name of the entity containing the observations" }
              observations:
                type: "array" 
                items: { type: "string" }
                description: "An array of observations to delete"
            required: ["entityName", "observations"]
      required: ["deletions"]
    container:
      <<: [*memory]
      command:
        - delete-observations
        - "{{raw|safe}}"
  - name: "delete_relations"
    description: "Delete multiple relations from the knowledge graph"
    parameters:
      type: "object"
      properties:
        relations:
          type: "array" 
          items:
            type: "object"
            properties:
              from: { type: "string", description: "The name of the entity where the relation starts" }
              to: { type: "string", description: "The name of the entity where the relation ends" }
              relationType: { type: "string", description: "The type of the relation" }
            required: ["from", "to", "relationType"]
          description: "An array of relations to delete" 
      required: ["relations"]
    container:
      <<: [*memory]
      command:
        - delete-relations
        - "{{raw|safe}}"
  - name: "read_graph"
    description: "Read the entire knowledge graph"
    parameters:
      type: "object"
      properties: {}
    container:
      <<: [*memory]
      command:
        - read-graph
        - "{{raw|safe}}"
  - name: "search_nodes"
    description: "Search for nodes in the knowledge graph based on a query"
    parameters:
      type: "object"
      properties: 
        query: 
          type: "string"
          description: "The search query to match against entity names, types, and observation content"
      required: ["query"]
    container:
      <<: [*memory]
      command:
        - search-nodes
        - "{{raw|safe}}"
  - name: "open_nodes"
    description: "Open specific nodes in the knowledge graph by their names"
    parameters:
      type: "object"
      properties:
        names:
          type: "array"
          items: 
            type: "string"
          description: "An array of entity names to retrieve"
      required: ["names"]
    container:
      <<: [*memory]
      command:
        - open-nodes
        - "{{raw|safe}}"
---

