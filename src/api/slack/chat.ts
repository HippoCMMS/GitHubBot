import { WebClient } from '@slack/web-api';
import { SLACK_TOKEN } from '../../env';

export const maxMessageLength = 128;
export const BotUsername = "Felipe the Bot";
export const FelipeIcon = "https://avatars3.githubusercontent.com/u/43920726?s=460&u=530161e00b65e7f9328d06bf835cf6662e45708f&v=4";

export interface IPRMessageParams {
    channel: string;
    author: string;
    number: number;
    notificationText: string;
    messageText: string;
    url: string;
    title: string;
    description: string;
    repository: string;
}

export interface IPostMessageParams {
    channel: string;
    text: string;
    defaultUser: boolean;
    username: string;
    iconUrl: string;
    blocks: any[];
}

export const createMessage = (params: IPRMessageParams): IPostMessageParams => {
    var desc = params.description;
    if (params.description.length > maxMessageLength)
        desc = params.description.substring(0, maxMessageLength-3) + "...";

    return {
        channel: params.channel,
        text: params.notificationText,
        defaultUser: false,
        username: BotUsername,
        iconUrl: FelipeIcon,
        blocks: [{
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": `_<!here> ${params.messageText}_\n*${params.title} (${params.repository} #${params.number})*\n>${desc}`
            },
            "accessory": {
                "type": "button",
                "text": {
                    "type": "plain_text",
                    "text": "Review",
                    "emoji": true
                },
                "style": "primary",
                "url": params.url
           }
        }]
    };
}

export const postMessage = async (params: IPostMessageParams) => {
    const web = new WebClient(SLACK_TOKEN);

    let message = {
        text: params.text,
        channel: params.channel,
        as_user: params.defaultUser,
        username: params.username,
        icon_url: params.iconUrl,
        blocks: params.blocks
    };

    return await web.chat.postMessage(message);
}
