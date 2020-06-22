import { atom, selector } from 'recoil';

import { getComments, getIssues, getRepoDetails } from '../services/github';

// An atom is a unit of state. The default value is the initial state. Note that we cannot use
// promises for a default value (we use selectors for that).
export const displayState = atom({
  key: 'displayState',
  default: {
    org: 'facebook',
    repo: 'react',
    page: 1,
    displayType: 'issues',
    issueId: null,
  },
});

// All of the selectors here are read-only, but they update based on changes to `displayState`.
// Note that selectors can be writeable if they have a `set` method.
export const repoState = selector({
  key: 'repoState',
  get: async ({ get }) => {
    // This state will update automatically when `displayState` changes.
    const { org, repo } = get(displayState);
    const { open_issues_count: openIssuesCount } = await getRepoDetails(org, repo);

    // I'm returning an object just to be consistent with other atoms and selectors.
    return {
      openIssuesCount,
    };
  },
});

export const issuesState = selector({
  key: 'issuesState',
  get: async ({ get }) => {
    const { org, repo, page } = get(displayState);
    const { pageLinks, pageCount, issues } = await getIssues(org, repo, page);

    const ids = issues.map((issue) => issue.number).sort((a, b) => b - a);
    const entities = {};

    issues.forEach((issue) => {
      entities[issue.number] = issue;
    });

    return {
      ids,
      entities,
      pageCount,
      pageLinks,
    };
  },
});

export const commentsState = selector({
  key: 'commentsState',
  get: async ({ get }) => {
    const { issueId } = get(displayState);
    const { entities } = get(issuesState);
    const { comments_url: commentsUrl } = entities[issueId];
    const comments = await getComments(commentsUrl);

    return {
      comments,
    };
  },
});
