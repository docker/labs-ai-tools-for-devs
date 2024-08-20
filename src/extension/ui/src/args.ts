export const getRunArgs = (promptRef: string, projectDir: string, username: string, platform: string, render = false) => {
    const isLocal = promptRef.startsWith('local://');
    let promptArgs: string[] = ["--prompts", promptRef];
    let mountArgs: string[] = [];

    if (isLocal) {
        const localPromptPath = promptRef.replace('local://', '');
        const pathSeparator = platform === 'win32' ? '\\' : '/';
        promptRef = localPromptPath.split(pathSeparator).pop() || 'unknown-local-prompt';
        promptArgs = ["--prompts-dir", `/app/${promptRef}`];
        mountArgs = ["--mount", `type=bind,source=${localPromptPath},target=/app/${promptRef}`];
    }

    const baseArgs: string[] = [
        '--rm',
        '-v', '/var/run/docker.sock:/var/run/docker.sock',
        '-v', 'openai_key:/root',
        '--mount', 'type=volume,source=docker-prompts,target=/prompts'
    ];

    const runArgs: string[] = render ? [] : [
        'vonwig/prompts:latest',
        ...(render ? [] : ['run']),
        "--host-dir", projectDir,
        "--user", username,
        "--platform", platform,
        ...promptArgs,
        '--jsonrpc'
    ];

    return [...baseArgs, ...mountArgs, ...runArgs];
}
