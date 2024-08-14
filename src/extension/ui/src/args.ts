export const getRunArgs = (prompt_ref: string, project_dir: string, username: string, platform: string) => {
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
        "--host-dir", project_dir,
        "--user", username,
        "--platform", platform,
        "--prompts", prompt_ref,
        '--jsonrpc'
    ];
}