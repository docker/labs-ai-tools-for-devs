# Edubase MCP Server

The EduBase MCP server enables Claude and other LLMs to interact with EduBase's comprehensive e-learning platform through the Model Context Protocol (MCP).

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
**Docker Image**|[mcp/edubase](https://hub.docker.com/repository/docker/mcp/edubase)
**Author**|[EduBase](https://github.com/EduBase)
**Repository**|https://github.com/EduBase/MCP
**Dockerfile**|https://github.com/EduBase/MCP/blob/main/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/edubase)
**Licence**|MIT License

## Available Tools
Tools provided by this Server|Short Description
-|-
`edubase_delete_class_members`|Remove user(s) from a class.|
`edubase_delete_class_permission`|Remove a user permission from a class.|
`edubase_delete_class_tag`|Remove a tag attachment from a class.|
`edubase_delete_course_permission`|Remove a user permission from a course.|
`edubase_delete_course_tag`|Remove a tag attachment from a course.|
`edubase_delete_event_permission`|Remove a user permission from an event.|
`edubase_delete_event_tag`|Remove a tag attachment from an event.|
`edubase_delete_exam`|Remove/archive exam.|
`edubase_delete_exam_permission`|Remove a user permission from an exam.|
`edubase_delete_exam_tag`|Remove a tag attachment from an exam.|
`edubase_delete_exam_users`|Remove user(s) from an exam.|
`edubase_delete_integration_permission`|Remove a user permission from an integration.|
`edubase_delete_integration_tag`|Remove a tag attachment from an integration.|
`edubase_delete_organization_members`|Remove user(s) from an organization.|
`edubase_delete_organization_permission`|Remove a user permission from an organization.|
`edubase_delete_organization_tag`|Remove a tag attachment from an organization.|
`edubase_delete_question`|Permanently delete a Quiz question.|
`edubase_delete_quiz`|Remove/archive Quiz set.|
`edubase_delete_quiz_permission`|Remove a user permission from a quiz.|
`edubase_delete_quiz_questions`|Remove question(s) from a Quiz set, or one of its question group.|
`edubase_delete_quiz_tag`|Remove a tag attachment from a Quiz.|
`edubase_delete_scorm_permission`|Remove a user permission from a SCORM learning material.|
`edubase_delete_scorm_tag`|Remove a tag attachment from a SCORM learning material.|
`edubase_delete_tag_permission`|Remove a user permission from a tag.|
`edubase_delete_user`|Delete user.|
`edubase_delete_user_assume`|Revoke assume token.|
`edubase_delete_user_classes`|Remove user from class(es).|
`edubase_delete_user_login`|Delete a previously generated login link.|
`edubase_delete_user_organizations`|Remove user from organization(s).|
`edubase_delete_video_permission`|Remove a user permission from a video.|
`edubase_delete_video_tag`|Remove a tag attachment from a video.|
`edubase_get_class`|Get/check class.|
`edubase_get_class_assignments`|List all assignments in a class.|
`edubase_get_class_members`|List all members in a class.|
`edubase_get_class_permission`|Check if a user has permission on a class.|
`edubase_get_class_tag`|Check if tag is attached to a class.|
`edubase_get_class_tags`|List all attached tags of a class.|
`edubase_get_classes`|List owned and managed classes.|
`edubase_get_course_permission`|Check if a user has permission on a course.|
`edubase_get_course_tag`|Check if tag is attached to a course.|
`edubase_get_course_tags`|List all attached tags of a course.|
`edubase_get_event_permission`|Check if a user has permission on an event.|
`edubase_get_event_tag`|Check if tag is attached to an event.|
`edubase_get_event_tags`|List all attached tags of an event.|
`edubase_get_exam`|Get/check exam.|
`edubase_get_exam_permission`|Check if a user has permission on an exam.|
`edubase_get_exam_results_raw`|Get raw results for a specific exam.|
`edubase_get_exam_results_user`|Get user results for a specific exam.|
`edubase_get_exam_tag`|Check if tag is attached to an exam.|
`edubase_get_exam_tags`|List all attached tags of an exam.|
`edubase_get_exam_users`|List all users on an exam.|
`edubase_get_exams`|List owned and managed exams.|
`edubase_get_integration_permission`|Check if a user has permission on an integration.|
`edubase_get_integration_tag`|Check if tag is attached to an integration.|
`edubase_get_integration_tags`|List all attached tags of an integration.|
`edubase_get_organization`|Get/check organization.|
`edubase_get_organization_members`|List all members in an organization.|
`edubase_get_organization_permission`|Check if a user has permission on an organization.|
`edubase_get_organization_tag`|Check if tag is attached to an organization.|
`edubase_get_organization_tags`|List all attached tags of an organization.|
`edubase_get_organizations`|List owned and managed organizations.|
`edubase_get_question`|Check existing question.|
`edubase_get_quiz`|Get/check Quiz set.|
`edubase_get_quiz_permission`|Check if a user has permission on a quiz.|
`edubase_get_quiz_play_results`|Get detailed results for a specific Quiz play.|
`edubase_get_quiz_questions`|List all questions and question groups in a Quiz set.|
`edubase_get_quiz_results_user`|Get user results for a specific Quiz set.|
`edubase_get_quiz_tag`|Check if tag is attached to a Quiz.|
`edubase_get_quiz_tags`|List all attached tags of a Quiz.|
`edubase_get_quizes`|List owned and managed Quiz sets.|
`edubase_get_scorm_permission`|Check if a user has permission on a SCORM learning material.|
`edubase_get_scorm_tag`|Check if tag is attached to a SCORM learning material.|
`edubase_get_scorm_tags`|List all attached tags of a SCORM learning material.|
`edubase_get_tag`|Get/check tag.|
`edubase_get_tag_permission`|Check if a user has permission on a tag.|
`edubase_get_tags`|List owned and managed tags.|
`edubase_get_user`|Get/check user.|
`edubase_get_user_classes`|List all classes a user is member of.|
`edubase_get_user_group`|Get user's group.|
`edubase_get_user_login`|Get latest valid login link for user.|
`edubase_get_user_name`|Get user's name.|
`edubase_get_user_organizations`|List all organizations a user is member of.|
`edubase_get_user_search`|Lookup user by email, username or code.|
`edubase_get_users`|List managed, non-generated users.|
`edubase_get_video_permission`|Check if a user has permission on a video.|
`edubase_get_video_tag`|Check if tag is attached to a video.|
`edubase_get_video_tags`|List all attached tags of a video.|
`edubase_post_class_members`|Assign user(s) to a class.|
`edubase_post_class_permission`|Create new permission for a user on a class.|
`edubase_post_class_tag`|Attach tag to a class.|
`edubase_post_classes_members`|Assign user(s) to class(es).|
`edubase_post_course_permission`|Create new permission for a user on a course.|
`edubase_post_course_tag`|Attach tag to a course.|
`edubase_post_custom_metric`|Update a custom metric.|
`edubase_post_event_permission`|Create new permission for a user on an event.|
`edubase_post_event_tag`|Attach tag to an event.|
`edubase_post_exam`|Create a new exam from an existing Quiz set.|
`edubase_post_exam_permission`|Create new permission for a user on an exam.|
`edubase_post_exam_summary`|Submit a new AI exam summary.|
`edubase_post_exam_tag`|Attach tag to an exam.|
`edubase_post_exam_users`|Assign user(s) to an exam.|
`edubase_post_integration_permission`|Create new permission for a user on an integration.|
`edubase_post_integration_tag`|Attach tag to an integration.|
`edubase_post_organization_members`|Assign user(s) to an organization.|
`edubase_post_organization_permission`|Create new permission for a user on an organization.|
`edubase_post_organization_tag`|Attach tag to an organization.|
`edubase_post_organizations_members`|Assign user(s) to organization(s).|
`edubase_post_question`|Publish or update a question.|
`edubase_post_quiz`|Create a new Quiz set.|
`edubase_post_quiz_permission`|Create new permission for a user on a quiz.|
`edubase_post_quiz_questions`|Assign question(s) to a Quiz set, or one of its question group.|
`edubase_post_quiz_tag`|Attach tag to a Quiz.|
`edubase_post_scorm_permission`|Create new permission for a user on a SCORM learning material.|
`edubase_post_scorm_tag`|Attach tag to a SCORM learning material.|
`edubase_post_tag_permission`|Create new permission for a user on a tag.|
`edubase_post_user`|Create new EduBase user account.|
`edubase_post_user_assume`|Assume user for next requests with assume token.|
`edubase_post_user_classes`|Assign user to class(es).|
`edubase_post_user_group`|Update a user's group.|
`edubase_post_user_login`|Generate login link.|
`edubase_post_user_name`|Update a user's name.|
`edubase_post_user_organizations`|Assign user to organization(s).|
`edubase_post_video_permission`|Create new permission for a user on a video.|
`edubase_post_video_tag`|Attach tag to a video.|

---
## Tools Details

#### Tool: **`edubase_delete_class_members`**
Remove user(s) from a class.
Parameters|Type|Description
-|-|-
`class`|`string`|class identification string
`users`|`string`|comma-separated list of user identification strings

---
#### Tool: **`edubase_delete_class_permission`**
Remove a user permission from a class.
Parameters|Type|Description
-|-|-
`class`|`string`|class identification string
`permission`|`string`|permission level (view / control / modify / grant / admin)
`user`|`string`|user identification string

---
#### Tool: **`edubase_delete_class_tag`**
Remove a tag attachment from a class.
Parameters|Type|Description
-|-|-
`class`|`string`|class identification string
`tag`|`string`|tag identification string

---
#### Tool: **`edubase_delete_course_permission`**
Remove a user permission from a course.
Parameters|Type|Description
-|-|-
`course`|`string`|course identification string
`permission`|`string`|permission level (view / control / modify / grant / admin)
`user`|`string`|user identification string

---
#### Tool: **`edubase_delete_course_tag`**
Remove a tag attachment from a course.
Parameters|Type|Description
-|-|-
`course`|`string`|course identification string
`tag`|`string`|tag identification string

---
#### Tool: **`edubase_delete_event_permission`**
Remove a user permission from an event.
Parameters|Type|Description
-|-|-
`event`|`string`|event identification string
`permission`|`string`|permission level (view / control / modify / finances / grant / admin)
`user`|`string`|user identification string

---
#### Tool: **`edubase_delete_event_tag`**
Remove a tag attachment from an event.
Parameters|Type|Description
-|-|-
`event`|`string`|event identification string
`tag`|`string`|tag identification string

---
#### Tool: **`edubase_delete_exam`**
Remove/archive exam.
Parameters|Type|Description
-|-|-
`exam`|`string`|exam identification string

---
#### Tool: **`edubase_delete_exam_permission`**
Remove a user permission from an exam.
Parameters|Type|Description
-|-|-
`exam`|`string`|exam identification string
`permission`|`string`|permission level (view / control / modify / grant / admin)
`user`|`string`|user identification string

---
#### Tool: **`edubase_delete_exam_tag`**
Remove a tag attachment from an exam.
Parameters|Type|Description
-|-|-
`exam`|`string`|exam identification string
`tag`|`string`|tag identification string

---
#### Tool: **`edubase_delete_exam_users`**
Remove user(s) from an exam.
Parameters|Type|Description
-|-|-
`exam`|`string`|exam identification string
`users`|`string`|comma-separated list of user identification strings

---
#### Tool: **`edubase_delete_integration_permission`**
Remove a user permission from an integration.
Parameters|Type|Description
-|-|-
`integration`|`string`|integration identification string
`permission`|`string`|permission level (view / control / modify / grant / admin)
`user`|`string`|user identification string

---
#### Tool: **`edubase_delete_integration_tag`**
Remove a tag attachment from an integration.
Parameters|Type|Description
-|-|-
`integration`|`string`|integration identification string
`tag`|`string`|tag identification string

---
#### Tool: **`edubase_delete_organization_members`**
Remove user(s) from an organization.
Parameters|Type|Description
-|-|-
`organization`|`string`|organization identification string
`users`|`string`|comma-separated list of user identification strings

---
#### Tool: **`edubase_delete_organization_permission`**
Remove a user permission from an organization.
Parameters|Type|Description
-|-|-
`organization`|`string`|organization identification string
`permission`|`string`|permission level (view / control / modify / grant / admin)
`user`|`string`|user identification string

---
#### Tool: **`edubase_delete_organization_tag`**
Remove a tag attachment from an organization.
Parameters|Type|Description
-|-|-
`organization`|`string`|organization identification string
`tag`|`string`|tag identification string

---
#### Tool: **`edubase_delete_question`**
Permanently delete a Quiz question.
Parameters|Type|Description
-|-|-
`id`|`string`|external unique question identifier

---
#### Tool: **`edubase_delete_quiz`**
Remove/archive Quiz set.
Parameters|Type|Description
-|-|-
`quiz`|`string`|quiz identification string

---
#### Tool: **`edubase_delete_quiz_permission`**
Remove a user permission from a quiz.
Parameters|Type|Description
-|-|-
`permission`|`string`|permission level (view / control / modify / grant / admin)
`quiz`|`string`|quiz identification string
`user`|`string`|user identification string

---
#### Tool: **`edubase_delete_quiz_questions`**
Remove question(s) from a Quiz set, or one of its question group.
Parameters|Type|Description
-|-|-
`questions`|`string`|comma-separated list of question identification strings
`quiz`|`string`|quiz identification string
`group`|`string` *optional*|question group title

---
#### Tool: **`edubase_delete_quiz_tag`**
Remove a tag attachment from a Quiz.
Parameters|Type|Description
-|-|-
`quiz`|`string`|quiz identification string
`tag`|`string`|tag identification string

---
#### Tool: **`edubase_delete_scorm_permission`**
Remove a user permission from a SCORM learning material.
Parameters|Type|Description
-|-|-
`permission`|`string`|permission level (view / control / modify / grant / admin)
`scorm`|`string`|SCORM identification string
`user`|`string`|user identification string

---
#### Tool: **`edubase_delete_scorm_tag`**
Remove a tag attachment from a SCORM learning material.
Parameters|Type|Description
-|-|-
`scorm`|`string`|SCORM identification string
`tag`|`string`|tag identification string

---
#### Tool: **`edubase_delete_tag_permission`**
Remove a user permission from a tag.
Parameters|Type|Description
-|-|-
`permission`|`string`|permission level (view / control / modify / grant / admin)
`tag`|`string`|tag identification string
`user`|`string`|user identification string

---
#### Tool: **`edubase_delete_user`**
Delete user.
Parameters|Type|Description
-|-|-
`user`|`string`|user identification string

---
#### Tool: **`edubase_delete_user_assume`**
Revoke assume token.
Parameters|Type|Description
-|-|-
`token`|`string`|assume token

---
#### Tool: **`edubase_delete_user_classes`**
Remove user from class(es).
Parameters|Type|Description
-|-|-
`classes`|`string`|comma-separated list of class identification strings
`user`|`string`|user identification string

---
#### Tool: **`edubase_delete_user_login`**
Delete a previously generated login link.
Parameters|Type|Description
-|-|-
`url`|`string`|generated login link to be invalidated
`user`|`string`|user identification string

---
#### Tool: **`edubase_delete_user_organizations`**
Remove user from organization(s).
Parameters|Type|Description
-|-|-
`organizations`|`string`|comma-separated list of organization identification strings
`user`|`string`|user identification string

---
#### Tool: **`edubase_delete_video_permission`**
Remove a user permission from a video.
Parameters|Type|Description
-|-|-
`permission`|`string`|permission level (view / control / modify / grant / admin)
`user`|`string`|user identification string
`video`|`string`|video identification string

---
#### Tool: **`edubase_delete_video_tag`**
Remove a tag attachment from a video.
Parameters|Type|Description
-|-|-
`tag`|`string`|tag identification string
`video`|`string`|video identification string

---
#### Tool: **`edubase_get_class`**
Get/check class.
Parameters|Type|Description
-|-|-
`class`|`string`|class identification string

---
#### Tool: **`edubase_get_class_assignments`**
List all assignments in a class.
Parameters|Type|Description
-|-|-
`class`|`string`|class identification string

---
#### Tool: **`edubase_get_class_members`**
List all members in a class.
Parameters|Type|Description
-|-|-
`class`|`string`|class identification string

---
#### Tool: **`edubase_get_class_permission`**
Check if a user has permission on a class.
Parameters|Type|Description
-|-|-
`class`|`string`|class identification string
`permission`|`string`|permission level (view / control / modify / grant / admin)
`user`|`string`|user identification string

---
#### Tool: **`edubase_get_class_tag`**
Check if tag is attached to a class.
Parameters|Type|Description
-|-|-
`class`|`string`|class identification string
`tag`|`string`|tag identification string

---
#### Tool: **`edubase_get_class_tags`**
List all attached tags of a class.
Parameters|Type|Description
-|-|-
`class`|`string`|class identification string

---
#### Tool: **`edubase_get_classes`**
List owned and managed classes.
Parameters|Type|Description
-|-|-
`limit`|`number` *optional*|limit number of results (default, in search mode: 16)
`page`|`number` *optional*|page number (default: 1), not used in search mode!
`search`|`string` *optional*|search string to filter results

---
#### Tool: **`edubase_get_course_permission`**
Check if a user has permission on a course.
Parameters|Type|Description
-|-|-
`course`|`string`|course identification string
`permission`|`string`|permission level (view / control / modify / grant / admin)
`user`|`string`|user identification string

---
#### Tool: **`edubase_get_course_tag`**
Check if tag is attached to a course.
Parameters|Type|Description
-|-|-
`course`|`string`|course identification string
`tag`|`string`|tag identification string

---
#### Tool: **`edubase_get_course_tags`**
List all attached tags of a course.
Parameters|Type|Description
-|-|-
`course`|`string`|course identification string

---
#### Tool: **`edubase_get_event_permission`**
Check if a user has permission on an event.
Parameters|Type|Description
-|-|-
`event`|`string`|event identification string
`permission`|`string`|permission level (view / control / modify / finances / grant / admin)
`user`|`string`|user identification string

---
#### Tool: **`edubase_get_event_tag`**
Check if tag is attached to an event.
Parameters|Type|Description
-|-|-
`event`|`string`|event identification string
`tag`|`string`|tag identification string

---
#### Tool: **`edubase_get_event_tags`**
List all attached tags of an event.
Parameters|Type|Description
-|-|-
`event`|`string`|event identification string

---
#### Tool: **`edubase_get_exam`**
Get/check exam.
Parameters|Type|Description
-|-|-
`exam`|`string`|exam identification string

---
#### Tool: **`edubase_get_exam_permission`**
Check if a user has permission on an exam.
Parameters|Type|Description
-|-|-
`exam`|`string`|exam identification string
`permission`|`string`|permission level (view / control / modify / grant / admin)
`user`|`string`|user identification string

---
#### Tool: **`edubase_get_exam_results_raw`**
Get raw results for a specific exam.
- This endpoint returns raw results, including all answers given by the user. It is not meant to be displayed to the user.
- This might require additional permissions.
Parameters|Type|Description
-|-|-
`exam`|`string`|exam identification string

---
#### Tool: **`edubase_get_exam_results_user`**
Get user results for a specific exam.
Parameters|Type|Description
-|-|-
`exam`|`string`|exam identification string
`user`|`string`|user identification string

---
#### Tool: **`edubase_get_exam_tag`**
Check if tag is attached to an exam.
Parameters|Type|Description
-|-|-
`exam`|`string`|exam identification string
`tag`|`string`|tag identification string

---
#### Tool: **`edubase_get_exam_tags`**
List all attached tags of an exam.
Parameters|Type|Description
-|-|-
`exam`|`string`|exam identification string

---
#### Tool: **`edubase_get_exam_users`**
List all users on an exam.
Parameters|Type|Description
-|-|-
`exam`|`string`|exam identification string

---
#### Tool: **`edubase_get_exams`**
List owned and managed exams. Exams are the highest level in the EduBase Quiz hierarchy, built from Quiz sets.
Parameters|Type|Description
-|-|-
`limit`|`number` *optional*|limit number of results (default, in search mode: 16)
`page`|`number` *optional*|page number (default: 1), not used in search mode!
`search`|`string` *optional*|search string to filter results

---
#### Tool: **`edubase_get_integration_permission`**
Check if a user has permission on an integration.
Parameters|Type|Description
-|-|-
`integration`|`string`|integration identification string
`permission`|`string`|permission level (view / control / modify / grant / admin)
`user`|`string`|user identification string

---
#### Tool: **`edubase_get_integration_tag`**
Check if tag is attached to an integration.
Parameters|Type|Description
-|-|-
`integration`|`string`|integration identification string
`tag`|`string`|tag identification string

---
#### Tool: **`edubase_get_integration_tags`**
List all attached tags of an integration.
Parameters|Type|Description
-|-|-
`integration`|`string`|integration identification string

---
#### Tool: **`edubase_get_organization`**
Get/check organization.
Parameters|Type|Description
-|-|-
`organization`|`string`|organization identification string

---
#### Tool: **`edubase_get_organization_members`**
List all members in an organization.
Parameters|Type|Description
-|-|-
`organization`|`string`|organization identification string

---
#### Tool: **`edubase_get_organization_permission`**
Check if a user has permission on an organization.
Parameters|Type|Description
-|-|-
`organization`|`string`|organization identification string
`permission`|`string`|permission level (view / control / modify / grant / admin)
`user`|`string`|user identification string

---
#### Tool: **`edubase_get_organization_tag`**
Check if tag is attached to an organization.
Parameters|Type|Description
-|-|-
`organization`|`string`|organization identification string
`tag`|`string`|tag identification string

---
#### Tool: **`edubase_get_organization_tags`**
List all attached tags of an organization.
Parameters|Type|Description
-|-|-
`organization`|`string`|organization identification string

---
#### Tool: **`edubase_get_organizations`**
List owned and managed organizations.
Parameters|Type|Description
-|-|-
`limit`|`number` *optional*|limit number of results (default, in search mode: 16)
`page`|`number` *optional*|page number (default: 1), not used in search mode!
`search`|`string` *optional*|search string to filter results

---
#### Tool: **`edubase_get_question`**
Check existing question. Questions are the lowest level in the EduBase hierarchy, serving as the building blocks for Quiz sets.
Parameters|Type|Description
-|-|-
`id`|`string`|external unique question identifier

---
#### Tool: **`edubase_get_quiz`**
Get/check Quiz set. Containing questions and powering Exams.
Parameters|Type|Description
-|-|-
`quiz`|`string`|quiz identification string

---
#### Tool: **`edubase_get_quiz_permission`**
Check if a user has permission on a quiz.
Parameters|Type|Description
-|-|-
`permission`|`string`|permission level (view / control / modify / grant / admin)
`quiz`|`string`|quiz identification string
`user`|`string`|user identification string

---
#### Tool: **`edubase_get_quiz_play_results`**
Get detailed results for a specific Quiz play.
Parameters|Type|Description
-|-|-
`play`|`string`|Quiz play identification string

---
#### Tool: **`edubase_get_quiz_questions`**
List all questions and question groups in a Quiz set. Quiz sets contain questions (lowest level) and can be used by exams (highest level).
Parameters|Type|Description
-|-|-
`quiz`|`string`|quiz identification string

---
#### Tool: **`edubase_get_quiz_results_user`**
Get user results for a specific Quiz set.
Parameters|Type|Description
-|-|-
`quiz`|`string`|Quiz set identification string
`user`|`string`|user identification string

---
#### Tool: **`edubase_get_quiz_tag`**
Check if tag is attached to a Quiz.
Parameters|Type|Description
-|-|-
`quiz`|`string`|quiz identification string
`tag`|`string`|tag identification string

---
#### Tool: **`edubase_get_quiz_tags`**
List all attached tags of a Quiz.
Parameters|Type|Description
-|-|-
`quiz`|`string`|quiz identification string

---
#### Tool: **`edubase_get_quizes`**
List owned and managed Quiz sets. Quiz sets are named collections of questions that sit at the middle level of the EduBase Quiz hierarchy.
Parameters|Type|Description
-|-|-
`limit`|`number` *optional*|limit number of results (default, in search mode: 16)
`page`|`number` *optional*|page number (default: 1), not used in search mode!
`search`|`string` *optional*|search string to filter results

---
#### Tool: **`edubase_get_scorm_permission`**
Check if a user has permission on a SCORM learning material.
Parameters|Type|Description
-|-|-
`permission`|`string`|permission level (view / control / modify / grant / admin)
`scorm`|`string`|SCORM identification string
`user`|`string`|user identification string

---
#### Tool: **`edubase_get_scorm_tag`**
Check if tag is attached to a SCORM learning material.
Parameters|Type|Description
-|-|-
`scorm`|`string`|SCORM identification string
`tag`|`string`|tag identification string

---
#### Tool: **`edubase_get_scorm_tags`**
List all attached tags of a SCORM learning material.
Parameters|Type|Description
-|-|-
`scorm`|`string`|SCORM identification string

---
#### Tool: **`edubase_get_tag`**
Get/check tag.
Parameters|Type|Description
-|-|-
`tag`|`string`|tag identification string

---
#### Tool: **`edubase_get_tag_permission`**
Check if a user has permission on a tag.
Parameters|Type|Description
-|-|-
`permission`|`string`|permission level (view / control / modify / grant / admin)
`tag`|`string`|tag identification string
`user`|`string`|user identification string

---
#### Tool: **`edubase_get_tags`**
List owned and managed tags.
Parameters|Type|Description
-|-|-
`limit`|`number` *optional*|limit number of results (default, in search mode: 16)
`page`|`number` *optional*|page number (default: 1), not used in search mode!
`search`|`string` *optional*|search string to filter results

---
#### Tool: **`edubase_get_user`**
Get/check user. Can be used to retrieve the caller user's ID by using 'me' as the user identification string.
Parameters|Type|Description
-|-|-
`user`|`string`|User identification string.
- Use 'me' to get the current user.

---
#### Tool: **`edubase_get_user_classes`**
List all classes a user is member of.
Parameters|Type|Description
-|-|-
`user`|`string`|user identification string

---
#### Tool: **`edubase_get_user_group`**
Get user's group.
Parameters|Type|Description
-|-|-
`user`|`string`|user identification string

---
#### Tool: **`edubase_get_user_login`**
Get latest valid login link for user.
Parameters|Type|Description
-|-|-
`user`|`string`|user identification string

---
#### Tool: **`edubase_get_user_name`**
Get user's name.
Parameters|Type|Description
-|-|-
`user`|`string`|user identification string

---
#### Tool: **`edubase_get_user_organizations`**
List all organizations a user is member of.
Parameters|Type|Description
-|-|-
`user`|`string`|user identification string

---
#### Tool: **`edubase_get_user_search`**
Lookup user by email, username or code.
Parameters|Type|Description
-|-|-
`query`|`string`|query string

---
#### Tool: **`edubase_get_users`**
List managed, non-generated users.
Parameters|Type|Description
-|-|-
`limit`|`number` *optional*|limit number of results (default, in search mode: 16)
`page`|`number` *optional*|page number (default: 1), not used in search mode!
`search`|`string` *optional*|search string to filter results

---
#### Tool: **`edubase_get_video_permission`**
Check if a user has permission on a video.
Parameters|Type|Description
-|-|-
`permission`|`string`|permission level (view / control / modify / grant / admin)
`user`|`string`|user identification string
`video`|`string`|video identification string

---
#### Tool: **`edubase_get_video_tag`**
Check if tag is attached to a video.
Parameters|Type|Description
-|-|-
`tag`|`string`|tag identification string
`video`|`string`|video identification string

---
#### Tool: **`edubase_get_video_tags`**
List all attached tags of a video.
Parameters|Type|Description
-|-|-
`video`|`string`|video identification string

---
#### Tool: **`edubase_post_class_members`**
Assign user(s) to a class. Updates memberships if already member of the class.
Parameters|Type|Description
-|-|-
`class`|`string`|class identification string
`users`|`string`|comma-separated list of user identification strings
`expires`|`string` *optional*|expiry in days or YYYY-MM-DD HH:ii:ss
`notify`|`boolean` *optional*|notify users (default: false)

---
#### Tool: **`edubase_post_class_permission`**
Create new permission for a user on a class.
Parameters|Type|Description
-|-|-
`class`|`string`|class identification string
`permission`|`string`|permission level (view / control / modify / grant / admin)
`user`|`string`|user identification string

---
#### Tool: **`edubase_post_class_tag`**
Attach tag to a class.
Parameters|Type|Description
-|-|-
`class`|`string`|class identification string
`tag`|`string`|tag identification string

---
#### Tool: **`edubase_post_classes_members`**
Assign user(s) to class(es). Updates memberships if already member of a class.
Parameters|Type|Description
-|-|-
`classes`|`string`|comma-separated list of class identification strings
`users`|`string`|comma-separated list of user identification strings
`expires`|`string` *optional*|expiry in days or YYYY-MM-DD HH:ii:ss
`notify`|`boolean` *optional*|notify users (default: false)

---
#### Tool: **`edubase_post_course_permission`**
Create new permission for a user on a course.
Parameters|Type|Description
-|-|-
`course`|`string`|course identification string
`permission`|`string`|permission level (view / control / modify / grant / admin)
`user`|`string`|user identification string

---
#### Tool: **`edubase_post_course_tag`**
Attach tag to a course.
Parameters|Type|Description
-|-|-
`course`|`string`|course identification string
`tag`|`string`|tag identification string

---
#### Tool: **`edubase_post_custom_metric`**
Update a custom metric.
Parameters|Type|Description
-|-|-
`metric`|`string`|metric name
`value`|`number`|target value (also accepts increments with a + prefix)

---
#### Tool: **`edubase_post_event_permission`**
Create new permission for a user on an event.
Parameters|Type|Description
-|-|-
`event`|`string`|event identification string
`permission`|`string`|permission level (view / control / modify / finances / grant / admin)
`user`|`string`|user identification string

---
#### Tool: **`edubase_post_event_tag`**
Attach tag to an event.
Parameters|Type|Description
-|-|-
`event`|`string`|event identification string
`tag`|`string`|tag identification string

---
#### Tool: **`edubase_post_exam`**
Create a new exam from an existing Quiz set. Exams are at the top level of the EduBase Quiz hierarchy and MUST be created from existing Quiz sets. They are time-constrained, secured assessment instances of Quiz sets.
Parameters|Type|Description
-|-|-
`close`|`string`|exam end time (in YYYY-mm-dd HH:ii:ss format)
`open`|`string`|exam start time (in YYYY-mm-dd HH:ii:ss format)
`quiz`|`string`|the Quiz set (specified using the quiz identification string) the exam is attached to
`title`|`string`|title of the exam
`language`|`string` *optional*|desired exam language
`type`|`string` *optional*|Type of the exam. (default: exam)
- exam: regular exam
- championship: exam with championship features enabled
- homework: homework assignment, can be paused and continued during the exam period
- survey: survey (optionally anonymous) with no grading

---
#### Tool: **`edubase_post_exam_permission`**
Create new permission for a user on an exam.
Parameters|Type|Description
-|-|-
`exam`|`string`|exam identification string
`permission`|`string`|permission level (view / control / modify / grant / admin)
`user`|`string`|user identification string

---
#### Tool: **`edubase_post_exam_summary`**
Submit a new AI exam summary.
Parameters|Type|Description
-|-|-
`exam`|`string`|exam identification string
`llm`|`string`|Name of the Large Language Model used to generate the summary.
- preferred values: openai / claude / gemini
`model`|`string`|Exact LLM model name used to generate the summary
`summary`|`string`|Summary text. 
- basic HTML formatting allowed, but avoid complex designs
- keep the summary short and concise
- try to avoid including personal information (such as usernames, names and contact addresses)
`type`|`string`|Type of summary. (default: ai)
- ai: AI-generated summary
`language`|`string` *optional*|summary language

---
#### Tool: **`edubase_post_exam_tag`**
Attach tag to an exam.
Parameters|Type|Description
-|-|-
`exam`|`string`|exam identification string
`tag`|`string`|tag identification string

---
#### Tool: **`edubase_post_exam_users`**
Assign user(s) to an exam.
Parameters|Type|Description
-|-|-
`exam`|`string`|exam identification string
`users`|`string`|comma-separated list of user identification strings

---
#### Tool: **`edubase_post_integration_permission`**
Create new permission for a user on an integration.
Parameters|Type|Description
-|-|-
`integration`|`string`|integration identification string
`permission`|`string`|permission level (view / control / modify / grant / admin)
`user`|`string`|user identification string

---
#### Tool: **`edubase_post_integration_tag`**
Attach tag to an integration.
Parameters|Type|Description
-|-|-
`integration`|`string`|integration identification string
`tag`|`string`|tag identification string

---
#### Tool: **`edubase_post_organization_members`**
Assign user(s) to an organization. Updates memberships if already member of the organization.
Parameters|Type|Description
-|-|-
`organization`|`string`|organization identification string
`users`|`string`|comma-separated list of user identification strings
`department`|`string` *optional*|optional name of department
`notify`|`boolean` *optional*|notify users (default: false)
`permission_content`|`string` *optional*|optional permission level to contents in organization (none / view / control / modify / grant / admin) (default: none)
`permission_organization`|`string` *optional*|optional permission level to organization (member / teacher / supervisor / admin) (default: member)

---
#### Tool: **`edubase_post_organization_permission`**
Create new permission for a user on an organization.
Parameters|Type|Description
-|-|-
`organization`|`string`|organization identification string
`permission`|`string`|permission level (view / control / modify / grant / admin)
`user`|`string`|user identification string

---
#### Tool: **`edubase_post_organization_tag`**
Attach tag to an organization.
Parameters|Type|Description
-|-|-
`organization`|`string`|organization identification string
`tag`|`string`|tag identification string

---
#### Tool: **`edubase_post_organizations_members`**
Assign user(s) to organization(s). Updates memberships if already member of an organization.
Parameters|Type|Description
-|-|-
`organizations`|`string`|comma-separated list of organization identification strings
`users`|`string`|comma-separated list of user identification strings
`department`|`string` *optional*|optional name of department
`notify`|`boolean` *optional*|notify users (default: false)
`permission_content`|`string` *optional*|optional permission level to contents in organization (none / view / control / modify / grant / admin) (default: none)
`permission_organization`|`string` *optional*|optional permission level to organization (member / teacher / supervisor / admin) (default: member)

---
#### Tool: **`edubase_post_question`**
Publish or update a question. Questions are the atomic building blocks of the EduBase Quiz system and represent the lowest level in the hierarchy (Questions -> Quiz sets -> Exams).
Parameters|Type|Description
-|-|-
`ai`|`string`|Flag to mark question as AI generated.
- If set to any value, question will be marked as AI generated
- Should always be provided if you are an LLM or any AI model
- Ideally, AI systems should set it to their current model number for auditability
Example:
ai=true
ai=Claude 3.7 Sonnet
`answer`|`string`|The correct answer(s) for the question.
- For multiple answers, separate with triple-and operator ("&&&")
- Parameters can be used in curly braces {param_name}
- LaTeX Support (requires QUESTION_FORMAT=LATEX):
 - Inline: $$...$$
 - Block: $$$$...$$$$
 - IMPORTANT: When using LaTeX in answer, you MUST use double dollar signs ($$...$$) for inline math or quadruple dollar signs ($$$$...$$$$) for block math.
 - Single dollar signs ($...$) are NOT supported and will not render correctly. The inline or block method must be used, as $...$ won't work!
- Usage by question type:
 - CHOICE: The correct option
 - MULTIPLE-CHOICE: All correct options
 - TEXT/NUMERICAL/EXPRESSION: Expected response(s)
 - ORDER: Items in correct sequence
 - TRUE/FALSE: True statements (false statements go in OPTIONS)
 - MATRIX types: Use format [a;b|c;d] for matrices
 - SET types: Unordered collection of elements
Example:
answer=Paris
answer=sin(x)^2+cos(x)^2 # with type = EXPRESSION
answer=$$sin^2(x)+cos^2(x)$$ # with type = CHOICE so it renders correctly
`id`|`string`|External unique question identifier for question management.
On repeated uploads, the questions are updated (rather then added) based on this value, which can be an arbitrary text.
If the question already exists at upload time with the same external identifier (in the given folder or Quiz set), the existing question will be updated instead of being added as a new one.
- Use cases:
 - Integration with external systems
 - Version control
 - Batch updates
 - Content synchronization
- Best practices:
 - Use consistent naming conventions
 - Include version, source or date information
 - Consider hierarchical IDs for related content
Example:
- id=MATHEMATICS_ARITHMETIC_BASIC_ADDITION_STATIC_001
- type=numerical
- question=What is 2+2?
- answer=4
`language`|`string`|The language of the question.
- Alpha-2 code according to ISO 639-1
Example:
language=hu  # Hungarian
`question`|`string`|The main question text that will be displayed to the test taker.
Supports rich formatting options:
- LaTeX Support (requires QUESTION_FORMAT=LATEX):
 - Inline: $$...$$
 - Block: $$$$...$$$$
 - IMPORTANT: When using LaTeX in questions, you MUST use double dollar signs ($$...$$) for inline math or quadruple dollar signs ($$$$...$$$$) for block math.
 - Single dollar signs ($...$) are NOT supported and will not render correctly. The inline or block method must be used, as $...$ won't work!
- Parameters: Use curly braces {parameter_name} (defined in PARAMETERS field)
- Quick expressions: Use ~~~expression~~~ for simple parameter calculations, e.g., area of a circle is ~~~{r}*{r}*pi~~~
- Style formatting with EduTags:
 - Bold: [[B]]...[[/B]]
 - Italic: [[I]]...[[/I]]
 - Underline: [[U]]...[[/U]]
 - Subscript: [[SUB]]...[[/SUB]], Superscript: [[SUP]]...[[/SUP]]
 - Code: [[CODE]]...[[/CODE]], [[CODEBLOCK]]...[[/CODEBLOCK]]
 - Colors: [[COLOR:{color}]]...[[/COLOR]], [[BACKGROUND:{color}]]...[[/BACKGROUND]]
- Tables: Use [[..]] format with semicolons for columns, vertical bars for rows, e.g., [[Header 1; Header 2 | Data 1; Data 2]]
- Answer placeholders: [[___]] (3 underscores), for fill-in-the-gaps
Example:
question=Calculate the area of a circle with radius {r} using $$A = \pi r^2$$
`type`|`string`|Type of the question.
EduBase supports various question types to accommodate different assessment needs:
- Basic Types:
 - GENERIC: Strict matching including spaces and punctuation
 - TEXT: Basic text input with flexible matching (ignores spaces and punctuation)
 - FREE-TEXT: Extended text response with semi-automatic grading
 - READING: Non-assessed text display for complex question groups
- Choice-Based Types:
 - CHOICE: Single correct answer selection
 - MULTIPLE-CHOICE: Multiple correct answers
 - ORDER: Sequence arrangement (arrange items in correct order)
 - TRUE/FALSE: Statement evaluation (true statements in ANSWER, false in OPTIONS)
- Numerical Types:
 - NUMERIC: Numerical value validation with fractions, constants, intervals
 - DATE/TIME: Calendar date validation with adjustable precision
 - EXPRESSION: Mathematical expression evaluation
- Advanced Types:
 - MATRIX/MATRIX:EXPRESSION: Matrix evaluation (format: [a;b|c;d] for 2x2)
 - SET/SET:TEXT: Unordered collection validation
 - FILE: File submission evaluation
Example:
type=numerical
`answer_format`|`string` *optional*|Defines how to display the answer on the results page.
- Only applicable for FREE-TEXT questions
- Format: type or type:value
- Available types:
 - normal: standard text (default)
 - code: with syntax highlighting (specify language after colon)
Example:
answer_format=code:python
answer_format=code:sql
Example API call:
id=sql_basics
type=free-text
question=Write a SQL query to select all columns from the "users" table where the age is greater than 18.
answer=SELECT * FROM users WHERE age > 18
answer_format=code:sql
`answer_hide`|`string` *optional*|Controls whether correct answers are hidden on the results page.
- Plus sign (+) to indicate YES
- Blank field or minus sign (-) indicates NO (default)
- Useful for test security and preventing answer sharing
- Critical for reusable questions and practice tests
Example:
answer_hide=+
Example API call:
id=uk_countries
type=text
question=Name any of the countries within the United Kingdom!
answer=England &&& Northern Ireland &&& Scotland &&& Wales
answer_require=1
answer_hide=+
`answer_indefinite`|`string` *optional*|Allows users to add any number of input fields using + and - buttons.
- Plus sign (+) to indicate YES
- Blank field or minus sign (-) indicates NO (default)
- Answer labels will not appear when this is enabled
- Ideal for brainstorming exercises or questions with variable number of answers
Example:
answer_indefinite=+
Example API call:
id=name_countries
type=text
question=Name as many European countries as you can think of.
answer=France &&& Germany &&& Italy &&& Spain &&& United Kingdom &&& ...
answer_indefinite=+
`answer_label`|`string` *optional*|Text displayed in/above the input field during the test.
- Separate multiple labels with triple-and operators ("&&&")
- Automatically activates the answer_order function
- Perfect for multi-part questions where each part needs clear labeling
- Useful for creating pairing/matching questions
Example:
answer_label=a) Distance (km) &&& b) Time (hours) &&& c) Speed (km/h)
Example API call:
id=basic_math
type=numerical
question=Given the number 16:\n\na) What is double this number?\n\nb) What is half of this number?\n\nc) What is this number plus 10?
answer=32 &&& 8 &&& 26
answer_label=a) Double &&& b) Half &&& c) Plus 10
points=3
`answer_order`|`string` *optional*|Controls whether the sequence of multiple answers matters.
- Plus sign (+) to indicate YES
- Blank field or minus sign (-) indicates NO (default)
- When using answer_label, this is automatically activated
- Essential for questions where sequence is important (e.g., steps in a process)
Example:
answer_order=+
Example API call:
id=europe_cities_population
type=text
question=List the following European cities in descending order by population (largest first)
answer=London &&& Madrid &&& Paris
answer_order=+
`answer_require`|`string` *optional*|Number of answers required for maximum score.
- Not applicable for CHOICE and FREE-TEXT questions
- Perfect for questions with multiple valid answers where only a subset needs to be provided
- Useful when asking students to provide any X examples from a larger set
Example:
answer_require=3
Example API call:
id=uk_countries
type=text
question=Name any one of the countries within the United Kingdom!
answer=England &&& Northern Ireland &&& Scotland &&& Wales
answer_require=1
`attachment`|`string` *optional*|Attach a file to the question.
Format: filename=data, where data is either a base64-encoded image or a URL
`category`|`string` *optional*|Category, another layer of organization as seen in SUBJECT
`constraints`|`string` *optional*|Define rules that parameter combinations must satisfy.
- Mathematical expressions that must evaluate to true
- Parameters must be in curly braces {param}
- Allowed relations: <, <=, =, >=, >, <>
- Multiple constraints separated by triple-and operators ("&&&")
Examples:
constraints={b}^2-4*{a}*{c}>0
constraints={a}+{b}>{c} &&& {b}+{c}>{a} &&& {c}+{a}>{b}
constraints={x}+{y}<10 &&& {x}<4
`datetime_precision`|`string` *optional*|Date/time precision.
- Applicable only for DATE/TIME questions
- Accepted values: YEAR / MONTH / DAY (default)
- Defines granularity of date validation
Example:
datetime_precision=MONTH
`datetime_range`|`string` *optional*|Date/time range (interval) question.
- Applicable only for DATE/TIME questions
- Plus sign (+) to indicate YES, while blank field or minus sign (-) indicates NO (default)
- Enables date range responses with the format {from}-{to}
Example:
datetime_range=+
`decimals`|`string` *optional*|Decimal precision (default: 2).
- Applicable only for NUMERIC / EXPRESSION / MATRIX / MATRIX:EXPRESSION / SET questions
- The expected decimal precision of the final answer
- Examples: Finance (decimals=2), Chemistry (decimals=4)
Example:
decimals=3
`explanation`|`string` *optional*|Text displayed underneath the answer on the results page.
- Explanation of the correctness of the answer or the incorrectness of the options
- Helps learners understand their mistakes
- Parameters can be used in explanations
- LaTeX is NOT supported here, so we MUST NOT use it!
Example:
explanation=Option A is correct because amphibians have permeable skin for gas exchange. Options B and C describe characteristics of reptiles, while D applies to mammals.
`expression_check`|`string` *optional*|Define how expressions should be validated (RANDOM, EXPLICIT, COMPARE) (default: RANDOM).
- RANDOM: Evaluates expressions at randomly generated points
- EXPLICIT: Checks expressions at predefined values against target values
- COMPARE: Direct comparison of expressions without variables
Example:
expression_check=RANDOM
`expression_decimals`|`string` *optional*|Sets precision for decimal calculations (default: 2).
- Inherited from decimals field if not specified
- Critical for controlling accurate validation of expressions
Example:
expression_decimals=4  # For high-precision calculations
`expression_explicit_goal`|`string` *optional*|Define exact value pairs (format: [x;f(x)]).
- Format for multiple variables: [x;y;z;...;f(x,y,z,...)]
- Multiple pairs: separate with &&&
- Only applicable when expression_check=EXPLICIT
Example:
expression_explicit_goal=[0;1] &&& [3;8.89] &&& [9;16]
`expression_extended`|`string` *optional*|Enable additional mathematical functions (+ to enable, - to disable).
- Activates support for custom base logarithms (e.g., log2(4))
- Enables factorial operations (e.g., 5!, 1!+2!+3!)
Example:
expression_extended=+
`expression_functions`|`string` *optional*|Controls whether functions can be used in user inputs (+ for yes, - for no) (default: +).
- Enabled by default with + sign
- Disable with - sign when students should use alternative forms
- Affects available input options for test takers
- Supported functions include:
  * Basic: sqrt, abs, round, floor, ceil
  * Logarithmic: ln, log, log10
  * Trigonometric: sin, cos, tan, csc, sec, arcsin/asin, arccos/acos, arctan/atan
  * Hyperbolic: sinh, cosh, tanh, arcsinh/asinh, arccosh/acosh, arctanh/atanh
  * Conversions: degree2radian, radian2degree, number2binary, number2hexadecimal, roman2number, etc.
  * Two-parameter (use semicolon separator): min(a;b), max(a;b), mod(n;i), fmod(n;i), div(a;b), intdiv(a;b),
    gcd(a;b), lcm(a;b), number2base(n;b), base2number(n;b), combinations(n;k), combinations_repetition(n;k), variations(n;k), variations_repetition(n;k)
Example:
expression_functions=-  # Forces students to expand rather than use functions.
# When asked for the value of sin(pi), the user can't input sin(pi) because functions cannot be used.
`expression_random_inside`|`string` *optional*|Require values within specific intervals (format: [start-end]).
- Multiple intervals: separate with ||| (OR relationship)
- Specify per variable with &&&
- Only applicable when expression_check=RANDOM
Example:
expression_random_inside=[4-8] ||| [12-16] &&& [2-3]
`expression_random_outside`|`string` *optional*|Exclude values from specific intervals (format: [start-end]).
- Multiple intervals: separate with ||| (AND relationship)
- Specify per variable with &&&
- Only applicable when expression_check=RANDOM
Example:
expression_random_outside=[0-1] ||| [10-20] &&& [8-11]
`expression_random_range`|`string` *optional*|Define value generation ranges (format: [min-max]).
- Specify per variable with &&&
- Only applicable when expression_check=RANDOM
Example:
expression_random_range=[8-16] &&& [4-6]  # Different ranges for different variables
`expression_random_tries`|`string` *optional*|Number of validation points (default: 5).
- Only applicable when expression_check=RANDOM
- Higher values increase validation reliability but impact performance
Example:
expression_random_tries=8
`expression_random_type`|`string` *optional*|Type of generated test values (INTEGER, FLOAT).
- Specify per variable with &&&
- Only applicable when expression_check=RANDOM
Example:
expression_random_type=INTEGER &&& FLOAT  # For mixed type validation
`expression_variable`|`string` *optional*|Specifies variable names used in expressions (separate multiple variables with &&&) (default: x).
- Multiple variables can be used for multivariable expressions
- Variable names must be used consistently in answer and validation
Examples:
expression_variable=t &&& v  # For distance formula using time and velocity
`freetext_characters`|`string` *optional*|Limit the number of characters that can be entered.
- Applicable only for FREE-TEXT questions
- Format: minimum-maximum, but you can specify only a minimum or maximum as well
- Integer(s) between 0-4000
Example:
freetext_characters=100-1000
freetext_characters=10- # Minimum 10 characters
`freetext_rules`|`string` *optional*|Automatic evaluation of free text questions.
- Applicable only for FREE-TEXT questions
- Notation: {type; keywords}
- Type:
 - 1: if keywords are included within input, answer is correct (maximum points)
 - 2: if keywords are included within input, answer is wrong (0 points)
 - 3: if no keywords are included within input, answer is good (maximum points)
 - 4: if keywords are not included within input, answer is wrong (0 points)
- Keywords: comma-separated list (must not contain semicolons!)
Example:
freetext_rules={1; mitochondria, ATP, cellular respiration}
`freetext_words`|`string` *optional*|Limit the number of words that can be entered.
- Applicable only for FREE-TEXT questions
- Format: minimum-maximum, but you can specify only a minimum or maximum as well
- Integer(s) between 0-4000
Example:
freetext_words=-50 # Max. 50 words
`group`|`string` *optional*|Add a question to a question group in a Quiz set.
- If the group doesn't exist, it will be created automatically as a complex task with default settings
- Only applicable when uploading DIRECTLY to a Quiz set
- Existing group settings will not be changed when adding more questions
Example:
group=Basic_Arithmetic
`hint`|`string` *optional*|Questions to help (not solution steps, just guiding questions/notes).
- LaTeX code can be used (as described in QUESTION)
 - IMPORTANT: When using LaTeX in hints, you MUST use double dollar signs ($$...$$) for inline math or quadruple dollar signs ($$$$...$$$$) for block math.
 - Single dollar signs ($...$) are NOT supported and will not render correctly. The inline or block method must be used, as $...$ won't work!
- Specify multiple hints separated by triple-and operators ("&&&")
- Not available for test takers in exam mode
- Displayed only when explicitly requested, one by one
- Can be penalized using HINT_PENALTY
Example:
hint=Think about the relationship between radius and area &&& Remember the formula for circle area involves $\pi$ &&& Square the radius and multiply by $\pi$
`hint_penalty`|`string` *optional*|Point deduction for using hints/solutions/videos during a test.
- Format: type or type:value
- Types:
 - NONE: No penalty (default)
 - ONCE:N%: Single deduction regardless of number used
 - PER-HELP:N%: Deduction for each hint (only for HINT_PENALTY)
Examples:
hint_penalty=ONCE:20% or hint_penalty=ONCE:0.2
hint_penalty=PER-HELP:10%
solution_penalty=ONCE:50%
video_penalty=ONCE:15%
Example API call with comprehensive penalty system:
id=area_circle_parametric
type=expression
question=Find an expression for the area of a circle with radius {r}.
answer=pi*{r}^2
parameters={r; INTEGER; 2; 10}
points=10
subject=Mathematics
category=Geometry
hint=Think about the formula for circle area &&& Remember that area involves squaring the radius
solution=The formula for circle area is $$\pi r^2$$
penalty_scoring=PER_ANSWER
penalty_points=3
hint_penalty=PER-HELP:10%
solution_penalty=ONCE:50%
# Each hint used reduces score by 10%, viewing solution reduces score by 50%
`image`|`string` *optional*|Attach an image to the question.
Supported formats: PNG, JPEG, WebP
Format: filename=data, where data is either a base64-encoded image or a URL
`labels`|`string` *optional*|Categorize questions with instance-level labels.
- Pre-defined values specific to each EduBase instance
- Values controlled by instance administrators (cannot be created by users)
- Consistent across all users in an instance
- Specify multiple labels separated by triple-and operators ("&&&")
- Use cases include:
 - System-wide flags (e.g., "needs_review", "featured")
 - Quality indicators (e.g., "verified", "deprecated")
 - Processing status (e.g., "ai_generated", "manually_checked")
Example:
label=verified &&& featured
`main_category`|`string` *optional*|The name of the category (for which CATEGORY will be a subcategory).
- Empty by default, e.g. CATEGORY will be treated as the main category
- Specify multiple levels (up to 2!) by using the triple-per operator (///) with highest main category on the left
Example:
main_category=Analytic Geometry /// Vectors
`manual_scoring`|`string` *optional*|Controls when to enable manual scoring.
- Not applicable for READING and FREE-TEXT questions
- Available values:
 - NO: Never use manual scoring (default)
 - NOT_CORRECT: Only manually score incorrect answers
 - ALWAYS: Always require manual scoring
Example:
manual_scoring=NOT_CORRECT
`media_audio`|`string` *optional*|Attach an audio file to the question.
Supported formats: MP3, AAC, M4A
Format: filename=data, where data is either a base64-encoded image or a URL
`note`|`string` *optional*|The text that appears right below the question.
- Provides task-specific comments and instructions
- Visible to test takers during the quiz
- Ideal for additional guidance without cluttering the main question
Example:
note=Use standard atmospheric pressure in your calculations.
`numerical_range`|`string` *optional*|Number range (interval) question.
- Only applicable for NUMERIC questions
- Plus sign (+) to indicate YES, while blank field or minus sign (-) indicates NO (default)
- Enables interval responses with the format {from}-{to}
Example:
numerical_range=+
`options`|`string` *optional*|Incorrect options or false statements for choice-based question types.
- Required for CHOICE, MULTIPLE-CHOICE question types
- For TRUE/FALSE, these are the false statements (ANSWER contains true statements)
- Separate multiple options with triple-and operators ("&&&")
- Parameters can be used in curly braces {param_name}
- LaTeX Support (requires QUESTION_FORMAT=LATEX):
 - Inline: $$...$$
 - Block: $$$$...$$$$
 - IMPORTANT: When using LaTeX in questions, you MUST use double dollar signs ($$...$$) for inline math or quadruple dollar signs ($$$$...$$$$) for block math.
 - Single dollar signs ($...$) are NOT supported and will not render correctly. The inline or block method must be used, as $...$ won't work!
Example:
options=London &&& Berlin &&& Madrid
Example API call:
id=capital_france
type=choice
question=What is the capital of France?
answer=Paris
options=London &&& Berlin &&& Madrid
`options_fix`|`string` *optional*|Controls the arrangement of answers and options.
- Available values:
 - all: Answers appear first, followed by options
 - abc: Sort all items (answers and options) alphabetically
 - first:N: Place first N options at the end
 - last:N: Place last N options at the end
 - answers: Place all answers at the end
- Useful for maintaining consistent presentation or for specific pedagogical purposes
For alphabetical ordering:
- When migrating content from textbooks or past exams, can maintain original lettering system (a, b, c...) for:
 - Reference consistency with printed materials
 - Alignment with answer keys
 - Compatibility with existing grading systems
 - Cross-referencing with study guides
- Particularly valuable when:
 - Test takers need to refer to both digital and printed materials
 - Questions are part of a larger standardized test system
 - Maintaining consistency with existing worksheets or textbooks
 - Digitizing legacy assessment materials
Example:
options_fix=abc
Example API call:
id=fruit_types
type=multiple-choice
question=Which of these are citrus fruits?
answer=Lemon &&& Orange
options=Apple &&& Banana &&& Grape
options_fix=abc
Example API call:
id=vocab_synonyms
type=multiple-choice
question=Select all words that mean "happy":
answer=b) Joyful &&& d) Merry
options=a) Angry &&& c) Sleepy &&& e) Tired
options_fix=abc
`options_order`|`string` *optional*|Define exact presentation order of answers and options.
- Format: ANSWER:N or OPTION:N items separated by "&&&"
- ANSWER:N references the Nth provided answer
- OPTION:N references the Nth provided option
- OPTION_NONE:N references the Nth third option (for TRUE/FALSE questions)
- All answers and options must be specified exactly once
Example:
options_order=OPTION:0 &&& ANSWER:0 &&& OPTION:1 &&& ANSWER:1
Example API call to create a chronologically ordered timeline
id=historical_chronology
type=multiple-choice
question=Which of these events occurred during the Industrial Revolution (1760-1840)?
answer=Invention of the Steam Engine &&& First Steam Locomotive &&& First Commercial Railway
options=Printing Press Invented &&& First Electric Light Bulb &&& First Powered Flight
options_order=OPTION:0 &&& ANSWER:0 &&& ANSWER:1 &&& ANSWER:2 &&& OPTION:1 &&& OPTION:2
`parameters`|`string` *optional*|Parameter definitions for dynamic question generation.
One of EduBase's most powerful features, allowing creation of dynamic questions where each user gets a unique variant of the same question.
- Separate multiple parameters with triple-and operators ("&&&")
- Up to 128 parameters can be defined
Parameter Types:
1. FIX (Fixed Value):
 - Format: {name; FIX; value}
 - Sets a predefined constant value (integer or fraction)
 - Example: {pi; FIX; 3.1415}
2. INTEGER (Whole Numbers):
 - Simple: {name; INTEGER}
 - Extended: {name; INTEGER; min; max}
 - Full: {name; INTEGER; min; max; inside; outside}
 - Generate random integers within specified ranges
 - Use '-' for omitting min/max values
 - Examples:
  * {p; INTEGER} - any integer
  * {p; INTEGER; 10; 20} - integer between 10 and 20 (inclusive)
  * {p; INTEGER; -; -; [10-20]; [12-14] ||| [16-18]} - integer between 10-20, excluding 12-14 and 16-18
3. FLOAT (Decimal Numbers):
 - Simple: {name; FLOAT; precision}
 - Extended: {name; FLOAT; precision; min; max}
 - Full: {name; FLOAT; precision; min; max; inside; outside}
 - Generate random decimal numbers
 - Specify precision (decimal places)
 - Examples:
  * {p; FLOAT; 2} - float with 2 decimal places
  * {p; FLOAT; 5; 0; 1} - float between 0 and 1 with 5 decimals
  * {p; FLOAT; 1; 0; 10; -; [0-1]} - float between 0-10 excluding 0-1, with 1 decimal
4. FORMULA (Expressions):
 - Simple: {name; FORMULA; formula}
 - Full: {name; FORMULA; formula; precision}
 - Define parameters based on other parameters
 - Examples:
  * {d; FORMULA; {b}^2-4*{a}*{c}} - quadratic formula discriminant
  * {p; FORMULA; 2*{q}+1} - linear expression
5. LIST (Random Selection):
 - Format: {name; LIST; value1; value2; value3; ...}
 - Randomly select from predefined values
 - Up to 64 elements
 - Examples:
  * {primes; LIST; 2; 3; 5; 7; 11}
  * {animals; LIST; dog; cat; snake; camel}
6. PERMUTATION:
 - Format: {name; PERMUTATION; value1; value2; value3; ...}
 - Creates permutated parameters accessible as {name_1}, {name_2}, etc.
 - Example: {p; PERMUTATION; A; B; C; D}
  * So {p_1} will be a different letter than {p_2}
 - Example: {primes; PERMUTATION; 2; 3; 5; 7}
  * So both {primes_1} and {primes_2} will be different single digit primes
7. FORMAT:
 - Format: {name; FORMAT; parameter; type; ...}
 - Format parameters based on other parameters
 - Supported types: NUMBER, NUMERTEXT, ROMAN
 - Optional extra parameters based on type
  * NUMBER
   * precision: number of decimal places
 - Examples:
  * {pp; FORMAT; p; NUMBER; 1} - format as number rounded to 1 decimal
  * {pp; FORMAT; p; NUMBERTEXT} - format number as text
  * {pp; FORMAT; p; ROMAN} - format number as Roman numeral
Best Practices:
 - Order parameters so dependent ones come later
 - Use simple notation when possible
 - Avoid unnecessary parameters
 - Use CONSTRAINTS field to ensure valid combinations
Examples:
parameters={pi; FIX; 3.14159} &&& {r; INTEGER; 1; 10}
parameters={a; INTEGER; 1; 5} &&& {b; INTEGER; -10; 10} &&& {c; INTEGER; -10; 10} &&& {d; FORMULA; {b}^2-4*{a}*{c}}
parameters={country; LIST; France; Germany; Italy} &&& {capital; LIST; Paris; Berlin; Rome}
parameters_sync=+  # Ensures each country is paired with its correct capital
`parameters_sync`|`string` *optional*|Controls synchronization of LIST parameter selections.
- Plus sign (+) to indicate YES
- Blank field or minus sign (-) indicates NO (default)
- When enabled, the Nth value from each LIST is selected together
- Critical for paired data like countries and capitals
Example:
parameters_sync=+
Example API call:
id=capital_city
type=text
question=What is the capital city of {country}?
answer={capital}
parameters={country; LIST; France; Germany; Italy} &&& {capital; LIST; Paris; Berlin; Rome}
parameters_sync=+
`path`|`string` *optional*|Path where question will be stored in personal QuestionBase.
- Default: /API
- Supports hierarchical structure with forward slashes
- Always start with a forward slash!
Example:
path=/Mathematics/Calculus/Derivatives
`penalty_points`|`string` *optional*|Points deducted for completely incorrect answers.
- No penalty applied if answer is partially correct
- No penalty for empty/unanswered questions
- Use positive values (recommended)
Example:
penalty_points=2
Example API call with penalties:
id=physics_multiple_choice
type=multiple-choice
question=Which of the following are forms of energy? Select all that apply.
answer=Kinetic &&& Potential &&& Thermal
options=Velocity &&& Acceleration
points=3
penalty_scoring=PER_QUESTION
penalty_points=1
`penalty_scoring`|`string` *optional*|Controls how penalty points should be applied.
- Available values:
 - DEFAULT: Standard penalty application, which might vary by question type (default)
 - PER_ANSWER: Apply penalties for each incorrect answer
 - PER_QUESTION: Apply penalties once per question
Example:
penalty_scoring=PER_ANSWER
`points`|`string` *optional*|Maximum points for a fully correct answer.
- Default: 1 point
- For questions with multiple answers, partial credit is possible based on SUBSCORING method
Example:
points=10
`private_note`|`string` *optional*|Private notes (not shown to test takers).
- Internal documentation for question creators and editors
- Useful for documenting question creation rationale
- Track modification history, common mistakes, related questions
Example:
private_note=Created from Chapter 3 exam, 2023 edition. Students often forget to convert units.
`question_format`|`string` *optional*|Controls question text rendering.
- NORMAL: Default text formatting with standard font size, recommended for most tasks
- LATEX: Enables LaTeX for mathematical, scientific notations (using KaTeX)
- LONG: Smaller font with automatic paragraph breaks (ideal for lengthy text)
Example:
question_format=LATEX
`solution`|`string` *optional*|Step-by-step solution.
- LaTeX code can be used (as described in QUESTION)
 - IMPORTANT: When using LaTeX in solution, you MUST use double dollar signs ($$...$$) for inline math or quadruple dollar signs ($$$$...$$$$) for block math.
 - Single dollar signs ($...$) are NOT supported and will not render correctly. The inline or block method must be used, as $...$ won't work!
- Specify multiple solution steps separated by triple-and operators ("&&&")
- Each step is displayed one at a time
- Can be penalized using SOLUTION_PENALTY
- Not available in exam mode
Example:
solution=Using the power rule, we differentiate each term: &&& For $x^2$: $\frac{d}{dx}(x^2) = 2x$ &&& For $x$: $\frac{d}{dx}(x) = 1$ &&& The constant term disappears: $\frac{d}{dx}(5) = 0$ &&& Therefore, $\frac{d}{dx}(x^2 + x + 5) = 2x + 1$
`solution_image`|`string` *optional*|Attach an image to the solution steps.
Supported formats: PNG, JPEG, WebP
Format: filename=data, where data is either a base64-encoded image or a URL
`solution_penalty`|`string` *optional*|Similar to HINT_PENALTY
Point deduction for viewing steps of the solution (NONE, ONCE:N%) (default: NONE)
`source`|`string` *optional*|Specify source of question content (not shown to test takers).
- Use cases include training material sources, documentation references, content attribution
- Important for tracking question origins and copyright compliance
Example:
source=Mathematics Textbook Chapter 5, Page 123
source=Company Safety Manual 2023, Section 3.4.2
`subject`|`string` *optional*|Subject classification for organizing questions.
- Provides primary categorization for content organization
- Use the question editor in the EduBase UI for an up-to-date list of possible values
Example:
subject=Mathematics
category=Algebra
`subpoints`|`string` *optional*|Define specific point values for each answer in percentages.
- Only used when subscoring=CUSTOM
- Specify percentage values separated by triple-and operators ("&&&")
- Not applicable for CHOICE, READING and FREE-TEXT questions
- Values should sum to 100 (for percentage)
Example:
subpoints=50 &&& 25 &&& 25
Example meaning: For a 10-point question with three answers:
- First answer: 5 points (50%)
- Second answer: 2.5 points (25%)
- Third answer: 2.5 points (25%)
`subscoring`|`string` *optional*|Method for calculating partial credit for partially correct answers.
- Not applicable for CHOICE, READING and FREE-TEXT questions
- Available values:
 - PROPORTIONAL: Points awarded proportionally to correct answers (default)
 - LINEAR_SUBSTRACTED:N: Linear scoring with N points subtracted for each error
 - CUSTOM: Use custom point distribution defined in SUBPOINTS field
 - NONE: No partial credit, all-or-nothing scoring
Example:
subscoring=LINEAR_SUBSTRACTED:2
Example API call:
id=math_problem
type=numerical
question=What is the sum and product of {a} and {b}?
answer={a}+{b} &&& {a}*{b}
parameters={a; INTEGER; 1; 100} &&& {b; INTEGER; 1; 100}
points=4
subscoring=CUSTOM
subpoints=25 &&& 75
`tags`|`string` *optional*|Tag questions with custom user-defined tags.
- Use ID or code of pre-registered tags
- Only previously registered tags can be used (must be pre-registered in EduBase UI)
- Specify multiple tags separated by triple-and operators ("&&&")
- User-controlled categorization that can be created at user or organization level
- Use cases include:
 - Personal content organization (e.g., "My Calculus Questions", "Spring 2024")
 - Department-level categorization (e.g., "IT Department", "CS101")
 - Custom taxonomies for specialized content organization
- Tags are flexible, customizable, and searchable in the UI
Example:
tags=Algebra &&& High School &&& Exam Prep
`tolerance`|`string` *optional*|Evaluation tolerance method.
- Applicable only for NUMERIC / EXPRESSION / MATRIX / MATRIX:EXPRESSION / SET questions
- Notation: type or type:value
- Types:
 - ABSOLUTE: maximum difference between answer and user input
   * Example: ABSOLUTE:0.1
 - RELATIVE: maximum difference in percentage (symmetric mean absolute percentage error, SMAP value is used)
   * Example: RELATIVE:5% or RELATIVE:0.05
 - QUOTIENT: integer multiple / QUOTIENT2: scalar multiple
   * Example: QUOTIENT or QUOTIENT2:SYNCED
Example:
tolerance=ABSOLUTE:0.01
`truefalse_third_options`|`string` *optional*|Activate the third option for TRUE/FALSE questions.
- Plus sign (+) to display the third option OR
- Specify options separated by triple-and operators ("&&&") to automatically enable the feature
- Parameters can be used in curly braces {param_name}
Example:
truefalse_third_options=Cannot be determined from the information given &&&Not applicable
`truefalse_third_options_label`|`string` *optional*|Label of the third option for TRUE/FALSE questions.
- If blank, the text "none" is displayed (default)
- Only applicable when TRUEFALSE_THIRD_OPTIONS is enabled
Example:
truefalse_third_options_label=Not enough information
`video_penalty`|`string` *optional*|Similar to HINT_PENALTY
Point deduction for video assistance used (NONE, ONCE:N%) (default: NONE)

---
#### Tool: **`edubase_post_quiz`**
Create a new Quiz set. Quiz sets are collections of questions that can be used for practice or to power multiple Exams.
Parameters|Type|Description
-|-|-
`title`|`string`|title of the Quiz set
`description`|`string` *optional*|short description
`language`|`string` *optional*|desired Quiz set language
`mode`|`string` *optional*|Sets how questions are displayed during the Quiz. (default: TEST)
- TEST: all questions are displayed at once, user can answer them in any order and switch between them
- TURNS: questions are displayed one by one, only one question is visible at a time and the user must answer it before moving to the next question

`type`|`string` *optional*|Type of the Quiz set. (default: set)
- set: for practice purposes
- exam: for exam purposes
- private: for private purposes (e.g testing)


---
#### Tool: **`edubase_post_quiz_permission`**
Create new permission for a user on a quiz.
Parameters|Type|Description
-|-|-
`permission`|`string`|permission level (view / control / modify / grant / admin)
`quiz`|`string`|quiz identification string
`user`|`string`|user identification string

---
#### Tool: **`edubase_post_quiz_questions`**
Assign question(s) to a Quiz set, or one of its question group. Questions can exist independently from Quiz sets.
Parameters|Type|Description
-|-|-
`questions`|`string`|comma-separated list of question identification strings
`quiz`|`string`|quiz identification string
`group`|`string` *optional*|question group title

---
#### Tool: **`edubase_post_quiz_tag`**
Attach tag to a Quiz.
Parameters|Type|Description
-|-|-
`quiz`|`string`|quiz identification string
`tag`|`string`|tag identification string

---
#### Tool: **`edubase_post_scorm_permission`**
Create new permission for a user on a SCORM learning material.
Parameters|Type|Description
-|-|-
`permission`|`string`|permission level (view / control / modify / grant / admin)
`scorm`|`string`|SCORM identification string
`user`|`string`|user identification string

---
#### Tool: **`edubase_post_scorm_tag`**
Attach tag to a SCORM learning material.
Parameters|Type|Description
-|-|-
`scorm`|`string`|SCORM identification string
`tag`|`string`|tag identification string

---
#### Tool: **`edubase_post_tag_permission`**
Create new permission for a user on a tag.
Parameters|Type|Description
-|-|-
`permission`|`string`|permission level (view / control / modify / grant / admin)
`tag`|`string`|tag identification string
`user`|`string`|user identification string

---
#### Tool: **`edubase_post_user`**
Create new EduBase user account.
Parameters|Type|Description
-|-|-
`email`|`string`|valid email address
`first_name`|`string`|first name (1-64 characters)
`last_name`|`string`|last name (1-64 characters)
`username`|`string`|username (4-64 characters)
`birthdate`|`string` *optional*|date of birth
`color`|`string` *optional*|desired favorite color (default/branding/red/blue/yellow/green/purple) (default: default)
`display_name`|`string` *optional*|override automatic display name (1-255 characters)
`exam`|`boolean` *optional*|user is only allowed to login when accessing exams (default: false)
`full_name`|`string` *optional*|override automatic full name (1-255 characters)
`gender`|`string` *optional*|gender ("male", "female", or "other")
`group`|`string` *optional*|name of the user group (requires admin permissions)
`language`|`string` *optional*|desired account language (default: API application owner's language)
`must_change_password`|`boolean` *optional*|user is forced to change password on first login (default: false)
`notify`|`boolean` *optional*|notify user via email (or SMS) (default: false)
`password`|`string` *optional*|password (4-64 characters) (default: initial random password is automatically generated)
`phone`|`string` *optional*|valid phone number in format "+prefix number" without special characters
`template`|`string` *optional*|a template ID for the new account (default: none)
`timezone`|`string` *optional*|desired timezone (default: API application owner's timezone)

---
#### Tool: **`edubase_post_user_assume`**
Assume user for next requests with assume token.
Parameters|Type|Description
-|-|-
`user`|`string`|user identification string, username or email address
`password`|`string` *optional*|password or user secret

---
#### Tool: **`edubase_post_user_classes`**
Assign user to class(es). Updates membership if already member of a class.
Parameters|Type|Description
-|-|-
`classes`|`string`|comma-separated list of class identification strings
`user`|`string`|user identification string
`expires`|`string` *optional*|expiry in days or YYYY-MM-DD HH:ii:ss
`notify`|`boolean` *optional*|notify user (default: false)

---
#### Tool: **`edubase_post_user_group`**
Update a user's group.
Parameters|Type|Description
-|-|-
`group`|`string`|user group code
`user`|`string`|user identification string

---
#### Tool: **`edubase_post_user_login`**
Generate login link. If a valid link with the same settings exists, it will be returned instead of creating a new one.
Parameters|Type|Description
-|-|-
`user`|`string`|user identification string
`expires`|`string` *optional*|expiry in days (1-30) or YYYY-MM-DD (default: 1 day)
`logins`|`number` *optional*|total count the link can be used to login users (default: 1)
`redirect`|`string` *optional*|redirect after a successful login (URI path or [{content_type}:{tag}])
`short`|`boolean` *optional*|generate shortened (eduba.se) link (only if feature is enabled on EduBase) (default: false)
`template`|`string` *optional*|a template ID for the login link

---
#### Tool: **`edubase_post_user_name`**
Update a user's name.
Parameters|Type|Description
-|-|-
`first_name`|`string`|first name (1-64 characters)
`last_name`|`string`|last name (1-64 characters)
`user`|`string`|user identification string
`display_name`|`string` *optional*|display name (1-255 characters)
`full_name`|`string` *optional*|full name (1-255 characters)

---
#### Tool: **`edubase_post_user_organizations`**
Assign user to organization(s). Updates membership if already member of an organization.
Parameters|Type|Description
-|-|-
`organizations`|`string`|comma-separated list of organization identification strings
`user`|`string`|user identification string
`department`|`string` *optional*|optional name of department
`notify`|`boolean` *optional*|notify user (default: false)
`permission_content`|`string` *optional*|optional permission level to contents in organization (none / view / control / modify / grant / admin) (default: none)
`permission_organization`|`string` *optional*|optional permission level to organization (member / teacher / supervisor / admin) (default: member)

---
#### Tool: **`edubase_post_video_permission`**
Create new permission for a user on a video.
Parameters|Type|Description
-|-|-
`permission`|`string`|permission level (view / control / modify / grant / admin)
`user`|`string`|user identification string
`video`|`string`|video identification string

---
#### Tool: **`edubase_post_video_tag`**
Attach tag to a video.
Parameters|Type|Description
-|-|-
`tag`|`string`|tag identification string
`video`|`string`|video identification string

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "edubase": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "EDUBASE_API_APP",
        "-e",
        "EDUBASE_API_URL",
        "-e",
        "EDUBASE_API_KEY",
        "mcp/edubase"
      ],
      "env": {
        "EDUBASE_API_APP": "YOUR_EDUBASE_API_APP",
        "EDUBASE_API_URL": "YOUR_EDUBASE_API_URL",
        "EDUBASE_API_KEY": "YOUR_EDUBASE_API_KEY"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)
