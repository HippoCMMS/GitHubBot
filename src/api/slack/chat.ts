import { WebClient } from '@slack/web-api';
import { SLACK_TOKEN } from '../../env';

export interface IPostMessageParams {
    channel: string;
    text: string;
}

export const postMessage = async (params: IPostMessageParams) => {
    const web = new WebClient(SLACK_TOKEN);
    return await web.chat.postMessage({
        text: params.text,
        channel: params.channel,
        as_user: false,
        username: "Felipe The Bot",
        icon_url: "https://avatars3.githubusercontent.com/u/43920726?s=460&u=530161e00b65e7f9328d06bf835cf6662e45708f&v=4"
    });
}