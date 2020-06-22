import React from 'react';
import ReactPaginate from 'react-paginate';
import { useRecoilState, useRecoilValue } from 'recoil';

import IssueLabels from './IssueLabels';
import UserWithAvatar from './UserWithAvatar';

import { displayState, issuesState, repoState } from '../states';

import { renderHtmlFromMarkdown } from '../utils';

const IssueIcon = (
  <span
    className="tooltipped tooltipped-ne v-align-middle"
    aria-label="Open issue"
    style={{ color: '#6cc644' }}
  >
    <svg
      className="octicon"
      viewBox="0 0 16 16"
      version="1.1"
      width="16"
      height="16"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm9 3a1 1 0 11-2 0 1 1 0 012 0zm-.25-6.25a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0v-3.5z"
      />
    </svg>
  </span>
);

const PullRequestIcon = (
  <span
    className="tooltipped tooltipped-ne v-align-middle"
    aria-label="Open pull request"
    style={{ color: '#6cc644' }}
  >
    <svg
      className="octicon"
      viewBox="0 0 16 16"
      version="1.1"
      width="16"
      height="16"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M7.177 3.073L9.573.677A.25.25 0 0110 .854v4.792a.25.25 0 01-.427.177L7.177 3.427a.25.25 0 010-.354zM3.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122v5.256a2.251 2.251 0 11-1.5 0V5.372A2.25 2.25 0 011.5 3.25zM11 2.5h-1V4h1a1 1 0 011 1v5.628a2.251 2.251 0 101.5 0V5A2.5 2.5 0 0011 2.5zm1 10.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0zM3.75 12a.75.75 0 100 1.5.75.75 0 000-1.5z"
      />
    </svg>
  </span>
);

// eslint-disable-next-line react/prop-types
const IssueCommentsWithIcon = ({ comments }) => (
  <div
    className="float-right tooltipped tooltipped-nw tooltipped-align-right-2 mt-1"
    aria-label={`${comments} comments`}
  >
    <svg
      className="octicon v-align-middle"
      viewBox="0 0 16 16"
      version="1.1"
      width="16"
      height="16"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M2.75 2.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h2a.75.75 0 01.75.75v2.19l2.72-2.72a.75.75 0 01.53-.22h4.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25H2.75zM1 2.75C1 1.784 1.784 1 2.75 1h10.5c.966 0 1.75.784 1.75 1.75v7.5A1.75 1.75 0 0113.25 12H9.06l-2.573 2.573A1.457 1.457 0 014 13.543V12H2.75A1.75 1.75 0 011 10.25v-7.5z"
      />
    </svg>
    <span className="text-small text-bold">{` ${comments}`}</span>
  </div>
);

export function IssuesListPageLoading() {
  return (
    <h2>
      Loading
      <span className="AnimatedEllipsis" />
    </h2>
  );
}

// eslint-disable-next-line react/prop-types
export function IssuesListPageError({ error }) {
  return (
    <>
      <h2>Something went wrong...</h2>
      <pre>{error.toString()}</pre>
    </>
  );
}

function IssuesListPage() {
  const [display, setDisplay] = useRecoilState(displayState);
  const { openIssuesCount } = useRecoilValue(repoState);
  const { ids, entities, pageCount } = useRecoilValue(issuesState);

  const { org, repo, page } = display;

  const issues = ids.map((issueNumber) => entities[issueNumber]);

  const pluralizedIssue = openIssuesCount === 1 ? 'issue' : 'issues';

  const handlePageSelectChange = (e) => {
    const pageNumber = parseInt(e.target.value, 10);
    setDisplay({ ...display, page: pageNumber });
  };

  const handleIssueLinkClick = (e, number) => {
    e.preventDefault();
    e.stopPropagation();
    setDisplay({ ...display, displayType: 'comments', issueId: number });
  };

  const handlePaginationLinkClick = ({ selected }) => {
    // React Paginate passes an object with a zero-indexed `selected` property.
    setDisplay({ ...display, page: selected + 1 });
  };

  return (
    <>
      <h2 className="mb-3">
        {openIssuesCount !== -1 && <span>{openIssuesCount}</span>}
        {` open ${pluralizedIssue} for `}
        <span>
          <a href={`https://github.com/${org}`} target="_blank" rel="noopener noreferrer">
            {org}
          </a>
          {' / '}
          <a href={`https://github.com/${org}/${repo}`} target="_blank" rel="noopener noreferrer">
            {repo}
          </a>
        </span>
      </h2>

      <form className="mb-4">
        <div className="clearfix">
          <div className="col-1 text-right float-left mt-1 pr-2">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="page">Page</label>
          </div>
          <div className="col-11 float-right">
            <select
              className="form-select select-sm"
              id="page"
              aria-label="page"
              value={page.toString()}
              onChange={handlePageSelectChange}
            >
              {Array.from({ length: pageCount }, (_, i) => (
                <option key={`option-${i + 1}`}>{i + 1}</option>
              ))}
            </select>
          </div>
        </div>
      </form>

      {issues.map((issue) => (
        <div key={issue.id} className="Box my-2">
          <div className="Box-header">
            <div className="clearfix">
              <div className="col-11 float-left">
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid, jsx-a11y/click-events-have-key-events */}
                <a
                  role="button"
                  tabIndex="0"
                  onClick={(e) => handleIssueLinkClick(e, issue.number)}
                  style={{ cursor: 'pointer', textDecoration: 'none' }}
                >
                  {/* eslint-disable-next-line camelcase */}
                  {issue?.pull_request ? PullRequestIcon : IssueIcon}
                  <h3 className="Box-title f3 d-inline v-align-middle">
                    &nbsp;
                    {issue.title}
                    <span className="text-small text-gray text-bold ml-2">{`#${issue.number} `}</span>
                  </h3>
                </a>
              </div>
              <div className="col-1 float-right">
                <IssueCommentsWithIcon comments={issue.comments} />
              </div>
            </div>
          </div>

          <div className="Box-body">
            <div className="clearfix">
              <div className="col-2 float-left text-center mt-1">
                <UserWithAvatar user={issue.user} />
              </div>

              <div className="col-10 float-right">
                {issue?.body?.length > 0 && (
                  <details className="mb-2">
                    <summary className="btn-link">
                      Details&nbsp;
                      <span className="dropdown-caret" />
                    </summary>
                    <div
                      className="markdown-body"
                      dangerouslySetInnerHTML={{
                        __html: renderHtmlFromMarkdown(issue.body),
                      }}
                    />
                  </details>
                )}

                {issue?.labels?.length > 0 && <IssueLabels labels={issue.labels} />}
              </div>
            </div>
          </div>
        </div>
      ))}

      <nav className="custom-paginate-container my-3">
        <ReactPaginate
          forcePage={page - 1}
          pageCount={pageCount}
          pageRangeDisplayed={3}
          marginPagesDisplayed={1}
          activeClassName="current"
          disabledClassName="disabled"
          breakClassName="disabled"
          onPageChange={handlePaginationLinkClick}
        />
      </nav>
    </>
  );
}

export default IssuesListPage;
