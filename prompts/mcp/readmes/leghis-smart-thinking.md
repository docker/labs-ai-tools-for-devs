# leghis-smart-thinking MCP Server

Smart-Thinking Un serveur MCP (Model Context Protocol) qui fournit un cadre de raisonnement multi-dimensionnel, adaptatif et collaboratif pour les assistants IA comme Claude.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Community Image |
| **Author** | [Leghis](https://github.com/Leghis) |
| **Repository** | https://github.com/Leghis/Smart-Thinking |
| **Dockerfile** | https://github.com/Leghis/Smart-Thinking/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`smartthinking`**: 

## Tools

### Tool: **`smartthinking`**



| Parameter | Type | Description |
| - | - | - |
| `thought` | `string` | Le contenu de la pensée à analyser - PARAMÈTRE OBLIGATOIRE - Cette pensée sera ajoutée au graphe de raisonnement |
| `connections` | `array` *optional* | Connexions à d'autres pensées - Permet de lier cette pensée à d'autres pensées du graphe |
| `containsCalculations` | `boolean` *optional* | Indique si la pensée contient des calculs à vérifier |
| `generateVisualization` | `boolean` *optional* | Générer une visualisation du graphe de pensée |
| `help` | `boolean` *optional* | Afficher le guide d'utilisation complet |
| `requestSuggestions` | `boolean` *optional* | Demander des suggestions d'amélioration du raisonnement |
| `requestVerification` | `boolean` *optional* | Demander explicitement une vérification des informations |
| `sessionId` | `string` *optional* | Identifiant de session pour maintenir l'état entre les appels |
| `suggestTools` | `boolean` *optional* | Suggérer des outils MCP pertinents pour cette étape du raisonnement |
| `thoughtType` | `string` *optional* | Type de pensée dans le graphe de raisonnement - Détermine la fonction de cette pensée |
| `userId` | `string` *optional* | Identifiant de l'utilisateur pour la personnalisation |
| `visualizationOptions` | `object` *optional* | Options avancées pour la visualisation |
| `visualizationType` | `string` *optional* | Type de visualisation à générer |

## Use this MCP Server

```json
{
  "mcpServers": {
    "leghis-smart-thinking": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcpcommunity/leghis-smart-thinking"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcpcommunity/leghis-smart-thinking -f Dockerfile https://github.com/Leghis/Smart-Thinking.git
```

