# Pulling prompt files from GitHub

Prompts can be fetched from a GitHub repository when using the `--prompts` arg.  The mandatory parts of the ref are `github:{owner}/{repo}` 
but optional `path` and `ref` can be added to pull prompts from branches, and to specify where the prompt file is located in the repo.  Here are some examples of valid refs
	- `github:docker/labs-githooks?ref=main&path=prompts/git_hooks`
	- `github:docker/labs-ai-tools-for-devs?path=prompts/hub/qrencode.md`
	-