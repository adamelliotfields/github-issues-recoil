import React from 'react';
import PropTypes from 'prop-types';

function IssueLabels({ labels }) {
  return (
    <>
      {labels.map((label) => (
        <span
          key={label.id}
          className="Label text-gray mr-2"
          style={{
            border: `1px solid #${label.color}`,
            boxShadow: `0 0 2px #${label.color}`,
          }}
        >
          {label.name}
        </span>
      ))}
    </>
  );
}

IssueLabels.propTypes = {
  labels: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      color: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default IssueLabels;
