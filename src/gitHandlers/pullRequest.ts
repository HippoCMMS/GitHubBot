import IPullRequestEvent from "../interfaces/IPullRequestEvent";
import EBranch from "../enums/EBranch";
import { deleteBranch } from "../api/branch";
import { createReviewRequest, addComment, approvePR } from "../api/pullRequest";
import { ENABLE_PR_QUOTES } from "../env";
import { getMembers } from "../api/teams";
import { postMessage, createMessage } from "../api/slack/chat";
const appSettings = require("../../appSettings.json");
const prQuotes = require("../../prQuotes.json");
const slackQuotes = require("../../slackQuotes.json");

export const pullRequest = async ({
  action,
  pull_request,
}: IPullRequestEvent) => {
  switch (action) {
    case "closed":
      if (pull_request.merged) {
        const {
          head: {
            ref,
            repo: { name: repository, owner },
          },
        } = pull_request;
        if (
          ref === EBranch.develop ||
          ref === EBranch.release ||
          ref === EBranch.master
        )
          return;
        await deleteBranch(owner.login, repository, ref);
      }
      break;
    case "opened":
    case "reopened":
    case "synchronize":
      const {
        head: {
          ref,
          repo: { name, owner },
        },
        html_url,
        title,
        body,
        number,
        user,
      } = pull_request;
      const getDevelopmentMembers = await getMembers();

      await createReviewRequest({
        owner: owner.login,
        repository: name,
        number,
        reviewers: [
          ...getDevelopmentMembers
            .map((u) => u.login)
            .filter((u) => u !== user.login),
        ],
      });

      if (appSettings.approve_prs.includes(user.login)) {
        await approvePR({
          owner: owner.login,
          repository: name,
          issueNumber: number,
        });
      }

      if (action !== "opened") break;

      let quote = GetQuote(slackQuotes.quotes);
      let text = quote.replace("user", pull_request.user.login);
      let message = createMessage({
        channel: "hippo_devs",
        author: pull_request.user.login,
        number: pull_request.number,
        title: pull_request.title,
        description: pull_request.body,
        url: pull_request.html_url,
        messageText: text,
        repository: pull_request.head.repo.name,
        notificationText: "<!here> A new Pull Request is ready for review",
      });
      postMessage(message);

      if (ENABLE_PR_QUOTES && prQuotes.coolCats.includes(user.login)) {
        let quote = GetQuote(prQuotes.quotes);
        await addComment({
          owner: owner.login,
          repository: name,
          issueNumber: number,
          comment: quote,
        });
      }
      break;
  }
};

function GetQuote(quotes: string[]): string {
  const pos = Math.floor(Math.random() * quotes.length);
  return quotes[pos];
}
