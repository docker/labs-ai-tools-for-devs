# octomind MCP Server

An MCP server for octomind tools, resources and prompts

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Official Image |
| **Author** | [OctoMind-dev](https://github.com/OctoMind-dev) |
| **Repository** | https://github.com/OctoMind-dev/octomind-mcp |
| **Dockerfile** | https://github.com/OctoMind-dev/octomind-mcp/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 + **createEnvironment**: the createEnvironment tool can create an environment for a given test target.
    an environment represents a specific setup or deployments for a test target. It include a test account when necsesary
    to login, a header configuration, a discovery url and a set of variables.
 + **createTestTarget**: the createTestTarget tool can create a new test target or project.
    A test target represents an application or service that can be tested using Octomind.
 + **deleteEnvironment**: deleteEnvironment tool can delete an environment for a given test target.
    The environment id is unique to the test target. The call is not reversible.
    an environment represents a specific setup or deployments for a test target. It include a test account when necsesary
    to login, a header configuration, a discovery url and a set of variables.
 + **deleteTestTarget**: the deleteTestTarget tool can delete an existing test target.
    This operation cannot be undone.
 + **discovery**: the discovery tool can create a test case on a giver test target with a test case description or prompt.
    one can either start from the predefined url for that test case or provide a new entry point url.
 + **executeTests**: the executeTests tool can trigger a set of tests for a given test target.
    The test target id is unique to the test target. The tests are executed on the provided url.
    The context object is used to provide information about the source of the test execution.
 + **getEnvironments**: the getEnvironments tool can retrieve environments for a given test target.
   an environment represents a specific setup or deployments for a test target. It include a test account when necsesary
    to login, a header configuration, a discovery url and a set of variables.
 + **getPrivateLocations**: the getPrivateLocations tool can retrieve all private locations configured for that org. 
    A private location is a server that can be used to access a test target behind a firewall or VPN.
 + **getTestCase**: the getTestCase tool can retrieve a test case for a given test target and test case id.
    A test case id is unique to the test target. The test case includes a set of interactions and assertions.
    it is the result of a discovery or a manual creation.
 + **getTestReport**: the getTestReport tool can retrieve a test report for a given test target and test report id.
    A test report id is generated when a set of test are executed on
    a test target. The test report id is unique to the test target.
 + **getTestReports**: the getTestReports tool can retrieve test reports for a given test target.
    Test reports are generated when set of tests are executed. The test report id is unique to the test target.
 + **getTestTargets**: the getTestTargets tool can retrieve all test targets or projects.
    Test targets represent applications or services that can be tested using Octomind.
 + **getVersion**: Returns the current version of the Octomind MCP server
 + **search**: the search tool can be used to search the octomind documentation for a given query.
    The search results are returned as a list of links to the documentation.
 + **updateEnvironment**: the updateEnvironment tool can update an environment for a given test target.
    an environment represents a specific setup or deployments for a test target. It include a test account when necsesary
    to login, a header configuration, a discovery url and a set of variables.
 + **updateTestTarget**: the updateTestTarget tool can update an existing test target.
    A test target represents an application or service that can be tested using Octomind.

## Tools

### createEnvironment

the createEnvironment tool can create an environment for a given test target.
    an environment represents a specific setup or deployments for a test target. It include a test account when necsesary
    to login, a header configuration, a discovery url and a set of variables.

| Parameter | Type | Description |
| - | - | - |
| `discoveryUrl` | `string` | URL used for test discovery |
| `name` | `string` | Name of the environment |
| `testTargetId` | `string` | Unique identifier of the test target |
| `additionalHeaderFields` | `object` *optional* | Optional additional HTTP header fields,         if discovery needs additional headers to be set |
| `basicAuth` | `object` *optional* | Optional basic authentication credentials, if discovery needs authentication |
| `privateLocationName` | `string` *optional* | Optional name of the private location, if discovery         needs to discover in a private location e.g. behind a firewall or VPN |
| `testAccount` | `object` *optional* | Optional test account credentials, if discovery needs authentication |

### createTestTarget

the createTestTarget tool can create a new test target or project.
    A test target represents an application or service that can be tested using Octomind.

| Parameter | Type | Description |
| - | - | - |
| `app` | `string` | The app name or project name of the test target |
| `discoveryUrl` | `string` | The discovery URL of the test target |
| `skipAutomaticTestCreation` | `boolean` *optional* | Skip automatic test creation right after the test target is created |

### deleteEnvironment

deleteEnvironment tool can delete an environment for a given test target.
    The environment id is unique to the test target. The call is not reversible.
    an environment represents a specific setup or deployments for a test target. It include a test account when necsesary
    to login, a header configuration, a discovery url and a set of variables.

| Parameter | Type | Description |
| - | - | - |
| `environmentId` | `string` | Unique identifier of the environment to delete |
| `testTargetId` | `string` | Unique identifier of the test target |

### deleteTestTarget

the deleteTestTarget tool can delete an existing test target.
    This operation cannot be undone.

| Parameter | Type | Description |
| - | - | - |
| `testTargetId` | `string` | Unique identifier of the test target to delete |

### discovery

the discovery tool can create a test case on a giver test target with a test case description or prompt.
    one can either start from the predefined url for that test case or provide a new entry point url.

| Parameter | Type | Description |
| - | - | - |
| `name` | `string` | Name of the test case to create |
| `prompt` | `string` | Description or prompt used for test case generation |
| `testTargetId` | `string` | Unique identifier of the test target |
| `assignedTagNames` | `array` *optional* | Optional list of tag names to assign to the newly discovered test case |
| `entryPointUrlPath` | `string` *optional* | Optional entry point URL path, if not provided the predefined url of the test target will be used |
| `externalId` | `string` *optional* | Optional external identifier. E.g. a ticket number or test rail id |
| `folderName` | `string` *optional* | Optional folder name  that the newly discovered test case will be added to |
| `prerequisiteId` | `string` *optional* | Optional prerequisite test case ID. If set all steps of the prerequisite will be executed before the test case discovery starts |

### executeTests

the executeTests tool can trigger a set of tests for a given test target.
    The test target id is unique to the test target. The tests are executed on the provided url.
    The context object is used to provide information about the source of the test execution.

| Parameter | Type | Description |
| - | - | - |
| `testTargetId` | `string` | Unique identifier of the test target |
| `url` | `string` | URL where the tests will be executed |
| `description` | `string` *optional* | Optional description of the test execution |
| `environmentName` | `string` *optional* | Name of the environment to use for test execution |
| `tags` | `array` *optional* | List of tags used for filtering the tests to execute |
| `variablesToOverwrite` | `object` *optional* | Optional variables to override during test execution |

### getEnvironments

the getEnvironments tool can retrieve environments for a given test target.
   an environment represents a specific setup or deployments for a test target. It include a test account when necsesary
    to login, a header configuration, a discovery url and a set of variables.

| Parameter | Type | Description |
| - | - | - |
| `testTargetId` | `string` | Unique identifier of the test target |

### getPrivateLocations

the getPrivateLocations tool can retrieve all private locations configured for that org. 
    A private location is a server that can be used to access a test target behind a firewall or VPN.

### getTestCase

the getTestCase tool can retrieve a test case for a given test target and test case id.
    A test case id is unique to the test target. The test case includes a set of interactions and assertions.
    it is the result of a discovery or a manual creation.

| Parameter | Type | Description |
| - | - | - |
| `testCaseId` | `string` | Unique identifier of the test case |
| `testTargetId` | `string` | Unique identifier of the test target |

### getTestReport

the getTestReport tool can retrieve a test report for a given test target and test report id.
    A test report id is generated when a set of test are executed on
    a test target. The test report id is unique to the test target.

| Parameter | Type | Description |
| - | - | - |
| `testReportId` | `string` | Unique identifier of the test report |
| `testTargetId` | `string` | Unique identifier of the test target |

### getTestReports

the getTestReports tool can retrieve test reports for a given test target.
    Test reports are generated when set of tests are executed. The test report id is unique to the test target.

| Parameter | Type | Description |
| - | - | - |
| `testTargetId` | `string` | Unique identifier of the test target |
| `filter` | `array` *optional* | Optional filters for test reports |
| `key` | `object` *optional* | Optional key for filtering test reports |

### getTestTargets

the getTestTargets tool can retrieve all test targets or projects.
    Test targets represent applications or services that can be tested using Octomind.

### getVersion

Returns the current version of the Octomind MCP server

### search

the search tool can be used to search the octomind documentation for a given query.
    The search results are returned as a list of links to the documentation.

| Parameter | Type | Description |
| - | - | - |
| `query` | `string` | Search query |

### updateEnvironment

the updateEnvironment tool can update an environment for a given test target.
    an environment represents a specific setup or deployments for a test target. It include a test account when necsesary
    to login, a header configuration, a discovery url and a set of variables.

| Parameter | Type | Description |
| - | - | - |
| `environmentId` | `string` | Unique identifier of the environment |
| `testTargetId` | `string` | Unique identifier of the test target |
| `additionalHeaderFields` | `object` *optional* | Optional additional HTTP header fields, if discovery needs additional headers to be set |
| `basicAuth` | `object` *optional* | Optional basic authentication credentials, if discovery needs authentication |
| `discoveryUrl` | `string` *optional* | Optional new discovery URL |
| `name` | `string` *optional* | Optional new name for the environment |
| `privateLocationName` | `string` *optional* | Optional name of the private location, if discovery needs to discover in a private location e.g. behind a firewall or VPN |
| `testAccount` | `object` *optional* | Optional test account credentials, if discovery needs authentication |

### updateTestTarget

the updateTestTarget tool can update an existing test target.
    A test target represents an application or service that can be tested using Octomind.

| Parameter | Type | Description |
| - | - | - |
| `testTargetId` | `string` | Unique identifier of the test target to update |
| `app` | `string` *optional* | The app name or project name of the test target |
| `discoveryUrl` | `string` *optional* | The discovery URL of the test target |
| `skipAutomaticTestCreation` | `boolean` *optional* | Skip automatic test creation right after the test target is created |
| `testIdAttribute` | `string` *optional* | The attribute name of the test ID |
| `testRailIntegration` | `object` *optional* | TestRail integration configuration |
| `timeoutPerStep` | `number` *optional* | The timeout per step in milliseconds |

## Use this MCP Server

```json
{
  "mcpServers": {
    "octomind": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e"
        "APIKEY"
        "mcp/octomind"
      ],
      "env": {
        "APIKEY": "your-api-key-here"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcp/octomind -f Dockerfile https://github.com/OctoMind-dev/octomind-mcp.git
```

