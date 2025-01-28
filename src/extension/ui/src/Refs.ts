// Example ref: ref: github:docker/labs-ai-tools-for-devs?ref=main&path=prompts/npm-project.md

export class Ref {
    provider: string;
    repository: string;
    ref: string;
    path: string;

    constructor(provider: string, repository: string, ref: string, path: string) {
        this.provider = provider;
        this.repository = repository;
        this.ref = ref;
        this.path = path;
    }

    static fromRef(refStr: string) {
        const [provider, uri] = refStr.split(':');
        const [repo, queryString] = uri.split('?');
        // Parse path query params
        const params = queryString.split('&').map(param => param.split('='));
        const ref = params.find(param => param[0] === 'ref')?.[1] || 'main';
        const path = params.find(param => param[0] === 'path')?.[1] || '';
        return new Ref(provider, repo, ref, path);
    }

    toRef() {
        return `${this.provider}:${this.repository}?ref=${this.ref}&path=${this.path}`;
    }

    toURL(plain: boolean = false) {
        let baseUrl = ''
        switch (this.provider) {
            case 'github':
                baseUrl = 'https://github.com';
                break;
            case 'gitlab':
                baseUrl = 'https://gitlab.com';
                break;
            case 'bitbucket':
                baseUrl = 'https://bitbucket.org';
                break;
            default:
                throw new Error(`Unsupported provider: ${this.provider}`);
        }
        return `${baseUrl}/${this.repository}/blob/${this.ref}/${this.path}${plain ? '?plain=1' : ''}`;
    }
}