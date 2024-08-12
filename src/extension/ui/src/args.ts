export const getRunArgs = (prompt_ref: string, project_dir: string, username: string, platform: string) => {
    // docker run --rm \
    // -it \
    // -v /var/run/docker.sock:/var/run/docker.sock \
    // --mount type=volume,source=docker-prompts,target=/prompts \
    // --mount type=bind,source=$HOME/.openai-api-key,target=/root/.openai-api-key \
    // vonwig/prompts:latest \
    //                       run \
    //                       $PWD \
    //                       $USER \
    //                       "$(uname -o)" \
    //                       "github:docker/labs-githooks?ref=main&path=prompts/git_hooks"
    return [
        '--rm',
        '-v',
        '/var/run/docker.sock:/var/run/docker.sock',
        '-v',
        'openai_key:/root',
        '--mount',
        'type=volume,source=docker-prompts,target=/prompts',
        'vonwig/prompts:latest',
        'run',
        project_dir,
        username,
        platform,
        prompt_ref
    ];

}