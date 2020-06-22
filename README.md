# `github-issues-recoil`

This is the GitHub Issues app from the Redux Toolkit advanced tutorial re-written using Facebook's
new [Recoil]() library (and GitHub's [Primer]() CSS).

The only references I used were [Dave McCabe's presentation from React Europe](https://www.youtube.com/watch?v=_ISAA_Jt9kI)
and the Recoil documentation. Because this is a new library only used in production internally at
Facebook, I have no idea what the community best practices are. Also, I'm only using the core
features of the Recoil API (nothing advanced). That being said, I'm pretty happy with it!

## Introduction

Recoil is a new state management library from Facebook. Unlike Redux and MobX, it only works with
React. Also unlike Redux and MobX, it works with React Suspense out of the box. Of all the state
management libraries out there, Recoil feels the most _react native_ by far.

> _As an aside, I have no experience using Redux or MobX with Suspense. As far as I know, Relay is the only other mainstream library to support Suspense out of the box._

In Recoil, you're creating a data-flow graph using _atoms_ and _selectors_. An atom is a unit of
state and it cannot be a Promise or Observable or any other asynchronous value. A selector is
derived state. The selector subscribes to atoms or other selectors and automatically updates when
those dependencies change.

If a React component reads an atom or selector, it will automatically update when the state changes.
This is the same way React's `useState` hook works.

In this app, we have one atom that represents the `display` state (the current org, repo, page
number, and page type). We then have three selectors for `repo`, `issues`, and `comments` state.

We never manually update selectors (although you can). Instead, our selectors update whenever the
`display` atom changes. For example, if we change the currently displayed repo, the `repo` selector
will fetch the number of open issues for that repo from the GitHub API and the `issues` selector
will fetch the latest 25 issues for that repo. The `IssuesListPage` will then update to show the
information for the new repo. This is extremely declarative as we are just instructing our app what
to display and not how to display it.

For displaying loading and error states, we rely on React's Suspense and Error Boundary components.
Typically in React applications, you'd have `isLoading` and `hasError` variables and somewhere in
your `render` method you'd check those variables to determine what to display. Because Recoil works
with Suspense out of the box, our "loading" component will be displayed until the promises returned
from both our selectors resolve. If one of the promises reject, our Error Boundary component will be
rendered instead. Again, this is very declarative.

Recoil does not require you to use Suspense. However, I feel that native integration with Suspense
is one of Recoil's killer features.

## Getting Started

Because we are using the GitHub API (read-only), you'll need to put a GitHub API token in
`.env.local` like this:

```
REACT_APP_GITHUB_API_TOKEN=
```

Because this is just a standard Create React App project, just run `npm install` and `npm start` to
start the local development server.

You'll get a warning in your browser's developer tools saying
`Cannot update a component ('Batcher')...`, but you can ignore this.

Note that I tried to build the app in as few components as possible as it's easier to prototype that
way. At work you would break this up into hundreds of files spanning dozens of cryptically-named
folders :stuck_out_tongue_winking_eye:
