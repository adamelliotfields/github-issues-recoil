import React, { useState } from 'react';
import { useRecoilState } from 'recoil';

import { displayState } from '../states';

function RepoSearchForm() {
  const [display, setDisplay] = useRecoilState(displayState);

  const { org, repo } = display;

  const [currentOrg, setCurrentOrg] = useState(org);
  const [currentRepo, setCurrentRepo] = useState(repo);

  const handleOrgInputChange = (e) => {
    setCurrentOrg(e.target.value);
  };

  const handleRepoInputChange = (e) => {
    setCurrentRepo(e.target.value);
  };

  const handleLoadRepoButtonClick = () => {
    setDisplay({ ...display, org: currentOrg, repo: currentRepo, page: 1 });
  };

  const formElements = [
    {
      id: 'org',
      label: 'Org',
      value: currentOrg,
      onChange: handleOrgInputChange,
    },
    {
      id: 'repo',
      label: 'Repo',
      value: currentRepo,
      onChange: handleRepoInputChange,
    },
  ];

  return (
    <form>
      {formElements.map((element) => (
        <div key={element.id} className="clearfix mb-2">
          <div className="col-1 text-right float-left mt-2 pr-2">
            <label htmlFor={element.id}>{element.label}</label>
          </div>
          <div className="col-11 float-right">
            <input
              className="form-control input-block"
              aria-label={element.id}
              id={element.id}
              value={element.value}
              onChange={element.onChange}
            />
          </div>
        </div>
      ))}
      <div className="clearfix">
        <div className="col-11 offset-1">
          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={handleLoadRepoButtonClick}
          >
            Load Repo
          </button>
        </div>
      </div>
    </form>
  );
}

export default RepoSearchForm;
