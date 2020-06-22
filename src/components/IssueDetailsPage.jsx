import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useRecoilState, useRecoilValue } from 'recoil';

import IssueLabels from './IssueLabels';
import UserWithAvatar from './UserWithAvatar';

import { commentsState, displayState, issuesState } from '../states';

import { renderHtmlFromMarkdown } from '../utils';

// eslint-disable-next-line react/prop-types
export function IssueDetailsPageLoading({ issueId }) {
  return (
    <div className="Box border-0 border-md border-gray-dark">
      <div className="Box-header">
        <h2 className="Box-title f2">
          {`Loading issue #${issueId}`}
          <span className="AnimatedEllipsis" />
        </h2>
      </div>
    </div>
  );
}

// eslint-disable-next-line react/prop-types
export function IssueDetailsPageError({ issueId, error }) {
  return (
    <div className="Box border-0 border-md border-gray-dark mb-0 mb-md-3">
      <div className="Box-header">
        <h2 className="Box-title f2 mb-2">{`Could not load issue #${issueId}`}</h2>
        <div className="clearfix">
          <div className="col-3 float-left">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => window.location.reload()}
            >
              Reload
            </button>
          </div>
        </div>
      </div>
      <div className="Box-body border-0">
        <pre>{error.toString()}</pre>
      </div>
    </div>
  );
}

function IssueDetailsPage({ issueId }) {
  const [display, setDisplay] = useRecoilState(displayState);
  const { entities } = useRecoilValue(issuesState);
  const { comments } = useRecoilValue(commentsState);

  const issue = entities[issueId];

  const showIssuesList = () => {
    setDisplay({ ...display, displayType: 'issues', issueId: null });
  };

  useEffect(() => {
    window.scrollTo({ top: 0 });
  });

  // eslint-disable-next-line
  return (
    <div className="Box border-0 border-md border-gray-dark mb-3">
      <div className="Box-header">
        <h2 className="Box-title f2 mb-2">
          {issue.title}
          <span className="text-small text-gray text-bold ml-2">{`#${issue.number}`}</span>
        </h2>
        <div className="clearfix">
          <div className="col-3 float-left">
            <button type="button" className="btn btn-outline" onClick={showIssuesList}>
              Back to Issues List
            </button>
          </div>
          <div className="col-9 float-right">
            <UserWithAvatar user={issue.user} style={{ float: 'right' }} />
          </div>
        </div>
      </div>

      <div className="Box-body border-0">
        <div className="clearfix mb-2">
          <div className="col-2 float-left">
            <span className="State State--green">{issue.state}</span>
          </div>
          {issue?.labels?.length > 0 && (
            <div className="col-10 float-right">
              <div className="float-right">
                <IssueLabels labels={issue.labels} />
              </div>
            </div>
          )}
        </div>

        {issue?.body?.length > 0 && (
          <div
            className="markdown-body mb-4"
            dangerouslySetInnerHTML={{
              __html: renderHtmlFromMarkdown(issue.body),
            }}
          />
        )}

        {comments?.length > 0 && (
          <ul>
            {comments.map((comment) => (
              <li key={comment.id} className="Box-row">
                <div className="clearfix">
                  <div className="col-2 float-left text-center mt-2">
                    <UserWithAvatar user={comment.user} />
                  </div>

                  <div className="col-10 float-right">
                    <div
                      className="markdown-body"
                      dangerouslySetInnerHTML={{
                        __html: renderHtmlFromMarkdown(comment.body),
                      }}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

IssueDetailsPage.propTypes = {
  issueId: PropTypes.number.isRequired,
};

export default IssueDetailsPage;
