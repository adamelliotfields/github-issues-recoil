import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useRecoilValue } from 'recoil';

import RepoSearchForm from './RepoSearchForm';
import IssuesListPage, { IssuesListPageLoading, IssuesListPageError } from './IssuesListPage';
import IssueDetailsPage, {
  IssueDetailsPageLoading,
  IssueDetailsPageError,
} from './IssueDetailsPage';

import { displayState } from '../states';

function App() {
  const { org, repo, page, displayType, issueId } = useRecoilValue(displayState);

  if (displayType === 'issues') {
    return (
      <div className="container-md mt-3 px-3 px-md-0">
        <div className="clearfix">
          <div className="col-12 mb-3">
            <h1 className="text-center mb-3">GitHub Issues</h1>
            <RepoSearchForm />
          </div>

          <div className="col-12 mt-2">
            <ErrorBoundary
              // Reset keys are compared using Object.is, so we can't pass the display object.
              resetKeys={[org, repo, page]}
              fallbackRender={({ error }) => <IssuesListPageError error={error} />}
            >
              <Suspense fallback={<IssuesListPageLoading />}>
                <IssuesListPage />
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>
      </div>
    );
  }

  if (displayType === 'comments') {
    return (
      <div className="container-md">
        <div className="clearfix">
          <div className="col-12 mt-0 mt-md-3">
            <ErrorBoundary
              resetKeys={[displayType, issueId]}
              fallbackRender={({ error }) => (
                <IssueDetailsPageError issueId={issueId} error={error} />
              )}
            >
              <Suspense fallback={<IssueDetailsPageLoading issueId={issueId} />}>
                <IssueDetailsPage issueId={issueId} />
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default App;
