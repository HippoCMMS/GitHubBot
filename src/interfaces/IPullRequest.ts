export default interface IPullRequest {
    number: number;
    html_url: string;
    head: {
        ref: string; // without refs/heads
        repo: {
            name: string;
            owner: {
                login: string;
            }
        }
    },
    base: {
        ref: string; // without refs/heads
    },
    merged: boolean,
    user: {
        login: string;
    }
}